import { test as base } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type MyFixtures = {
  makeAxeBuilder: () => AxeBuilder;
  loginAs: (role: 'admin' | 'user') => Promise<void>;
};

export const test = base.extend<MyFixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    const makeAxeBuilder = () => new AxeBuilder({ page });
    await use(makeAxeBuilder);
  },
  
  // Custom auth fixture that abstracts login logic and bypasses UI for faster tests if needed
  loginAs: async ({ page }, use) => {
    await use(async (role) => {
      // Aqui faríamos um POST via page.request ou simularíamos sessão real preenchendo cookies
      // Exemplo prático de by-pass via UI rápida:
      await page.goto('/login');
      if (role === 'admin') {
        await page.fill('input[name="email"]', 'admin@example.com');
        await page.fill('input[name="password"]', 'admin123');
      } else {
        await page.fill('input[name="email"]', 'user@example.com');
        await page.fill('input[name="password"]', 'user123');
      }
      await page.click('button[type="submit"]');
      await page.waitForURL('/dashboard');
    });
  },
});

export { expect } from '@playwright/test';
