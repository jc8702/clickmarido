# Plano de Correções de Auditoria: ClickMarido ERP+CRM

Este documento define o plano técnico e cronograma de correções baseado estritamente nas falhas levantadas pelo Relatório de Auditoria Pós-Implementação de 15 de Junho de 2026.

---

## 🛠️ Levantamento de Skills Necessárias (Squad de Especialistas)

1. **`backend-architect` (Arquitetura NestJS e APIs)**: Responsável pela refatoração estrutural dos services no backend (adoção de Repository Pattern), configuração do Swagger/OpenAPI e padronização do tratamento global de exceções.
2. **`security-auditor` (Segurança)**: Focado em sanar as vulnerabilidades de segurança críticas (proteção CSRF, sanitização XSS no frontend/backend e ativação de CORS restritivo).
3. **`typescript-expert` / `react-patterns` (Qualidade de Código e Refatoração)**: Especialista em TypeScript estrito para remover as 927 ocorrências de `any` e refatorar as páginas monolíticas gigantes (>500 linhas) em sub-componentes. Responsável pela divisão da store monolítica do Zustand em Slices.
4. **`test-driven-development` / `playwright-skill` (Testes e Qualidade)**: Responsável por elevar a cobertura de testes do backend para 80% (Jest) e do frontend para 75% (Vitest + RTL), configurar os mocks/factories e implementar os testes E2E do fluxo crítico via Playwright.
5. **`performance-engineer` (Performance e DevOps)**: Responsável pelo code-splitting dinâmico, mitigação de bundles pesados, melhorias em índices de queries do banco de dados e auditoria de CI/CD gates no GitHub Actions.

---

## 🚀 Cronograma e Plano de Ações Corretivas

### FASE 1: Fundações Críticas e Segurança (Semanas 1-2)

#### **1. Hardening de Segurança (CSRF, XSS & CORS)**
* **Objetivo:** Eliminar as brechas de segurança críticas.
* **Ações:**
  * Implementar o middleware `csrf-csrf` no backend e validação de tokens nas requisições mutativas (`POST`, `PUT`, `DELETE`).
  * Integrar `DOMPurify` no frontend para sanitizar entradas textareas.
  * Restringir o CORS de `loose` para as origens estritas especificadas no `.env`.
  * Ativar o Throttler (rate-limiting) por rotas específicas de autenticação.

#### **2. Restrições do ESLint e Type Safety**
* **Objetivo:** Forçar a qualidade de código estrita.
* **Ações:**
  * Alterar a regra `@typescript-eslint/no-explicit-any` de `off` para `error` no ESLint do backend e frontend.
  * Substituir sistematicamente o uso de `any` por tipos explícitos, interfaces ou genéricos (667 no backend, 260 no frontend).
  * Promover avisos de Promises soltas e argumentos não seguros para erros de compilação.

#### **3. Suíte de Testes e Quality Gates no CI/CD**
* **Objetivo:** Estabelecer barreiras automáticas que impeçam regressões.
* **Ações:**
  * Remover a flag `--if-present` ou skip do CI e forçar a execução de testes em cada pull request.
  * Configurar a quebra automática do build no GitHub Actions se o coverage de backend cair abaixo de 30% (rumo a 80%) e frontend abaixo de 30% (rumo a 75%).

---

### FASE 2: Refactoring e Padrões de Projeto (Semanas 3-4)

#### **4. Component Refactoring no Frontend**
* **Objetivo:** Resolver as páginas monolíticas gigantes que impedem a testabilidade.
* **Ações:**
  * Quebrar `orcamentos/page.tsx` (1.225 linhas) em pequenos sub-componentes.
  * Desmembrar `servicos/page.tsx` (1.021 linhas), `clientes/page.tsx` (791 linhas), `materiais/page.tsx` (777 linhas) e outras páginas maiores que 500 linhas.
  * Extrair estados locais para custom hooks.

#### **5. Refactoring de Services no Backend (Repository Pattern)**
* **Objetivo:** Separar regras de negócio da persistência de dados.
* **Ações:**
  * Criar classes de Repository que envelopam chamadas ao Prisma Client.
  * Isolar a lógica de geolocalização e transações financeiras dos services de negócios (`quotes.service.ts`, `clients.service.ts`).
  * Utilizar factories/fixtures para isolar o banco de dados em suítes de testes.

#### **6. Estado Global no Zustand (Slices)**
* **Objetivo:** Organizar a store única monolítica do frontend.
* **Ações:**
  * Dividir a store única em slices funcionais (`AuthSlice`, `ClientsSlice`, `QuotesSlice`, `ServicesSlice`).
  * Implementar seletores tipados para evitar renderizações excessivas de componentes.

---

### FASE 3: Error Handling, API Docs e Otimizações (Semanas 5-6)

#### **7. Error Handling Global**
* **Objetivo:** Garantir resiliência na interface e rastreabilidade na API.
* **Ações:**
  * Criar `ErrorBoundary` no frontend nas páginas principais.
  * Integrar logging estruturado com Winston no backend para auditoria e centralização de logs.

#### **8. Otimização de Performance e Bundle Size**
* **Objetivo:** Acelerar o carregamento inicial da aplicação.
* **Ações:**
  * Implementar dynamic imports (`next/dynamic`) para componentes pesados como `react-big-calendar`.
  * Habilitar lazy-loading em imagens e otimizar fontes.

#### **9. Documentação Swagger da API**
* **Objetivo:** Facilitar a integração e contratos com o frontend.
* **Ações:**
  * Configurar `@nestjs/swagger` no endpoint `/api/docs`.
  * Decorar os DTOs e controllers para auto-gerar documentação OpenAPI.

---

## 🧪 Estratégia de Verificação e Qualidade

1. **Testes Unitários e Integração (Jest e Vitest):**
   * Validar todas as rotas alteradas no backend e frontend garantindo a passagem de 100% dos testes implementados.
2. **Auditoria de CI/CD:**
   * Garantir que o linter estrito e suítes de testes rodem obrigatoriamente sem erros na esteira do GitHub Actions antes de liberar o deploy.
