import { ITTSProvider, TTSRequest, TTSResult } from '../types';
import { VoicePreset } from '@/types';

const DEFAULT_VOICES: VoicePreset[] = [
  { id: 'elevenlabs-male-1', name: 'José (Profissional)', gender: 'male', style: 'corporate', language: 'pt-BR', provider: 'elevenlabs', providerVoiceId: 'EXAVITQu4vrRV7Ss5gzB' },
  { id: 'elevenlabs-male-2', name: 'Carlos (Jovem)', gender: 'male', style: 'young', language: 'pt-BR', provider: 'elevenlabs', providerVoiceId: 'N2l8QFTyFbS4E3XQm5gA' },
  { id: 'elevenlabs-female-1', name: 'Ana (Institucional)', gender: 'female', style: 'institutional', language: 'pt-BR', provider: 'elevenlabs', providerVoiceId: '21m00Tcm4TlvDq8ikWAM' },
  { id: 'elevenlabs-female-2', name: 'Mariana (Jovem)', gender: 'female', style: 'young', language: 'pt-BR', provider: 'elevenlabs', providerVoiceId: 'AZnzlk1XiGk3HlUwOAVZ' },
  { id: 'elevenlabs-male-en', name: 'John (English)', gender: 'male', style: 'corporate', language: 'en-US', provider: 'elevenlabs', providerVoiceId: 'pNInz6obpgDQGcFmaJgB' },
  { id: 'elevenlabs-female-en', name: 'Sarah (English)', gender: 'female', style: 'institutional', language: 'en-US', provider: 'elevenlabs', providerVoiceId: 'EXAVITQu4vrRV7Ss5gzB' },
  { id: 'elevenlabs-male-es', name: 'Carlos (Español)', gender: 'male', style: 'corporate', language: 'es-ES', provider: 'elevenlabs', providerVoiceId: 'ODq5zmih8GrVes37Dizd' },
];

export class ElevenLabsProvider implements ITTSProvider {
  name = 'elevenlabs';

  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || '';
  }

  async generateSpeech(request: TTSRequest): Promise<TTSResult> {
    const key = request.apiKey || this.apiKey;
    if (!key) {
      throw new Error('ElevenLabs API key não configurada');
    }

    const response = await fetch(`${this.baseUrl}/text-to-speech/${request.voice.providerVoiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': key,
      },
      body: JSON.stringify({
        text: request.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          speed: request.speed || 1.0,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`ElevenLabs API error (${response.status}): ${response.statusText} ${errorBody}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    const dataUrl = `data:audio/mpeg;base64,${audioBase64}`;

    const durationMs = await this.estimateDuration(audioBuffer);

    return {
      audioUrl: dataUrl,
      durationMs,
      cost: this.calculateCost(request.text),
      provider: this.name,
    };
  }

  async getVoices(): Promise<VoicePreset[]> {
    return DEFAULT_VOICES;
  }

  private async estimateDuration(audioBuffer: ArrayBuffer): Promise<number> {
    try {
      const sampleRate = 16000;
      const bytesPerSample = 2;
      const channels = 1;
      const totalSamples = audioBuffer.byteLength / (bytesPerSample * channels);
      return Math.round((totalSamples / sampleRate) * 1000);
    } catch {
      return 0;
    }
  }

  private calculateCost(text: string): number {
    const charCount = text.length;
    return Math.ceil(charCount / 1000) * 0.3;
  }
}
