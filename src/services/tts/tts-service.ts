import { ITTSProvider, TTSRequest, TTSResult, TTSProviderName } from './types';
import { ElevenLabsProvider } from './providers/elevenlabs-provider';
import { GoogleTTSProvider } from './providers/google-tts-provider';
import { MockTTSProvider } from './providers/mock-tts-provider';
import { VoicePreset, VoiceConfig } from '@/types';

export class TTSService {
  private providers: Map<TTSProviderName, ITTSProvider> = new Map();
  private activeProvider: TTSProviderName;

  constructor(activeProvider: TTSProviderName = 'mock') {
    this.activeProvider = activeProvider;
    this.registerProvider('elevenlabs', new ElevenLabsProvider());
    this.registerProvider('google', new GoogleTTSProvider());
    this.registerProvider('mock', new MockTTSProvider());
  }

  registerProvider(name: TTSProviderName, provider: ITTSProvider): void {
    this.providers.set(name, provider);
  }

  setActiveProvider(name: TTSProviderName): void {
    if (!this.providers.has(name)) {
      throw new Error(`Provider TTS "${name}" não registrado`);
    }
    this.activeProvider = name;
  }

  getProvider(name?: TTSProviderName): ITTSProvider {
    const providerName = name || this.activeProvider;
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(
        `Provider TTS "${providerName}" não encontrado. Disponíveis: ${Array.from(this.providers.keys()).join(', ')}`
      );
    }
    return provider;
  }

  async generateSpeech(
    text: string,
    voice: VoiceConfig,
    options?: {
      speed?: number;
      pitch?: number;
      provider?: TTSProviderName;
    }
  ): Promise<TTSResult> {
    const provider = this.getProvider(options?.provider);

    const request: TTSRequest = {
      text,
      voice,
      speed: options?.speed,
      pitch: options?.pitch,
    };

    return provider.generateSpeech(request);
  }

  async getVoices(providerName?: TTSProviderName): Promise<VoicePreset[]> {
    return this.getProvider(providerName).getVoices();
  }

  async getAllVoices(): Promise<VoicePreset[]> {
    const allVoices: VoicePreset[] = [];
    for (const [_, provider] of this.providers) {
      const voices = await provider.getVoices();
      allVoices.push(...voices);
    }
    return allVoices;
  }

  async getVoicesByFilter(filters: {
    gender?: string;
    style?: string;
    language?: string;
    provider?: string;
  }): Promise<VoicePreset[]> {
    let voices = await this.getAllVoices();

    if (filters.gender) voices = voices.filter(v => v.gender === filters.gender);
    if (filters.style) voices = voices.filter(v => v.style === filters.style);
    if (filters.language) voices = voices.filter(v => v.language === filters.language);
    if (filters.provider) voices = voices.filter(v => v.provider === filters.provider);

    return voices;
  }

  listProviders(): TTSProviderName[] {
    return Array.from(this.providers.keys());
  }
}

export const ttsService = new TTSService(
  (process.env.NEXT_PUBLIC_TTS_PROVIDER as TTSProviderName) || 'mock'
);
