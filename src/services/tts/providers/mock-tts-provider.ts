import { ITTSProvider, TTSRequest, TTSResult } from '../types';
import { VoicePreset } from '@/types';

const MOCK_VOICES: VoicePreset[] = [
  { id: 'mock-male-1', name: 'João (Mock)', gender: 'male', style: 'corporate', language: 'pt-BR', provider: 'mock', providerVoiceId: 'mock-male-pt' },
  { id: 'mock-male-2', name: 'Pedro (Mock)', gender: 'male', style: 'young', language: 'pt-BR', provider: 'mock', providerVoiceId: 'mock-male-pt-young' },
  { id: 'mock-female-1', name: 'Maria (Mock)', gender: 'female', style: 'institutional', language: 'pt-BR', provider: 'mock', providerVoiceId: 'mock-female-pt' },
  { id: 'mock-female-2', name: 'Ana (Mock)', gender: 'female', style: 'young', language: 'pt-BR', provider: 'mock', providerVoiceId: 'mock-female-pt-young' },
  { id: 'mock-male-en', name: 'John (Mock EN)', gender: 'male', style: 'corporate', language: 'en-US', provider: 'mock', providerVoiceId: 'mock-male-en' },
  { id: 'mock-female-en', name: 'Sarah (Mock EN)', gender: 'female', style: 'institutional', language: 'en-US', provider: 'mock', providerVoiceId: 'mock-female-en' },
  { id: 'mock-male-es', name: 'Carlos (Mock ES)', gender: 'male', style: 'corporate', language: 'es-ES', provider: 'mock', providerVoiceId: 'mock-male-es' },
];

export class MockTTSProvider implements ITTSProvider {
  name = 'mock';

  async generateSpeech(request: TTSRequest): Promise<TTSResult> {
    const durationMs = this.estimateDuration(request.text);

    // Simula delay de processamento
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      audioUrl: `data:audio/mpeg;base64,MOCK_AUDIO_${Date.now()}`,
      durationMs,
      cost: 0,
      provider: this.name,
      phonemes: this.generateMockPhonemes(request.text),
    };
  }

  async getVoices(): Promise<VoicePreset[]> {
    return MOCK_VOICES;
  }

  private estimateDuration(text: string): number {
    const wordsPerMinute = 150;
    const wordsPerSecond = wordsPerMinute / 60;
    const wordCount = text.split(/\s+/).length;
    return Math.round((wordCount / wordsPerSecond) * 1000);
  }

  private generateMockPhonemes(text: string) {
    const words = text.split(/\s+/);
    const phonemes: { startMs: number; endMs: number; phoneme: string }[] = [];
    let currentTime = 0;

    for (const word of words) {
      const wordDuration = Math.round((60 / 150) * 1000);
      const wordPhonemes = word.toLowerCase()
        .replace(/[aeiouáéíóúâêôàãõ]/g, 'V')
        .replace(/[^v\s]/g, 'C')
        .split('')
        .filter(p => p === 'V' || p === 'C');

      for (const p of wordPhonemes) {
        phonemes.push({
          startMs: currentTime,
          endMs: currentTime + Math.round(wordDuration / wordPhonemes.length),
          phoneme: p === 'V' ? 'AA' : 'SS',
        });
        currentTime += Math.round(wordDuration / wordPhonemes.length);
      }

      currentTime += 50;
    }

    return phonemes;
  }
}
