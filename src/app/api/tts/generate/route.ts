import { NextResponse } from 'next/server';
import { ttsService } from '@/services/tts/tts-service';
import { VoiceConfig } from '@/types';
import { TTSProviderName } from '@/services/tts/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, voice, speed, pitch, provider, apiKey } = body as {
      text: string;
      voice: VoiceConfig;
      speed?: number;
      pitch?: number;
      provider?: TTSProviderName;
      apiKey?: string;
    };

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Texto é obrigatório' },
        { status: 400 }
      );
    }

    if (!voice || !voice.providerVoiceId) {
      return NextResponse.json(
        { success: false, error: 'Configuração de voz inválida' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Texto muito longo. Máximo 5000 caracteres' },
        { status: 400 }
      );
    }

    const result = await ttsService.generateSpeech(text, voice, {
      speed,
      pitch,
      provider,
      apiKey,
    });

    return NextResponse.json({
      success: true,
      data: {
        audioUrl: result.audioUrl,
        durationMs: result.durationMs,
        cost: result.cost,
        provider: result.provider,
        phonemes: result.phonemes || null,
      },
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao gerar narração:', error);
    const message = error instanceof Error ? error.message : 'Falha ao gerar narração';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
