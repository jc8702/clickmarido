# Plano de Implementação: Persistência, Consistência de Dados e Segurança da API

Este plano orienta a varredura e refatoração no Click Marido ERP + CRM, focando em garantir o salvamento robusto de dados no banco de dados e a blindagem de segurança de endpoints.

---

## 🛠️ Levantamento de Skills Necessárias

1. **`backend-architect` (Arquitetura NestJS)**: Especialista em injeção de dependências, guards de autenticação e ciclo de vida de requisições no framework NestJS.
2. **`database-design` (Consistência PostgreSQL)**: Para tratar de forma ótima as unique constraints compostas e garantir a persistência adequada de valores nulos e strings higienizadas.
3. **`security-auditor` (Segurança e Controle de Acesso)**: Para revisar o controle de acesso baseado em papéis (RBAC) e as rotas públicas da aplicação.

---

## 🚀 Hoja de Ruta de Alterações

### Fase 1: Correção do Erro HTTP 401 Unauthorized
* **[app.module.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/app.module.ts):**
  * Remover a declaração de `PermissionsGuard` como `APP_GUARD` global.
  * O guard continuará ativo de forma local nos controllers que o declaram explicitamente em `@UseGuards(JwtAuthGuard, PermissionsGuard)`.

### Fase 2: Blindagem e Segurança de Controllers
* **[technicians.controller.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/modules/technicians/technicians.controller.ts):**
  * Adicionar `@UseGuards(JwtAuthGuard, PermissionsGuard)`.
  * Adicionar `@RequirePermissions('*', 'user:read')` nos endpoints de leitura e `@RequirePermissions('*', 'user:update')` nos de escrita.
* **[financial.controller.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/modules/financial/financial.controller.ts):**
  * Adicionar `@UseGuards(JwtAuthGuard, PermissionsGuard)`.
  * Adicionar `@RequirePermissions('*', 'quote:read')` nos endpoints de leitura e `@RequirePermissions('*', 'quote:update')` nos de escrita.
  * **Exceção**: Manter o endpoint `/webhook/mercadopago` livre de guards para permitir o recebimento de notificações externas.
* **[service-orders.controller.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/modules/service-orders/service-orders.controller.ts):**
  * Adicionar `@UseGuards(JwtAuthGuard, PermissionsGuard)`.
  * Adicionar `@RequirePermissions('*', 'service:read')` para listagem e `@RequirePermissions('*', 'service:update')`/`service:create` nos métodos correspondentes.

### Fase 3: Consistência de Dados e Tratamento de Strings Vazias
* **[empty-string-to-null.pipe.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/common/pipes/empty-string-to-null.pipe.ts):**
  * Criar um custom NestJS `PipeTransform` que intercepta o corpo das requisições e altera recursivamente strings vazias `""` para `null`.
* **[main.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/main.ts):**
  * Injetar o `EmptyStringToNullPipe` globalmente antes do `ValidationPipe` do NestJS.

---

## 🧪 Plano de Verificação e Testes

1. **Testes do Backend (Unitários e E2E):**
   * Executar build local e rodar testes do NestJS para verificar integridade da API.
2. **Teste Prático de Cadastro de Clientes:**
   * Tentar criar um cliente via frontend de produção/local preenchendo apenas nome e telefone, verificando se a persistência ocorre com sucesso (sem erros de validação por causa do CPF e e-mail vazios).
3. **Teste Prático de Cadastro de Técnicos:**
   * Tentar cadastrar um técnico com campos opcionais vazios e validar se é persistido corretamente.
