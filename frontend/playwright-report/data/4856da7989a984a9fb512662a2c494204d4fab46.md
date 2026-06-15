# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: agenda.spec.ts >> Agenda Flow >> should display calendar view
- Location: e2e\agenda.spec.ts:8:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.rbc-calendar').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.rbc-calendar').first()

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
  3  | test.describe('Agenda Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/agenda');
  6  |   });
  7  | 
  8  |   test('should display calendar view', async ({ page }) => {
  9  |     // Check if the calendar grid is visible
> 10 |     await expect(page.locator('.rbc-calendar').first()).toBeVisible();
     |                                                         ^ Error: expect(locator).toBeVisible() failed
  11 |   });
  12 | 
  13 |   test('should open event creation modal on date click', async ({ page }) => {
  14 |     // Simulate clicking a date cell
  15 |     const dateCell = page.locator('.rbc-day-bg').first();
  16 |     if (await dateCell.isVisible()) {
  17 |       await dateCell.click();
  18 |       await expect(page.getByRole('dialog')).toBeVisible();
  19 |     }
  20 |   });
  21 | 
  22 |   test('should validate event form', async ({ page }) => {
  23 |     const btnNovo = page.getByRole('button', { name: /novo agendamento/i });
  24 |     if (await btnNovo.isVisible()) {
  25 |       await btnNovo.click();
  26 |       await page.getByRole('button', { name: /salvar/i }).click();
  27 |       await expect(page.getByText(/obrigatório/i).first()).toBeVisible();
  28 |     }
  29 |   });
  30 | 
  31 |   test('should allow dragging and dropping events', async ({ page }) => {
  32 |     // Placeholder test for drag and drop functionality
  33 |     expect(true).toBe(true);
  34 |   });
  35 | 
  36 |   test('should switch between day, week, and month views', async ({ page }) => {
  37 |     const weekBtn = page.getByRole('button', { name: /semana/i });
  38 |     if (await weekBtn.isVisible()) {
  39 |       await weekBtn.click();
  40 |       await expect(page.locator('.rbc-time-view')).toBeVisible();
  41 |     }
  42 |   });
  43 | });
  44 | 
```