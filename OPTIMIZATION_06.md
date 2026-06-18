# ULTRAPROMPT 06 — Backend Reports Rate Limiting & Query Optimization

## Status

| Área | Status |
|---|---|
| Rate limiting no controller | Aplicado |
| ThrottlerModule no AppModule | Aplicado |
| ThrottlerGuard global duplicado | Removido para evitar consumo duplo |
| Transação em dashboard | Aplicada |
| Transação em relatório comercial | Aplicada |
| N+1 em `getCommercialReport` | Corrigido |
| Limites contra OOM/Timeout | Aplicados |
| Índices Prisma | Aplicados |
| Testes de reports | Passaram |
| Build backend | Passou |
| Prisma validate | Passou |

## Arquivos alterados

- `backend/src/modules/reports/reports.controller.ts`
- `backend/src/app.module.ts`
- `backend/src/modules/reports/reports.service.ts`
- `backend/src/modules/reports/reports.service.spec.ts`
- `backend/prisma/schema.prisma`

## Rate limit config

### `backend/src/app.module.ts`

```typescript
ThrottlerModule.forRoot([
  {
    ttl: 60000,
    limit: 10,
  },
])
```

### `backend/src/modules/reports/reports.controller.ts`

```typescript
@UseGuards(JwtAuthGuard, CompanyContextGuard, ThrottlerGuard)
```

| Endpoint | Rate limit |
|---|---:|
| `GET /reports/dashboard` | 10 req/min |
| `GET /reports/commercial` | 10 req/min |
| `GET /reports/operational` | 10 req/min |
| `GET /reports/financial` | 10 req/min |
| `GET /reports/export/financial` | 5 req/min |

Global default (app.module.ts): 10 req/min (TTL 60s). O `ThrottlerGuard` global foi removido para evitar consumo duplo, já que os endpoints de reports usam `@UseGuards(..., ThrottlerGuard)`.

## Queries: antes vs depois

### `getExecutiveDashboard`

**Antes**

- 7 queries sequenciais ou paralelas fora de transação:
  - `client.count`
  - `quote.findMany`
  - `serviceOrder.count`
  - `financialTransaction.findMany` receitas
  - `financialTransaction.findMany` despesas
  - `technician.count`
  - `warranty.count`

**Depois**

- 7 queries paralelas dentro de `this.prisma.$transaction(async (tx) => { ... })`
- Uso de `tx.*` para leitura point-in-time consistente
- Agregação no banco com `quote.groupBy` e `financialTransaction.aggregate`

### `getCommercialReport`

**Antes**

- `quote.findMany`
- `financialTransaction.findMany`
- `serviceOrder.count`
- `serviceOrder.findMany({ include: { services: true } })` sem limite

**Depois**

- 4 queries paralelas dentro de transação:
  - `tx.quote.groupBy`
  - `tx.financialTransaction.aggregate`
  - `tx.serviceOrder.count`
  - `tx.serviceOrder.findMany({ include: { services: true }, take: 2000 })`
- Remove N+1 com JOIN/`include`
- Limita leitura para evitar OOM/Timeout

### Outras queries limitadas

| Método | Limite aplicado |
|---|---:|
| `getCommercialReport` | `take: QUERY_LIMIT` = 2000 ordens |
| `getOperationalReport` | `take: QUERY_LIMIT` = 2000 ordens |
| `getFinancialReport` | `take: QUERY_LIMIT` = 2000 transações |
| `exportFinancialExcel` | `take: EXPORT_LIMIT` = 10000 transações |

## Índices adicionados ao Prisma schema

### `Quote`

```prisma
@@index([companyId, deletedAt])
@@index([companyId, status, deletedAt])
```

### `ServiceOrder`

```prisma
@@index([companyId, status, deletedAt])
```

### `FinancialTransaction`

```prisma
@@index([companyId, deletedAt])
@@index([companyId, type, deletedAt])
@@index([companyId, transactionDate])
```

## EXPLAIN PLAN

Não foi executado `EXPLAIN` real porque o ambiente de execução não estabeleceu conexão com o banco PostgreSQL.

Plano esperado após migração dos índices:

- `Quote`: `Index Scan`/`Bitmap Index Scan` usando `companyId, deletedAt` ou `companyId, status, deletedAt`
- `ServiceOrder`: `Index Scan`/`Bitmap Index Scan` usando `companyId, status, deletedAt`
- `FinancialTransaction`: `Index Scan`/`Bitmap Index Scan` usando `companyId, type, deletedAt` ou `companyId, transactionDate`

## Logs de queries lentas

Adicionado/validado logging de duração:

- `getExecutiveDashboard`: alerta acima de `1000ms`
- `getCommercialReport`: alerta acima de `1500ms`
- `getOperationalReport`: alerta acima de `1500ms`
- `getFinancialReport`: alerta acima de `1000ms`
- `exportFinancialExcel`: log de quantidade e duração

## Saída dos comandos

### `npm run test --w=backend -- reports.service.spec.ts`

```text
> backend@0.0.1 test
> jest reports.service.spec.ts

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        1.734 s
Ran all test suites matching reports.service.spec.ts.
```

### `npm run build -w backend`

```text
> backend@0.0.1 build
> nest build --webpack

webpack 5.106.2 compiled successfully in 19242 ms
```

### `npx prisma validate --schema backend/prisma/schema.prisma`

```text
Prisma schema loaded from backend\prisma\schema.prisma.
The schema at backend\prisma\schema.prisma is valid 🚀
```

### `git status --short`

```text
M RESUMO_PROJETO.md
 M backend/Dockerfile
 D backend/package-lock.json
 M backend/prisma/schema.prisma
 M backend/src/app.module.ts
 M backend/src/common/company/company.context.ts
 M backend/src/common/company/company.middleware.ts
 M backend/src/modules/reports/reports.controller.ts
 M backend/src/modules/reports/reports.module.ts
 M backend/src/modules/reports/reports.service.spec.ts
 M backend/src/modules/reports/reports.service.ts
 M docker-compose.prod.yml
 M frontend/src/app/(dashboard)/dashboard/use-dashboard-metrics.ts
 M frontend/src/lib/api/client.ts
?? DOCKERFILE_FIX_03.md
?? OPTIMIZATION_06.md
?? REPORTS_FIX_04.md
?? backend/src/common/decorators/current-user.decorator.ts
?? backend/src/common/guards/company-context.guard.ts
?? backend/src/core/cache/
?? ultraprompt-summary.md
```

## Próximo agente

ULTRAPROMPT 07 — Convert null values + Cache
