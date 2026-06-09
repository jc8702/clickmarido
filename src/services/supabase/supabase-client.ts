import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cria o cliente Supabase de forma segura, garantindo que não dispare erro de inicialização se as chaves estiverem vazias no MVP
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn(
    'Supabase URL ou Anon Key ausente. A aplicação está rodando em modo offline utilizando persistência local no localStorage.'
  );
}

// Helpers rápidos para persistência opcional futura
export const supabaseService = {
  async saveProject(project: Record<string, unknown>) {
    if (!supabase) return { success: false, error: 'Supabase offline' };
    
    const { data, error } = await supabase
      .from('projects')
      .upsert(project)
      .select();

    if (error) {
      console.error('Erro ao salvar no Supabase:', error);
      return { success: false, error };
    }
    return { success: true, data };
  },

  async getProjects() {
    if (!supabase) return { success: false, error: 'Supabase offline', data: [] };

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar do Supabase:', error);
      return { success: false, error, data: [] };
    }
    return { success: true, data };
  }
};
