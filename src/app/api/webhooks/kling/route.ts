import { NextResponse } from 'next/server';
import { supabaseService } from '@/services/supabase/supabase-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { task_id, status, data, fail_reason } = body as {
      task_id: string;
      status: 'pending' | 'running' | 'succeeded' | 'failed';
      data?: { task_id?: string; video?: { url: string; duration: number }; cost?: number };
      fail_reason?: string;
    };

    if (!task_id) {
      return NextResponse.json({ success: false, error: 'task_id é obrigatório' }, { status: 400 });
    }

    const mappedStatus = status === 'succeeded' ? 'completed'
      : status === 'failed' ? 'failed'
      : 'processing';

    const output = data?.video
      ? { url: data.video.url, duration: data.video.duration, cost: data.cost }
      : undefined;

    await supabaseService.updateJobStatus(task_id, mappedStatus, output, fail_reason);

    if (mappedStatus === 'completed' && data?.cost) {
      const job = await supabaseService.getProject(task_id);
      if (job.success && job.data) {
        await supabaseService.logUsage({
          userId: job.data.userId || 'unknown',
          projectId: job.data.id,
          jobId: task_id,
          provider: 'kling',
          operation: 'motion_generation',
          costCents: Math.round((data.cost || 0) * 100),
          durationMs: data.video?.duration ? data.video.duration * 1000 : undefined,
        });
      }
    }

    return NextResponse.json({ success: true, data: null, error: null });
  } catch (error: unknown) {
    console.error('Erro no webhook Kling:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Webhook error' },
      { status: 500 }
    );
  }
}
