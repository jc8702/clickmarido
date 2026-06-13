# VISUAL GUIDE & MAINTENANCE | Click Marido CRM

## 1. DESIGN TOKENS (Tailwind v4)

Todas as cores semânticas estão injetadas via Tailwind v4 CSS Variables (`@theme`) no arquivo `globals.css`. 

Para atualizar a cor primária global da plataforma:
1. Abra `src/app/globals.css`.
2. Edite `--primary: #8b5cf6;` no bloco `:root` (Light Mode).
3. Edite `--primary: #a78bfa;` no bloco `.dark` (Dark Mode).

### Paleta Principal
- **Primary (Roxo):** `--primary` | Destaque principal, botões CTA.
- **Success (Verde):** `--success` | Confirmações, agendamentos pagos.
- **Warning (Laranja):** `--warning` | Alertas, pagamentos pendentes, trending positivo de receita.
- **Destructive (Vermelho):** `--destructive` | Exclusões, cancelamentos.
- **Info (Azul):** `--info` | Links, dicas e notificações neutras.

## 2. COMPONENTES CORE (`src/components/ui`)

Temos uma biblioteca baseada no Radix-UI (shadcn-like), já adaptada para nosso Design System:

| Componente | Uso | Arquivo |
|------------|-----|---------|
| **Button** | Botões de ação (`variant="primary|danger|ghost|outline"`) | `button.tsx` |
| **Input** | Campos de texto com validação visual (`error`, `success`) e ARIA | `input.tsx` |
| **Card** | Contêineres de conteúdo, KPIs, formulários | `card.tsx` |
| **Badge** | Tags de status com cores semânticas (`variant="success|warning|danger"`) | `badge.tsx` |
| **Dialog** | Modais interativos com overlay (`backdrop-blur`) | `dialog.tsx` |
| **Select** | Dropdowns de seleção customizados | `select.tsx` |
| **Spinner**| Indicador de carregamento genérico | `spinner.tsx` |
| **KpiCard**| Cartão customizado para exibição de métricas com trend | `dashboard/kpi-card.tsx` |
| **Charts** | Gráficos (Line, Bar) usando `recharts` | `dashboard/charts.tsx` |

> [!NOTE]
> Todos os Design Tokens da escala cromática (50 a 900) estão disponíveis e consolidados em `src/lib/colors.ts`. Utilize-os para construção de gradientes mais finos em componentes customizados.

### Acessibilidade (A11y)
Todos os componentes interativos possuem `focus-visible:ring-2 focus-visible:ring-primary`, garantindo conformidade com a WCAG para navegação via teclado (`Tab`).

## 3. DARK / LIGHT MODE

O sistema foi desenhado para ser 100% responsivo a temas dinâmicos via `next-themes`. 
Utilize sempre classes semânticas nas suas páginas:
- Fundo da página: `bg-background`
- Texto principal: `text-foreground`
- Borda de divs: `border-border`
- Fundo de painéis flutuantes: `bg-popover text-popover-foreground`

**Evite hardcodar cores estáticas** como `bg-white` ou `text-black` fora de exceções críticas.

## 4. RESPONSIVIDADE

Siga o padrão Mobile-First:
1. `< 768px` (Mobile): Cards ocupam 100% da largura, gráficos ficam empilhados. Use classes base (ex: `grid-cols-1`).
2. `md:` (Tablet - 768px+): Elementos começam a ficar lado-a-lado (ex: `md:grid-cols-2`).
3. `lg:` (Desktop - 1024px+): Disposição ampla, tabelas ganham mais colunas e painéis flutuantes expandem.

---
*Este documento é parte da documentação viva do Click Marido. Atualize-o sempre que um novo padrão UI/UX for adotado.*
