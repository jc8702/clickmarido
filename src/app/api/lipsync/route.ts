import { NextResponse } from 'next/server';
import { lipSyncService } from '@/services/lipsync/lipsync-service';
import { LipSyncProviderName } from '@/services/lipsync/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl, audioUrl, phonemes, faceBoundingBox, provider } = body as {
      videoUrl: string;
      audioUrl: string;
      phonemes?: { startMs: number; endMs: number; phoneme: string }[];
      faceBoundingBox?: { x: number; y: number; width: number; height: number };
      provider?: LipSyncProviderName;
    };

    if (!videoUrl || !audioUrl) {
      return NextResponse.json(
        { success: false, error: 'videoUrl e audioUrl são obrigatórios' },
        { status: 400 }
      );
    }

    const result = await lipSyncService.sync(
      { videoUrl, audioUrl, phonemes, faceBoundingBox },
      provider
    );

    return NextResponse.json({
      success: true,
      data: {
        jobId: result.jobId,
        provider: provider || 'auto',
      },
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao iniciar lip sync:', error);
    const message = error instanceof Error ? error.message : 'Falha ao iniciar lip sync';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
