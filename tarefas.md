# Backlog de Tarefas: Melhorias Visuais e Padronização de Temas

Este backlog detalha as etapas de implementação para a higienização visual do Click Marido ERP + CRM, resolvendo os problemas de contraste e aplicando o design semântico e dinâmico.

## 🎨 Grupo 1: Configuração do Design Tokens (Fundação)
- [x] **Tarefa 1.1:** Ajustar e validar variáveis CSS de cores semânticas sob `:root` e `.dark` no [globals.css](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/globals.css).
- [x] **Tarefa 1.2:** Configurar variante `@custom-variant dark` no Tailwind v4 para respeitar a classe `.dark` injetada pelo `next-themes`.
- [x] **Tarefa 1.3:** Atualizar o layout principal [dashboard-layout.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/components/layout/dashboard-layout.tsx) para aplicar `bg-background` semântico no container `<main>`.

## ⚙️ Grupo 2: Higienização de Componentes e Telas (Estrutura)
- [x] **Tarefa 2.1:** Ajustar o cabeçalho global [page-header.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/components/layout/page-header.tsx) para usar `text-foreground` e `border-border`, corrigindo a invisibilidade dos títulos no Light Mode.
- [x] **Tarefa 2.2:** Refatorar a página do Dashboard executivo ([dashboard/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/(dashboard)/dashboard/page.tsx)), substituindo backgrounds pretos rígidos e textos fixos por classes semânticas (`bg-card`, `border-border/50`, `text-foreground`).
- [x] **Tarefa 2.3:** Refatorar a página de Empresas ([empresas/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/(dashboard)/empresas/page.tsx)), aplicando cores semânticas aos filtros, inputs e mapeando o botão "+ Nova Empresa" para usar a cor primária dinâmica (`bg-primary`).
- [x] **Tarefa 2.4:** Refatorar a página de Relatórios ([relatorios/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/(dashboard)/relatorios/page.tsx)), garantindo legibilidade no título e reatividade no botão comercial e nos cards de análise de vendas.
- [x] **Tarefa 2.5:** Refatorar a página de Configurações ([settings/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/(dashboard)/settings/page.tsx)), limpando as classes rígidas dos cards de seleção de temas e garantindo que o Live Preview responda corretamente ao Light e Dark Mode.

## 🧪 Grupo 3: Validação Visual e Build
- [x] **Tarefa 3.1:** Rodar o build de produção local (`npm run build` na pasta `frontend`) para garantir que nenhuma classe do Tailwind v4 cause quebras ou erros de compilação.
- [x] **Tarefa 3.2:** Testar visualmente a interface simulando o modo Light e Dark em todos os 5 temas dinâmicos.
- [x] **Tarefa 3.3:** Atualizar o arquivo [RESUMO_PROJETO.md](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/RESUMO_PROJETO.md) na raiz do projeto com o log das melhorias efetuadas.
