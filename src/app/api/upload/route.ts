import { NextResponse } from 'next/server';
import { storageService } from '@/services/storage/supabase-storage';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;
    const projectId = formData.get('projectId') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Arquivo não fornecido' },
        { status: 400 }
      );
    }

    if (!userId || !projectId) {
      return NextResponse.json(
        { success: false, error: 'userId e projectId são obrigatórios' },
        { status: 400 }
      );
    }

    // Valida tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF' },
        { status: 400 }
      );
    }

    // Valida tamanho (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Arquivo muito grande. Máximo 50MB' },
        { status: 400 }
      );
    }

    const result = await storageService.uploadImage(file, userId, projectId, file.name);

    return NextResponse.json({
      success: true,
      data: {
        url: result.url,
        path: result.path,
        name: file.name,
        size: file.size,
        type: file.type,
      },
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro no upload:', error);
    const message = error instanceof Error ? error.message : 'Falha ao fazer upload';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { path } = await request.json() as { path: string };

    if (!path) {
      return NextResponse.json(
        { success: false, error: 'path é obrigatório' },
        { status: 400 }
      );
    }

    await storageService.deleteImage(path);

    return NextResponse.json({
      success: true,
      data: null,
      error: null,
    });
  } catch (error: unknown) {
    console.error('Erro ao deletar imagem:', error);
    const message = error instanceof Error ? error.message : 'Falha ao deletar imagem';
    return NextResponse.json(
      { success: false, data: null, error: message },
      { status: 500 }
    );
  }
}
