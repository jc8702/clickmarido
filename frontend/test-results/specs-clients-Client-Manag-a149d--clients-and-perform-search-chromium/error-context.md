# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: specs\clients.spec.ts >> Client Management >> should list clients and perform search
- Location: e2e\specs\clients.spec.ts:12:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

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
  1  | import { test as base } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | type MyFixtures = {
  5  |   makeAxeBuilder: () => AxeBuilder;
  6  |   loginAs: (role: 'admin' | 'user') => Promise<void>;
  7  | };
  8  | 
  9  | export const test = base.extend<MyFixtures>({
  10 |   makeAxeBuilder: async ({ page }, use) => {
  11 |     const makeAxeBuilder = () => new AxeBuilder({ page });
  12 |     await use(makeAxeBuilder);
  13 |   },
  14 |   
  15 |   // Custom auth fixture that abstracts login logic and bypasses UI for faster tests if needed
  16 |   loginAs: async ({ page }, use) => {
  17 |     await use(async (role) => {
  18 |       // Aqui faríamos um POST via page.request ou simularíamos sessão real preenchendo cookies
  19 |       // Exemplo prático de by-pass via UI rápida:
  20 |       await page.goto('/login');
  21 |       if (role === 'admin') {
> 22 |         await page.fill('input[name="email"]', 'admin@example.com');
     |                    ^ Error: page.fill: Test timeout of 30000ms exceeded.
  23 |         await page.fill('input[name="password"]', 'admin123');
  24 |       } else {
  25 |         await page.fill('input[name="email"]', 'user@example.com');
  26 |         await page.fill('input[name="password"]', 'user123');
  27 |       }
  28 |       await page.click('button[type="submit"]');
  29 |       await page.waitForURL('/dashboard');
  30 |     });
  31 |   },
  32 | });
  33 | 
  34 | export { expect } from '@playwright/test';
  35 | 
```