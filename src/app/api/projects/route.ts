import { NextResponse } from 'next/server';
import { supabaseService } from '@/services/supabase/supabase-client';
import { Briefing } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, briefing, userId } = body as {
      name: string;
      briefing: Briefing;
      userId?: string;
    };

    if (!name || !briefing) {
      return NextResponse.json(
        { success: false, error: 'name e briefing são obrigatórios' },
        { status: 400 }
      );
    }

    const project = {
      id: `proj-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      status: 'draft' as const,
      briefing,
      userId,
    };

    const result = await supabaseService.saveProject(project);
    if (!result.success) throw new Error(result.error as string);

    return NextResponse.json({
      success: true,
      data: project,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao criar projeto:', error);
    const message = error instanceof Error ? error.message : 'Falha ao criar projeto';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const result = await supabaseService.getProjects(userId || undefined);

    return NextResponse.json({
      success: result.success,
      data: result.data,
      error: result.error || null,
    });
  } catch (error: unknown) {
    console.error('Erro ao listar projetos:', error);
    const message = error instanceof Error ? error.message : 'Falha ao listar projetos';
    return NextResponse.json(
      { success: false, data: [], error: message },
      { status: 500 }
    );
  }
}
