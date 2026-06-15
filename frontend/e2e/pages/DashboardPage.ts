import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly welcomeHeader: Locator;
  readonly quickActions: Locator;
  readonly revenueChart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeHeader = page.locator('h1:has-text("Dashboard")');
    this.quickActions = page.locator('.quick-actions-card');
    this.revenueChart = page.locator('.recharts-wrapper');
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }
}
