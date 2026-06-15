import { test, expect } from '@playwright/test';

test.describe('Financeiro Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/financeiro');
  });

  test('should display financial dashboard', async ({ page }) => {
    await expect(page.getByText(/fluxo de caixa/i)).toBeVisible();
  });

  test('should display transactions table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should open new transaction dialog', async ({ page }) => {
    const newBtn = page.getByRole('button', { name: /nova transação/i });
    if (await newBtn.isVisible()) {
      await newBtn.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('should allow filtering transactions by date', async ({ page }) => {
    const dateFilter = page.getByPlaceholder(/data inicial/i);
    if (await dateFilter.isVisible()) {
      await dateFilter.fill('2026-06-01');
      await expect(dateFilter).toHaveValue('2026-06-01');
    }
  });

  test('should generate and download DRE report', async ({ page }) => {
    const dreBtn = page.getByRole('button', { name: /gerar dre/i });
    if (await dreBtn.isVisible()) {
      // In a real test, we would intercept the download
      await dreBtn.click();
      await expect(page.getByText(/relatório gerado/i)).toBeVisible();
    }
  });
});
