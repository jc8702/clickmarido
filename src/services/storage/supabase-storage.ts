import { getSupabase } from '@/services/supabase/supabase-client';

const BUCKET_NAME = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'project-images';

export interface UploadResult {
  url: string;
  path: string;
  thumbnailUrl?: string;
}

export class SupabaseStorage {
  private async ensureBucket(): Promise<void> {
    const db = getSupabase();
    if (!db) return;

    const { data: buckets } = await db.storage.listBuckets();
    if (!buckets?.find(b => b.name === BUCKET_NAME)) {
      await db.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 50 * 1024 * 1024, // 50MB
      });
    }
  }

  async uploadImage(
    file: File | Blob,
    userId: string,
    projectId: string,
    fileName?: string
  ): Promise<UploadResult> {
    const db = getSupabase();
    if (!db) throw new Error('Supabase não configurado');

    await this.ensureBucket();

    const ext = fileName?.split('.').pop() || 'png';
    const path = `${userId}/${projectId}/${crypto.randomUUID()}.${ext}`;

    const { error } = await db.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw new Error(`Erro ao fazer upload: ${error.message}`);

    const { data: urlData } = db.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    return {
      url: urlData.publicUrl,
      path,
    };
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    const db = getSupabase();
    if (!db) throw new Error('Supabase não configurado');

    const { data, error } = await db.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error) throw new Error(`Erro ao gerar URL: ${error.message}`);
    return data.signedUrl;
  }

  async deleteImage(path: string): Promise<void> {
    const db = getSupabase();
    if (!db) throw new Error('Supabase não configurado');

    const { error } = await db.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw new Error(`Erro ao deletar: ${error.message}`);
  }

  async listImages(userId: string, projectId: string): Promise<string[]> {
    const db = getSupabase();
    if (!db) return [];

    const prefix = `${userId}/${projectId}/`;
    const { data, error } = await db.storage
      .from(BUCKET_NAME)
      .list(prefix);

    if (error) return [];

    return (data || []).map(f => f.name);
  }
}

export const storageService = new SupabaseStorage();
