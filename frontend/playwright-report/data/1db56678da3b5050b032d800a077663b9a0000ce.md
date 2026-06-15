# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: financeiro.spec.ts >> Financeiro Flow >> should display transactions table
- Location: e2e\financeiro.spec.ts:12:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('table')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('table')

```

```yaml
- link "Pular para o conteúdo principal":
  - /url: "#main-content"
- text: CM
- heading "Acesse o ERP + CRM" [level=3]
- paragraph: Insira suas credenciais para entrar no Click Marido
- text: E-mail institucional
- textbox "E-mail institucional":
  - /placeholder: nome@clickmarido.com.br
- text: Senha de acesso
- link "Esqueceu a senha?":
  - /url: /esqueci-senha
- textbox "Senha de acesso":
  - /placeholder: ••••••••
- button "Entrar no Painel"
- paragraph: "Usuários de demonstração (Senha: senha123):"
- text: 🔑 admin@clickmarido.com.br 🔧 tecnico@clickmarido.com.br 📞 atendente@clickmarido.com.br 💼 gestor@clickmarido.com.br
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Financeiro Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/financeiro');
  6  |   });
  7  | 
  8  |   test('should display financial dashboard', async ({ page }) => {
  9  |     await expect(page.getByText(/fluxo de caixa/i)).toBeVisible();
  10 |   });
  11 | 
  12 |   test('should display transactions table', async ({ page }) => {
> 13 |     await expect(page.getByRole('table')).toBeVisible();
     |                                           ^ Error: expect(locator).toBeVisible() failed
  14 |   });
  15 | 
  16 |   test('should open new transaction dialog', async ({ page }) => {
  17 |     const newBtn = page.getByRole('button', { name: /nova transação/i });
  18 |     if (await newBtn.isVisible()) {
  19 |       await newBtn.click();
  20 |       await expect(page.getByRole('dialog')).toBeVisible();
  21 |     }
  22 |   });
  23 | 
  24 |   test('should allow filtering transactions by date', async ({ page }) => {
  25 |     const dateFilter = page.getByPlaceholder(/data inicial/i);
  26 |     if (await dateFilter.isVisible()) {
  27 |       await dateFilter.fill('2026-06-01');
  28 |       await expect(dateFilter).toHaveValue('2026-06-01');
  29 |     }
  30 |   });
  31 | 
  32 |   test('should generate and download DRE report', async ({ page }) => {
  33 |     const dreBtn = page.getByRole('button', { name: /gerar dre/i });
  34 |     if (await dreBtn.isVisible()) {
  35 |       // In a real test, we would intercept the download
  36 |       await dreBtn.click();
  37 |       await expect(page.getByText(/relatório gerado/i)).toBeVisible();
  38 |     }
  39 |   });
  40 | });
  41 | 
```