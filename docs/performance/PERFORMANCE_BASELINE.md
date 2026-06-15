# Performance Baseline & Monitoring Guide

O desempenho não é um sprint, é uma maratona. Este documento fixa as metas inflexíveis de tempo de carregamento e as políticas que a infraestrutura do **ClickMarido** usa para bloquear códigos lentos.

## 1. Web Vitals & Thresholds

Qualquer Pull Request que degradar essas métricas abaixo deverá ser refatorado ou revertido pelo CI/CD:

| Métrica | Target (Bom) | O que é? | Causas Comuns de Piora |
| ------- | ------------ | -------- | ---------------------- |
| **FCP** (First Contentful Paint) | `< 1.8s` | Tempo até o primeiro pixel de UI aparecer na tela. | TTFB lento, bloqueadores de renderização na `<head>` (CSS/JS síncrono). |
| **LCP** (Largest Contentful Paint)| `< 2.5s` | Tempo até o maior elemento (ex: Hero Image) carregar. | Imagens não otimizadas, ausência de Priority Hints (`<img priority>`). |
| **CLS** (Cumulative Layout Shift) | `< 0.1` | O quanto a tela "pula" durante o carregamento. | Imagens/Iframes sem `width`/`height` explícitos. WebFonts lentas. |
| **INP** (Interaction to Next Paint)| `< 200ms` | Tempo de resposta do UI ao clique do mouse/teclado. | Tarefas bloqueantes de Javascript na thread principal (Long Tasks). |

## 2. Budgets de Infraestrutura

- **Bundle de Javascript Frontend**: MAX 300 KB Gziped. Acima disso o Github Actions recusa a build do Next.js via `bundle-size.config.json`.
- **CSS Crítico**: MAX 50 KB.
- **API Latency (Backend NestJS)**: A mediana de chamadas deve responder abaixo de **200ms**. O `PerformanceInterceptor` emite um WARNING no console e log de métrica se ultrapassar.
- **Database Query Time (Prisma)**: A querie deve executar abaixo de **100ms**. A extension `prisma.extension.ts` notifica via logs quando isso é descumprido.

## 3. Fluxo de Monitoramento
O Lighthouse foi integrado na Pipeline (Lighthouse CI) forçando a nota mínima global de **85**.

Para o **Real User Monitoring (RUM)**:
1. No Frontend, implementamos o utilitário `/utils/reportWebVitals.ts` atrelado aos hooks do W3C. Ele coleta de usuários de carne e osso os tempos de pintura e delay de cliques e submete isso aos endpoints da aplicação em background via `navigator.sendBeacon`.
2. O Backend utiliza esse dado nos dashboards do Prometheus/Grafana e Sentry (configurados no PROMPT 11) para emitir alertas automáticos se uma *release* prejudicou usuários reais.

## 4. Otimização Obrigatória no Next.js
- Utilize `next/image` SEMPRE.
- Utilize `next/font` para prevenir Layout Shift (FOUT/FOIT).
- Se a rota não requerer Auth em tempo real no servidor, use Static Site Generation (SSG) no Page Router ou `export const revalidate` no App Router.
