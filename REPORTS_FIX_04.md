# REPORTS_FIX_04 — Reports Middleware Fix (CompanyContext)

## Problema

`CompanyContext.getCompanyId()` retornava `''` (string vazia) em todas as rotas autenticadas, causando `BadRequestException('Empresa não encontrada')` nos endpoints de reports e potencialmente em outros controllers.

**Root cause:** `CompanyMiddleware` decodificava o JWT mas só extraía `sub`/`userId` — ignorava `companyId` que existe no payload (`auth.service.ts:81`).

## Mudanças

### 1. `company.middleware.ts` — Extrair `companyId` do JWT

- Adicionado `jwtCompanyId` extraído do payload JWT (`payload.companyId`)
- Prioridade: `x-company-id` header > `jwtCompanyId` > `''`

### 2. `company.context.ts` — Adicionar `setCompanyId()` / `setUserId()`

- Novos métodos estáticos que permitem mutar o store do ALS in-place
- Usado pelo `CompanyContextGuard` para sobrescrever o context após JWT auth

### 3. `company-context.guard.ts` (NOVO)

- Guard que roda após `JwtAuthGuard` e antes de `PermissionsGuard`
- Extrai `companyId` de `req.user` (validado pelo JwtStrategy contra o DB)
- Chama `CompanyContext.setCompanyId()` para garantir context correto
- Segunda barreira de validação: usuários sem `companyId` recebem 401

### 4. `current-user.decorator.ts` (NOVO)

- Decorator `@CurrentUser()` para injetar `req.user` tipado nos controllers
- Interface `CurrentUser` exportada com `{ id, email, name, isActive, companyId }`

### 5. `reports.controller.ts` — Adicionar `CompanyContextGuard`

- Guard order: `JwtAuthGuard → CompanyContextGuard → PermissionsGuard`
- `CompanyContextGuard` roda após JWT auth e antes de qualquer uso do `CompanyContext`

## Arquivos modificados

- `backend/src/common/company/company.middleware.ts`
- `backend/src/common/company/company.context.ts`
- `backend/src/modules/reports/reports.controller.ts`

## Arquivos criados

- `backend/src/common/guards/company-context.guard.ts`
- `backend/src/common/decorators/current-user.decorator.ts`

## Testes

- `npm run lint`: 0 erros (warnings preexistentes)
- `npm run test -w backend`: 196 passed, 32 suites
- `npm run test -w frontend`: (não afetado)

## Como aplicar o guard em outros controllers

Adicionar `CompanyContextGuard` na lista de guards entre `JwtAuthGuard` e `PermissionsGuard`:

```typescript
@UseGuards(JwtAuthGuard, CompanyContextGuard, PermissionsGuard)
```

Ou usar `@CurrentUser()` decorator para acessar `req.user` diretamente:

```typescript
@Get('profile')
getProfile(@CurrentUser() user: CurrentUser) {
  return user;
}
```
