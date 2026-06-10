import { NextResponse } from 'next/server';
import { captionGeneratorService } from '@/services/captions/caption-generator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { audioUrl, text, language } = body as {
      audioUrl?: string;
      text?: string;
      language?: string;
    };

    if (!audioUrl && !text) {
      return NextResponse.json(
        { success: false, error: 'Forneça audioUrl ou text para gerar legendas' },
        { status: 400 }
      );
    }

    const result = await captionGeneratorService.generate({
      audioUrl: audioUrl || '',
      text,
      language: language || 'pt-BR',
    });

    return NextResponse.json({
      success: true,
      data: {
        cues: result.cues,
        srt: result.srt,
        vtt: result.vtt,
        durationMs: result.durationMs,
        provider: result.provider,
      },
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao gerar legendas:', error);
    const message = error instanceof Error ? error.message : 'Falha ao gerar legendas';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
