import { NextResponse } from 'next/server';
import { renderer } from '@/services/video/renderer';
import { RenderConfig, TimelineState, CaptionCue, CaptionStyle } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      timeline,
      captions,
      captionStyle,
      renderConfig,
      musicUrl,
      musicVolume,
    } = body as {
      timeline: TimelineState;
      captions: CaptionCue[];
      captionStyle: CaptionStyle;
      renderConfig: RenderConfig;
      musicUrl?: string;
      musicVolume?: number;
    };

    if (!timeline || !renderConfig) {
      return NextResponse.json(
        { success: false, error: 'timeline e renderConfig são obrigatórios' },
        { status: 400 }
      );
    }

    const validResolutions = ['1080p', '1440p', '4K'];
    if (!validResolutions.includes(renderConfig.resolution)) {
      return NextResponse.json(
        { success: false, error: `Resolução inválida. Use: ${validResolutions.join(', ')}` },
        { status: 400 }
      );
    }

    const result = await renderer.startRender({
      timeline,
      captions: captions || [],
      captionStyle: captionStyle || {
        fontSize: 28,
        fontFamily: 'Arial',
        color: '#FFFFFF',
        highlightColor: '#FFD700',
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'bottom',
        highlightCurrentWord: true,
      },
      renderConfig,
      musicUrl,
      musicVolume,
    });

    return NextResponse.json({
      success: true,
      data: {
        jobId: result.jobId,
        estimatedCost: renderer.estimateCost({
          duration: timeline.duration,
          resolution: renderConfig.resolution,
        }),
      },
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao iniciar render:', error);
    const message = error instanceof Error ? error.message : 'Falha ao iniciar render';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
