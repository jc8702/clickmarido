# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth Flow >> should login successfully with valid credentials
- Location: e2e\auth.spec.ts:15:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder(/email/i)

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Pular para o conteúdo principal" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e7]:
    - generic [ref=e8]:
      - generic [ref=e9]: CM
      - generic [ref=e10]:
        - heading "Acesse o ERP + CRM" [level=3] [ref=e11]
        - paragraph [ref=e12]: Insira suas credenciais para entrar no Click Marido
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]:
          - text: E-mail institucional
          - generic [ref=e16]:
            - img [ref=e17]
            - textbox "E-mail institucional" [ref=e20]:
              - /placeholder: nome@clickmarido.com.br
        - generic [ref=e21]:
          - generic [ref=e22]:
            - generic [ref=e23]: Senha de acesso
            - link "Esqueceu a senha?" [ref=e24] [cursor=pointer]:
              - /url: /esqueci-senha
          - generic [ref=e25]:
            - img [ref=e26]
            - textbox "Senha de acesso" [ref=e29]:
              - /placeholder: ••••••••
        - button "Entrar no Painel" [ref=e30]:
          - generic [ref=e31]: Entrar no Painel
          - img [ref=e32]
      - generic [ref=e34]:
        - paragraph [ref=e35]: "Usuários de demonstração (Senha: senha123):"
        - generic [ref=e36]:
          - generic [ref=e37]: 🔑 admin@clickmarido.com.br
          - generic [ref=e38]: 🔧 tecnico@clickmarido.com.br
          - generic [ref=e39]: 📞 atendente@clickmarido.com.br
          - generic [ref=e40]: 💼 gestor@clickmarido.com.br
  - button "Open Next.js Dev Tools" [ref=e46] [cursor=pointer]:
    - img [ref=e47]
  - alert [ref=e50]
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
  12 |     await expect(page.getByText(/inválido/i)).toBeVisible();
  13 |   });
  14 | 
  15 |   test('should login successfully with valid credentials', async ({ page }) => {
  16 |     await page.goto('/login');
> 17 |     await page.getByPlaceholder(/email/i).fill('admin@clickmarido.com.br');
     |                                           ^ Error: locator.fill: Test timeout of 30000ms exceeded.
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