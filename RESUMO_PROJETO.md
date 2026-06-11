# RESUMO DE PROJETO: Click Marido CRM

## Informações Gerais
- **Status Atual:** ✅ CRM funcional — Video Studio removido completamente
- **Objetivo Central:** Sistema CRM para gerenciamento de clientes, serviços e orçamentos da Click Marido Reparos Residenciais
- **Última Atualização:** 2026-06-11 15:10

---

## Histórico de Alterações

- **[11/06/2026 - 15:10]:** Remoção completa do Video Studio (gerador de vídeos com IA)
  - Arquivos removidos (65+ arquivos):
    - `src/services/ai/` — AIService, ImageAnalyzer, PromptGenerator
    - `src/services/captions/` — caption-generator, types
    - `src/services/tts/` — tts-service, providers (ElevenLabs, Google, Mock)
    - `src/services/lipsync/` — lipsync-service, providers (Hedra, wav2lip, mock)
    - `src/services/motion/` — motion-engine, providers (VEO, mock)
    - `src/services/queue/` — job-manager, providers (BullMQ, Supabase queue)
    - `src/services/storage/` — supabase-storage
    - `src/services/video/` — ffmpeg-generator, renderer, video-compositor, video-generator
    - `src/modules/video-generator/store.ts` — store do video studio
    - `src/modules/timeline/store.ts` — store da timeline
    - `src/components/timeline/` — 6 componentes de timeline
    - `src/components/voice-selector/` — voice-picker
    - `src/components/avatar-preview.tsx`
    - `src/app/api/` — todas as 19 rotas de API (generate, captions, lipsync, motion, tts, render, upload, webhooks, workers)
    - `src/app/projects/` — páginas [id] e new
    - `src/app/templates/` — página de templates
    - `src/workers/index.ts` — workers BullMQ
  - Arquivos reescritos:
    - `src/types/index.ts` → apenas tipos CRM (Client, ServiceRequest, Quote, DashboardStats)
    - `src/services/supabase/supabase-client.ts` → clientService, serviceRequestService, quoteService
    - `src/components/layouts/store-initializer.tsx` → wrapper vazio sem referências ao video store
    - `src/components/layouts/sidebar.tsx` → navegação CRM (Clientes, Serviços, Orçamentos)
    - `src/app/dashboard/page.tsx` → KPIs CRM (clientes, serviços, receita)
    - `src/app/settings/page.tsx` → apenas Gemini + Supabase (sem ElevenLabs/VEO)
    - `src/app/layout.tsx` → metadados CRM
    - `src/instrumentation.ts` → vazio (sem workers)
    - `.env.local` → apenas GEMINI_API_KEY + SUPABASE
    - `.env.example` → limpo
    - `package.json` → removido `bullmq` e `ioredis`
  - Arquivos criados:
    - `src/modules/crm/store.ts` → Zustand store CRM (clientes, serviços, orçamentos, stats)
    - `src/app/clientes/page.tsx` → listagem de clientes com busca
    - `src/app/servicos/page.tsx` → listagem de serviços com filtros e ações rápidas
    - `src/app/orcamentos/page.tsx` → listagem de orçamentos
  - Branch de backup criada: `backup/video-studio-20260611`
  - **Build:** ✅ `npm run build` passou com 0 erros

---

## Estrutura Atual (pós-remoção)

```
src/
  app/
    page.tsx                 ← redirect /dashboard
    layout.tsx               ← metadados CRM
    dashboard/page.tsx       ← KPIs CRM
    clientes/page.tsx        ← listagem de clientes
    servicos/page.tsx        ← listagem de serviços
    orcamentos/page.tsx      ← listagem de orçamentos
    settings/page.tsx        ← configurações Gemini + Supabase
  components/
    layouts/
      sidebar.tsx            ← navegação CRM
      store-initializer.tsx  ← wrapper vazio
    ui/
      badge.tsx, button.tsx, card.tsx, tabs.tsx
  modules/
    crm/
      store.ts               ← Zustand CRM store
  services/
    supabase/
      supabase-client.ts     ← clientService, serviceRequestService, quoteService
  types/
    index.ts                 ← Client, ServiceRequest, Quote, DashboardStats
  instrumentation.ts         ← vazio
```

## Rotas disponíveis
- `/` → redirect `/dashboard`
- `/dashboard` — Painel CRM
- `/clientes` — Listagem de clientes
- `/servicos` — Listagem de serviços (com ações de status)
- `/orcamentos` — Listagem de orçamentos
- `/settings` — Configurações

## TODOs / Próximos Passos
- [ ] Criar formulário de novo cliente (`/clientes/novo`)
- [ ] Criar formulário de novo serviço (`/servicos/novo`)
- [ ] Criar formulário de novo orçamento (`/orcamentos/novo`)
- [ ] Integrar Supabase real para persistência (substituir mock data)
- [ ] Criar migration SQL para tabelas `clients`, `service_requests`, `quotes`
- [ ] Adicionar autenticação (Supabase Auth)
- [ ] Adicionar página de cliente individual (`/clientes/[id]`)
