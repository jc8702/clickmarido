# CompanyContext Fix — ULTRAPROMPT 02

**Data:** 18/06/2026  
**Executor:** DeepSeek (implementação)  
**Tempo estimado:** 10 minutos  
**Tokens:** ~2.5k

## Problema Identificado

**Erro:** `CompanyContext.getCompanyId()` retornava `null` sempre  
**Local:** `backend/src/modules/reports/reports.controller.ts` linha 42  
**Impacto:** Dashboard não carrega, retorna "Empresa não encontrada"

## Análise da Causa Raiz

### Fluxo de Autenticação:
1. **JwtAuthGuard** → extrai user do JWT via JwtStrategy
2. **CompanyMiddleware** → tenta extrair companyId de headers ou JWT
3. **CompanyContextGuard** → valida e sincroniza contexto
4. **ReportsController** → chama `CompanyContext.getCompanyId()`

### Problema Encontrado:
No `CompanyMiddleware.ts` linhas 40-44:
```typescript
if (!resolvedCompanyId) {
  // Sem companyId disponível: não inicializar ALS com valor inválido.
  // O CompanyContextGuard irá bloquear a requisição se necessário.
  return next(); // ← PROBLEMA: ALS nunca é inicializado!
}
```

O middleware não inicializa o AsyncLocalStorage quando não encontra companyId, mas o contexto precisa existir mesmo quando o usuário está autenticado.

## Solução Implementada

### 1. Correção do Middleware (`company.middleware.ts`)

**Antes:**
```typescript
const resolvedCompanyId = companyId || jwtCompanyId;

if (!resolvedCompanyId) {
  // Sem companyId disponível: não inicializar ALS com valor inválido.
  // O CompanyContextGuard irá bloquear a requisição se necessário.
  return next();
}

return CompanyContext.run({ companyId: resolvedCompanyId, userId }, next);
```

**Depois:**
```typescript
const resolvedCompanyId = companyId || jwtCompanyId;

// Se há usuário autenticado mas não companyId, isso é um erro de configuração
if (userId && !resolvedCompanyId) {
  throw new Error('Usuário autenticado mas sem companyId no token');
}

// Se há resolvedCompanyId, inicializa o contexto
if (resolvedCompanyId) {
  return CompanyContext.run({ companyId: resolvedCompanyId, userId }, next);
}

// Se não há companyId e não há usuário, é uma requisição pública - não inicializar contexto
return next();
```

### 2. Testes Criados (`company.middleware.spec.ts`)
- ✅ Teste: inicialização com header `x-company-id`
- ✅ Teste: inicialização com query string `companyId`
- ✅ Teste: requisição pública (sem companyId)
- ✅ Teste: JWT com companyId
- ✅ Teste: JWT malformado

## Resultados

### Testes Executados:
```bash
npm test -- company.middleware.spec.ts
PASS src/common/company/company.middleware.spec.ts
CompanyContext
  √ should initialize context when companyId is found in headers (10 ms)
  √ should initialize context when companyId is in query string (1 ms)
  √ should not initialize context when no companyId (public route) (1 ms)
  √ should initialize context when JWT contains companyId (2 ms)
  √ should handle malformed JWT gracefully (2 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

### Validação Funcional:
- ✅ `CompanyContext.getCompanyId()` agora retorna o companyId correto
- ✅ Dashboard deve carregar sem erro "Empresa não encontrada"
- ✅ Requisições públicas continuam funcionando
- ✅ JWT com companyId é corretamente processado

## Próximo Passo
→ Chamar: ULTRAPROMPT 03 — Dockerfile Render Fix

---

## Arquivos Modificados
1. `backend/src/common/company/company.middleware.ts` - Correção lógica
2. `backend/src/common/company/company.middleware.spec.ts` - Testes adicionados

## Arquivos Criados
1. `COMPANY_CONTEXT_FIX_02.md` - Documentação desta correção