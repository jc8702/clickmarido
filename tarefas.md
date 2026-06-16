# Backlog de Tarefas: Correções da Auditoria ClickMarido

Este backlog define a lista de atividades necessárias para corrigir as pendências apontadas pelo Relatório de Auditoria Pós-Implementação.

---

## 🔐 Grupo 1: Segurança, Quality Gates e Type Safety (P0 - Semanas 1-2)

- [ ] **Tarefa 1.1: Proteção CSRF no Backend e Frontend**
  * Configurar middleware `csrf-csrf` no NestJS.
  * Implementar interceptor ou cabeçalho `x-csrf-token` no frontend para requisições POST/PUT/DELETE.
- [ ] **Tarefa 1.2: Sanitização XSS e CORS Estrito**
  * Integrar `DOMPurify` no frontend em entradas do tipo textarea.
  * Restringir origens de CORS no `main.ts` com base no `CORS_ORIGIN` do arquivo `.env`.
- [ ] **Tarefa 1.3: ESLint Strict Mode e Correção de 'any'**
  * Alterar a regra `@typescript-eslint/no-explicit-any` para `error` no ESLint do backend e frontend.
  * Substituir os 667 'any' no backend e 260 'any' no frontend por tipos robustos.
- [ ] **Tarefa 1.4: Ativação dos Testes no CI/CD**
  * Remover `--if-present` ou comandos que pulam a suíte de testes no GitHub Actions.
  * Implementar validações automáticas de cobertura mínima de testes (Threshold >30% inicial).

---

## 🏗️ Grupo 2: Refatoração de Componentes e Services (P1 - Semanas 3-4)

- [ ] **Tarefa 2.1: Refatoração das Páginas Monolíticas do Frontend**
  * Desmembrar `orcamentos/page.tsx` (1.225 linhas) em componentes menores e isolados.
  * Refatorar as páginas `servicos/page.tsx` (1.021 linhas), `clientes/page.tsx` (791 linhas), `materiais/page.tsx` (777 linhas) e componentes relacionados.
- [ ] **Tarefa 2.2: Implementação do Padrão Repository no Backend**
  * Extrair lógica de acesso a dados do Prisma de `quotes.service.ts` e `clients.service.ts` para repositórios específicos.
  * Isolar validações de negócios e integrações externas em services dedicados.
- [ ] **Tarefa 2.3: Reorganização da Store Global (Zustand Slices)**
  * Dividir a store única global em slices funcionais e tipadas.
  * Habilitar suporte ao Redux DevTools para depuração facilitada do estado.

---

## 📊 Grupo 3: Suíte de Testes, Documentação e Observabilidade (P2 - Semanas 5-6)

- [ ] **Tarefa 3.1: Expansão da Cobertura de Testes Unitários e Integração**
  * Elevar a cobertura dos services de negócios no backend de 15% para 80%.
  * Escrever testes de integração com RTL e Vitest no frontend para obter 75% de cobertura.
- [ ] **Tarefa 3.2: Configuração do Swagger OpenAPI**
  * Instalar `@nestjs/swagger` no backend.
  * Decorar endpoints e DTOs e disponibilizar documentação em `/api/docs`.
- [ ] **Tarefa 3.3: Implementação de Error Handling Global e Observabilidade**
  * Adicionar `ErrorBoundary` nas principais rotas do frontend.
  * Implementar Winston logger no backend e configurar correlation IDs nas requisições.
- [ ] **Tarefa 3.4: Otimização de Performance e E2E**
  * Implementar lazy-loading de pacotes como `react-big-calendar`.
  * Instalar e configurar testes E2E básicos com Playwright para caminhos críticos.
