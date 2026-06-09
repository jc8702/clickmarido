import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project } from '@/types';

function getConfig() {
  if (typeof window === 'undefined') {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    };
  }
  try {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || localStorage.getItem('clickmarido_supabase_url') || '',
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || localStorage.getItem('clickmarido_supabase_anon_key') || '',
    };
  } catch {
    return { url: '', key: '' };
  }
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  const { url, key } = getConfig();
  if (url && key) {
    client = createClient(url, key);
  }
  return client;
}

export const supabaseService = {
  async saveProject(project: Project) {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { data, error } = await db
      .from('projects')
      .upsert({
        id: project.id,
        name: project.name,
        created_at: project.createdAt,
        status: project.status,
        briefing: JSON.stringify(project.briefing),
        script: project.script ? JSON.stringify(project.script) : null,
        storyboard: project.storyboard ? JSON.stringify(project.storyboard) : null,
        prompts: project.prompts ? JSON.stringify(project.prompts) : null,
        caption: project.caption ? JSON.stringify(project.caption) : null,
        images: project.images ? JSON.stringify(project.images) : '[]',
        video: project.video ? JSON.stringify(project.video) : null,
      }, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return { success: false, error };
    }
    return { success: true, data };
  },

  async getProjects(): Promise<{ success: boolean; error?: unknown; data: Project[] }> {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado', data: [] };

    const { data, error } = await db
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar do Supabase:', error);
      return { success: false, error, data: [] };
    }

    const projects: Project[] = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      name: row.name as string,
      createdAt: row.created_at as string,
      status: row.status as Project['status'],
      briefing: typeof row.briefing === 'string' ? JSON.parse(row.briefing as string) : row.briefing,
      script: row.script ? (typeof row.script === 'string' ? JSON.parse(row.script as string) : row.script) : undefined,
      storyboard: row.storyboard ? (typeof row.storyboard === 'string' ? JSON.parse(row.storyboard as string) : row.storyboard) : undefined,
      prompts: row.prompts ? (typeof row.prompts === 'string' ? JSON.parse(row.prompts as string) : row.prompts) : undefined,
      caption: row.caption ? (typeof row.caption === 'string' ? JSON.parse(row.caption as string) : row.caption) : undefined,
      images: row.images ? (typeof row.images === 'string' ? JSON.parse(row.images as string) : row.images) : [],
      video: row.video ? (typeof row.video === 'string' ? JSON.parse(row.video as string) : row.video) : undefined,
    }));

    return { success: true, data: projects };
  },

  async deleteProject(id: string) {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { error } = await db
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar no Supabase:', error);
      return { success: false, error };
    }
    return { success: true };
  }
};
