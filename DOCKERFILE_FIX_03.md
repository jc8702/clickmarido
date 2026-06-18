# DOCKERFILE_FIX_03 — Render Build Fix (npm ci / lockfile)

## Problema
Item 9.6 da `AUDITORIA_PLANO.md`: "Corrigir Dockerfile `npm ci` sem lockfile"
- `backend/package-lock.json` **não existe** (monorepo npm workspace gera lockfile apenas na raiz)
- Build context `./backend` impedia acesso ao `package-lock.json` da raiz
- `npm install` (sem lockfile) produzia builds não reproduzíveis
- `npm ci` falhava silenciosamente no Render

## Mudanças

### 1. `docker-compose.prod.yml` (linha 6-7)

**Antes:**
```yaml
      context: ./backend
      dockerfile: Dockerfile
```

**Depois:**
```yaml
      context: .
      dockerfile: backend/Dockerfile
```

### 2. `backend/Dockerfile` (completo)

**Antes:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --ignore-scripts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/v1/health || exit 1

CMD ["node", "dist/main"]
```

**Problemas do antes:**
- `COPY package.json ./` → Copiava `backend/package.json` (contexto errado)
- Sem `package-lock.json` → `npm install` sem lockfile
- `COPY . .` → Copiava tudo (`node_modules/` local incluso)
- Build não reproduzível (lockfile ausente)

**Depois:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Root workspace files (lockfile garantido para npm ci)
COPY package.json package-lock.json ./

# Backend source
COPY backend/ ./backend/

# Install com ci usando lockfile da raiz (workspace-aware, reproduzível)
RUN npm ci --legacy-peer-deps --prefer-offline

WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# Root workspace files para instalação reproduzível
COPY package.json package-lock.json ./

# Apenas produção
RUN npm ci --omit=dev --ignore-scripts --legacy-peer-deps

# Artifacts do build
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/backend/node_modules/@prisma/client ./node_modules/@prisma/client

ENV NODE_ENV=production
ENV PORT=3001
EXPOSE 3001

USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/v1/health || exit 1

CMD ["node", "dist/main"]
```

## O que mudou (resumo)

| Aspecto | Antes | Depois |
|---------|-------|--------|
| Build context | `./backend` | `.` (raiz) |
| Lockfile | Nenhum | `package-lock.json` da raiz |
| Instalação | `npm install` | `npm ci --legacy-peer-deps --prefer-offline` |
| Reprodutível | ❌ | ✅ |
| Caminho do build | `/app` | `/app/backend` |
| Runner stage | `npm install --omit=dev` | `npm ci --omit=dev --ignore-scripts --legacy-peer-deps` |

## Teste

**Comando:** `docker build -t clickmarido-backend:test -f backend/Dockerfile .`

**Resultado:** ⚠️ Docker CLI não disponível neste ambiente (Windows sem Docker Desktop). A correção é estruturalmente válida e segue o padrão npm workspaces oficial.

### Como testar localmente:
```bash
docker build -t clickmarido-backend:test -f backend/Dockerfile .
docker run --rm clickmarido-backend:test npm --version
docker run --rm clickmarido-backend:test ls -la dist/
```

## Render Redeploy Instructions

1. **Commit e push:**
   ```bash
   git add backend/Dockerfile docker-compose.prod.yml
   git commit -m "fix(render): Dockerfile npm ci com lockfile da raiz (workspace)"
   git push
   ```

2. **Render Dashboard:**
   - Acesse https://dashboard.render.com
   - Selecione o serviço `clickmarido-backend`
   - Clique **"Manual Deploy" → "Clear Build Cache & Deploy"**
   - Verifique os logs: `npm ci` deve executar sem erros

3. **Verificar health:**
   ```bash
   curl https://clickmarido.onrender.com/api/v1/health
   # Esperado: {"status":"ok"}
   ```

## Verificação pós-deploy

- [ ] Build passa sem erros de lockfile
- [ ] `npm ci` usa o lockfile da raiz
- [ ] Container inicia sem crash
- [ ] Healthcheck responde 200
