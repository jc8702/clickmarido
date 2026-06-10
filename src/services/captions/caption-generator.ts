import { ICaptionProvider, CaptionGenerationRequest, CaptionGenerationResult, CaptionProviderName } from './types';
import { CaptionCue, CaptionStyle } from '@/types';

const DEFAULT_STYLE: CaptionStyle = {
  fontSize: 28,
  fontFamily: 'Arial',
  color: '#FFFFFF',
  highlightColor: '#FFD700',
  backgroundColor: 'rgba(0,0,0,0.6)',
  position: 'bottom',
  highlightCurrentWord: true,
};

function msToSrt(ms: number): string {
  const totalSec = ms / 1000;
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.floor(totalSec % 60);
  const msFormatted = Math.floor(ms % 1000);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${msFormatted.toString().padStart(3, '0')}`;
}

function generateSRT(cues: CaptionCue[]): string {
  return cues.map(cue =>
    `${cue.index}\n${msToSrt(cue.startMs)} --> ${msToSrt(cue.endMs)}\n${cue.text}\n`
  ).join('\n');
}

function generateVTT(cues: CaptionCue[]): string {
  const header = 'WEBVTT\n\n';
  return header + cues.map(cue =>
    `${msToSrt(cue.startMs).replace(',', '.')} --> ${msToSrt(cue.endMs).replace(',', '.')}\n${cue.text}\n`
  ).join('\n');
}

class GeminiCaptionProvider implements ICaptionProvider {
  name = 'gemini';

  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
  }

  async generate(request: CaptionGenerationRequest): Promise<CaptionGenerationResult> {
    const textPrompt = request.text
      ? `Here is the full script text: "${request.text}".`
      : 'Transcribe the audio and generate accurate captions.';

    const prompt = `You are a professional caption generator. Generate word-level timestamped captions.

${textPrompt}

Return ONLY valid JSON (no markdown):
{
  "cues": [
    {
      "index": 1,
      "startMs": 0,
      "endMs": 2000,
      "text": "First caption text",
      "words": [
        {"word": "First", "startMs": 0, "endMs": 500},
        {"word": "caption", "startMs": 500, "endMs": 1500},
        {"word": "text", "startMs": 1500, "endMs": 2000}
      ]
    }
  ],
  "durationMs": 30000
}

Rules:
- Each caption should be 2-5 seconds long
- Each word must have startMs and endMs timestamps
- Language: ${request.language || 'pt-BR'}
- Break long sentences into multiple cues
- Total duration should match the audio length`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: request.audioUrl
              ? [
                  { text: prompt },
                  { inline_data: { mime_type: 'audio/mpeg', data: '' } }
                ]
              : [{ text: prompt }]
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.1,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`Gemini caption error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);

    type RawCue = Record<string, unknown>;
    type RawWord = Record<string, unknown>;
    const cues: CaptionCue[] = (result.cues || []).map((cue: RawCue) => ({
      index: cue.index as number,
      startMs: cue.startMs as number,
      endMs: cue.endMs as number,
      text: cue.text as string,
      words: ((cue.words || []) as RawWord[]).map((w: RawWord) => ({
        word: w.word as string,
        startMs: w.startMs as number,
        endMs: w.endMs as number,
      })),
    }));

    return {
      cues,
      srt: generateSRT(cues),
      vtt: generateVTT(cues),
      durationMs: result.durationMs || 30000,
      cost: 0,
      provider: this.name,
    };
  }
}

class MockCaptionProvider implements ICaptionProvider {
  name = 'mock';

  async generate(request: CaptionGenerationRequest): Promise<CaptionGenerationResult> {
    const text = request.text || 'Este é um vídeo institucional da Click Marido. Nós resolvemos todos os seus problemas residenciais com rapidez e profissionalismo. Entre em contato agora mesmo pelo WhatsApp e solicite seu orçamento.';
    const words = text.split(/\s+/);
    const wordDuration = 200;
    const totalDuration = words.length * wordDuration;
    const wordsPerCue = 5;

    const cues: CaptionCue[] = [];
    let cueIndex = 0;

    for (let i = 0; i < words.length; i += wordsPerCue) {
      cueIndex++;
      const slice = words.slice(i, i + wordsPerCue);
      const startMs = i * wordDuration;
      const endMs = Math.min((i + wordsPerCue) * wordDuration, totalDuration);

      cues.push({
        index: cueIndex,
        startMs,
        endMs,
        text: slice.join(' '),
        words: slice.map((word, wi) => ({
          word,
          startMs: (i + wi) * wordDuration,
          endMs: (i + wi + 1) * wordDuration,
        })),
      });
    }

    return {
      cues,
      srt: generateSRT(cues),
      vtt: generateVTT(cues),
      durationMs: totalDuration,
      cost: 0,
      provider: this.name,
    };
  }
}

export class CaptionGeneratorService {
  private providers: Map<CaptionProviderName, ICaptionProvider> = new Map();
  private activeProvider: CaptionProviderName;

  constructor(activeProvider: CaptionProviderName = 'mock') {
    this.activeProvider = activeProvider;
    this.registerProvider('gemini', new GeminiCaptionProvider());
    this.registerProvider('mock', new MockCaptionProvider());
  }

  registerProvider(name: CaptionProviderName, provider: ICaptionProvider): void {
    this.providers.set(name, provider);
  }

  getProvider(name?: CaptionProviderName): ICaptionProvider {
    const providerName = name || this.activeProvider;
    const provider = this.providers.get(providerName);
    if (!provider) throw new Error(`Provider "${providerName}" não encontrado`);
    return provider;
  }

  async generate(request: CaptionGenerationRequest, providerName?: CaptionProviderName) {
    return this.getProvider(providerName).generate(request);
  }

  getDefaultStyle(): CaptionStyle {
    return { ...DEFAULT_STYLE };
  }
}

export const captionGeneratorService = new CaptionGeneratorService(
  (process.env.NEXT_PUBLIC_CAPTION_PROVIDER as CaptionProviderName) || 'mock'
);
