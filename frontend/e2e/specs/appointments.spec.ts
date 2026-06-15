import { test, expect } from '../fixtures/base.fixture';
import { AppointmentPage } from '../pages/AppointmentPage';

test.describe('Appointment Scheduling', () => {
  let apptPage: AppointmentPage;

  test.beforeEach(async ({ page, loginAs }) => {
    await loginAs('admin');
    apptPage = new AppointmentPage(page);
    
    await page.route('**/api/v1/appointments**', route => {
      route.fulfill({
        status: 200,
        json: { data: [] }
      });
    });
  });

  test('should open calendar view and create appointment', async ({ page }) => {
    await apptPage.navigate();
    await expect(apptPage.calendarGrid).toBeVisible();

    await page.route('**/api/v1/appointments', route => {
      route.fulfill({ status: 201 });
    });

    await apptPage.newAppointmentBtn.click();
    await apptPage.datePicker.fill('2026-06-20T10:00');
    await apptPage.saveBtn.click();
  });

  test('should handle scheduling conflicts gracefully', async ({ page }) => {
    await apptPage.navigate();
    await apptPage.newAppointmentBtn.click();
    
    // Simula conflito de API
    await page.route('**/api/v1/appointments', route => {
      route.fulfill({ status: 409, json: { message: 'Horário já reservado' } });
    });

    await apptPage.saveBtn.click();
    await expect(page.locator('text=Horário já reservado')).toBeVisible();
  });
});
