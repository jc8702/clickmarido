import { Page, Locator } from '@playwright/test';

export class FinancialPage {
  readonly page: Page;
  readonly newQuoteBtn: Locator;
  readonly convertToOrderBtn: Locator;
  readonly statusBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newQuoteBtn = page.locator('button:has-text("Nova Cotação")');
    this.convertToOrderBtn = page.locator('button:has-text("Aprovar Cotação")');
    this.statusBadge = page.locator('.badge-status');
  }

  async navigateToQuotes() {
    await this.page.goto('/quotes');
  }
}
