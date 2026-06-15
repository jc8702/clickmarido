# Deployment

## Architecture

```
Frontend (Vercel) ──▶ Backend (VPS/Coolify) ──▶ Supabase (PostgreSQL)
       │                        │
       │                        └── WebSocket (Socket.IO)
       │
       └── Sentry + Vercel Analytics
```

## Environment Variables

### Frontend (Vercel)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry DSN |
| `SENTRY_AUTH_TOKEN` | No | Sentry auth for source maps |
| `SENTRY_ORG` | No | Sentry org slug |
| `SENTRY_PROJECT` | No | Sentry project slug |

### Backend (VPS)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Supabase pooled connection (port 6543) |
| `DIRECT_URL` | Yes | Supabase direct connection (port 5432) |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `JWT_EXPIRES_IN` | No | Token expiry (default: 1d) |

## Deploy Process

### Automatic (recommended)

Push to `main` → GitHub Actions:
1. CI runs: lint → typecheck → test → build
2. Deploy Frontend to Vercel
3. Deploy Backend to VPS via SSH

### Manual

See [Deploy Guide](../DEPLOY.md) for manual steps.

## Monitoring

See [Runbook](../RUNBOOK.md) for incident response and SOPs.
