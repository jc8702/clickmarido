import { TimelineState, TimelineTrack, CaptionCue, CaptionStyle } from '@/types';

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

        // Fase 1: Download/mapeamento de assets
        j.progress = 10;
        await this.downloadAssets(input.timeline);

        // Fase 2: Montagem das faixas
        j.progress = 30;
        const ffmpegArgs = this.buildFFmpegCommand(input);

        // Fase 3: Renderização
        j.progress = 50;
        await this.simulateRender(ffmpegArgs, jobId);

        // Fase 4: Finalização
        j.progress = 100;
        j.status = 'completed';
        j.outputUrl = `https://mock-storage.example.com/renders/${jobId}.mp4`;
      } catch (err) {
        const j = this.jobs.get(jobId);
        if (j) {
          j.status = 'failed';
          j.error = err instanceof Error ? err.message : 'Render failed';
        }
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
    const audioStreams: string[] = [];

    for (const track of timeline.tracks) {
      if (!track.visible) continue;

      for (const item of track.items) {
        const inputName = `[${inputIndex}:v]`;
        const audioInput = `[${inputIndex}:a]`;

        if (item.type === 'video_clip') {
          videoStreams.push(inputName);
          audioStreams.push(audioInput);
        } else if (item.type === 'narration_clip' || item.type === 'audio_clip' || item.type === 'music_clip') {
          audioStreams.push(audioInput);
        }

        inputs.push(`-i '${item.sourceUrl}'`);
        inputIndex++;
      }
    }

    if (musicUrl) {
      inputs.push(`-i '${musicUrl}'`);
      audioStreams.push(`[${inputIndex}:a]`);
    }

    // Mix de áudio
    if (audioStreams.length > 0) {
      const mixInput = audioStreams.join('');
      const musicVol = musicVolume !== undefined ? musicVolume : 0.3;
      filterComplex.push(`${mixInput} amix=inputs=${audioStreams.length}:duration=first:dropout_transition=2,volume=${musicVol}[aout]`);
    }

    // Legendas burn-in
    if (captions.length > 0) {
      const srtContent = this.generateSRT(captions);
      filterComplex.push(`drawtext=text='':fontsize=${captionStyle.fontSize}:fontcolor=${captionStyle.color}:x=(w-text_w)/2:y=h-th-40:shadowcolor=black@0.6:shadowx=2:shadowy=2`);
    }

    const filterChain = filterComplex.length > 0
      ? `-filter_complex "${filterComplex.join('; ')}"`
      : '';

    const audioMapping = audioStreams.length > 0 ? '-map "[aout]"' : '-an';

    return `ffmpeg ${inputs.join(' ')} ${filterChain} -map ${videoStreams[0] || '0:v'} ${audioMapping} -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -s ${resolution} -r ${fps} -y output.mp4`;
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
