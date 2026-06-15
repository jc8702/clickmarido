# Guia do Banco de Dados (PostgreSQL + Prisma)

Este guia documenta os padrões e processos para lidar com o esquema do banco de dados, aplicar migrations seguras e evitar problemas de performance no ClickMarido.

## 🚀 Migrations Zero-Downtime

Para evitar instabilidade na aplicação ou travamentos longos (table locks) em tabelas volumosas:
1. **Sempre crie migrations isoladas**:
   `npx prisma migrate dev --name nome_da_feature --create-only`
2. Modifique o arquivo gerado de SQL `migration.sql` na pasta `prisma/migrations` para usar `CONCURRENTLY` na criação de índices:
   ```sql
   -- Exemplo de Criação sem lock:
   CREATE INDEX CONCURRENTLY "clients_companyId_name_idx" ON "clients"("companyId", "name");
   ```
3. Ao usar `CONCURRENTLY`, a migration não pode rodar dentro de uma transação. Lembre-se de adicionar configurações que permitam o deploy caso seja via Prisma CLI, ou utilizar scripts de SQL puros.
4. Aplique a alteração no BD de produção apenas após o app já possuir lógica compatível (Backwards Compatibility).

## ⚡ Index Strategy e Performance
- **Índices Compostos**: Adicionamos índices combinando chaves estrangeiras com flags lógicas, pois a esmagadora maioria das queries filtra primeiramente pelo seu **Tenant** (`companyId`), e então pela coluna alvo (ex: `deletedAt`, `status`, `name`). 
- **Remoção de N+1**: Ao consultar dados via Prisma, evite fazer `.findMany()` em loops. Utilize a cláusula `include` ou `select` de forma encadeada para recuperar todas as relações com junções otimizadas do motor do Postgres.
- **Explain Analyze**: Para queries lentas observadas no Grafana, utilize `EXPLAIN ANALYZE SELECT ...` e valide se a operação está usando um Index Scan em vez de um Seq Scan.

## 📦 Rotina de Backup e Recovery (DR)

### Backup
O script `scripts/backup-db.sh` encapsula um backup `pg_dump` puro não-bloqueante (read-only snap).
Agendamento Cron recomendado:
```cron
0 2 * * * /opt/clickmarido/scripts/backup-db.sh
```

### Point-in-time Recovery e Restore (Plano de DR)
1. Conecte no VPS e localize o dump mais recente em `/var/backups/clickmarido`.
2. Interrompa as conexões à base atual (pare a API).
3. Recrie a base de dados em branco.
4. Execute:
   ```bash
   gunzip -c db_backup_XXX.sql.gz | psql -U postgres -d clickmarido -h localhost
   ```
5. Reinicie a aplicação e verifique se as migrações coincidem com a branch atual.
