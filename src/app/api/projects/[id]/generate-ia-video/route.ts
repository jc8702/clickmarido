import { NextResponse } from 'next/server';
import { jobManager } from '@/services/queue/job-manager';
import { supabaseService } from '@/services/supabase/supabase-client';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json().catch(() => ({}));
    const { apiKey } = body as { apiKey?: string };

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId é obrigatório' },
        { status: 400 }
      );
    }

    const projResult = await supabaseService.getProject(projectId);
    if (!projResult.success || !projResult.data) {
      return NextResponse.json(
        { success: false, error: 'Projeto não encontrado' },
        { status: 404 }
      );
    }
    const project = projResult.data;

    if (!project.images || project.images.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Por favor, adicione pelo menos uma imagem na aba de Imagens antes de gerar.' },
        { status: 400 }
      );
    }

    // Cria o job do pipeline assíncrono
    const jobId = await jobManager.addJob(
      'project_pipeline',
      { projectId, apiKey },
      { projectId, priority: 10 }
    );

    // Atualiza o status do projeto no banco de dados
    project.status = 'generating';
    await supabaseService.saveProject(project);

    return NextResponse.json({
      success: true,
      data: { jobId, status: 'generating' },
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao iniciar pipeline IA:', error);
    const message = error instanceof Error ? error.message : 'Falha ao iniciar geração de vídeo por IA';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
