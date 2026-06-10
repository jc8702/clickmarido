import { NextResponse } from 'next/server';
import { renderer } from '@/services/video/renderer';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'jobId é obrigatório' },
        { status: 400 }
      );
    }

    const status = renderer.getStatus(jobId);
    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Job de renderização não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: status,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar status da renderização:', error);
    const message = error instanceof Error ? error.message : 'Falha ao buscar status';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
