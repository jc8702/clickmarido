# Backlog de Tarefas: Persistência, Consistência de Dados e Segurança da API

Este backlog detalha as tarefas a serem executadas para restabelecer a segurança e o correto salvamento de registros no Click Marido ERP + CRM.

## 🔐 Grupo 1: Correção de Segurança e Guards da API (Backend)
- [ ] **Tarefa 1.1:** Remover o `PermissionsGuard` global no arquivo [app.module.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/app.module.ts).
- [ ] **Tarefa 1.2:** Adicionar `@UseGuards(JwtAuthGuard, PermissionsGuard)` e permissões correspondentes no [technicians.controller.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/modules/technicians/technicians.controller.ts).
- [ ] **Tarefa 1.3:** Adicionar `@UseGuards(JwtAuthGuard, PermissionsGuard)` e permissões correspondentes no [financial.controller.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/modules/financial/financial.controller.ts) (exceto no webhook do Mercado Pago).
- [ ] **Tarefa 1.4:** Adicionar `@UseGuards(JwtAuthGuard, PermissionsGuard)` e permissões correspondentes no [service-orders.controller.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/modules/service-orders/service-orders.controller.ts).

## 🧹 Grupo 2: Higienização de Dados e Tratamento de Strings Vazias
- [ ] **Tarefa 2.1:** Criar o custom pipe `EmptyStringToNullPipe` no arquivo [empty-string-to-null.pipe.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/common/pipes/empty-string-to-null.pipe.ts).
- [ ] **Tarefa 2.2:** Registrar o `EmptyStringToNullPipe` globalmente em [main.ts](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/backend/src/main.ts).

## 🧪 Grupo 3: Validação de Build, Testes e Sincronização
- [ ] **Tarefa 3.1:** Executar testes unitários e de integração do backend para garantir que as alterações não introduziram quebras.
- [ ] **Tarefa 3.2:** Rodar a compilação local do backend (`npm run build`) para verificar se o build está saudável.
- [ ] **Tarefa 3.3:** Atualizar o arquivo [RESUMO_PROJETO.md](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/RESUMO_PROJETO.md) na raiz do projeto com o log das melhorias executadas.
- [ ] **Tarefa 3.4:** Realizar commit, push para o GitHub e monitorar o deploy em produção.
