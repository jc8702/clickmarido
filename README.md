# Click Marido ERP + CRM

[![CI Pipeline](https://github.com/jc8702/clickmarido/actions/workflows/ci.yml/badge.svg)](https://github.com/jc8702/clickmarido/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/jc8702/clickmarido/actions/workflows/cd.yml/badge.svg)](https://github.com/jc8702/clickmarido/actions/workflows/cd.yml)
[![codecov](https://codecov.io/gh/jc8702/clickmarido/graph/badge.svg?token=YOUR_TOKEN)](https://codecov.io/gh/jc8702/clickmarido)

SaaS de gestão para prestadores de serviços com CRM, ordens de serviço, financeiro, agenda inteligente e relatórios.

## Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, TailwindCSS v4
- **Backend**: NestJS 11, Prisma ORM, PostgreSQL (Supabase)
- **Auth**: NextAuth v4 + JWT
- **AI**: Google Gemini API
- **Monitoring**: Sentry, Vercel Analytics, Web Vitals
- **CI/CD**: GitHub Actions, Vercel, Coolify

## Quick Start

```bash
git clone https://github.com/jc8702/clickmarido.git
cd clickmarido/frontend && npm install && cd ../backend && npm install && cd ..
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
# Configure DB connection, then:
cd backend && npx prisma migrate dev && npx prisma db seed
cd ../frontend && npm run dev
```

## Documentation

See [docs/](docs/README.md) for full documentation:
- [Getting Started](docs/GETTING_STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development](docs/DEVELOPMENT.md)
- [Testing](docs/TESTING.md)
- [Deployment](docs/DEPLOYMENT.md)
- [API](docs/API.md)
- [Components](docs/COMPONENTS.md)
- [Design Tokens](docs/DESIGN_TOKENS.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)
- [Runbook](RUNBOOK.md)

## Status

- ✅ WCAG AAA (7:1 contrast, keyboard, screen reader)
- ✅ Monitoring (Sentry, Vercel Analytics)
- ✅ CI/CD (GitHub Actions < 5min build)
- ✅ Backup automation (daily to S3)
- ✅ Testing (70%+ coverage)
- ✅ API Layer (NestJS + auto-generated client)
- ✅ Performance (FCP < 1.5s, LCP < 2.5s)
- ✅ Design System (20+ components, 4+ states)
