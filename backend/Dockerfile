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
