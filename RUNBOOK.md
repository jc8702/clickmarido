# Runbook & SOP

## Production Incident Response

### 1. Detection
- Sentry alerts (email, Slack)
- Vercel Analytics alerts (>2s LCP, >100ms CLS)
- Uptime monitoring (e.g., Better Uptime, Pingdom)
- User reports via WhatsApp/support

### 2. Debugging Checklist

```
[ ] Check Sentry dashboard for new errors
[ ] Check Vercel Analytics for traffic anomalies
[ ] Check VPS health: CPU, RAM, disk (via Grafana)
[ ] Check database connections: SELECT * FROM pg_stat_activity;
[ ] Check recent deployments (git log --oneline -5)
[ ] Check environment variables match between deploys
```

### 3. Escalation

| Severity | Response Time | Who |
|----------|-------------|-----|
| **P0** — Site down | < 15 min | DevOps + Lead Dev |
| **P1** — Major feature broken | < 1h | Feature owner |
| **P2** — Minor issue | < 24h | Assigned dev |
| **P3** — Cosmetic | Next sprint | Any dev |

### 4. Rollback

**Frontend (Vercel):**
```bash
# Instant rollback via Vercel dashboard
# Or via CLI:
npx vercel rollback --yes
```

**Backend (VPS/Coolify):**
```bash
cd /opt/clickmarido
git revert HEAD --no-edit
git push origin main
# Coolify auto-deploys on push
```

---

## Deployment SOP

### Pre-deploy Checklist

```
[ ] Tests pass: npm run test
[ ] Lint passes: npm run lint
[ ] TypeScript compiles: npx tsc --noEmit
[ ] Build succeeds locally: npm run build
[ ] CHANGELOG updated (if applicable)
[ ] Database migration reviewed (if applicable)
[ ] Feature flag disabled (if rollback needed)
```

### Frontend Deploy (Vercel)

```bash
# Automatic on push to main (via GitHub Actions)
# Manual CLI deploy:
cd frontend
vercel --prod
```

### Backend Deploy (VPS/Coolify)

```bash
# Push to main → GitHub Actions → SSH deploy:
git push origin main

# Manual deploy:
ssh user@server
cd /opt/clickmarido
git pull origin main
cd backend
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart clickmarido-api
```

### Post-deploy Verification

```
[ ] Homepage loads correctly (HTTP 200)
[ ] Login works
[ ] API responds: curl https://api.clickmarido.com.br/api/health
[ ] WebSocket connects
[ ] Sentry shows no new errors
[ ] Vercel Analytics shows deployment
```

---

## Database Maintenance

### Backup Verification

```bash
# Check last backup
ls -la scripts/backups/clickmarido_latest.sql.gz

# Verify backup integrity
gunzip -c scripts/backups/clickmarido_latest.sql.gz | head -100

# Restore test (dry run on local DB)
gunzip -c scripts/backups/clickmarido_latest.sql.gz | psql -U user -d clickmarido_restore_test
```

### Index Optimization

```sql
-- Check unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Reindex (maintenance window)
REINDEX DATABASE clickmarido_db;
```

### Connection Pool Tuning

```yaml
# Supabase dashboard → Database → Connection pooling
# Recommended settings:
Pool size: 15-25 (default: 15)
Max client connections: 200
Statement timeout: 30s
```

### Regular Maintenance (Monthly)

```
[ ] VACUUM ANALYZE on all tables
[ ] Archive soft-deleted records (> 90 days)
[ ] Review slow queries (pg_stat_statements)
[ ] Audit active roles and permissions
[ ] Check disk usage and plan scaling
```

---

## Cron Jobs

| Schedule | Script | Description |
|----------|--------|-------------|
| Daily 03:00 | `scripts/backup-supabase.sh` | Database backup to S3 |
| Daily 04:00 | `scripts/cleanup.sh` | Clean old temp files |
| Every 15min | Vercel Cron | Application health check |

## Monitoring URLs

| Service | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/jc8702/clickmarido |
| Supabase Dashboard | https://supabase.com/dashboard |
| Sentry | https://sentry.io (project: clickmarido) |
| Grafana | http://<vps-ip>:3002 |
| Health Check | https://api.clickmarido.com.br/api/health |
