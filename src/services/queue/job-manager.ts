import { IQueueBackend, QueueJob, JobType, WorkerHandler } from './types';
import { BullMQProvider } from './providers/bullmq-provider';
import { SupabaseQueueProvider } from './providers/supabase-queue-provider';

export class JobManager {
  private backend: IQueueBackend;
  private workerHandlers: Map<JobType, WorkerHandler['handler']> = new Map();
  private isListening = false;

  constructor(backend?: IQueueBackend) {
    this.backend = backend || this.createDefaultBackend();
  }

  private createDefaultBackend(): IQueueBackend {
    if (process.env.REDIS_URL) {
      try {
        return new BullMQProvider();
      } catch {
        console.warn('[Queue] Redis unavailable, falling back to Supabase queue');
      }
    }
    return new SupabaseQueueProvider();
  }

  setBackend(backend: IQueueBackend): void {
    if (this.isListening) {
      throw new Error('Cannot change backend while workers are active');
    }
    this.backend = backend;
  }

  getBackend(): IQueueBackend {
    return this.backend;
  }

  async addJob<T>(type: JobType, data: T, options?: {
    userId?: string;
    projectId?: string;
    priority?: number;
    provider?: string;
  }): Promise<string> {
    const jobId = await this.backend.add(type, data, options);
    return jobId;
  }

  async getJobStatus(jobId: string): Promise<QueueJob | null> {
    return this.backend.getStatus(jobId);
  }

  registerWorker(type: JobType, handler: WorkerHandler['handler']): void {
    this.workerHandlers.set(type, handler);
  }

  unregisterWorker(type: JobType): void {
    this.workerHandlers.delete(type);
  }

  async startListening(): Promise<void> {
    if (this.isListening) return;
    this.isListening = true;

    for (const [type, handler] of this.workerHandlers) {
      const wrappedHandler = async (job: QueueJob) => {
        const result = await handler(job);
        job.result = result;
      };
      await this.backend.listen(type, wrappedHandler);
    }

    console.log(`[JobManager] Listening for ${this.workerHandlers.size} job types via ${this.backend.name}`);
  }

  stopListening(): void {
    this.isListening = false;
    if (this.backend instanceof SupabaseQueueProvider) {
      this.backend.stopListening();
    }
  }

  isWorkerRegistered(type: JobType): boolean {
    return this.workerHandlers.has(type);
  }

  getRegisteredWorkers(): JobType[] {
    return Array.from(this.workerHandlers.keys());
  }
}

export const jobManager = new JobManager();
