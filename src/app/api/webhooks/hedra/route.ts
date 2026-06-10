import { NextResponse } from 'next/server';
import { supabaseService } from '@/services/supabase/supabase-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { job_id, status, output, error } = body as {
      job_id: string;
      status: 'completed' | 'failed' | 'processing';
      output?: { video_url?: string; duration?: number };
      error?: string;
    };

    if (!job_id) {
      return NextResponse.json({ success: false, error: 'job_id é obrigatório' }, { status: 400 });
    }

    // Salva no banco
    await supabaseService.updateJobStatus(
      job_id,
      status,
      output ? { videoUrl: output.video_url, duration: output.duration } : undefined,
      error
    );

    // Se completed, log uso
    if (status === 'completed') {
      const job = await supabaseService.getProject(job_id);
      if (job.success && job.data) {
        await supabaseService.logUsage({
          userId: job.data.userId || 'unknown',
          projectId: job.data.id,
          jobId: job_id,
          provider: 'hedra',
          operation: 'lipsync',
          costCents: 200, // $2
          durationMs: output?.duration ? output.duration * 1000 : undefined,
        });
      }
    }

    return NextResponse.json({ success: true, data: null, error: null });
  } catch (error: unknown) {
    console.error('Erro no webhook Hedra:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Webhook error' },
      { status: 500 }
    );
  }
}
