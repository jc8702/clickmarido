# Click Marido Marketing Studio 🛠️📺

O **Click Marido Marketing Studio** é uma aplicação SaaS inteligente desenvolvida sob medida para a **Click Marido Reparos Residenciais**. O sistema automatiza a criação de conteúdo publicitário para o Instagram (Reels de 15s, 30s e 60s), gerando roteiros de alta conversão, storyboards detalhados de gravação, prompts cinematográficos para geradores de vídeo de IA (Gemini Veo, Sora, Kling, Runway) e legendas com hashtags locais.

---

## 🚀 Funcionalidades MVP

*   **Dashboard Executivo**: Acompanhamento de KPIs (total de projetos, status de geração da IA) e atalhos de templates.
*   **Briefing Guiado**: Formulário inteligente (validação via Zod + React Hook Form) integrando todos os serviços e diferenciais da Click Marido.
*   **Template Padrão**: Atalho para carregar instantaneamente o briefing institucional "Click Marido Institucional".
*   **Gerador de Roteiro**: Cria hooks de impacto de 5s, dor/problema, transição para o serviço e CTA focada em fechar orçamentos no WhatsApp.
*   **Storyboard de Direção**: Estruturação de câmera, ambiente, ação de atores e tempo por cena.
*   **Prompts Cinematográficos de Vídeo**: Prompts otimizados em inglês com negative prompts prontos para copiar e colar em IAs de vídeo.
*   **Copys do Post**: Geração de legenda envolvente para o Instagram, hashtags locais e CTA para o WhatsApp.
*   **Modo Híbrido (Offline Fallback)**: Se chaves de API não estiverem configuradas, o Studio ativa um mock gerador robusto e funcional que utiliza os dados inseridos de forma imediata para simular o SaaS.

---

## 🛠️ Stack Tecnológica

*   **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS v4.
*   **Gerenciamento de Estado**: Zustand (com persistência automática no `localStorage` do navegador para projetos e templates).
*   **Backend & APIs**: Next.js API Routes (serverless/edge friendly) prontas para Vercel.
*   **Integração IA**: Serviços configurados para Google Gemini API, Anthropic Claude e OpenRouter (IA Hub).
*   **Banco de Dados**: Supabase Client integrado para persistência opcional no PostgreSQL do Neon/Supabase.
*   **Validação & Formulários**: Zod + React Hook Form com Zod Resolver.
*   **Ferramentas de Qualidade**: ESLint, Prettier, Husky (git hooks para pre-commit de linter) e Commitlint (regras convencionais de commit).

---

## 📁 Estrutura de Pastas

```text
src/
├── app/                  # Rotas do App Router (dashboard, projects, templates, settings)
│   ├── api/generate/     # API Route serverless para chamadas seguras de IA
│   └── layout.tsx        # Layout global com Sidebar fixa e tema Dark
├── components/           # Componentes reutilizáveis do projeto
│   ├── layouts/          # Estruturas de layout (Sidebar, StoreInitializer)
│   └── ui/               # Componentes atômicos estilizados (Button, Card, Tabs, Badge)
├── modules/              # Lógica modular de negócios
│   └── video-generator/  # Estado global de criação de vídeos e projetos (Zustand Store)
├── services/             # Serviços externos e APIs
│   ├── ai/               # Integração direta com Gemini/Claude/OpenRouter e Fallback Mock
│   └── supabase/         # Integração com banco de dados PostgreSQL
├── types/                # Definições de tipos TypeScript do sistema
└── lib/                  # Bibliotecas auxiliares (classe cn para Tailwind v4)
```

---

## ⚙️ Configuração Local

### Pré-requisitos

*   Node.js (versão 18.x ou superior recomendada)
*   NPM

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/jc8702/clickmarido.git
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Duplique o arquivo de variáveis de ambiente:
    ```bash
    cp .env.example .env.local
    ```
4.  Insira suas credenciais e chaves de API no `.env.local` (opcional - a aplicação roda em modo offline se as chaves não forem inseridas).

### Executando em Desenvolvimento

Rode o servidor de desenvolvimento:
```bash
npm run dev
```
Abra [http://localhost:3000](http://localhost:3000) no seu navegador para testar a aplicação.

---

## 📦 Scripts NPM

*   `npm run dev`: Inicializa o servidor local em modo desenvolvimento.
*   `npm run build`: Compila a versão de produção otimizada para deploy.
*   `npm run start`: Inicializa o app Next.js compilado na produção.
*   `npm run lint`: Executa a verificação estática com o ESLint para garantir a qualidade de código.
*   `prepare`: Script automático executado pelo Husky na instalação para ativar os Git Hooks.

---

## 🎨 Design System & Estética

A interface foi projetada utilizando um estilo **Dark Mode minimalista e ultra premium**, inspirado na Vercel, Linear e Stripe:
*   Visual escuro com contraste em tons de cinza (#09090b e #18181b) e bordas finas (#27272a).
*   Gradients suaves nos títulos importantes e badges coloridos para indicar status.
*   Sidebar fixa com links elegantes e atalho dinâmico no topo do formulário.
*   Micro-interações: hover com glow azul, cliques com retorno tátil de escala e animações de esvanecimento na troca de abas.
