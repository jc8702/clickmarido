import { NextResponse } from 'next/server';
import { startWorkers } from '@/workers';

let started = false;

export async function POST() {
  if (started) {
    return NextResponse.json({ success: true, message: 'Workers já estão rodando' });
  }

  try {
    await startWorkers();
    started = true;
    return NextResponse.json({ success: true, message: 'Workers iniciados com sucesso' });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Erro ao iniciar workers' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    running: started,
    registeredWorkers: started ? ['image_analysis', 'motion_generation', 'tts_generation', 'lipsync', 'caption_generation', 'video_render', 'composite_final'] : [],
  });
}
