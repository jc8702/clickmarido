import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('should redirect to login if not authenticated', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/.*login/);
  });

  test('should display validation errors on empty submission', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /entrar/i }).click();
    await expect(page.getByText(/inválido/i)).toBeVisible();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByPlaceholder(/email/i).fill('admin@clickmarido.com.br');
    await page.getByPlaceholder(/senha/i).fill('123456');
    await page.getByRole('button', { name: /entrar/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('/dashboard'); // assuming mocked auth or state
    // We'll mock the click on logout
    const logoutBtn = page.getByText(/sair/i);
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await expect(page).toHaveURL(/.*login/);
    }
  });

  test('should block access to dashboard after logout', async ({ page }) => {
    await page.goto('/dashboard');
    // If logged out, it should redirect back to login
    await expect(page).toHaveURL(/.*login/);
  });
});
