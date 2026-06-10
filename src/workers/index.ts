import { jobManager } from '@/services/queue/job-manager';
import { motionEngine } from '@/services/motion/motion-engine';
import { ttsService } from '@/services/tts/tts-service';
import { lipSyncService } from '@/services/lipsync/lipsync-service';
import { captionGeneratorService } from '@/services/captions/caption-generator';
import { renderer } from '@/services/video/renderer';
import { ImageAnalyzer } from '@/services/ai/image-analyzer';
import { PromptGenerator } from '@/services/ai/prompt-generator';
import { QueueJob } from '@/services/queue/types';
import type { ImageAnalysis, VoiceConfig, Phoneme, TimelineState, CaptionCue, CaptionStyle, RenderConfig } from '@/types';

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

  const result = await ttsService.generateSpeech(
    extractStr(d, 'text'),
    voiceData as unknown as VoiceConfig,
    {
      speed: extractNum(d, 'speed'),
      pitch: extractNum(d, 'pitch'),
    },
  );

  return {
    audioUrl: result.audioUrl,
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

export function registerWorkers(): void {
  jobManager.registerWorker('image_analysis', handleImageAnalysis);
  jobManager.registerWorker('motion_generation', handleMotionGeneration);
  jobManager.registerWorker('tts_generation', handleTTSGeneration);
  jobManager.registerWorker('lipsync', handleLipSync);
  jobManager.registerWorker('caption_generation', handleCaptionGeneration);
  jobManager.registerWorker('video_render', handleVideoRender);
  jobManager.registerWorker('composite_final', handleCompositeFinal);

  console.log('[Workers] Registered 7 job handlers');
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
};
