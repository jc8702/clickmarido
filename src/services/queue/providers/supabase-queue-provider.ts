import { IQueueBackend, QueueJob, JobType, JobStatus } from '../types';
import { getSupabase } from '@/services/supabase/supabase-client';

export class SupabaseQueueProvider implements IQueueBackend {
  name = 'supabase';

  private pollingIntervals: Map<string, ReturnType<typeof setInterval>> = new Map();
  private handlers: Map<JobType, (job: QueueJob) => Promise<void>> = new Map();

  async add<T>(type: JobType, data: T, options?: {
    userId?: string;
    projectId?: string;
    priority?: number;
    provider?: string;
  }): Promise<string> {
    const db = getSupabase();
    if (!db) throw new Error('Supabase não configurado');

    const { data: job, error } = await db
      .from('jobs')
      .insert({
        type,
        status: 'queued',
        priority: options?.priority || 0,
        provider: options?.provider || null,
        input: JSON.stringify(data),
        user_id: options?.userId || null,
        project_id: options?.projectId || null,
        retry_count: 0,
        max_retries: 3,
      })
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar job: ${error.message}`);
    return job.id;
  }

  async getStatus(jobId: string): Promise<QueueJob | null> {
    const db = getSupabase();
    if (!db) return null;

    const { data, error } = await db
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !data) return null;
    return this.rowToJob(data);
  }

  async updateProgress(jobId: string, progress: number): Promise<void> {
    // Progresso não é nativamente suportado na tabela jobs
  }

  async complete(jobId: string, result: Record<string, unknown>): Promise<void> {
    const db = getSupabase();
    if (!db) return;

    await db
      .from('jobs')
      .update({
        status: 'completed',
        output: JSON.stringify(result),
        completed_at: new Date().toISOString(),
      })
      .eq('id', jobId);
  }

  async fail(jobId: string, error: string): Promise<void> {
    const db = getSupabase();
    if (!db) return;

    // Incrementa retry_count antes de falhar
    const current = await this.getStatus(jobId);
    const retryCount = (current?.retryCount || 0) + 1;
    const maxRetries = current?.maxRetries || 3;

    if (retryCount >= maxRetries) {
      await db
        .from('jobs')
        .update({
          status: 'failed',
          error_message: error,
          retry_count: retryCount,
          completed_at: new Date().toISOString(),
        })
        .eq('id', jobId);
    } else {
      await db
        .from('jobs')
        .update({
          status: 'queued',
          error_message: error,
          retry_count: retryCount,
        })
        .eq('id', jobId);
    }
  }

  async getNextJob(type?: JobType): Promise<QueueJob | null> {
    const db = getSupabase();
    if (!db) return null;

    let query = db
      .from('jobs')
      .select('*')
      .eq('status', 'queued')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1);

    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) return null;

    // Marca como processing
    await db
      .from('jobs')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
      })
      .eq('id', data[0].id);

    return this.rowToJob(data[0]);
  }

  async listen(type: JobType, handler: (job: QueueJob) => Promise<void>): Promise<void> {
    this.handlers.set(type, handler);

    const interval = setInterval(async () => {
      const job = await this.getNextJob(type);
      if (job) {
        try {
          await handler(job);
          await this.complete(job.id, job.result || {});
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          await this.fail(job.id, message);
        }
      }
    }, 2000); // Poll a cada 2s

    this.pollingIntervals.set(type, interval);
  }

  stopListening(type?: JobType): void {
    if (type) {
      const interval = this.pollingIntervals.get(type);
      if (interval) clearInterval(interval);
    } else {
      for (const [, interval] of this.pollingIntervals) {
        clearInterval(interval);
      }
    }
  }

  private rowToJob(row: Record<string, unknown>): QueueJob {
    return {
      id: row.id as string,
      type: row.type as JobType,
      data: typeof row.input === 'string' ? JSON.parse(row.input as string) : (row.input || {}),
      userId: row.user_id as string | undefined,
      projectId: row.project_id as string | undefined,
      provider: row.provider as string | undefined,
      priority: row.priority as number | undefined,
      status: row.status as JobStatus,
      progress: 0,
      result: row.output ? (typeof row.output === 'string' ? JSON.parse(row.output as string) : row.output) : undefined,
      error: row.error_message as string | undefined,
      retryCount: (row.retry_count as number) || 0,
      maxRetries: (row.max_retries as number) || 3,
      createdAt: row.created_at as string || new Date().toISOString(),
      startedAt: row.started_at as string | undefined,
      completedAt: row.completed_at as string | undefined,
    };
  }
}
