# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: clientes.spec.ts >> Clientes CRUD Flow >> should display clients table
- Location: e2e\clientes.spec.ts:9:7

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
  3  | test.describe('Clientes CRUD Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Navigate to clientes page
  6  |     await page.goto('/clientes');
  7  |   });
  8  | 
  9  |   test('should display clients table', async ({ page }) => {
> 10 |     await expect(page.getByRole('table')).toBeVisible();
     |                                           ^ Error: expect(locator).toBeVisible() failed
  11 |   });
  12 | 
  13 |   test('should open create client dialog', async ({ page }) => {
  14 |     await page.getByRole('button', { name: /novo cliente/i }).click();
  15 |     await expect(page.getByRole('dialog')).toBeVisible();
  16 |   });
  17 | 
  18 |   test('should validate required fields in create client', async ({ page }) => {
  19 |     await page.getByRole('button', { name: /novo cliente/i }).click();
  20 |     await page.getByRole('button', { name: /salvar/i }).click();
  21 |     await expect(page.getByText(/obrigatório/i).first()).toBeVisible();
  22 |   });
  23 | 
  24 |   test('should allow searching for a client', async ({ page }) => {
  25 |     const searchInput = page.getByPlaceholder(/buscar/i);
  26 |     await searchInput.fill('João Silva');
  27 |     // Assert table filters (mocked or visual)
  28 |     await expect(searchInput).toHaveValue('João Silva');
  29 |   });
  30 | 
  31 |   test('should allow pagination in clients table', async ({ page }) => {
  32 |     const nextBtn = page.getByRole('button', { name: /próxima/i });
  33 |     if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
  34 |       await nextBtn.click();
  35 |       // Verify state changed
  36 |     }
  37 |   });
  38 | });
  39 | 
```