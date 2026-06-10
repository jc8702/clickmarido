import { NextResponse } from 'next/server';
import { supabaseService } from '@/services/supabase/supabase-client';
import { Project } from '@/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await supabaseService.getProject(id);

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: 'Projeto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao buscar projeto:', error);
    const message = error instanceof Error ? error.message : 'Falha ao buscar projeto';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json() as Record<string, unknown>;

    // Tenta carregar o projeto existente para evitar perda de dados omitidos no body
    const existing = await supabaseService.getProject(id);
    let updated: Record<string, unknown>;

    if (existing.success && existing.data) {
      updated = { ...existing.data, ...body, id };
    } else {
      updated = { ...body, id };
    }

    const result = await supabaseService.saveProject(updated as unknown as Project);
    if (!result.success) throw new Error(result.error as string);

    return NextResponse.json({
      success: true,
      data: updated,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao atualizar projeto:', error);
    const message = error instanceof Error ? error.message : 'Falha ao atualizar projeto';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await supabaseService.deleteProject(id);

    if (!result.success) throw new Error(result.error as string);

    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao deletar projeto:', error);
    const message = error instanceof Error ? error.message : 'Falha ao deletar projeto';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
