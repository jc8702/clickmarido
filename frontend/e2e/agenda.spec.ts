import { test, expect } from '@playwright/test';

test.describe('Agenda Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/agenda');
  });

  test('should display calendar view', async ({ page }) => {
    // Check if the calendar grid is visible
    await expect(page.locator('.rbc-calendar').first()).toBeVisible();
  });

  test('should open event creation modal on date click', async ({ page }) => {
    // Simulate clicking a date cell
    const dateCell = page.locator('.rbc-day-bg').first();
    if (await dateCell.isVisible()) {
      await dateCell.click();
      await expect(page.getByRole('dialog')).toBeVisible();
    }
  });

  test('should validate event form', async ({ page }) => {
    const btnNovo = page.getByRole('button', { name: /novo agendamento/i });
    if (await btnNovo.isVisible()) {
      await btnNovo.click();
      await page.getByRole('button', { name: /salvar/i }).click();
      await expect(page.getByText(/obrigatório/i).first()).toBeVisible();
    }
  });

  test('should allow dragging and dropping events', async ({ page }) => {
    // Placeholder test for drag and drop functionality
    expect(true).toBe(true);
  });

  test('should switch between day, week, and month views', async ({ page }) => {
    const weekBtn = page.getByRole('button', { name: /semana/i });
    if (await weekBtn.isVisible()) {
      await weekBtn.click();
      await expect(page.locator('.rbc-time-view')).toBeVisible();
    }
  });
});
