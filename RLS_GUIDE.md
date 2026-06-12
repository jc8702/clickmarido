# Guia de Configuração de Row Level Security (RLS) no PostgreSQL / Neon

A arquitetura atual do Click Marido garante o isolamento multi-tenant (multi-empresa) na camada de aplicação (NestJS) assegurando que todos os endpoints que buscam, inserem ou atualizam dados sempre passem `companyId` no predicado Prisma (`where: { companyId }`).

Como uma camada **adicional de segurança** (Defense in Depth), o PostgreSQL suporta Row Level Security (RLS). A implementação de RLS com Prisma exige um fluxo específico, onde você configura uma variável de sessão no banco e define políticas (Policies).

## 1. Habilitando RLS nas Tabelas
Para todas as tabelas que contenham `companyId`, você pode habilitar o RLS conectando-se diretamente ao banco de dados (por ex: Neon SQL Editor) e executando:

```sql
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "service_orders" ENABLE ROW LEVEL SECURITY;
-- etc...
```

## 2. Criando a Política (Policy)
Crie uma política que força o banco a aceitar apenas linhas cujo `companyId` bata com o id definido em uma variável de sessão do Postgres (`app.current_company_id`):

```sql
CREATE POLICY tenant_isolation_policy ON "users"
    FOR ALL
    USING ("companyId" = current_setting('app.current_company_id', TRUE))
    WITH CHECK ("companyId" = current_setting('app.current_company_id', TRUE));
```
*(Repita para todas as tabelas tenant-bound).*

## 3. Adaptando o Prisma
O Prisma Client padrão não tem suporte nativo plug-and-play para RLS a cada query. No entanto, é possível usar o Prisma Client Extension para envolver as transações e definir o `current_setting` antes da query rodar, baseando-se no `AsyncLocalStorage` que já implementamos:

```typescript
import { PrismaClient } from '@prisma/client';
import { tenantStorage } from './tenant.storage';

const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async $allOperations({ args, query }) {
        const companyId = tenantStorage.getStore();
        if (companyId) {
           await prisma.$executeRawUnsafe(`SET app.current_company_id = '${companyId}';`);
        }
        return query(args);
      },
    },
  },
});
```
*Atenção*: Esse setup pode gerar complexidades no Prisma com Connection Pooling (PgBouncer). É recomendado utilizar o modo de driver `Transaction` ou Neon Serverless Driver com queries diretas se o RLS for estritamente necessário. No momento, o isolamento lógico do NestJS atende o MVP.
