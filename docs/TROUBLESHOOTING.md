# Troubleshooting

## Common Issues

### Build fails with "Module not found"

```bash
# Clear Next.js cache and node_modules
cd frontend
rm -rf .next node_modules
npm install
npm run build
```

### Prisma migrations fail

```bash
cd backend
# Reset database (WARNING: loses data)
npx prisma migrate reset

# Or apply pending migrations
npx prisma migrate deploy
```

### WebSocket connection fails

1. Check `NEXT_PUBLIC_WS_URL` matches backend URL
2. Verify VPS firewall allows port 3001
3. Check Coolify container logs: `docker logs clickmarido-backend`

### Auth returns 401

1. Check `JWT_SECRET` is same on frontend and backend
2. Verify token not expired (default: 1 day)
3. Clear cookies and re-login

### Sentry not capturing errors

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set
2. Check Sentry dashboard for project configuration
3. Ensure `beforeSend` isn't filtering in production

### Performance issues

1. Enable bundle analyzer: `ANALYZE=true npm run build`
2. Check Lighthouse report via Vercel Analytics
3. Verify database indexes (see RUNBOOK.md)

## Common Errors

| Error | Solution |
|-------|----------|
| `Error: useLayout deve ser usado dentro de um LayoutProvider` | Wrap component inside `DashboardLayout` |
| `Error: PrismaClientInitializationError` | Check `DATABASE_URL` is correct and DB is running |
| `Module not found: Can't resolve '@/...'` | Ensure path alias is configured in tsconfig.json |
