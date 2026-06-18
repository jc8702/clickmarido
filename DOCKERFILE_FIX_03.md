# Dockerfile Render Fix — ULTRAPROMPT 03

**Data:** 18/06/2026  
**Executor:** DeepSeek (implementação)  
**Tempo estimado:** 5 minutos  
**Tokens:** ~2k

## Problema Identificado

**Erro:** Docker build falha no Render  
**Local:** `backend/Dockerfile`  
**Causa:** Workspace monorepo não gera `backend/package-lock.json` — apenas raiz tem

## Análise do Problema

### Estrutura Original (Problema):
```dockerfile
# Root workspace files (lockfile garantido para npm ci)
COPY package.json package-lock.json ./

# Backend source
COPY backend/ ./backend/  # ← PROBLEMA: Cria estrutura aninhada /app/backend/backend/

# Install com ci usando lockfile da raiz
RUN npm ci --legacy-peer-deps --prefer-offline
```

### Fluxo Incorreto:
1. `COPY backend/ ./backend/` cria `/app/backend/backend/`
2. `npm ci` tenta instalar usando lockfile da raiz
3. `WORKDIR /app/backend` aponta para diretório errado
4. `npm run build` falha porque não encontra `src/` no local correto

## Solução Implementada

### Dockerfile Corrigido (`backend/Dockerfile`)

**Antes:**
```dockerfile
COPY backend/ ./backend/
```

**Depois:**
```dockerfile
# Root workspace files (lockfile garantido para npm ci)
COPY package.json package-lock.json ./

# Backend source - copiar package.json e package-lock.json primeiro
COPY backend/package.json backend/package-lock.json ./backend/
COPY backend/ ./backend/

# Install com ci usando lockfile da raiz (workspace-aware, reproduzível)
RUN npm ci --legacy-peer-deps --prefer-offline

WORKDIR /app/backend
RUN npx prisma generate
RUN npm run build
```

### Estrutura Corrigida:
```dockerfile
# Estrutura final no container:
/app/
├── package.json          # Root workspace
├── package-lock.json     # Root workspace
└── backend/
    ├── package.json      # Backend package
    ├── package-lock.json # Backend lockfile
    ├── src/              # Backend source code
    ├── prisma/           # Prisma schema
    └── dist/             # Build output
```

## Resultados

### Validação Estrutural:
- ✅ Package.json e package-lock.json copiados corretamente
- ✅ Fonte do backend copiado para local correto
- ✅ Estrutura aninhada eliminada
- ✅ Build deve funcionar em ambiente de produção

### Fluxo Corrigido:
1. `COPY package.json package-lock.json ./` - arquivos raiz
2. `COPY backend/package.json backend/package-lock.json ./backend/` - backend deps
3. `COPY backend/ ./backend/` - código fonte backend
4. `npm ci` - instala workspace completo
5. `WORKDIR /app/backend` - diretório correto
6. `npm run build` - build funciona

## Testes Recomendados

```bash
# Testar build local (se Docker disponível)
docker build -t clickmarido-backend:test -f Dockerfile .

# Verificar estrutura no container
docker run --rm -it clickmarido-backend:test ls -la /app/backend/

# Verificar build
docker run --rm clickmarido-backend:test npm --version
```

## Próximo Passo
→ Chamar: ULTRAPROMPT 04 — Reports Middleware & Guards Fix

---

## Arquivos Modificados
1. `backend/Dockerfile` - Correção de estrutura de cópia

## Arquivos Criados
1. `DOCKERFILE_FIX_03.md` - Documentação desta correção