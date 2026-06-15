# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth Flow >> should display validation errors on empty submission
- Location: e2e\auth.spec.ts:9:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/inválido/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/inválido/i)

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
  3  | test.describe('Auth Flow', () => {
  4  |   test('should redirect to login if not authenticated', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveURL(/.*login/);
  7  |   });
  8  | 
  9  |   test('should display validation errors on empty submission', async ({ page }) => {
  10 |     await page.goto('/login');
  11 |     await page.getByRole('button', { name: /entrar/i }).click();
> 12 |     await expect(page.getByText(/inválido/i)).toBeVisible();
     |                                               ^ Error: expect(locator).toBeVisible() failed
  13 |   });
  14 | 
  15 |   test('should login successfully with valid credentials', async ({ page }) => {
  16 |     await page.goto('/login');
  17 |     await page.getByPlaceholder(/email/i).fill('admin@clickmarido.com.br');
  18 |     await page.getByPlaceholder(/senha/i).fill('123456');
  19 |     await page.getByRole('button', { name: /entrar/i }).click();
  20 |     await expect(page).toHaveURL(/.*dashboard/);
  21 |   });
  22 | 
  23 |   test('should logout successfully', async ({ page }) => {
  24 |     await page.goto('/dashboard'); // assuming mocked auth or state
  25 |     // We'll mock the click on logout
  26 |     const logoutBtn = page.getByText(/sair/i);
  27 |     if (await logoutBtn.isVisible()) {
  28 |       await logoutBtn.click();
  29 |       await expect(page).toHaveURL(/.*login/);
  30 |     }
  31 |   });
  32 | 
  33 |   test('should block access to dashboard after logout', async ({ page }) => {
  34 |     await page.goto('/dashboard');
  35 |     // If logged out, it should redirect back to login
  36 |     await expect(page).toHaveURL(/.*login/);
  37 |   });
  38 | });
  39 | 
```