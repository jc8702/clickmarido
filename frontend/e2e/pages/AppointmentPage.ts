import { Page, Locator } from '@playwright/test';

export class AppointmentPage {
  readonly page: Page;
  readonly calendarGrid: Locator;
  readonly newAppointmentBtn: Locator;
  readonly clientSelect: Locator;
  readonly datePicker: Locator;
  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.calendarGrid = page.locator('.rbc-calendar');
    this.newAppointmentBtn = page.locator('button:has-text("Agendar")');
    this.clientSelect = page.locator('select[name="clientId"]');
    this.datePicker = page.locator('input[type="datetime-local"]');
    this.saveBtn = page.locator('button:has-text("Confirmar")');
  }

  async navigate() {
    await this.page.goto('/appointments');
  }
}
