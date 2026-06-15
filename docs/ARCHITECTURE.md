# Architecture

## Overview

Monorepo with two main packages: `frontend` (Next.js) and `backend` (NestJS).

```
┌─────────────┐     ┌──────────────┐     ┌──────────┐
│  Next.js 16 │────▶│  NestJS 11   │────▶│ Supabase │
│  (Vercel)   │     │  (VPS/Docker)│     │ (PostgreSQL)
└─────────────┘     └──────────────┘     └──────────┘
       │                    │
       │              ┌─────┴──────┐
       │              │ WebSocket  │
       │              │ (Socket.IO)│
       │              └────────────┘
       │
  ┌────┴─────┐
  │  Sentry  │
  │ Analytics│
  └──────────┘
```

## Frontend Architecture

### App Router Structure

```
src/app/
├── (auth)/          # Login, password recovery
├── (dashboard)/     # Authenticated pages
├── layout.tsx       # Root layout with providers
├── global-error.tsx # Sentry error boundary
└── q/[id]/          # Quote public view
```

### State Management

- **Auth**: React Context + NextAuth
- **Server State**: SWR (stale-while-revalidate)
- **Forms**: React Hook Form + Zod
- **Theme**: next-themes

## Backend Architecture

### Modules

```
src/modules/
├── ai/              # AI integrations (Gemini)
├── appointments/    # Calendar / Agenda
├── auth/            # Authentication (JWT)
├── chat/            # WhatsApp WebSocket
├── clients/         # Client CRUD
├── financial/       # Financial transactions
├── materials/       # Inventory management
├── quotes/          # Quote generation & PDF
├── reports/         # Analytics & reports
├── service-orders/  # Service order management
└── technicians/     # Technician management
```

### Auth Flow

1. User logs in via `/login`
2. Backend validates credentials, returns JWT
3. Frontend stores token, attaches to subsequent requests
4. WebSocket connections authenticated via token
