import { LipSyncRequest, LipSyncResult } from '@/types';

export interface ILipSyncProvider {
  name: string;
  sync(request: LipSyncRequest): Promise<{ jobId: string }>;
  getStatus(jobId: string): Promise<
    | { status: 'queued' }
    | { status: 'processing'; progress: number }
    | { status: 'completed'; result: LipSyncResult }
    | { status: 'failed'; error: string }
  >;
  cancelJob(jobId: string): Promise<void>;
  estimateCost(request: LipSyncRequest): number;
}

export type LipSyncProviderName = 'hedra' | 'wav2lip' | 'musetalk' | 'mock';
