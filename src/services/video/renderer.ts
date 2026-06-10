import { RenderConfig, TimelineState, CaptionCue, CaptionStyle } from '@/types';
import { videoCompositor, CompositionInput } from './video-compositor';

export interface RenderRequest {
  timeline: TimelineState;
  captions: CaptionCue[];
  captionStyle: CaptionStyle;
  renderConfig: RenderConfig;
  musicUrl?: string;
  musicVolume?: number;
  webhookUrl?: string;
}

export interface RenderStatus {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputUrl?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

const RESOLUTION_MAP: Record<string, string> = {
  '1080p': '1920x1080',
  '1440p': '2560x1440',
  '4K': '3840x2160',
};

const CODEC_MAP: Record<string, string> = {
  h264: 'libx264',
  h265: 'libx265',
};

const FORMAT_MAP: Record<string, string> = {
  mp4: 'mp4',
  mov: 'mov',
  webm: 'webm',
};

export class Renderer {
  private activeJobs: Map<string, RenderStatus> = new Map();

  async startRender(request: RenderRequest): Promise<{ jobId: string }> {
    const resolution = RESOLUTION_MAP[request.renderConfig.resolution] || '1920x1080';
    const frameRate = request.renderConfig.fps || 30;

    const { jobId } = await videoCompositor.compose({
      timeline: request.timeline,
      captions: request.captions,
      captionStyle: request.captionStyle,
      musicUrl: request.musicUrl,
      musicVolume: request.musicVolume,
    });

    const status: RenderStatus = {
      jobId,
      status: 'queued',
      progress: 0,
      startedAt: new Date().toISOString(),
    };

    this.activeJobs.set(jobId, status);
    this.pollJob(jobId);

    return { jobId };
  }

  getStatus(jobId: string): RenderStatus | undefined {
    return this.activeJobs.get(jobId);
  }

  cancelRender(jobId: string): void {
    videoCompositor.cancelJob(jobId);
    this.activeJobs.delete(jobId);
  }

  estimateCost(config: { duration: number; resolution: string }): number {
    const baseCost = 0.05;
    const resolutionMultiplier: Record<string, number> = {
      '1080p': 1,
      '1440p': 1.5,
      '4K': 3,
    };

    return baseCost * (config.duration / 30) * (resolutionMultiplier[config.resolution] || 1);
  }

  private async pollJob(jobId: string): Promise<void> {
    const interval = setInterval(() => {
      const job = videoCompositor.getStatus(jobId);
      if (!job) {
        clearInterval(interval);
        return;
      }

      const renderJob = this.activeJobs.get(jobId);
      if (!renderJob) {
        clearInterval(interval);
        return;
      }

      renderJob.status = job.status as RenderStatus['status'];
      renderJob.progress = job.progress;

      if (job.status === 'completed') {
        renderJob.outputUrl = job.outputUrl;
        renderJob.completedAt = new Date().toISOString();
        clearInterval(interval);
      }

      if (job.status === 'failed') {
        renderJob.error = job.error;
        renderJob.completedAt = new Date().toISOString();
        clearInterval(interval);
      }
    }, 500);
  }
}

export const renderer = new Renderer();
