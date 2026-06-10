import { NextResponse } from 'next/server';
import { ttsService } from '@/services/tts/tts-service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const style = searchParams.get('style');
    const language = searchParams.get('language');
    const provider = searchParams.get('provider');

    const filters: Record<string, string> = {};
    if (gender) filters.gender = gender;
    if (style) filters.style = style;
    if (language) filters.language = language;
    if (provider) filters.provider = provider;

    const voices = Object.keys(filters).length > 0
      ? await ttsService.getVoicesByFilter(filters)
      : await ttsService.getAllVoices();

    return NextResponse.json({
      success: true,
      data: voices,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao listar vozes:', error);
    const message = error instanceof Error ? error.message : 'Falha ao listar vozes';
    return NextResponse.json(
      { success: false, data: [], error: message },
      { status: 500 }
    );
  }
}
