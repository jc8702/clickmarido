import { test, expect } from '@playwright/test';

test.describe('Empresas Flow', () => {
  test('should navigate to empresas page', async ({ page }) => {
    await page.goto('/empresas');
  });
});
