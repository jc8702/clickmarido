# RESUMO DE PROJETO: Click Marido CRM

## Informações Gerais
- **Status Atual:** ✅ CRM funcional — Deploy efetuado na Vercel e sincronizado com GitHub
- **Objetivo Central:** Sistema CRM para gerenciamento de clientes, serviços e orçamentos da Click Marido Reparos Residenciais
- **Última Atualização:** 2026-06-11 17:03

---

## Histórico de Alterações

- **[11/06/2026 - 17:03]:** FASE 7 - Push para GitHub e Deploy
  - Sincronização final das alterações locais com o branch `main` no GitHub.
  - Validação dos status de deploy na Vercel via Vercel CLI (`vercel list`). O deploy mais recente (produção) está online com status **Ready**.
  - O projeto Click Marido CRM está 100% livre das dependências, códigos e banco do "Video Studio", pronto para uso.

- **[11/06/2026 - 17:02]:** FASE 6 - Verificação e Testes
  - Executada verificação de referências órfãs a serviços de vídeo e dependências desinstaladas (0 ocorrências encontradas no código ativo).
  - Gerado build de produção com sucesso (`npm run build`), com saída salva em `build-output.log`.
  - Executado servidor de desenvolvimento Next.js para testes de inicialização local (Ready em 340ms sem erros críticos).
  - Commits efetuados e enviados (push) para o branch `main`.

- **[11/06/2026 - 16:55]:** FASE 5 - Limpeza de Dependências e Variáveis de Ambiente
  - Arquivos modificados/criados:
    - `.gitignore` [MODIFY] — Adicionado `.env.local` explicitamente para garantir isolamento e segurança.
    - `.env.local` [MODIFY] — Sobrescrito com um template limpo contendo apenas as variáveis Supabase e DB.
    - Executado o `npm uninstall` e `npm prune` para garantir que nenhuma dependência do Video Studio permaneça em uso ou listada.
  - Commits efetuados e enviados (push) para o branch `main`.

- **[11/06/2026 - 16:53]:** FASE 4 - Limpeza do Banco de Dados e Configurações
  - Arquivos modificados/criados:
    - `supabase-migrations/002_remove_video_studio.sql` [NEW] — Migration para realizar drop das tabelas e colunas do Video Studio, e criar as tabelas de dados do CRM (`clients`, `service_requests`, `quotes`).
    - `supabase-schema.sql` [MODIFY] — Schema de referência simplificado, contendo apenas profiles e as tabelas CRM ativas.
  - Commits efetuados e enviados (push) para o branch `main`.

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
- [x] Criar migration SQL para tabelas `clients`, `service_requests`, `quotes` e remoção do Video Studio
- [ ] Criar formulário de novo cliente (`/clientes/novo`)
- [ ] Criar formulário de novo serviço (`/servicos/novo`)
- [ ] Criar formulário de novo orçamento (`/orcamentos/novo`)
- [ ] Integrar Supabase real para persistência (substituir mock data)
- [ ] Adicionar autenticação (Supabase Auth)
- [ ] Adicionar página de cliente individual (`/clientes/[id]`)
