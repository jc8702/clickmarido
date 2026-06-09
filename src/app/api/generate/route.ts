import { NextResponse } from 'next/server';
import { AIService } from '@/services/ai/ai-service';
import { Briefing } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { briefing } = body as { briefing: Briefing };

    if (!briefing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Briefing não fornecido' },
        { status: 400 }
      );
    }

    // 1. Gera o Roteiro
    const script = await AIService.generateScript(briefing);

    // 2. Gera o Storyboard
    const storyboard = await AIService.generateStoryboard(briefing, script);

    // 3. Gera os Prompts de Vídeo
    const prompts = await AIService.generateVideoPrompts(briefing, storyboard);

    // 4. Gera a Legenda
    const caption = await AIService.generateCaption(briefing, script);

    return NextResponse.json({
      success: true,
      data: {
        script,
        storyboard,
        prompts,
        caption
      },
      error: null
    });
  } catch (error: unknown) {
    console.error('Erro na API de geração:', error);
    const errorMessage = error instanceof Error ? error.message : 'Falha ao processar conteúdo com IA';
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: errorMessage
      },
      { status: 500 }
    );
  }
}
