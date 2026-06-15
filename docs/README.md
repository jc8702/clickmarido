# Click Marido ERP + CRM

SaaS de gestão para prestadores de serviços com CRM, ordens de serviço, financeiro, agenda e relatórios.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, TailwindCSS v4
- **Backend**: NestJS 11, Prisma ORM, PostgreSQL (Supabase)
- **Auth**: NextAuth v4 + JWT
- **AI**: Google Gemini API
- **Monitoring**: Sentry, Vercel Analytics
- **CI/CD**: GitHub Actions, Vercel

## Quick Links

- [Getting Started](GETTING_STARTED.md)
- [Architecture](ARCHITECTURE.md)
- [Development](DEVELOPMENT.md)
- [Testing](TESTING.md)
- [Deployment](DEPLOYMENT.md)
- [API](API.md)
- [Components](COMPONENTS.md)
- [Design Tokens](DESIGN_TOKENS.md)
- [Accessibility](ACCESSIBILITY.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Runbook](../RUNBOOK.md)

## Project Structure

```
clickmarido/
├── frontend/          # Next.js 16 (App Router)
│   ├── src/
│   │   ├── app/       # Routes & pages
│   │   ├── components/# UI & feature components
│   │   ├── contexts/  # React contexts (auth, layout)
│   │   ├── hooks/     # Custom hooks
│   │   ├── lib/       # Utilities & API client
│   │   └── ...
│   ├── e2e/           # Playwright E2E tests
│   └── ...
├── backend/           # NestJS 11 API
│   ├── src/
│   │   ├── modules/   # Feature modules
│   │   ├── common/    # Shared utilities
│   │   └── core/      # Core config (auth, guards)
│   ├── prisma/        # Schema & migrations
│   └── test/          # E2E tests
├── docs/              # Documentation
├── scripts/           # Utility scripts
└── .github/           # CI/CD workflows
```
