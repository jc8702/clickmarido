import { Queue, Worker, Job as BullJob } from 'bullmq';
import IORedis from 'ioredis';
import { IQueueBackend, QueueJob, JobType } from '../types';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export class BullMQProvider implements IQueueBackend {
  name = 'bullmq';

  private connection: IORedis;
  private queues: Map<JobType, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();

  constructor() {
    this.connection = new IORedis(REDIS_URL, {
      maxRetriesPerRequest: null,
      enableOfflineQueue: true,
    });
  }

  async add<T>(type: JobType, data: T, options?: {
    userId?: string;
    projectId?: string;
    priority?: number;
    provider?: string;
  }): Promise<string> {
    const queue = this.getOrCreateQueue(type);
    const job = await queue.add(type, {
      ...data as Record<string, unknown>,
      _metadata: {
        userId: options?.userId,
        projectId: options?.projectId,
        provider: options?.provider,
      },
    }, {
      priority: options?.priority || 0,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });

    return job.id || `${type}-${Date.now()}`;
  }

  async getStatus(jobId: string): Promise<QueueJob | null> {
    const job = await this.findJob(jobId);
    if (!job) return null;
    return this.toQueueJob(job);
  }

  async updateProgress(jobId: string, progress: number): Promise<void> {
    const job = await this.findJob(jobId);
    if (job) {
      await job.updateProgress(progress);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async complete(_jobId: string, _result: Record<string, unknown>): Promise<void> {
    // BullMQ Worker lida com complete automaticamente via retorno do handler
  }

  async fail(jobId: string, error: string): Promise<void> {
    const job = await this.findJob(jobId);
    if (job) {
      await job.moveToFailed(new Error(error), 'true');
    }
  }

  async getNextJob(type?: JobType): Promise<QueueJob | null> {
    const typesToCheck = type ? [type] : Array.from(this.queues.keys());
    if (typesToCheck.length === 0) return null;

    for (const t of typesToCheck) {
      try {
        const queue = this.queues.get(t);
        if (!queue) continue;
        const jobs = await queue.getJobs(['waiting', 'active'], 0, 1);
        if (jobs.length > 0) {
          return this.toQueueJob(jobs[0]);
        }
      } catch {}
    }

    return null;
  }

  async listen(type: JobType, handler: (job: QueueJob) => Promise<void>): Promise<void> {
    const worker = new Worker(type, async (bullJob: BullJob) => {
      const queueJob = this.toQueueJob(bullJob);
      await handler(queueJob);
    }, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connection: this.connection as any,
      concurrency: 5,
    });

    worker.on('failed', (bullJob, err) => {
      console.error(`[BullMQ] Job ${bullJob?.id} failed:`, err.message);
    });

    this.workers.set(type, worker);
  }

  private getOrCreateQueue(type: JobType): Queue {
    if (this.queues.has(type)) {
      return this.queues.get(type)!;
    }

    const queue = new Queue(type, {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      connection: this.connection as any,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { age: 3600 * 24 },
        removeOnFail: { age: 3600 * 24 * 7 },
      },
    });

    this.queues.set(type, queue);
    return queue;
  }

  private async findJob(jobId: string): Promise<BullJob | null> {
    for (const [, queue] of this.queues) {
      try {
        const job = await queue.getJob(jobId);
        if (job) return job;
      } catch {}
    }
    return null;
  }

  private toQueueJob(bullJob: BullJob): QueueJob {
    const data = bullJob.data || {};
    const metadata = data._metadata || {};
    const failedReason = bullJob.failedReason || '';

    return {
      id: bullJob.id || '',
      type: bullJob.name as JobType,
      data,
      userId: metadata.userId,
      projectId: metadata.projectId,
      provider: metadata.provider,
      status: this.mapStatus(bullJob),
      progress: typeof bullJob.progress === 'number' ? bullJob.progress : 0,
      result: data.result,
      error: failedReason || undefined,
      retryCount: bullJob.attemptsMade || 0,
      maxRetries: bullJob.opts?.attempts || 3,
      createdAt: new Date(bullJob.timestamp).toISOString(),
      startedAt: bullJob.processedOn ? new Date(bullJob.processedOn).toISOString() : undefined,
      completedAt: bullJob.finishedOn ? new Date(bullJob.finishedOn).toISOString() : undefined,
    };
  }

  private mapStatus(bullJob: BullJob): QueueJob['status'] {
    if (bullJob.failedReason) return 'failed';
    if (bullJob.returnvalue) return 'completed';
    if (bullJob.processedOn) return 'processing';
    if (bullJob.finishedOn) return 'completed';
    return 'queued';
  }

  async disconnect(): Promise<void> {
    for (const [, worker] of this.workers) {
      await worker.close();
    }
    for (const [, queue] of this.queues) {
      await queue.close();
    }
    await this.connection.quit();
  }
}
