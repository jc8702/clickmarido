import { NextResponse } from 'next/server';
import { AIService } from '@/services/ai/ai-service';
import { Briefing } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { briefing, apiKey } = body as { briefing: Briefing; apiKey?: string };

    if (!briefing) {
      return NextResponse.json(
        { success: false, data: null, error: 'Briefing não fornecido' },
        { status: 400 }
      );
    }

    const script = await AIService.generateScript(briefing, apiKey);
    const storyboard = await AIService.generateStoryboard(briefing, script, apiKey);
    const prompts = await AIService.generateVideoPrompts(briefing, storyboard, apiKey);
    const caption = await AIService.generateCaption(briefing, script, apiKey);

    return NextResponse.json({
      success: true,
      data: { script, storyboard, prompts, caption },
      error: null
    });
  } catch (error: unknown) {
    console.error('Erro na API de geração:', error);
    const errorMessage = error instanceof Error ? error.message : 'Falha ao processar conteúdo com IA';
    return NextResponse.json(
      { success: false, data: null, error: errorMessage },
      { status: 500 }
    );
  }
}
