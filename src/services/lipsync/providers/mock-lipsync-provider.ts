import { ILipSyncProvider, LipSyncProviderName } from '../types';
import { LipSyncRequest, LipSyncResult } from '@/types';

interface MockJob {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: LipSyncResult;
}

export class MockLipSyncProvider implements ILipSyncProvider {
  name: LipSyncProviderName = 'mock';

  private jobs: Map<string, MockJob> = new Map();
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();

  async sync(_request: LipSyncRequest): Promise<{ jobId: string }> {
    const jobId = `lipsync-mock-${Date.now()}`;

    const job: MockJob = {
      id: jobId,
      status: 'queued',
      progress: 0,
    };
    this.jobs.set(jobId, job);

    const timer = setTimeout(async () => {
      const j = this.jobs.get(jobId);
      if (!j) return;

      j.status = 'processing';
      j.progress = 0;

      for (let p = 20; p <= 100; p += 20) {
        await new Promise(r => setTimeout(r, 600));
        const current = this.jobs.get(jobId);
        if (current) current.progress = p;
      }

      const current = this.jobs.get(jobId);
      if (current) {
        current.status = 'completed';
        current.result = {
          videoUrl: `https://mock-storage.example.com/lipsync/${jobId}.mp4`,
          duration: 10,
          cost: 0,
          provider: 'mock',
          metadata: { simulated: true, jobId },
        };
      }
    }, 1000);

    this.timers.set(jobId, timer);
    return { jobId };
  }

  async getStatus(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return { status: 'failed' as const, error: 'Job not found' };

    switch (job.status) {
      case 'queued':
        return { status: 'queued' as const };
      case 'processing':
        return { status: 'processing' as const, progress: job.progress };
      case 'completed':
        return { status: 'completed' as const, result: job.result! };
      case 'failed':
        return { status: 'failed' as const, error: 'Mock error' };
    }
  }

  async cancelJob(jobId: string): Promise<void> {
    const timer = this.timers.get(jobId);
    if (timer) clearTimeout(timer);
    this.jobs.delete(jobId);
    this.timers.delete(jobId);
  }

  estimateCost(_request: LipSyncRequest): number {
    return 0;
  }
}
