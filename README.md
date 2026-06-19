# ClickMarido — Plataforma CRM para Técnicos

> Sistema de gestão de ordens de serviço, agendamento e financeiro para empresas de serviços técnicos residenciais.

---

## 🏗️ Stack

| Camada | Tecnologia |
|---|---|
| **Frontend** | Next.js 15 (App Router) + TypeScript |
| **Backend** | NestJS 11 + TypeScript |
| **Banco de Dados** | PostgreSQL via [Neon](https://neon.tech) |
| **ORM** | Prisma 7 |
| **Autenticação** | Next-Auth + JWT (NestJS) |
| **Deploy** | Vercel (Frontend + Backend Serverless) |
| **CI/CD** | GitHub Actions |
| **Versionamento** | GitHub |

---

## 🚀 Rodando Localmente

### Pré-requisitos
- Node.js 20+
- Uma conta no [Neon](https://neon.tech) (gratuito)

### 1. Clonar e instalar
```bash
git clone https://github.com/SEU_USUARIO/clickmarido.git
cd clickmarido
npm install   # instala root + workspaces
```

### 2. Configurar variáveis de ambiente

**Backend:**
```bash
cp backend/.env.example backend/.env.local
# Preencha DATABASE_URL e DIRECT_URL com as strings do Neon
```

**Frontend:**
```bash
cp frontend/.env.example frontend/.env.local
# Preencha NEXTAUTH_SECRET e NEXT_PUBLIC_API_URL
```

### 3. Rodar migrations e seed
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

### 4. Iniciar em desenvolvimento
```bash
# Na raiz do projeto:
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Swagger: http://localhost:3001/api/docs

---

## 🗄️ Banco de Dados (Neon)

1. Crie um projeto em [neon.tech](https://neon.tech)
2. Copie a **Connection String (Pooled)** → `DATABASE_URL`
3. Copie a **Connection String (Direct)** → `DIRECT_URL`
4. Cole em `backend/.env.local`

---

## 🌐 Deploy

### Frontend → Vercel
1. Conecte o repositório na [Vercel Dashboard](https://vercel.com)
2. Configure **Root Directory:** `frontend`
3. Adicione as variáveis de ambiente na Vercel Dashboard
4. Deploy automático a cada push na `main`

### Backend → Railway
1. Conecte o repositório no [Railway](https://railway.app)
2. Configure **Root Directory:** `backend`
3. Adicione as variáveis de ambiente
4. O `railway.toml` já tem o comando de build e start configurados

---

## 🧪 Testes

```bash
# Backend (Jest)
cd backend && npm test

# Frontend (Vitest)
cd frontend && npx vitest run

# E2E (Playwright) — requer servidor rodando
cd frontend && npx playwright test
```

---

## 📁 Estrutura

```
clickmarido/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── core/      # Auth, cache, email, logger, segurança
│   │   └── (módulos de negócio)
│   ├── prisma/        # Schema e migrations
│   └── railway.toml   # Deploy Railway
│
├── frontend/          # Next.js App
│   ├── src/
│   │   ├── app/       # App Router (pages e layouts)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── store/     # Zustand
│   └── vercel.json    # Deploy Vercel
│
└── .github/
    └── workflows/
        ├── ci.yml     # Lint + Type-check + Testes (PRs)
        └── cd.yml     # Deploy produção (merge main)
```