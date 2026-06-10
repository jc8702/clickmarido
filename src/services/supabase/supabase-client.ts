import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Project, ImageAnalysis, ProjectStatus, VoicePreset } from '@/types';

function getConfig() {
  if (typeof window === 'undefined') {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
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

function parseProjectRow(row: Record<string, unknown>): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    createdAt: row.created_at as string,
    status: row.status as ProjectStatus,
    briefing: typeof row.briefing === 'string' ? JSON.parse(row.briefing as string) : row.briefing,
    script: row.script ? (typeof row.script === 'string' ? JSON.parse(row.script as string) : row.script) : undefined,
    storyboard: row.storyboard ? (typeof row.storyboard === 'string' ? JSON.parse(row.storyboard as string) : row.storyboard) : undefined,
    prompts: row.prompts ? (typeof row.prompts === 'string' ? JSON.parse(row.prompts as string) : row.prompts) : undefined,
    caption: row.caption ? (typeof row.caption === 'string' ? JSON.parse(row.caption as string) : row.caption) : undefined,
    images: row.images ? (typeof row.images === 'string' ? JSON.parse(row.images as string) : row.images) : [],
    video: row.video ? (typeof row.video === 'string' ? JSON.parse(row.video as string) : row.video) : undefined,
    timeline: row.timeline ? (typeof row.timeline === 'string' ? JSON.parse(row.timeline as string) : row.timeline) : undefined,
    renderConfig: row.render_config ? (typeof row.render_config === 'string' ? JSON.parse(row.render_config as string) : row.render_config) : undefined,
    narration: row.narration ? (typeof row.narration === 'string' ? JSON.parse(row.narration as string) : row.narration) : undefined,
    totalCostCents: row.total_cost_cents as number | undefined,
    userId: row.user_id as string | undefined,
  };
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
        briefing: typeof project.briefing === 'string' ? project.briefing : JSON.stringify(project.briefing),
        script: project.script ? JSON.stringify(project.script) : null,
        storyboard: project.storyboard ? JSON.stringify(project.storyboard) : null,
        prompts: project.prompts ? JSON.stringify(project.prompts) : null,
        caption: project.caption ? JSON.stringify(project.caption) : null,
        images: project.images ? JSON.stringify(project.images) : '[]',
        video: project.video ? JSON.stringify(project.video) : null,
        timeline: project.timeline ? JSON.stringify(project.timeline) : null,
        render_config: project.renderConfig ? JSON.stringify(project.renderConfig) : null,
        narration: project.narration ? JSON.stringify(project.narration) : null,
        total_cost_cents: project.totalCostCents || 0,
        user_id: project.userId || null,
      }, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return { success: false, error };
    }
    return { success: true, data };
  },

  async getProjects(userId?: string): Promise<{ success: boolean; error?: unknown; data: Project[] }> {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado', data: [] };

    let query = db.from('projects').select('*').order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar do Supabase:', error);
      return { success: false, error, data: [] };
    }

    const projects: Project[] = (data || []).map((row: Record<string, unknown>) => parseProjectRow(row));

    return { success: true, data: projects };
  },

  async getProject(id: string): Promise<{ success: boolean; error?: unknown; data: Project | null }> {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado', data: null };

    const { data, error } = await db
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar projeto:', error);
      return { success: false, error, data: null };
    }

    return { success: true, data: parseProjectRow(data as Record<string, unknown>) };
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
  },

  // ============ PROJECT IMAGES ============

  async saveProjectImage(data: {
    projectId: string;
    userId?: string;
    originalUrl: string;
    storagePath: string;
    analysis?: ImageAnalysis;
    width?: number;
    height?: number;
    fileSizeBytes?: number;
    mimeType?: string;
    sceneIndex?: number;
    durationSeconds?: number;
  }) {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { data: result, error } = await db
      .from('project_images')
      .insert({
        project_id: data.projectId,
        user_id: data.userId || null,
        original_url: data.originalUrl,
        storage_path: data.storagePath,
        analysis: data.analysis ? JSON.stringify(data.analysis) : null,
        face_data: data.analysis?.faceData ? JSON.stringify(data.analysis.faceData) : null,
        width: data.width || null,
        height: data.height || null,
        file_size_bytes: data.fileSizeBytes || null,
        mime_type: data.mimeType || null,
        scene_index: data.sceneIndex || 0,
        duration_seconds: data.durationSeconds || 5.0,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar imagem:', error);
      return { success: false, error };
    }
    return { success: true, data: result };
  },

  async getProjectImages(projectId: string) {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado', data: [] };

    const { data, error } = await db
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('scene_index', { ascending: true });

    if (error) {
      console.error('Erro ao buscar imagens:', error);
      return { success: false, error, data: [] };
    }

    return { success: true, data: data || [] };
  },

  async deleteProjectImage(imageId: string) {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { error } = await db
      .from('project_images')
      .delete()
      .eq('id', imageId);

    if (error) {
      console.error('Erro ao deletar imagem:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  // ============ VOICE PRESETS ============

  async getVoicePresets(language?: string): Promise<{ success: boolean; data: VoicePreset[] }> {
    const db = getSupabase();
    if (!db) return { success: false, data: [] };

    let query = db.from('voice_presets').select('*').eq('is_active', true);

    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar vozes:', error);
      return { success: false, data: [] };
    }

    const presets: VoicePreset[] = (data || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      name: row.name as string,
      gender: row.gender as 'male' | 'female',
      style: row.style as VoicePreset['style'],
      language: row.language as VoicePreset['language'],
      provider: row.provider as string,
      providerVoiceId: row.provider_voice_id as string,
      previewUrl: row.preview_url as string | undefined,
    }));

    return { success: true, data: presets };
  },

  // ============ JOBS ============

  async createJob(data: {
    projectId: string;
    userId?: string;
    type: string;
    provider: string;
    input?: Record<string, unknown>;
    priority?: number;
  }) {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { data: result, error } = await db
      .from('jobs')
      .insert({
        project_id: data.projectId,
        user_id: data.userId || null,
        type: data.type,
        provider: data.provider,
        input: data.input ? JSON.stringify(data.input) : null,
        priority: data.priority || 0,
        status: 'queued',
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar job:', error);
      return { success: false, error };
    }
    return { success: true, data: result };
  },

  async updateJobStatus(jobId: string, status: string, output?: Record<string, unknown>, errorMessage?: string) {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const updateData: Record<string, unknown> = { status };

    if (output) updateData.output = JSON.stringify(output);
    if (errorMessage) updateData.error_message = errorMessage;
    if (status === 'processing') updateData.started_at = new Date().toISOString();
    if (status === 'completed' || status === 'failed') updateData.completed_at = new Date().toISOString();

    const { error } = await db
      .from('jobs')
      .update(updateData)
      .eq('id', jobId);

    if (error) {
      console.error('Erro ao atualizar job:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  // ============ USAGE LOG ============

  async logUsage(data: {
    userId: string;
    projectId?: string;
    jobId?: string;
    provider: string;
    operation: string;
    costCents: number;
    tokensUsed?: number;
    durationMs?: number;
  }) {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { error } = await db
      .from('usage_log')
      .insert({
        user_id: data.userId,
        project_id: data.projectId || null,
        job_id: data.jobId || null,
        provider: data.provider,
        operation: data.operation,
        cost_cents: data.costCents,
        tokens_used: data.tokensUsed || null,
        duration_ms: data.durationMs || null,
      });

    if (error) {
      console.error('Erro ao registrar uso:', error);
      return { success: false, error };
    }
    return { success: true };
  },
};
