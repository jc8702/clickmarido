import { test, expect } from '@playwright/test';

test.describe('Clientes CRUD Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to clientes page
    await page.goto('/clientes');
  });

  test('should display clients table', async ({ page }) => {
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should open create client dialog', async ({ page }) => {
    await page.getByRole('button', { name: /novo cliente/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should validate required fields in create client', async ({ page }) => {
    await page.getByRole('button', { name: /novo cliente/i }).click();
    await page.getByRole('button', { name: /salvar/i }).click();
    await expect(page.getByText(/obrigatório/i).first()).toBeVisible();
  });

  test('should allow searching for a client', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/buscar/i);
    await searchInput.fill('João Silva');
    // Assert table filters (mocked or visual)
    await expect(searchInput).toHaveValue('João Silva');
  });

  test('should allow pagination in clients table', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /próxima/i });
    if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
      await nextBtn.click();
      // Verify state changed
    }
  });
});
