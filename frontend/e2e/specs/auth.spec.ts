import { test, expect } from '../fixtures/base.fixture';
import { AuthPage } from '../pages/AuthPage';

test.describe('Authentication Flows', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    // Intercept API call to prevent needing backend running
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 200,
        json: { token: 'mock-token', user: { id: 1, name: 'Admin' } }
      });
    });

    await authPage.navigate();
    await authPage.login('admin@example.com', 'admin123');
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({ status: 401, json: { message: 'Unauthorized' } });
    });

    await authPage.navigate();
    await authPage.login('wrong@example.com', 'wrong123');
    await expect(authPage.errorMessage).toBeVisible();
  });
});
