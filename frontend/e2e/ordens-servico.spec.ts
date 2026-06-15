import { test, expect } from '@playwright/test';

test.describe('Ordens de Serviço Flow', () => {
  test('should navigate to ordens de servico page', async ({ page }) => {
    await page.goto('/ordens-servico');
  });
});
