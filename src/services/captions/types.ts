import { CaptionCue, CaptionStyle } from '@/types';

export interface CaptionGenerationRequest {
  audioUrl: string;
  text?: string;
  language?: string;
}

export interface CaptionGenerationResult {
  cues: CaptionCue[];
  srt: string;
  vtt: string;
  durationMs: number;
  cost: number;
  provider: string;
}

export interface ICaptionProvider {
  name: string;
  generate(request: CaptionGenerationRequest): Promise<CaptionGenerationResult>;
}

export type CaptionProviderName = 'gemini' | 'whisper' | 'mock';
