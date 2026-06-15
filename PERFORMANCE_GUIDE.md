# Guia de Otimização de Performance

Este guia descreve as diretrizes arquiteturais para garantir que o **ClickMarido** se mantenha com pontuações no Lighthouse > 85, LCP < 2.5s e First Load JS do bundle principal abaixo de 300KB.

## 1. Code Splitting & Dynamic Imports

Qualquer pacote npm "pesado" (maior que 50KB parseado) não deve ser enviado no Initial Load (a não ser que seja crítico para o first paint).

### Quando usar `next/dynamic`
- **Componentes de Gráficos**: `recharts` ou `chart.js`. Eles devem ser importados usando `dynamic` com ou sem `ssr: false`.
- **Modais de Ação**: Modais que o usuário acessa ocasionalmente (ex: `ClientHistoryModal`, `AppointmentModal`) devem ser dinamicamente importados. O código do formulário complexo não precisa carregar na view da tabela.
- **Calendários**: `react-big-calendar` deve ter `ssr: false` e ser lazy loaded, visto que lida com o DOM pesadamente.

## 2. Configuração de Service Worker (Workbox / Serwist)

A aplicação foi configurada com o `@serwist/next`, um substituto moderno para o `next-pwa`.
- **Precache**: Arquivos estáticos do Next.js gerados no `.next` são automáticamente cacheados via hash (stale-while-revalidate).
- **Trabalho em Prod**: O Service worker é injetado apenas em ambiente `production` (`NODE_ENV !== 'development'`).
- O manifesto de cache (workbox) reside em `src/app/sw.ts`.

## 3. Otimização de Imagens e Fontes

### Imagens (`next/image`)
- Sempre use `<Image />` do `next/image` ao invés da tag `<img>` nativa.
- O `next.config.mjs` força formatos `['image/avif', 'image/webp']` para o navegador.

### Script Customizado
Se existirem assets locais brutos na pasta `/public`, você pode rodar o `node scripts/optimize-images.mjs` para convertê-los localmente em WebP via `sharp`.

### Fontes (Geist)
As fontes estão sendo otimizadas e embarcadas automaticamente pelo `next/font/google`. 
Certificamos que as propriedades `display: "swap"` e `preload: true` estejam presentes para evitar FOUT (Flash of Unstyled Text) e mitigar aumentos na métrica de CLS.

## 4. Analisador de Bundle
Sempre que adicionar uma nova dependência pesada, utilize o comando:
```bash
npm run analyze
```
Isso gerará os mapas HTML e mostrará a visualização em treemap do bundle atual.

---

**Métricas Target do Projeto (Lighthouse / Core Web Vitals)**:
- Bundle JS Main: < 300KB
- LCP (Largest Contentful Paint): < 2.5s
- CLS (Cumulative Layout Shift): < 0.1
