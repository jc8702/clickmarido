# CSRF Protection - ClickMarido

## Visão Geral

Cross-Site Request Forgery (CSRF) é um ataque que força um usuário autenticado a executar ações indesejadas em uma aplicação web. O ClickMarido implementa proteção CSRF usando o padrão **double-submit cookie** via `csrf-csrf`.

## Arquitetura

```
Frontend (Next.js)                    Backend (NestJS)
──────────────────────────────────────────────────────────
1. GET /api/csrf-token  ──────────►  Gera token + cookie
   ◄── { token } + Set-Cookie       Token armazenado em
                                     cookie httpOnly + response

2. POST /api/clients                Middleware csrf-csrf:
   Headers:                           • Lê cookie x-csrf-token
   x-csrf-token: <token>              • Lê header x-csrf-token
   Cookie: x-csrf-token=<token>       • Compara ambos
   ◄── 201 / 403                    • 403 se inválido/ausente
```

### Fluxo Detalhado

1. **Token Request**: Frontend faz `GET /api/v1/csrf-token` na inicialização
2. **Token Storage**: Backend retorna token no body + cookie httpOnly
3. **Token Cache**: Frontend armazena token em memória (variável `csrfToken`)
4. **Mutation Injection**: Todo POST/PUT/PATCH/DELETE automaticamente inclui header `x-csrf-token`
5. **Validation**: Backend valida token vs cookie em cada mutação
6. **Token Refresh**: Se 403, token é limpo e re-buscado no próximo request

## Configuração

### Backend (.env)

```env
CSRF_SECRET=sua_chave_secreta_aqui
CSRF_TOKEN_EXPIRY=3600
CSRF_COOKIE_SECURE=true
CSRF_COOKIE_HTTPONLY=true
COOKIE_SECRET=outra_chave_secreta
```

### Frontend (.env)

```env
NEXT_PUBLIC_CSRF_HEADER_NAME=X-CSRF-Token
```

## Endpoints Protegidos

Todos os endpoints `POST/PUT/PATCH/DELETE` sob `/api/*` são protegidos pelo middleware CSRF global.

### Endpoints EXCLUÍDOS (sem CSRF):

| Endpoint | Motivo |
|----------|--------|
| `GET /api/v1/health` | Health check |
| `GET /api/v1/csrf-token` | Obtém token CSRF |
| `OPTIONS *` | Preflight CORS |

## Implementação Atual

### Backend

- **`src/core/security/csrf.ts`**: Configuração do `csrf-csrf` (double-submit cookie)
  - Cookie: `x-csrf-token`, httpOnly, secure em produção, sameSite lax
  - Token size: 64 bytes
  - Header aceito: `x-csrf-token` ou `csrf-token`
  - Métodos ignorados: GET, HEAD, OPTIONS

- **`src/main.ts`**: Registro global do middleware `doubleCsrfProtection`

- **`src/app.controller.ts`**: Endpoint `GET /api/v1/csrf-token` que gera e retorna o token

### Frontend

- **`src/lib/api/client.ts`**: `ApiClient` com cache automático de token + header injection

- **`src/components/providers/swr-provider.tsx`**: SWR fetcher com CSRF injection para mutations

## Como Testar Manualmente

### 1. Obter token CSRF

```bash
curl -v http://localhost:3001/api/v1/csrf-token
```

Response esperada:
```json
{ "token": "<64-char-hex-token>" }
```
Cookie: `x-csrf-token=<token>` setado no header `Set-Cookie`

### 2. POST sem token (deve falhar)

```bash
curl -X POST http://localhost:3001/api/v1/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}'
```

Response esperada: `403 Forbidden`

### 3. POST com token válido

```bash
# Primeiro obtém o token
TOKEN_RESP=$(curl -c cookies.txt http://localhost:3001/api/v1/csrf-token)
TOKEN=$(echo $TOKEN_RESP | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Depois faz POST com o token
curl -X POST http://localhost:3001/api/v1/clients \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: $TOKEN" \
  -b cookies.txt \
  -d '{"name":"Test"}'
```

Response esperada: `201 Created`

### 4. POST com token inválido

```bash
curl -X POST http://localhost:3001/api/v1/clients \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: token-invalido" \
  -b cookies.txt \
  -d '{"name":"Test"}'
```

Response esperada: `403 Forbidden`

## Testes Automatizados

### Backend (E2E)

```bash
cd backend
npm run test:e2e -- --testPathPattern=csrf
```

Testes em `backend/test/csrf.e2e-spec.ts`:
1. `GET /csrf-token` deve retornar token + cookie
2. `POST` sem token deve retornar 403
3. `POST` com token válido deve retornar 201

### Frontend (Unit)

```bash
cd frontend
npx vitest run --reporter=verbose src/middleware/csrf.test.ts
```

## Vulnerabilidades Mitigadas

| Ameaça | Status | Mitigação |
|--------|--------|-----------|
| CSRF (Cross-Site Request Forgery) | ✅ Mitigado | Double-submit cookie + token header |
| XSS (Cross-Site Scripting) | ✅ Mitigado | DOMPurify + Helmet CSP headers |
| Clickjacking | ✅ Mitigado | Helmet `X-Frame-Options` |
| MIME Sniffing | ✅ Mitigado | Helmet `X-Content-Type-Options` |
| CORS abusivo | ✅ Mitigado | CORS restritivo por `CORS_ORIGIN` env |

## Troubleshooting

### "403 Forbidden" em toda mutação

**Causa possível**: Token CSRF expirado ou não obtido.

**Solução**: O `ApiClient` e o SWR fetcher limpam o cache em 403 e re-obtêm o token automaticamente. Verifique o console do browser para erros de fetch do token.

### "Cannot read properties of undefined (reading 'token')"

**Causa possível**: Backend offline ou rota CSRF não encontrada.

**Solução**: Verifique se o backend está rodando e se `NEXT_PUBLIC_API_URL` está configurado corretamente.

### Token não renovando após expiração

**Causa**: O cookie e o token em memória expiram em 1 hora.

**Solução**: O `ApiClient` limpa o cache em qualquer 403 e re-obtém o token automaticamente no próximo request.

## Monitoramento

Logs de CSRF são capturados pelo `LoggingInterceptor` e `SentryInterceptor`:
- **Warn level**: Tentativa de POST com token inválido
- **Info level**: Token gerado com sucesso
- **Error level**: Erro ao validar token (enviado ao Sentry se for 500+)

## Referências

- [csrf-csrf (npm)](https://www.npmjs.com/package/csrf-csrf)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [NestJS Security](https://docs.nestjs.com/security/helmet)
