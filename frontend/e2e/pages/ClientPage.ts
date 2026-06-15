import { Page, Locator } from '@playwright/test';

export class ClientPage {
  readonly page: Page;
  readonly createButton: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly saveButton: Locator;
  readonly searchInput: Locator;
  readonly clientListRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createButton = page.locator('button:has-text("Novo Cliente")');
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.saveButton = page.locator('button:has-text("Salvar")');
    this.searchInput = page.locator('input[placeholder*="Buscar"]');
    this.clientListRows = page.locator('tbody tr');
  }

  async navigate() {
    await this.page.goto('/clients');
  }

  async createClient(name: string, email: string, phone: string) {
    await this.createButton.click();
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.saveButton.click();
  }
}
