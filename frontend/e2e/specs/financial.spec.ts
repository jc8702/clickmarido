import { test, expect } from '../fixtures/base.fixture';
import { FinancialPage } from '../pages/FinancialPage';

test.describe('Financial Flows', () => {
  let finPage: FinancialPage;

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('admin');
    finPage = new FinancialPage(page);
  });

  test('should create a quote and convert it to an order', async ({ page }) => {
    await page.route('**/api/v1/quotes**', route => {
      route.fulfill({ status: 200, json: { data: [{ id: 1, status: 'DRAFT' }] } });
    });

    await finPage.navigateToQuotes();
    await expect(finPage.newQuoteBtn).toBeVisible();

    await page.route('**/api/v1/quotes/1/approve', route => {
      route.fulfill({ status: 200, json: { id: 1, status: 'APPROVED' } });
    });

    await finPage.convertToOrderBtn.first().click();
    // Assuming UI feedback happens
    await expect(page.locator('text=Cotação Aprovada')).toBeVisible();
  });
});
