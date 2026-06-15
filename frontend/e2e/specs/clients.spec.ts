import { test, expect } from '../fixtures/base.fixture';
import { ClientPage } from '../pages/ClientPage';

test.describe('Client Management', () => {
  let clientPage: ClientPage;

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('admin');
    clientPage = new ClientPage(page);
  });

  test('should list clients and perform search', async ({ page }) => {
    await page.route('**/api/v1/clients**', route => {
      route.fulfill({
        status: 200,
        json: { data: [{ id: 1, name: 'John Doe', email: 'john@doe.com' }] }
      });
    });

    await clientPage.navigate();
    await expect(clientPage.clientListRows.first()).toBeVisible();
    await clientPage.searchInput.fill('John');
    await expect(page.locator('text=John Doe')).toBeVisible();
  });

  test('should create a new client', async ({ page }) => {
    await page.route('**/api/v1/clients', route => {
      route.fulfill({ status: 201, json: { id: 2, name: 'Jane Doe' } });
    });
    
    await clientPage.navigate();
    await clientPage.createClient('Jane Doe', 'jane@example.com', '123456789');
    // Verifica se aparece notificação de sucesso ou modais fecham
    await expect(page.locator('text=Salvar')).not.toBeVisible();
  });
});
