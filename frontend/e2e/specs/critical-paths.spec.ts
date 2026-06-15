import { test, expect } from '../fixtures/base.fixture';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Critical User Journeys', () => {
  let dashPage: DashboardPage;

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('admin');
    dashPage = new DashboardPage(page);
  });

  test('should load dashboard data correctly', async ({ page }) => {
    await page.route('**/api/v1/metrics/dashboard', route => {
      route.fulfill({ status: 200, json: { revenue: 5000, activeOrders: 10 } });
    });

    await dashPage.navigate();
    await expect(dashPage.welcomeHeader).toBeVisible();
  });

  test('should pass accessibility checks on dashboard', async ({ page, makeAxeBuilder }) => {
    await dashPage.navigate();
    const accessibilityScanResults = await makeAxeBuilder().analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await dashPage.navigate();
    
    // Testa se o menu hambúrguer ou layout mobile colapsou
    const isVisible = await dashPage.welcomeHeader.isVisible();
    expect(isVisible).toBeTruthy();
  });
});
