# Auditoria de Design e Padrões Visuais: Click Marido (ERP + CRM)

Este documento detalha a auditoria visual do sistema, identificando pontos de melhoria e estabelecendo um plano de execução para elevar o produto ao nível de design internacional (Elite SaaS).

## 1. Diagnóstico de Design (Audit)

### 🎨 Consistência de Cores e Temas
- **Status:** ✅ Implementado via Tailwind v4 CSS Variables.
- **Observação:** O uso de cores "hardcoded" em componentes específicos quebra o suporte ao Dark Mode e a flexibilidade de marca.
- **Ação:** ✅ Unificado — Sidebar, Topbar e todos os utilitários agora usam `var(--primary)`, `var(--foreground)`, `var(--border)` etc.

### 📐 Grade e Espaçamento (Layout & Rhythm)
- **Status:** ✅ Padronizado.
- **Ação:** ✅ Padrão `p-8 lg:p-12 max-w-7xl space-y-10` adotado em todas as páginas.

### 🔡 Tipografia e Hierarquia
- **Status:** ✅ Geist Sans & Geist Mono com hierarquia clara.
- **Ação:** ✅ `PageHeader` garante `text-4xl font-extrabold tracking-tight` consistente em todas as páginas.

### ✨ Micro-interações e Feedback
- **Status:** ✅ Animações refinadas.
- **Ação:** ✅ `glow-hover` com `0.4s cubic-bezier`, `animate-success`, scroll suave e Skeletons temáticos implementados.

---

## 2. Plano de Implementação e Execução (Roadmap)

### Fase 1: Fundação de Design Tokens ✅ Concluído
- [x] **Sanitização de Cores:** Todas as classes utilitárias de cores fixas substituídas por variáveis de tema no `globals.css`.
- [x] **Refinamento de Glassmorphism:** `glass-card` usa `color-mix(in srgb, var(--card) 45%, transparent)` no light e `rgba(18,18,21,0.6)` no dark.
- [x] **Padronização de Bordas:** `rounded-2xl` para containers, `rounded-xl` para elementos interativos.

### Fase 2: Componentização de Elite ✅ Concluído
- [x] **Temas Dinâmicos:** 5 variações de sistema (Arctic, Cyber, Warm, Corporate, Purple) via `data-theme` e CSS Variables.
- [x] **Theme Engine AI:** Lógica de extração de cores a partir da logo da empresa com persistência Zustand.
- [x] **Configurações de Marca:** Tela dedicada `/settings` com seletor de temas e logo upload.
- [x] **Dashboard Header (PageHeader):** Componente reutilizável `PageHeader` com Breadcrumbs, Título, Badge de Status e Botões de Ação — aplicado em Dashboard, Clientes e Técnicos.
- [x] **Sidebar Temática:** Refatorada para `var(--primary)`, `var(--border)`, `var(--foreground)` — funciona com todos os 5 temas.
- [x] **Topbar Temática:** Background e borda atualizados para variáveis CSS com glassmorphism.
- [x] **Skeletons Temáticos:** `SkeletonCard` e `SkeletonList` criados com `color-mix(in srgb, var(--border) 60%, transparent)`.

### Fase 3: Polimento e UX ✅ Concluído
- [x] **Smooth Scrolling:** `scroll-behavior: smooth` no `html` + scrollbar dinâmico com cor primária no hover.
- [x] **Micro-animação de Sucesso:** `@utility animate-success` com `successPulse` keyframe para confirmações.
- [x] **Acessibilidade WCAG AA:** Contrastes revisados, `aria-describedby` configurado nos Inputs, Skeletons legíveis e ring offsets atualizados.
- [x] **Dashboard de Alto Impacto:** Substituição dos mocks estáticos por componentes reativos `KpiCard` (com tendências e ícones) e Gráficos utilizando `recharts` (`DashboardLineChart`, `DashboardBarChart`).

---

## 3. Guia de Referência Rápida

| Elemento | Propriedade | Valor Padrão (Tailwind v4) |
| :--- | :--- | :--- |
| **Containers** | `glass-card` | `color-mix(in srgb, var(--card) 45%, transparent) backdrop-blur-md` |
| **Botões** | `primary` | `bg-(--primary) text-(--primary-foreground) rounded-xl shadow-lg` |
| **Inputs** | `standard` | `bg-(--input)/40 border-(--border) focus:ring-(--primary)/30` |
| **Heading 1** | `page-title` | `text-4xl font-extrabold tracking-tight` |
| **Subtitles** | `meta-data` | `text-[11px] font-bold uppercase tracking-[0.15em]` |
| **Page Layout** | `page-header` | `<PageHeader>` component em `components/layout/page-header.tsx` |

---

## 4. Arquitetura de Temas

```
globals.css
  ├── :root            → Tema padrão (Amber + Blue)
  ├── .dark            → Modo escuro
  ├── [data-theme='arctic']    → Minimalist Arctic
  ├── [data-theme='cyber']     → Cyberpunk Tech
  ├── [data-theme='warm']      → Warm Organic
  ├── [data-theme='corporate'] → Corporate Blue
  └── [data-theme='purple']    → Vibrant Purple

appearance-store.ts (Zustand + persist)
  ├── setTheme()       → define data-theme no body + persiste
  └── setCustomPalette() → aplica cores extraídas da logo via CSS vars

settings/page.tsx
  ├── Aba Aparência → Seletor de 6 temas + Logo Upload + Live Preview
  └── Aba API Keys  → Gemini + Supabase
```
