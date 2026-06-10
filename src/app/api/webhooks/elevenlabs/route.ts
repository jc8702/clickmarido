import { NextResponse } from 'next/server';
import { supabaseService } from '@/services/supabase/supabase-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { job_id, status, output, error } = body as {
      job_id: string;
      status: 'completed' | 'failed' | 'processing';
      output?: { audio_url?: string; duration_ms?: number; cost?: number };
      error?: string;
    };

    if (!job_id) {
      return NextResponse.json({ success: false, error: 'job_id é obrigatório' }, { status: 400 });
    }

    await supabaseService.updateJobStatus(
      job_id,
      status,
      output ? { audioUrl: output.audio_url, durationMs: output.duration_ms } : undefined,
      error
    );

    if (status === 'completed') {
      await supabaseService.logUsage({
        userId: 'unknown',
        projectId: job_id,
        jobId: job_id,
        provider: 'elevenlabs',
        operation: 'tts_generation',
        costCents: output?.cost ? Math.round(output.cost * 100) : 30,
        durationMs: output?.duration_ms || undefined,
      });
    }

    return NextResponse.json({ success: true, data: null, error: null });
  } catch (error: unknown) {
    console.error('Erro no webhook ElevenLabs:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Webhook error' },
      { status: 500 }
    );
  }
}
