import { TimelineState, TimelineTrack, CaptionCue, CaptionStyle } from '@/types';
import { storageService } from '@/services/storage/supabase-storage';
import { FFmpegGenerator } from './ffmpeg-generator';
import fs from 'fs';
import path from 'path';

export interface CompositionInput {
  timeline: TimelineState;
  captions: CaptionCue[];
  captionStyle: CaptionStyle;
  musicUrl?: string;
  musicVolume?: number;
}

export interface CompositionJob {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputUrl?: string;
  error?: string;
}

interface AssetMapping {
  originalUrl: string;
  localPath: string;
  type: 'video' | 'audio' | 'music' | 'image';
}

export class VideoCompositor {
  private jobs: Map<string, CompositionJob> = new Map();
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  private async downloadFile(url: string, destPath: string): Promise<string> {
    if (fs.existsSync(destPath)) return destPath;

    if (url.startsWith('data:')) {
      const base64Data = url.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(destPath, buffer);
      return destPath;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Falha ao baixar arquivo da timeline: ${url}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(buffer));
    return destPath;
  }

  async compose(input: CompositionInput): Promise<{ jobId: string }> {
    const jobId = `render-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const job: CompositionJob = {
      jobId,
      status: 'queued',
      progress: 0,
    };
    this.jobs.set(jobId, job);

    const timer = setTimeout(async () => {
      try {
        const j = this.jobs.get(jobId);
        if (!j) return;
        j.status = 'processing';
        j.progress = 10;

        console.log(`[VideoCompositor] Iniciando composição real via FFmpeg para o job ${jobId}...`);
        
        const tempDir = path.join(process.cwd(), 'temp-renders');
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }

        // Fase 1: Download/Mapeamento de assets locais ou remotos
        j.progress = 25;
        const clipPaths: string[] = [];
        let clipIdx = 0;

        for (const track of input.timeline.tracks) {
          if (track.type === 'video') {
            for (const item of track.items) {
              if (item.sourceUrl) {
                // Se já for um arquivo local na pasta temp-renders, usamos direto
                if (item.sourceUrl.includes('temp-renders') && fs.existsSync(item.sourceUrl)) {
                  clipPaths.push(item.sourceUrl);
                } else {
                  const localPath = path.join(tempDir, `input-clip-${jobId}-${clipIdx}.mp4`);
                  await this.downloadFile(item.sourceUrl, localPath);
                  clipPaths.push(localPath);
                  clipIdx++;
                }
              }
            }
          }
        }

        if (clipPaths.length === 0) {
          throw new Error('Nenhum clipe de vídeo encontrado na timeline para concatenação.');
        }

        j.progress = 50;

        // Fase 2: Composição real via FFmpeg
        console.log(`[VideoCompositor] Concatenando ${clipPaths.length} clipes de vídeo...`);
        const musicVolume = input.musicVolume !== undefined ? input.musicVolume : 0.08;
        const finalLocalPath = await FFmpegGenerator.composeFinalVideo(
          clipPaths,
          input.musicUrl,
          musicVolume
        );

        j.progress = 80;

        // Fase 3: Upload do vídeo final para o Supabase Storage
        console.log(`[VideoCompositor] Enviando vídeo composto para o Supabase Storage...`);
        const finalVideoBuffer = fs.readFileSync(finalLocalPath);
        const finalVideoBlob = new Blob([finalVideoBuffer], { type: 'video/mp4' });
        const uploadRes = await storageService.uploadImage(
          finalVideoBlob,
          'system',
          'renders',
          `reels-final-${jobId}.mp4`
        );

        // Limpeza dos temporários locais
        FFmpegGenerator.cleanTempFiles();

        // Fase 4: Conclusão
        j.progress = 100;
        j.status = 'completed';
        j.outputUrl = uploadRes.url;
        console.log(`[VideoCompositor] Render concluído com sucesso: ${uploadRes.url}`);
      } catch (err) {
        console.error(`[VideoCompositor] Erro durante a composição:`, err);
        const j = this.jobs.get(jobId);
        if (j) {
          j.status = 'failed';
          j.error = err instanceof Error ? err.message : 'Render failed';
        }
        // Garante a limpeza em caso de erro
        FFmpegGenerator.cleanTempFiles();
      }
    }, 500);

    this.timers.set(jobId, timer);
    return { jobId };
  }

  getStatus(jobId: string): CompositionJob | undefined {
    return this.jobs.get(jobId);
  }

  cancelJob(jobId: string): void {
    const timer = this.timers.get(jobId);
    if (timer) clearTimeout(timer);
    this.jobs.delete(jobId);
    this.timers.delete(jobId);
  }

  private async downloadAssets(timeline: TimelineState): Promise<AssetMapping[]> {
    const mappings: AssetMapping[] = [];

    for (const track of timeline.tracks) {
      for (const item of track.items) {
        if (item.sourceUrl) {
          const type = item.type === 'music_clip' ? 'music'
            : item.type === 'video_clip' ? 'video'
            : item.type === 'narration_clip' || item.type === 'audio_clip' ? 'audio'
            : 'image';

          mappings.push({
            originalUrl: item.sourceUrl,
            localPath: `/tmp/assets/${item.id}.${type === 'video' ? 'mp4' : type === 'audio' || type === 'music' ? 'mp3' : 'jpg'}`,
            type,
          });
        }
      }
    }

    return mappings;
  }

  private buildFFmpegCommand(input: CompositionInput): string {
    const { timeline, captions, captionStyle, musicUrl, musicVolume } = input;
    const fps = timeline.fps || 30;
    const resolution = '1080x1920';

    const filterComplex: string[] = [];
    const inputs: string[] = [];
    let inputIndex = 0;
    
    const videoStreams: string[] = [];
    const voiceInputs: string[] = [];
    const musicInputs: string[] = [];
    const otherAudioInputs: string[] = [];

    for (const track of timeline.tracks) {
      if (!track.visible) continue;

      for (const item of track.items) {
        const inputName = `[${inputIndex}:v]`;
        const audioInput = `[${inputIndex}:a]`;

        if (item.type === 'video_clip') {
          videoStreams.push(inputName);
          otherAudioInputs.push(audioInput);
        } else if (item.type === 'narration_clip') {
          voiceInputs.push(audioInput);
        } else if (item.type === 'music_clip') {
          musicInputs.push(audioInput);
        } else if (item.type === 'audio_clip') {
          otherAudioInputs.push(audioInput);
        }

        inputs.push(`-i '${item.sourceUrl}'`);
        inputIndex++;
      }
    }

    if (musicUrl) {
      inputs.push(`-i '${musicUrl}'`);
      musicInputs.push(`[${inputIndex}:a]`);
      inputIndex++;
    }

    // Filtros de vídeo - Concatenação de múltiplos clipes
    let videoMap = '0:v';
    if (videoStreams.length > 0) {
      filterComplex.push(`${videoStreams.join('')} concat=n=${videoStreams.length}:v=1:a=0[vout]`);
      videoMap = '[vout]';
    }

    // Filtros de áudio - Volumes ajustados para mixagem
    const mixedStreams: string[] = [];
    let filterIndex = 0;

    voiceInputs.forEach(stream => {
      const outStream = `[voice_${filterIndex}]`;
      filterComplex.push(`${stream}volume=1.0${outStream}`);
      mixedStreams.push(outStream);
      filterIndex++;
    });

    const bgMusicVol = musicVolume !== undefined ? musicVolume : 0.15;
    musicInputs.forEach(stream => {
      const outStream = `[music_${filterIndex}]`;
      filterComplex.push(`${stream}volume=${bgMusicVol}${outStream}`);
      mixedStreams.push(outStream);
      filterIndex++;
    });

    otherAudioInputs.forEach(stream => {
      const outStream = `[other_${filterIndex}]`;
      filterComplex.push(`${stream}volume=0.5${outStream}`);
      mixedStreams.push(outStream);
      filterIndex++;
    });

    let audioMapping = '-an';
    if (mixedStreams.length > 0) {
      filterComplex.push(`${mixedStreams.join('')} amix=inputs=${mixedStreams.length}:duration=first:dropout_transition=2[aout]`);
      audioMapping = '-map "[aout]"';
    }

    // Legendas burn-in
    let finalVideoMap = videoMap;
    if (captions.length > 0) {
      filterComplex.push(`${videoMap} drawtext=text='':fontsize=${captionStyle.fontSize}:fontcolor=${captionStyle.color}:x=(w-text_w)/2:y=h-th-40:shadowcolor=black@0.6:shadowx=2:shadowy=2[v_captioned]`);
      finalVideoMap = '[v_captioned]';
    }

    const filterChain = filterComplex.length > 0
      ? `-filter_complex "${filterComplex.join('; ')}"`
      : '';

    return `ffmpeg ${inputs.join(' ')} ${filterChain} -map ${finalVideoMap} ${audioMapping} -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -s ${resolution} -r ${fps} -y output.mp4`;
  }

  private generateSRT(cues: CaptionCue[]): string {
    return cues.map(cue => {
      const start = this.msToSrtTime(cue.startMs);
      const end = this.msToSrtTime(cue.endMs);
      return `${cue.index}\n${start} --> ${end}\n${cue.text}\n`;
    }).join('\n');
  }

  private msToSrtTime(ms: number): string {
    const totalSec = ms / 1000;
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.floor(totalSec % 60);
    const msF = Math.floor(ms % 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${msF.toString().padStart(3, '0')}`;
  }

  private async simulateRender(_ffmpegArgs: string, jobId: string): Promise<void> {
    for (let p = 50; p < 100; p += 10) {
      await new Promise(r => setTimeout(r, 400));
      const job = this.jobs.get(jobId);
      if (job) job.progress = p;
    }
  }
}

export const videoCompositor = new VideoCompositor();
