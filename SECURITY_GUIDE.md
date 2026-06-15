# Click Marido - Security Guide

Este documento lista as configurações e defesas implementadas contra o OWASP Top 10 para o projeto Click Marido.

## 1. CSRF (Cross-Site Request Forgery)
A aplicação previne ataques CSRF garantindo que requisições de mutação (POST, PUT, DELETE, PATCH) incluam um token de segurança gerado no backend.
- O token é obtido via **GET `/api/csrf-token`**.
- O frontend envia esse token via cabeçalho `x-csrf-token`.
- O pacote `csrf-csrf` valida isso contra o hash guardado via cookies (com `SameSite=Lax`).

## 2. Prevenção de XSS (Cross-Site Scripting)
A sanitização ocorre em duas etapas principais:
1. **Frontend / HTTP Headers:** O `helmet` com uma forte política `Content-Security-Policy (CSP)` bloqueia a execução de scripts `inline` ou não autorizados (`eval`).
2. **Backend Global Pipe:** Todas as requisições com corpo JSON passam pelo `XssSanitizePipe`, o qual utiliza a biblioteca `DOMPurify` combinada com o `JSDOM` para remover qualquer `<script>` ou atributo malicioso (`javascript:`, `onEvent`) das strings.

## 3. Rate Limiting e Prevenção de Brute Force
Usando o módulo oficial `@nestjs/throttler`:
- O limitador **padrão** do sistema é de 100 requisições por 60 segundos por IP.
- A **autenticação** (`/api/auth/login`) possui limite reduzido de 5 tentativas por 5 minutos, protegendo contra credenciais brute-force.

## 4. Gerenciamento de Segredos
Nenhum segredo foi incluído no repositório. Em vez disso:
- Utiliza-se um **Schema de Validação** rígido com o `Joi` via `@nestjs/config`.
- Se as chaves `DATABASE_URL`, `JWT_SECRET`, entre outras não forem detectadas na inicialização, a API fará um *crash-early*, impedindo que a aplicação suba num estado desprotegido.

## 5. SQL Injection
- O uso exclusivo do Prisma ORM como Query Builder previne SQL Injection de forma inerente usando consultas parametrizadas.
- Todas as rotas de API possuem **Data Transfer Objects (DTOs)** rigidamente tipados pelo `class-validator`, forçando um whitelist (`forbidNonWhitelisted`).

> [!TIP]
> **Check-list de Deploy:**
> Sempre certifique-se de preencher as variáveis do `.env` baseando-se no `.env.example`, provendo `NODE_ENV=production` e gerando novos segredos usando `openssl rand -hex 32`.
