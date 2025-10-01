import { test, expect } from '@playwright/test';

test.describe('Settings & Privacy', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/settings');
  });

  test('should display settings page', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/settings|paramètres|réglages/i);
  });

  test('should show privacy section', async ({ page }) => {
    // Look for privacy/confidentialité tab or section
    const privacySection = page.locator('text=/privacy|confidentialité/i');
    await expect(privacySection).toBeVisible();
  });

  test('should have data export option', async ({ page }) => {
    // Look for export data button
    const exportButton = page.locator('button:has-text("Exporter"), button:has-text("Export")');
    
    const count = await exportButton.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have account deletion option', async ({ page }) => {
    // Look for delete account button
    const deleteButton = page.locator('button:has-text("Supprimer"), button:has-text("Delete")');
    
    const count = await deleteButton.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show data export dialog', async ({ page }) => {
    // Click export button
    const exportButton = page.locator('button:has-text("Exporter"), button:has-text("Export")').first();
    await exportButton.click();
    
    // Dialog should appear
    await expect(page.locator('[role="dialog"], .dialog')).toBeVisible({ timeout: 3000 });
  });

  test('should have profile editing capabilities', async ({ page }) => {
    // Look for input fields for profile editing
    const inputs = await page.locator('input[type="text"], input[type="email"], textarea').count();
    
    expect(inputs).toBeGreaterThan(0);
  });
});
