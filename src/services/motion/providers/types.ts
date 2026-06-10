import { ImageAnalysis, MotionConfig, JobStatusResponse } from '@/types';

export interface VideoGenerationRequest {
  imageUrl: string;
  imageAnalysis: ImageAnalysis;
  motionConfig: MotionConfig;
  audioUrl?: string;
  lipsyncEnabled: boolean;
  duration: number;
}

export interface IVideoProvider {
  name: string;
  generateVideo(request: VideoGenerationRequest): Promise<{ jobId: string }>;
  getStatus(jobId: string): Promise<JobStatusResponse>;
  cancelJob(jobId: string): Promise<void>;
  estimateCost(config: { duration: number; resolution: string }): number;
}

export type ProviderName = 'veo' | 'kling' | 'hedra' | 'runway' | 'mock';

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  [key: string]: unknown;
}
