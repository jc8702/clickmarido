# Plano de Melhoria Visual e Padronização de Temas (SaaS Elite)

Este documento apresenta o plano de implementação técnico para corrigir as inconsistências visuais e a falta de legibilidade no Click Marido ERP + CRM, padronizando os botões, os inputs e a conformidade de cores semânticas para Light e Dark Mode em todos os 5 temas dinâmicos.

---

## 📸 Diagnóstico Visual (Baseado nas Imagens de Auditoria)

Analisando as capturas fornecidas, identificamos os seguintes problemas que comprometem a experiência de usuário:
1. **Falta de Contraste (Invisibilidade em Modo Claro):**
   * Títulos principais das páginas (como "Configurações", "Empresas", "Painel Executivo", "Relatórios e Das") usam a classe rígida `text-white`. Quando o fundo da página em Light Mode é claro (`bg-zinc-50`), esses títulos desaparecem totalmente.
   * Vários textos secundários e metadados também perdem o contraste.
2. **Cards e Elementos de Grid Rígidos (Hardcoded):**
   * Cards de métricas, containers de tabelas e filtros estão estilizados de forma rígida com cores escuras fixas (ex: `bg-zinc-900`, `bg-zinc-950`, `border-zinc-800`).
   * No Light Mode, isso faz com que os cards pretos flutuem sobre o fundo claro de forma desarmônica.
3. **Despadronização de Botões:**
   * Botões de ação primária (como "+ Nova Empresa") estão com cores rígidas e fixas (`bg-blue-600`), ignorando a identidade visual do tema ativo.
   * O botão da aba Relatórios ("Comercial") é preto rígido, o que quebra a coerência estética no Light Mode.

---

## 🛠️ Levantamento de Skills Necessárias & Squad de Especialistas

Para conduzir essa refatoração visual seguindo os mais altos padrões de design de produto (Elite SaaS), o seguinte Squad foi mapeado com base nas competências requeridas:

1. **`tailwind-patterns` (Especialista em Tailwind v4)**: Necessário para a correta manipulação de variáveis CSS no arquivo de estilos central sob a nova estrutura e sintaxe v4 do Tailwind CSS, garantindo compilação limpa.
2. **`ui-tokens` (Arquiteto de Design System)**: Responsável pela sincronização das variáveis do tema ativo com as variantes `dark` e `light` dinâmicas.
3. **`ui-a11y` & `wcag-audit-patterns` (Engenheiro de Acessibilidade)**: Responsável por garantir conformidade de contraste (WCAG AA) em todos os temas e modos de visualização, eliminando textos invisíveis.
4. **`design-spells` & `gpt-taste` (Especialista em UI/UX Premium)**: Responsável pelo polimento das micro-interações, transições suaves nos botões, glassmorphism e design coerente com o padrão internacional de aplicativos SaaS.

---

## 🎨 Proposta de Padronização de Cores Semânticas

Para resolver todos os problemas de contraste, substituiremos as classes de cores estáticas por tokens semânticos baseados nas variáveis CSS ativas de cada tema:

| Elemento | De (Rígido) | Para (Semântico) | Comportamento Light / Dark |
| :--- | :--- | :--- | :--- |
| **Fundo de Tela** | `bg-zinc-50` / `bg-zinc-900` | `bg-background` | Claro no Light, Escuro no Dark |
| **Títulos Principais** | `text-white` / `text-zinc-900` | `text-foreground` | Escuro no Light, Claro no Dark |
| **Subtítulos/Metadata**| `text-zinc-500` / `text-zinc-400` | `text-muted-foreground` | Tons cinza ajustados de forma reativa |
| **Cards de Conteúdo**  | `bg-zinc-950` / `bg-zinc-900` | `glass-card` / `bg-card` | Fundo translúcido reativo com blur |
| **Bordas** | `border-zinc-800` | `border-border` | Bordas suaves ajustadas ao tema |
| **Inputs/Filtros** | `bg-zinc-900 border-zinc-800`| `bg-input/40 border-border`| Translúcidos e responsivos ao foco |
| **Botões Primários** | `bg-blue-600` / `bg-zinc-900` | `bg-primary text-primary-foreground`| Cor de marca correspondente ao tema ativo |

---

## 🚀 Hoja de Ruta de Alterações Propostas

### Fase 1: Ajuste do CSS e Variáveis de Tema (Design Tokens)
* **[globals.css](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/globals.css):**
  * Ajustar as propriedades do seletor `:root` e `.dark` para garantir que `--foreground`, `--background`, `--card` e `--border` tenham o comportamento esperado de contraste.
  * Certificar que a variante `@custom-variant dark (&:where(.dark, .dark *));` esteja ativa para forçar o Tailwind v4 a responder à classe `.dark` inserida no HTML.

### Fase 2: Componentização Core
* **[dashboard-layout.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/components/layout/dashboard-layout.tsx):**
  * Atualizar o background do elemento `<main>` para usar `bg-background` de forma que responda dinamicamente às mudanças do `next-themes`.
* **[page-header.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/components/layout/page-header.tsx):**
  * Substituir a classe `text-white` por `text-foreground` e `border-zinc-900` por `border-border`.

### Fase 3: Higienização de Telas
* **[dashboard/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/(dashboard)/dashboard/page.tsx):**
  * Substituir o fundo dos cards de métricas por `glass-card` ou `bg-card`, a borda por `border-border/50` e o texto dos valores por `text-foreground`.
  * Atualizar as cores de destaque e botões da timeline e painéis para variáveis semânticas.
* **[empresas/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/(dashboard)/empresas/page.tsx):**
  * Remover classes de cores fixas `text-white` dos cabeçalhos.
  * Atualizar a barra de filtros para usar `bg-input/20 border-border` no lugar de backgrounds pretos rígidos.
  * Ajustar o botão de "Nova Empresa" para usar a classe do design system `bg-primary hover:bg-primary/90 text-primary-foreground`.
* **[relatorios/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/(dashboard)/relatorios/page.tsx):**
  * Corrigir a cor do título principal e subtexto.
  * Substituir os fundos pretos rígidos dos cards analíticos por `bg-card border-border`.
  * Tornar o botão de abas semântico (`bg-primary` se ativo ou `variant="outline"`).
* **[settings/page.tsx](file:///c:/Users/jc-pr/.gemini/antigravity/scratch/clickmarido/frontend/src/app/(dashboard)/settings/page.tsx):**
  * Higienizar os cards de visualização de temas.
  * Garantir legibilidade perfeita no seletor de "Aparência".

---

## 🧪 Plano de Verificação Visual

1. **Modo Claro (Light Mode):**
   * Verificar se todos os títulos das páginas estão visíveis e legíveis (em cinza escuro ou preto).
   * Validar se os cards possuem fundo claro correspondente ao tema.
   * Certificar que as bordas dos inputs não desaparecem contra o fundo.
2. **Modo Escuro (Dark Mode):**
   * Garantir que as fontes fiquem brancas ou cinza claro.
   * Confirmar se o fundo geral se torna escuro.
3. **Alternância Dinâmica de Temas:**
   * Testar a mudança de cor de marca (Arctic, Cyber, Warm, Corporate, Purple) no seletor de Aparência e verificar se os botões primários mudam de cor dinamicamente em ambas as variantes (light/dark).
