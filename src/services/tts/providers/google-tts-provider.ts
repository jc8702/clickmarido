import { ITTSProvider, TTSRequest, TTSResult } from '../types';
import { VoicePreset } from '@/types';

const DEFAULT_VOICES: VoicePreset[] = [
  { id: 'google-male-pt', name: 'Pedro (Profissional)', gender: 'male', style: 'corporate', language: 'pt-BR', provider: 'google', providerVoiceId: 'pt-BR-Wavenet-B' },
  { id: 'google-male-pt-young', name: 'Lucas (Jovem)', gender: 'male', style: 'young', language: 'pt-BR', provider: 'google', providerVoiceId: 'pt-BR-Wavenet-A' },
  { id: 'google-female-pt', name: 'Julia (Institucional)', gender: 'female', style: 'institutional', language: 'pt-BR', provider: 'google', providerVoiceId: 'pt-BR-Wavenet-C' },
  { id: 'google-female-pt-young', name: 'Beatriz (Jovem)', gender: 'female', style: 'young', language: 'pt-BR', provider: 'google', providerVoiceId: 'pt-BR-Wavenet-D' },
  { id: 'google-male-en', name: 'James (English)', gender: 'male', style: 'corporate', language: 'en-US', provider: 'google', providerVoiceId: 'en-US-Wavenet-D' },
  { id: 'google-female-en', name: 'Emma (English)', gender: 'female', style: 'institutional', language: 'en-US', provider: 'google', providerVoiceId: 'en-US-Wavenet-C' },
  { id: 'google-male-es', name: 'Diego (Español)', gender: 'male', style: 'corporate', language: 'es-ES', provider: 'google', providerVoiceId: 'es-ES-Wavenet-B' },
  { id: 'google-female-es', name: 'Sofia (Español)', gender: 'female', style: 'institutional', language: 'es-ES', provider: 'google', providerVoiceId: 'es-ES-Wavenet-C' },
];

const LANGUAGE_CODES: Record<string, string> = {
  'pt-BR': 'pt-BR',
  'en-US': 'en-US',
  'es-ES': 'es-ES',
};

const SSML_GENDER: Record<string, string> = {
  male: 'MALE',
  female: 'FEMALE',
};

export class GoogleTTSProvider implements ITTSProvider {
  name = 'google';

  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_TTS_API_KEY || process.env.GEMINI_API_KEY || '';
  }

  async generateSpeech(request: TTSRequest): Promise<TTSResult> {
    if (!this.apiKey) {
      throw new Error('Google TTS API key não configurada');
    }

    const languageCode = LANGUAGE_CODES[request.voice.language] || 'pt-BR';
    const ssmlGender = SSML_GENDER[request.voice.gender] || 'NEUTRAL';

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: { text: request.text },
          voice: {
            languageCode,
            name: request.voice.providerVoiceId,
            ssmlGender,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: request.speed || 1.0,
            pitch: request.pitch || 0,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Google TTS API error (${response.status}): ${response.statusText} ${errorBody}`);
    }

    const data = await response.json();
    const audioBase64 = data.audioContent;

    if (!audioBase64) {
      throw new Error('Google TTS não retornou áudio');
    }

    const dataUrl = `data:audio/mpeg;base64,${audioBase64}`;

    return {
      audioUrl: dataUrl,
      durationMs: await this.estimateDuration(request.text),
      cost: 0,
      provider: this.name,
    };
  }

  async getVoices(): Promise<VoicePreset[]> {
    return DEFAULT_VOICES;
  }

  private async estimateDuration(text: string): Promise<number> {
    const avgCharPerSecond = 15;
    const charCount = text.length;
    return Math.round((charCount / avgCharPerSecond) * 1000);
  }
}
