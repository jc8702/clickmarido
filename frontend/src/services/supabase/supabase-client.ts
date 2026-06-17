// ============================================================
// supabase-client.ts — Click Marido CRM
// Cliente Supabase para persistência de dados do CRM.
// Video Studio removido completamente.
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Client, ServiceRequest, Quote } from '@/types';

function getConfig() {
  if (typeof window === 'undefined') {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    };
  }
  try {
    return {
      url:
        process.env.NEXT_PUBLIC_SUPABASE_URL ||
        localStorage.getItem('clickmarido_supabase_url') ||
        '',
      key:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        localStorage.getItem('clickmarido_supabase_anon_key') ||
        '',
    };
  } catch {
    return { url: '', key: '' };
  }
}

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const { url, key } = getConfig();
  if (url && key) {
    _client = createClient(url, key);
  }
  return _client;
}

// ---------- CLIENTES ----------

export const clientService = {
  async list(): Promise<{ success: boolean; data: Client[]; error?: unknown }> {
    const db = getSupabase();
    if (!db) return { success: false, data: [], error: 'Supabase não configurado' };

    const { data, error } = await db
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Erro ao listar clientes:', error);
      return { success: false, data: [], error };
    }

    return {
      success: true,
      data: (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        name: row.name as string,
        phone: row.phone as string,
        email: row.email as string | undefined,
        address: row.address as string | undefined,
        status: row.status as Client['status'],
        notes: row.notes as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })),
    };
  },

  async upsert(client: Client): Promise<{ success: boolean; error?: unknown }> {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { error } = await db.from('clients').upsert(
      {
        id: client.id,
        name: client.name,
        phone: client.phone,
        email: client.email || null,
        address: client.address || null,
        status: client.status,
        notes: client.notes || null,
        created_at: client.createdAt,
        updated_at: client.updatedAt,
      },
      { onConflict: 'id' },
    );

    if (error) {
      console.error('[Supabase] Erro ao salvar cliente:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async delete(id: string): Promise<{ success: boolean; error?: unknown }> {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { error } = await db.from('clients').delete().eq('id', id);

    if (error) {
      console.error('[Supabase] Erro ao deletar cliente:', error);
      return { success: false, error };
    }
    return { success: true };
  },
};

// ---------- SERVIÇOS ----------

export const serviceRequestService = {
  async list(): Promise<{ success: boolean; data: ServiceRequest[]; error?: unknown }> {
    const db = getSupabase();
    if (!db) return { success: false, data: [], error: 'Supabase não configurado' };

    const { data, error } = await db
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Erro ao listar serviços:', error);
      return { success: false, data: [], error };
    }

    return {
      success: true,
      data: (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        clientId: row.client_id as string,
        description: row.description as string,
        status: row.status as ServiceRequest['status'],
        scheduledAt: row.scheduled_at as string | undefined,
        completedAt: row.completed_at as string | undefined,
        valueEstimate: row.value_estimate as number | undefined,
        valueFinal: row.value_final as number | undefined,
        notes: row.notes as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })),
    };
  },

  async upsert(service: ServiceRequest): Promise<{ success: boolean; error?: unknown }> {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { error } = await db.from('service_requests').upsert(
      {
        id: service.id,
        client_id: service.clientId,
        description: service.description,
        status: service.status,
        scheduled_at: service.scheduledAt || null,
        completed_at: service.completedAt || null,
        value_estimate: service.valueEstimate || null,
        value_final: service.valueFinal || null,
        notes: service.notes || null,
        created_at: service.createdAt,
        updated_at: service.updatedAt,
      },
      { onConflict: 'id' },
    );

    if (error) {
      console.error('[Supabase] Erro ao salvar serviço:', error);
      return { success: false, error };
    }
    return { success: true };
  },

  async delete(id: string): Promise<{ success: boolean; error?: unknown }> {
    const db = getSupabase();
    if (!db) return { success: false, error: 'Supabase não configurado' };

    const { error } = await db.from('service_requests').delete().eq('id', id);

    if (error) {
      console.error('[Supabase] Erro ao deletar serviço:', error);
      return { success: false, error };
    }
    return { success: true };
  },
};

// ---------- ORÇAMENTOS ----------

export const quoteService = {
  async list(): Promise<{ success: boolean; data: Quote[]; error?: unknown }> {
    const db = getSupabase();
    if (!db) return { success: false, data: [], error: 'Supabase não configurado' };

    const { data, error } = await db
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase] Erro ao listar orçamentos:', error);
      return { success: false, data: [], error };
    }

    return {
      success: true,
      data: (data || []).map((row: Record<string, unknown>) => ({
        id: row.id as string,
        clientId: row.client_id as string,
        serviceRequestId: row.service_request_id as string | undefined,
        items: typeof row.items === 'string' ? JSON.parse(row.items as string) : row.items,
        totalValue: row.total_value as number,
        status: row.status as Quote['status'],
        validUntil: row.valid_until as string | undefined,
        notes: row.notes as string | undefined,
        createdAt: row.created_at as string,
        updatedAt: row.updated_at as string,
      })),
    };
  },
};
