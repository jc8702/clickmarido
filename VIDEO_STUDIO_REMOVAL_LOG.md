# Remoção de Video Studio — Log de Execução

**Data:** 2026-06-11 15:10 (BRT)
**Branch de Backup:** `backup/video-studio-20260611`
**Branch Principal:** `main`

---

## Itens Removidos:

### Diretórios
- [x] `src/services/video/` — ffmpeg-generator, renderer, video-compositor, video-generator
- [x] `src/services/captions/` — caption-generator, types
- [x] `src/services/tts/` — tts-service, providers (ElevenLabs, Google, Mock)
- [x] `src/services/lipsync/` — lipsync-service, providers (Hedra, wav2lip, mock)
- [x] `src/services/motion/` — motion-engine, providers (VEO, mock)
- [x] `src/services/ai/` — ai-service, image-analyzer, prompt-generator
- [x] `src/services/queue/` — job-manager, providers (BullMQ, Supabase queue)
- [x] `src/services/storage/` — supabase-storage
- [x] `src/modules/video-generator/` — store.ts
- [x] `src/modules/timeline/` — store.ts
- [x] `src/components/avatar-preview.tsx`
- [x] `src/components/timeline/` — controls, playhead, ruler, timeline-container, track-item, track
- [x] `src/components/voice-selector/` — voice-picker
- [x] `src/app/projects/` — [id]/page.tsx, new/page.tsx
- [x] `src/app/templates/` — page.tsx
- [x] `src/workers/` — index.ts (BullMQ workers: image_analysis, motion_generation, tts_generation, lipsync, caption_generation)

### APIs Removidas
- [x] `/api/generate/` — geração de roteiro, storyboard, prompts com Gemini
- [x] `/api/captions/` — geração de legendas
- [x] `/api/lipsync/` — sincronização labial
- [x] `/api/lipsync/status/[jobId]/` — polling de status lipsync
- [x] `/api/motion/analyze/` — análise de imagem
- [x] `/api/motion/animate/` — geração de vídeo (VEO/Kling)
- [x] `/api/motion/status/[jobId]/` — polling de status motion
- [x] `/api/tts/generate/` — geração de voz (ElevenLabs)
- [x] `/api/tts/voices/` — listagem de vozes
- [x] `/api/render/` — renderização final
- [x] `/api/render/status/[jobId]/` — polling de status render
- [x] `/api/upload/` — upload de imagens para Supabase Storage
- [x] `/api/projects/` — CRUD de projetos de vídeo
- [x] `/api/projects/[id]/` — operações por projeto
- [x] `/api/projects/[id]/generate-ia-video/` — disparo de geração de vídeo com IA
- [x] `/api/webhooks/elevenlabs/` — webhook ElevenLabs TTS
- [x] `/api/webhooks/hedra/` — webhook Hedra lip sync
- [x] `/api/webhooks/kling/` — webhook Kling motion
- [x] `/api/workers/start/` — inicialização dos workers

### Configurações Alteradas
- [x] `package.json` — removidas dependências: `bullmq`, `ioredis`
- [x] `tsconfig.json` — sem alterações necessárias (sem paths específicos de vídeo)
- [x] `.env.local` — removidas: `VEO_API_KEY`, `ELEVENLABS_API_KEY`, `NEXT_PUBLIC_MOTION_PROVIDER`, `NEXT_PUBLIC_LIPSYNC_PROVIDER`, `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`
- [x] `.env.example` — atualizado para refletir apenas variáveis do CRM
- [x] `src/instrumentation.ts` — removida inicialização dos workers BullMQ
- [x] `src/types/index.ts` — reescrito com apenas tipos CRM (sem tipos de vídeo)
- [x] `src/services/supabase/supabase-client.ts` — reescrito para CRM (sem Project, VoicePreset, Jobs de vídeo)

---

## Itens Criados (CRM)

| Arquivo | Descrição |
|---|---|
| `src/modules/crm/store.ts` | Zustand store CRM com clientes, serviços, orçamentos |
| `src/app/clientes/page.tsx` | Listagem de clientes com busca |
| `src/app/servicos/page.tsx` | Listagem de serviços com filtros e ações |
| `src/app/orcamentos/page.tsx` | Listagem de orçamentos |

## Itens Reescritos (mantidos, mas limpos)

| Arquivo | O que mudou |
|---|---|
| `src/types/index.ts` | Apenas tipos CRM: Client, ServiceRequest, Quote, DashboardStats |
| `src/services/supabase/supabase-client.ts` | clientService, serviceRequestService, quoteService |
| `src/components/layouts/store-initializer.tsx` | Removida referência ao video-generator store |
| `src/components/layouts/sidebar.tsx` | Navegação CRM: Clientes, Serviços, Orçamentos |
| `src/app/dashboard/page.tsx` | KPIs CRM: total clientes, serviços pendentes, receita mensal |
| `src/app/settings/page.tsx` | Apenas Gemini + Supabase (removidos ElevenLabs, VEO, OpenRouter) |
| `src/app/layout.tsx` | Metadados: "Click Marido CRM | Gestão de Clientes e Serviços" |
| `src/instrumentation.ts` | Vazio (sem workers) |
| `.env.local` | Apenas GEMINI_API_KEY + SUPABASE |
| `.env.example` | Apenas GEMINI_API_KEY + SUPABASE |
| `package.json` | Removido bullmq e ioredis |

---

## Status Final

| Verificação | Status |
|---|---|
| `npm run build` | ✅ Passou — 0 erros, 0 warnings TypeScript |
| Referências órfãs a `@/workers` | ✅ Nenhuma |
| Referências órfãs a `AIService` | ✅ Nenhuma |
| Referências órfãs a `useVideoStudioStore` | ✅ Nenhuma |
| Referências órfãs a `bullmq`/`ioredis` | ✅ Nenhuma |
| Branch de backup `backup/video-studio-20260611` | ✅ Criado e publicado no GitHub |
| Rotas disponíveis no build | ✅ `/`, `/dashboard`, `/clientes`, `/servicos`, `/orcamentos`, `/settings` |

### Build output
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /clientes
├ ○ /dashboard
├ ○ /orcamentos
├ ○ /servicos
└ ○ /settings

○  (Static)  prerendered as static content
```
