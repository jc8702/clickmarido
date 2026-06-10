export type JobType =
  | 'image_analysis'
  | 'motion_generation'
  | 'tts_generation'
  | 'lipsync'
  | 'caption_generation'
  | 'video_render'
  | 'composite_final';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface QueueJob<T = Record<string, unknown>> {
  id: string;
  type: JobType;
  data: T;
  userId?: string;
  projectId?: string;
  priority?: number;
  provider?: string;
  status: JobStatus;
  progress: number;
  result?: Record<string, unknown>;
  error?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface IQueueBackend {
  name: string;
  add<T>(type: JobType, data: T, options?: {
    userId?: string;
    projectId?: string;
    priority?: number;
    provider?: string;
  }): Promise<string>;
  getStatus(jobId: string): Promise<QueueJob | null>;
  updateProgress(jobId: string, progress: number): Promise<void>;
  complete(jobId: string, result: Record<string, unknown>): Promise<void>;
  fail(jobId: string, error: string): Promise<void>;
  getNextJob(type?: JobType): Promise<QueueJob | null>;
  listen(type: JobType, handler: (job: QueueJob) => Promise<void>): Promise<void>;
}

export interface WorkerHandler<T = Record<string, unknown>> {
  type: JobType;
  handler: (job: QueueJob<T>) => Promise<Record<string, unknown>>;
}
