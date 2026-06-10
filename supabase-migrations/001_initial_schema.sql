-- ============================================================
-- MIGRATION 001: Click Marido Motion Studio - Schema Completo
-- ============================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extensão do auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  credits_remaining INT DEFAULT 0,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'business', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROJECTS (evolução da tabela existente)
-- ============================================================
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '{"tracks": [], "duration": 0}'::jsonb;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS captions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS captions_srt TEXT;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS captions_vtt TEXT;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS render_config JSONB DEFAULT '{"resolution": "1080p", "codec": "h264", "format": "mp4"}'::jsonb;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS narration JSONB;
ALTER TABLE IF EXISTS projects ADD COLUMN IF NOT EXISTS total_cost_cents INT DEFAULT 0;

-- Se a tabela não existir ainda, cria do zero
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'draft',
  briefing JSONB,
  script JSONB,
  storyboard JSONB,
  prompts JSONB,
  caption JSONB,
  images JSONB DEFAULT '[]'::jsonb,
  video JSONB,
  timeline JSONB DEFAULT '{"tracks": [], "duration": 0}'::jsonb,
  captions JSONB DEFAULT '[]'::jsonb,
  captions_srt TEXT,
  captions_vtt TEXT,
  narration JSONB,
  render_config JSONB DEFAULT '{"resolution": "1080p", "codec": "h264", "format": "mp4"}'::jsonb,
  total_cost_cents INT DEFAULT 0
);

-- ============================================================
-- PROJECT IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  original_url TEXT NOT NULL,
  processed_url TEXT,
  thumbnail_url TEXT,
  storage_path TEXT NOT NULL,

  analysis JSONB,
  face_data JSONB,

  motion_config JSONB DEFAULT '{
    "camera": {"type": "push_in", "intensity": 0.08},
    "background_parallax": false,
    "element_movement": false,
    "light_variation": false
  }'::jsonb,

  width INT,
  height INT,
  file_size_bytes BIGINT,
  mime_type TEXT,
  scene_index INT DEFAULT 0,
  duration_seconds DECIMAL(5,2) DEFAULT 5.0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_images_project ON public.project_images(project_id);

-- ============================================================
-- JOBS (processamento assíncrono)
-- ============================================================
DO $$ BEGIN
  CREATE TYPE job_type AS ENUM (
    'image_analysis', 'motion_generation', 'tts_generation',
    'lipsync', 'caption_generation', 'video_render',
    'composite_final'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE job_status AS ENUM (
    'queued', 'processing', 'completed', 'failed', 'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  type TEXT NOT NULL,
  status TEXT DEFAULT 'queued',
  priority INT DEFAULT 0,

  provider TEXT,
  input JSONB,
  output JSONB,

  cost_cents INT DEFAULT 0,

  error_message TEXT,
  error_stack TEXT,

  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,

  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_project ON public.jobs(project_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON public.jobs(type);

-- ============================================================
-- VOICE PRESETS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.voice_presets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  style TEXT NOT NULL,
  language TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_voice_id TEXT NOT NULL,
  preview_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- USAGE LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES public.projects(id) ON DELETE SET NULL,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  operation TEXT NOT NULL,
  cost_cents INT NOT NULL DEFAULT 0,
  tokens_used INT,
  duration_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_usage_user ON public.usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_created ON public.usage_log(created_at DESC);

-- ============================================================
-- TRIGGER: updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON public.projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS jobs_updated_at ON public.jobs;
CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ÍNDICES ADICIONAIS
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
