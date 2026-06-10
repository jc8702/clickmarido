import { NextResponse } from 'next/server';
import { motionEngine } from '@/services/motion/motion-engine';

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

    const status = await motionEngine.getStatus(jobId);

    return NextResponse.json({
      success: true,
      data: status,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar status do job:', error);
    const message = error instanceof Error ? error.message : 'Falha ao buscar status';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
