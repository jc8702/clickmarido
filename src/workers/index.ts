import { jobManager } from '@/services/queue/job-manager';
import { motionEngine } from '@/services/motion/motion-engine';
import { ttsService } from '@/services/tts/tts-service';
import { lipSyncService } from '@/services/lipsync/lipsync-service';
import { captionGeneratorService } from '@/services/captions/caption-generator';
import { renderer } from '@/services/video/renderer';
import { ImageAnalyzer } from '@/services/ai/image-analyzer';
import { PromptGenerator } from '@/services/ai/prompt-generator';
import { QueueJob } from '@/services/queue/types';
import type { ImageAnalysis, VoiceConfig, Phoneme, TimelineState, TimelineTrack, CaptionCue, CaptionStyle, RenderConfig, MotionConfig } from '@/types';
import { FFmpegGenerator } from '@/services/video/ffmpeg-generator';
import fs from 'fs';

async function handleImageAnalysis(job: QueueJob) {
  const { imageUrl, imageBase64, mimeType } = job.data as Record<string, string>;
  const analyzer = new ImageAnalyzer();

  const analysis = imageUrl
    ? await analyzer.analyzeFromUrl(imageUrl)
    : await analyzer.analyze(imageBase64!, mimeType || 'image/jpeg');

  return { analysis };
}

type JobData = Record<string, unknown>;

function extractStr(data: JobData, key: string): string {
  return data[key] as string;
}

function extractNum(data: JobData, key: string): number {
  return data[key] as number;
}

function extractBool(data: JobData, key: string): boolean {
  return data[key] as boolean;
}

function extractObj(data: JobData, key: string): Record<string, unknown> {
  return data[key] as Record<string, unknown>;
}

async function handleMotionGeneration(job: QueueJob) {
  const d = job.data as JobData;
  const promptGenerator = new PromptGenerator();
  const imageAnalysisRaw = extractObj(d, 'imageAnalysis');
  const imageAnalysis = imageAnalysisRaw as unknown as ImageAnalysis;

  const animationPrompt = promptGenerator.generateAnimationPrompt(imageAnalysis);
  const analysis = { ...imageAnalysis, suggestedPrompt: animationPrompt };

  const result = await motionEngine.generateVideo(
    extractStr(d, 'imageUrl'),
    analysis,
    extractObj(d, 'motionConfig'),
    {
      duration: extractNum(d, 'duration'),
      audioUrl: extractStr(d, 'audioUrl'),
      lipsyncEnabled: extractBool(d, 'lipsyncEnabled'),
    },
  );

  return { jobId: result.jobId };
}

async function handleTTSGeneration(job: QueueJob) {
  const d = job.data as JobData;
  const voiceData = extractObj(d, 'voice');
  const apiKey = d.apiKey as string || undefined;

  const result = await ttsService.generateSpeech(
    extractStr(d, 'text'),
    voiceData as unknown as VoiceConfig,
    {
      speed: extractNum(d, 'speed'),
      pitch: extractNum(d, 'pitch'),
      apiKey,
    },
  );

  let audioUrl = result.audioUrl;
  const projectId = job.projectId;
  const userId = job.userId || 'system';

  if (projectId && audioUrl.startsWith('data:')) {
    try {
      const base64Data = audioUrl.split(',')[1];
      const mime = audioUrl.split(',')[0].split(':')[1].split(';')[0];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const { storageService } = await import('@/services/storage/supabase-storage');
      const audioBlob = new Blob([buffer], { type: mime });
      
      const uploadResult = await storageService.uploadImage(
        audioBlob,
        userId,
        projectId,
        `narration-${Date.now()}.mp3`
      );
      
      audioUrl = uploadResult.url;
      
      const { supabaseService } = await import('@/services/supabase/supabase-client');
      const projResult = await supabaseService.getProject(projectId);
      if (projResult.success && projResult.data) {
        const project = projResult.data;
        project.narration = {
          audioUrl,
          durationMs: result.durationMs,
          voiceId: (voiceData.providerVoiceId as string) || 'default',
        };
        await supabaseService.saveProject(project);
      }
    } catch (err) {
      console.error('[Worker] Erro ao salvar áudio no Supabase Storage:', err);
    }
  }

  return {
    audioUrl,
    durationMs: result.durationMs,
    cost: result.cost,
    phonemes: result.phonemes,
  };
}

async function handleLipSync(job: QueueJob) {
  const d = job.data as JobData;

  const result = await lipSyncService.sync({
    videoUrl: extractStr(d, 'videoUrl'),
    audioUrl: extractStr(d, 'audioUrl'),
    phonemes: d.phonemes as Phoneme[],
  });

  return { jobId: result.jobId };
}

async function handleCaptionGeneration(job: QueueJob) {
  const d = job.data as JobData;

  const result = await captionGeneratorService.generate({
    audioUrl: extractStr(d, 'audioUrl'),
    text: extractStr(d, 'text'),
    language: extractStr(d, 'language'),
  });

  return {
    cues: result.cues,
    srt: result.srt,
    vtt: result.vtt,
    durationMs: result.durationMs,
  };
}

async function handleVideoRender(job: QueueJob) {
  const d = job.data as JobData;

  const result = await renderer.startRender({
    timeline: d.timeline as TimelineState,
    captions: d.captions as CaptionCue[],
    captionStyle: d.captionStyle as CaptionStyle,
    renderConfig: d.renderConfig as RenderConfig,
    musicUrl: extractStr(d, 'musicUrl'),
    musicVolume: extractNum(d, 'musicVolume'),
  });

  return { jobId: result.jobId };
}

async function handleCompositeFinal(job: QueueJob) {
  const { projectId } = job.data as Record<string, string>;

  return {
    status: 'completed',
    message: `Projeto ${projectId} finalizado`,
    url: `https://mock-storage.example.com/final/${projectId}.mp4`,
  };
}

async function handleProjectPipeline(job: QueueJob) {
  const { projectId, apiKey } = job.data as { projectId: string; apiKey?: string };
  if (!projectId) throw new Error('projectId é obrigatório no pipeline');

  const { supabaseService } = await import('@/services/supabase/supabase-client');
  const { storageService } = await import('@/services/storage/supabase-storage');

  const projResult = await supabaseService.getProject(projectId);
  if (!projResult.success || !projResult.data) {
    throw new Error(`Projeto ${projectId} não encontrado no banco de dados`);
  }
  const project = projResult.data;

  if (!project.script || !project.storyboard) {
    throw new Error('O projeto precisa ter roteiro e storyboard gerados');
  }

  // Atualiza status do projeto para generating
  project.status = 'generating';
  await supabaseService.saveProject(project);

  const scenesText = [
    project.script.hook,
    project.script.scene1,
    project.script.scene2,
    project.script.scene3,
    project.script.cta,
  ];

  const sceneClips: { videoUrl: string; durationMs: number }[] = [];

  for (let idx = 0; idx < scenesText.length; idx++) {
    const text = scenesText[idx];
    const storyboardItem = project.storyboard[idx];
    const sceneName = storyboardItem?.scene || `Cena ${idx + 1}`;

    console.log(`[Pipeline] Processando TTS para ${sceneName}...`);
    const ttsVoice: VoiceConfig = {
      provider: 'elevenlabs',
      providerVoiceId: 'EXAVITQu4vrRV7Ss5gzB', // Voz male padrão
      gender: 'male',
      style: 'adult',
      language: 'pt-BR',
    };

    const ttsResult = await ttsService.generateSpeech(text, ttsVoice, { apiKey });
    
    // Upload do áudio
    const base64Audio = ttsResult.audioUrl.split(',')[1];
    const audioBuffer = Buffer.from(base64Audio, 'base64');
    const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUpload = await storageService.uploadImage(
      audioBlob,
      project.userId || 'system',
      projectId,
      `scene-${idx + 1}-narration.mp3`
    );

    console.log(`[Pipeline] Locução gerada para ${sceneName}: ${audioUpload.url}`);

    // Busca imagem mapeada para a cena
    let img = project.images?.find(i => i.scene === sceneName);
    if (!img) img = project.images?.[idx];
    if (!img) img = project.images?.[0];

    if (!img) {
      throw new Error(`Nenhuma imagem fornecida ou disponível para a cena ${sceneName}. Adicione imagens antes de gerar.`);
    }

    let finalSceneVideoUrl = '';
    const durationMs = ttsResult.durationMs || 5000;
    const isLipsyncMock = process.env.NEXT_PUBLIC_LIPSYNC_PROVIDER === 'mock' || process.env.LIPSYNC_PROVIDER === 'mock';

    if (isLipsyncMock) {
      console.log(`[Pipeline] Sincronização configurada como mock. Usando FFmpegGenerator local para ${sceneName}...`);
      try {
        const localVideoPath = await FFmpegGenerator.generateSceneClip(
          img.dataUrl,
          audioUpload.url,
          `${projectId}-scene-${idx + 1}`,
          durationMs
        );

        // Upload do clipe de vídeo gerado
        const videoBuffer = fs.readFileSync(localVideoPath);
        const videoBlob = new Blob([videoBuffer], { type: 'video/mp4' });
        const videoUpload = await storageService.uploadImage(
          videoBlob,
          project.userId || 'system',
          projectId,
          `scene-${idx + 1}-video.mp4`
        );
        finalSceneVideoUrl = videoUpload.url;
        console.log(`[Pipeline] Vídeo local FFmpeg gerado e enviado para ${sceneName}: ${finalSceneVideoUrl}`);
      } catch (err) {
        console.error(`[Pipeline] Erro ao gerar vídeo via FFmpeg local para ${sceneName}:`, err);
        throw err;
      }
    } else {
      // Fluxo real de IA (Veo + Lipsync)
      try {
        console.log(`[Pipeline] Iniciando animação Veo 2.0 para ${sceneName}...`);
        const imageAnalysis: ImageAnalysis = {
          sceneType: 'indoor',
          description: storyboardItem.action || 'Brazil repair service',
          objects: [],
          faceData: { detected: false, confidence: 0 },
          depthEstimate: 0.5,
          suggestedMotion: { type: 'push_in', intensity: 1.0 },
          suggestedPrompt: storyboardItem.action || 'Brazil repair service',
        };

        const motionConfig: MotionConfig = {
          camera: { type: 'push_in', intensity: 1.0 },
          backgroundParallax: false,
          elementMovement: false,
          lightVariation: false,
        };

        const motionResult = await motionEngine.generateVideo(
          img.dataUrl,
          imageAnalysis,
          motionConfig,
          { duration: 5, audioUrl: audioUpload.url }
        );

        // Polling da animação Veo
        let motionVideoUrl = '';
        let pollingVeo = true;
        let retries = 0;
        while (pollingVeo && retries < 30) {
          await new Promise(r => setTimeout(r, 2000));
          const statusRes = await motionEngine.getStatus(motionResult.jobId);
          if (statusRes.status === 'completed') {
            motionVideoUrl = statusRes.result!.url;
            pollingVeo = false;
          } else if (statusRes.status === 'failed') {
            throw new Error(`Geração de vídeo falhou no Veo: ${statusRes.error}`);
          }
          retries++;
        }

        if (!motionVideoUrl) throw new Error(`Timeout ao gerar animação de vídeo para ${sceneName}`);
        console.log(`[Pipeline] Vídeo animado Veo gerado: ${motionVideoUrl}`);

        console.log(`[Pipeline] Iniciando lipsync Wav2Lip para ${sceneName}...`);
        const lipsyncRes = await lipSyncService.sync({
          videoUrl: motionVideoUrl,
          audioUrl: audioUpload.url,
          phonemes: [],
        }, 'wav2lip');

        // Polling do lipsync
        let pollingLipsync = true;
        let lipsyncRetries = 0;
        while (pollingLipsync && lipsyncRetries < 30) {
          await new Promise(r => setTimeout(r, 2000));
          const statusRes = await lipSyncService.getStatus(lipsyncRes.jobId, 'wav2lip');
          if (statusRes.status === 'completed') {
            finalSceneVideoUrl = statusRes.result!.videoUrl;
            pollingLipsync = false;
          } else if (statusRes.status === 'failed') {
            throw new Error(`Sincronização labial falhou: ${statusRes.error}`);
          }
          lipsyncRetries++;
        }

        if (!finalSceneVideoUrl) throw new Error(`Timeout ao sincronizar áudio e vídeo da ${sceneName}`);
        console.log(`[Pipeline] Cena finalizada: ${finalSceneVideoUrl}`);
      } catch (iaError) {
        console.warn(`[Pipeline] Fluxo de IA falhou para ${sceneName}. Utilizando fallback do FFmpeg local...`, iaError);
        const localVideoPath = await FFmpegGenerator.generateSceneClip(
          img.dataUrl,
          audioUpload.url,
          `${projectId}-scene-${idx + 1}`,
          durationMs
        );
        const videoBuffer = fs.readFileSync(localVideoPath);
        const videoBlob = new Blob([videoBuffer], { type: 'video/mp4' });
        const videoUpload = await storageService.uploadImage(
          videoBlob,
          project.userId || 'system',
          projectId,
          `scene-${idx + 1}-video.mp4`
        );
        finalSceneVideoUrl = videoUpload.url;
      }
    }

    sceneClips.push({
      videoUrl: finalSceneVideoUrl,
      durationMs,
    });
  }

  console.log(`[Pipeline] Todas as 5 cenas processadas. Montando timeline...`);

  const tracks: TimelineTrack[] = [
    {
      id: 'track-video-final',
      name: 'Video Final',
      type: 'video',
      visible: true,
      locked: false,
      items: sceneClips.map((clip, index) => ({
        id: `clip-v-${index}`,
        trackId: 'track-video-final',
        type: 'video_clip' as const,
        startTime: sceneClips.slice(0, index).reduce((acc, c) => acc + c.durationMs, 0) / 1000,
        duration: clip.durationMs / 1000,
        sourceUrl: clip.videoUrl,
      })),
    },
  ];

  const totalDuration = sceneClips.reduce((acc, c) => acc + c.durationMs, 0) / 1000;

  const timeline: TimelineState = {
    tracks,
    duration: totalDuration,
    fps: 30,
    currentTime: 0,
    isPlaying: false,
    zoom: 1,
  };

  console.log(`[Pipeline] Iniciando composição final FFmpeg...`);
  const { videoCompositor } = await import('@/services/video/video-compositor');
  const renderRes = await videoCompositor.compose({
    timeline,
    captions: [],
    captionStyle: {
      fontSize: 28,
      fontFamily: 'Arial',
      color: '#FFFFFF',
      highlightColor: '#FFD700',
      backgroundColor: 'rgba(0,0,0,0.6)',
      position: 'bottom',
      highlightCurrentWord: true,
    },
    musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    musicVolume: 0.1,
  });

  // Polling do render final do compositor
  let finalVideoUrl = '';
  let pollingRender = true;
  let renderRetries = 0;
  while (pollingRender && renderRetries < 30) {
    await new Promise(r => setTimeout(r, 2000));
    const renderStatus = videoCompositor.getStatus(renderRes.jobId);
    if (!renderStatus) throw new Error('Job de composição final não encontrado');
    if (renderStatus.status === 'completed') {
      finalVideoUrl = renderStatus.outputUrl!;
      pollingRender = false;
    } else if (renderStatus.status === 'failed') {
      throw new Error(`Composição do vídeo falhou: ${renderStatus.error}`);
    }
    renderRetries++;
  }

  if (!finalVideoUrl) throw new Error('Timeout na composição final do Reels');
  console.log(`[Pipeline] Reels completo gerado com sucesso: ${finalVideoUrl}`);

  // Atualiza o projeto com o link final do vídeo
  project.status = 'completed';
  project.video = {
    url: finalVideoUrl,
    prompt: project.script.hook,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };

  await supabaseService.saveProject(project);

  return {
    videoUrl: finalVideoUrl,
    projectId,
  };
}

export function registerWorkers(): void {
  jobManager.registerWorker('image_analysis', handleImageAnalysis);
  jobManager.registerWorker('motion_generation', handleMotionGeneration);
  jobManager.registerWorker('tts_generation', handleTTSGeneration);
  jobManager.registerWorker('lipsync', handleLipSync);
  jobManager.registerWorker('caption_generation', handleCaptionGeneration);
  jobManager.registerWorker('video_render', handleVideoRender);
  jobManager.registerWorker('composite_final', handleCompositeFinal);
  jobManager.registerWorker('project_pipeline', handleProjectPipeline);

  console.log('[Workers] Registered 8 job handlers');
}

export async function startWorkers(): Promise<void> {
  registerWorkers();
  await jobManager.startListening();
}

export {
  handleImageAnalysis,
  handleMotionGeneration,
  handleTTSGeneration,
  handleLipSync,
  handleCaptionGeneration,
  handleVideoRender,
  handleCompositeFinal,
  handleProjectPipeline,
};
