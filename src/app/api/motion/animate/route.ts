import { NextResponse } from 'next/server';
import { motionEngine } from '@/services/motion/motion-engine';
import { ImageAnalysis, MotionConfig } from '@/types';
import { ProviderName } from '@/services/motion/providers/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      imageUrl,
      imageAnalysis,
      motionConfig,
      duration,
      audioUrl,
      lipsyncEnabled,
      provider,
    } = body as {
      imageUrl: string;
      imageAnalysis: ImageAnalysis;
      motionConfig?: Partial<MotionConfig>;
      duration?: number;
      audioUrl?: string;
      lipsyncEnabled?: boolean;
      provider?: ProviderName;
    };

    if (!imageUrl || !imageAnalysis) {
      return NextResponse.json(
        { success: false, error: 'imageUrl e imageAnalysis são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await motionEngine.generateVideo(
      imageUrl,
      imageAnalysis,
      motionConfig,
      {
        duration,
        audioUrl,
        lipsyncEnabled,
        provider,
      }
    );

    return NextResponse.json({
      success: true,
      data: {
        jobId: result.jobId,
        provider: provider || motionEngine.listProviders()[0]?.name || 'mock',
      },
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao gerar animação:', error);
    const message = error instanceof Error ? error.message : 'Falha ao gerar animação';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
