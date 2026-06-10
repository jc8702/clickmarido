import { IVideoProvider, VideoGenerationRequest } from './providers/types';
import { JobStatusResponse, VideoGenerationResult } from '@/types';

interface MockJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: VideoGenerationResult;
  error?: string;
}

export class MockProvider implements IVideoProvider {
  name = 'mock';

  private jobs: Map<string, MockJob> = new Map();
  private processingTimers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  async generateVideo(request: VideoGenerationRequest): Promise<{ jobId: string }> {
    const jobId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const job: MockJob = {
      id: jobId,
      status: 'queued',
      progress: 0,
    };
    this.jobs.set(jobId, job);

    // Simula processamento assíncrono
    const timer = setTimeout(() => {
      const j = this.jobs.get(jobId);
      if (!j) return;

      j.status = 'processing';

      // Simula progresso ao longo de 5 segundos
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 20;
        j.progress = progress;

        if (progress >= 100) {
          clearInterval(progressInterval);
          j.status = 'completed';
          j.result = {
            url: `https://mock-storage.example.com/videos/${jobId}.mp4`,
            duration: request.duration,
            cost: 0,
            provider: 'mock',
            metadata: {
              simulated: true,
              imageAnalysis: request.imageAnalysis.description,
              motionType: request.motionConfig.camera.type,
            },
          };
        }
      }, 1000);
    }, 500);

    this.processingTimers.set(jobId, timer);

    return { jobId };
  }

  async getStatus(jobId: string): Promise<JobStatusResponse> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return { status: 'failed', error: 'Job not found' };
    }

    switch (job.status) {
      case 'queued':
        return { status: 'queued' };
      case 'processing':
        return { status: 'processing', progress: job.progress };
      case 'completed':
        return { status: 'completed', result: job.result! };
      case 'failed':
        return { status: 'failed', error: job.error || 'Unknown error' };
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    const timer = this.processingTimers.get(jobId);
    if (timer) {
      clearTimeout(timer);
      this.processingTimers.delete(jobId);
    }
    this.jobs.delete(jobId);
  }

  estimateCost(_config: { duration: number; resolution: string }): number { // eslint-disable-line @typescript-eslint/no-unused-vars
    return 0; // Mock é gratuito
  }
}
