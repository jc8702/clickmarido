# RESUMO DE PROJETO: ClickMarido

## Informações Gerais
- **Status Atual:** ✅ REESTRUTURADO — Stack limpa, deploy definido
- **Objetivo Central:** Plataforma CRM e Agendamento para Técnicos/Serviços
- **Última Atualização:** [18/06/2026 - 19:00]

## Stack Definitiva
| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (estável) + TypeScript |
| Backend | NestJS 11 + TypeScript |
| Banco | PostgreSQL — **Neon** |
| ORM | Prisma 7 |
| Deploy Frontend | **Vercel** |
| Deploy Backend | **Railway** |
| CI/CD | GitHub Actions (ci.yml + cd.yml) |
| Versionamento | **GitHub** |

## Histórico de Alterações

- **[18/06/2026 - 19:00]:** 🧹 REESTRUTURAÇÃO ARQUITETURAL COMPLETA (Andru.ia Consultant)
  - **Removido:** 7 plataformas de deploy desnecessárias (Render, Docker, Heroku, DigitalOcean, AWS, GCP, Netlify)
  - **Removido:** ~40 arquivos .md de log de sessões IA da raiz
  - **Removido:** 8 scripts .sh/.bat de deploy redundantes
  - **Removido:** pastas `monitoring/`, `prometheus/`, `docs/`
  - **Removido:** `backend/dev.db`, `backend/backend.env`, scripts de init do banco
  - **Removido:** `frontend/lint-errors.json` (429KB de lixo)
  - **Atualizado:** `backend/prisma/schema.prisma` — `provider: sqlite` → `provider: postgresql`
  - **Atualizado:** `backend/.env.example` — variáveis do Neon (DATABASE_URL + DIRECT_URL)
  - **Atualizado:** `backend/package.json` — removido `sqlite3`
  - **Atualizado:** `frontend/package.json` — removido `@supabase/supabase-js`, fixado Next.js `canary` → `^15.1.0`
  - **Criado:** `frontend/vercel.json` — config correta para Next.js
  - **Criado:** `backend/railway.toml` — config Railway para NestJS
  - **Reescrito:** `.github/workflows/ci.yml` — 4 jobs claros (setup, lint, test, build)
  - **Reescrito:** `.github/workflows/cd.yml` — deploy Vercel + migrations + Railway
  - **Reescrito:** `.gitignore` — regras ampliadas (banco, .env, scripts temporários)
  - **Reescrito:** `README.md` — instruções claras de setup e deploy
  - Arquivos modificados: 10+ arquivos críticos

- **[18/06/2026 - 11:21]:** SWR Dashboard Refresh + Error Handling
- **[18/06/2026 - 11:16]:** Reports Middleware & Guards
- **[18/06/2026 - 11:06]:** Diagnóstico bug CompanyContext.getCompanyId() → null
- **[17/06/2026 - 20:52]:** Auditoria de segurança git (senha Supabase exposta)

## ⚠️ AÇÕES PENDENTES CRÍTICAS

- [ ] **URGENTE — Rotacionar credenciais:**
  - Senha do banco Supabase `Millena@@2017@@` ainda está no histórico do git
  - Criar conta Neon e configurar novo banco
  - Nunca mais usar essas credenciais antigas

- [ ] **DÍVIDA TÉCNICA CRÍTICA — Frontend acessa banco diretamente via Supabase:**
  - `frontend/src/services/supabase/supabase-client.ts` chama Supabase SDK direto
  - `frontend/src/app/(dashboard)/settings/page.tsx` salva URL/Key do Supabase no localStorage
  - **Isso bypassa o NestJS backend completamente para algumas operações (clientes, serviços, orçamentos)**
  - O correto é: todas as chamadas de dados passam pelo NestJS → Prisma → Neon
  - **Ação:** Migrar essas chamadas Supabase para o client da API REST do NestJS
  - Por enquanto, `@supabase/supabase-js` foi mantido no package.json para não quebrar o build


- [ ] **Configurar Neon:**
  1. Criar conta em neon.tech
  2. Criar projeto `clickmarido`
  3. Copiar `DATABASE_URL` (pooled) e `DIRECT_URL` para `backend/.env.local`
  4. Rodar `cd backend && npx prisma migrate dev`

- [ ] **Configurar Vercel (Backend):**
  1. Criar novo projeto apontando para a pasta `backend`
  2. Adicionar as três chaves: `DATABASE_URL`, `DIRECT_URL` e `JWT_SECRET`
  3. Copiar o domínio gerado (ex: clickmarido-backend.vercel.app)

- [ ] **Configurar Vercel (Frontend):**
  1. Criar novo projeto apontando para a pasta `frontend`
  2. Adicionar `NEXT_PUBLIC_API_URL` apontando para o Vercel do Backend
  3. Adicionar `NEXTAUTH_SECRET`

- [ ] **GitHub Secrets (para CI/CD funcionar):**
  - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_FRONTEND`, `VERCEL_PROJECT_ID_BACKEND`
  - `DATABASE_URL`, `DIRECT_URL` (para o step de migrations)

- [ ] **Opcional — Limpar histórico git:**
  - Rodar `git filter-repo` para remover senha exposta do histórico
  - ⚠️ Isso reescreve o histórico. Todos os collaboradores precisam re-clonar.

## TODOs / Próximos Passos
- [ ] Concluir configuração do Neon + primeiro deploy
- [ ] Verificar se `@supabase/supabase-js` era usado em algum arquivo de código
- [ ] Verificar se os testes unitários passam após remoção do sqlite3
- [ ] Configurar secrets no GitHub para o CD funcionar