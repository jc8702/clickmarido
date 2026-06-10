import { NextResponse } from 'next/server';
import { ImageAnalyzer } from '@/services/ai/image-analyzer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, imageBase64, mimeType } = body as {
      imageUrl?: string;
      imageBase64?: string;
      mimeType?: string;
    };

    if (!imageUrl && !imageBase64) {
      return NextResponse.json(
        { success: false, error: 'Forneça imageUrl ou imageBase64' },
        { status: 400 }
      );
    }

    const analyzer = new ImageAnalyzer();

    let analysis;
    if (imageUrl) {
      analysis = await analyzer.analyzeFromUrl(imageUrl);
    } else {
      analysis = await analyzer.analyze(imageBase64!, mimeType || 'image/jpeg');
    }

    return NextResponse.json({
      success: true,
      data: analysis,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao analisar imagem:', error);
    const message = error instanceof Error ? error.message : 'Falha ao analisar imagem';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
