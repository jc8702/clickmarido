import { VoiceConfig, VoicePreset } from '@/types';

export interface TTSRequest {
  text: string;
  voice: VoiceConfig;
  speed?: number;
  pitch?: number;
  apiKey?: string;
}

export interface PhonemeTiming {
  startMs: number;
  endMs: number;
  phoneme: string;
}

export interface TTSResult {
  audioUrl: string;
  durationMs: number;
  cost: number;
  provider: string;
  phonemes?: PhonemeTiming[];
}

export interface ITTSProvider {
  name: string;
  generateSpeech(request: TTSRequest): Promise<TTSResult>;
  getVoices(): Promise<VoicePreset[]>;
}

export type TTSProviderName = 'elevenlabs' | 'google' | 'openai' | 'mock';
