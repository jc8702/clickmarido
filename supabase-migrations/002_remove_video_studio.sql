-- ============================================================
-- MIGRATION 002: Remover Video Studio e Adicionar Tabelas do CRM
-- Execute no SQL Editor do Supabase
-- ============================================================

-- DROP TABLES DO VIDEO STUDIO (ordem reversa de dependência)
DROP TABLE IF EXISTS public.usage_log;
DROP TABLE IF EXISTS public.voice_presets;
DROP TABLE IF EXISTS public.jobs;
DROP TABLE IF EXISTS public.project_images;

-- Remover colunas de vídeo da tabela projects
ALTER TABLE IF EXISTS public.projects 
  DROP COLUMN IF EXISTS timeline,
  DROP COLUMN IF EXISTS captions,
  DROP COLUMN IF EXISTS captions_srt,
  DROP COLUMN IF EXISTS captions_vtt,
  DROP COLUMN IF EXISTS render_config,
  DROP COLUMN IF EXISTS narration,
  DROP COLUMN IF EXISTS total_cost_cents,
  DROP COLUMN IF EXISTS briefing,
  DROP COLUMN IF EXISTS script,
  DROP COLUMN IF EXISTS storyboard,
  DROP COLUMN IF EXISTS prompts,
  DROP COLUMN IF EXISTS caption,
  DROP COLUMN IF EXISTS images,
  DROP COLUMN IF EXISTS video;

-- Remover tipos customizados do Video Studio
DROP TYPE IF EXISTS job_type CASCADE;
DROP TYPE IF EXISTS job_status CASCADE;

-- Criar Tabelas do CRM se não existirem
CREATE TABLE IF NOT EXISTS public.clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.service_requests (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  value_estimate DECIMAL(10,2),
  value_final DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES public.clients(id) ON DELETE CASCADE,
  service_request_id TEXT REFERENCES public.service_requests(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_value DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'approved', 'rejected', 'expired')),
  valid_until TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers de updated_at para as tabelas do CRM
DROP TRIGGER IF EXISTS clients_updated_at ON public.clients;
CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS service_requests_updated_at ON public.service_requests;
CREATE TRIGGER service_requests_updated_at
  BEFORE UPDATE ON public.service_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS quotes_updated_at ON public.quotes;
CREATE TRIGGER quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Índices adicionais para performance do CRM
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_client ON public.service_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);
CREATE INDEX IF NOT EXISTS idx_quotes_client ON public.quotes(client_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
