# E2E Testing Guide (Playwright)

## Arquitetura
Utilizamos o **Playwright** para testes E2E.
Nossos testes adotam o padrão **Page Object Model (POM)** (localizado em `e2e/pages/`) para manter os seletores e fluxos abstraídos das assertions, resultando em testes resilientes e escaláveis.

## Executando Testes Localmente

- Rodar no background: `npm run test:e2e`
- Rodar em modo UI (debug interativo): `npx playwright test --ui`
- Visualizar relatório HTML passado: `npx playwright show-report`

## Testando Acessibilidade (a11y)
Nossa *base fixture* (`e2e/fixtures/base.fixture.ts`) injeta automaticamente o `@axe-core/playwright`.
Basta consumir o parâmetro `makeAxeBuilder` dentro da closure do `test` e validar com `expect(results.violations).toEqual([])`.

## Debugging no CI
O GitHub Actions retém os resultados dos testes (vídeos das falhas, traces e screenshots) por 14 dias se o teste falhar.
1. Vá até a tab *Actions* no Github.
2. Acesse o job de falha.
3. Baixe o `.zip` contendo os traces (`playwright-report`).
4. Rode localmente: `npx playwright show-trace path/to/trace.zip`.
