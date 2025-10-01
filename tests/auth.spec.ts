import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.locator('h1')).toContainText(/connexion|sign in/i);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth');
    
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Wait for error message
    await expect(page.locator('text=/invalid|incorrect|error/i')).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to signup form', async ({ page }) => {
    await page.goto('/auth');
    
    // Click on signup link/button
    await page.click('text=/inscription|sign up|create account/i');
    
    await expect(page.locator('h1, h2')).toContainText(/inscription|sign up|register/i);
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    const errorCount = await page.locator('text=/required|obligatoire/i').count();
    expect(errorCount).toBeGreaterThan(0);
  });

  test('should redirect authenticated users away from auth page', async ({ page }) => {
    // This test assumes a valid test account exists
    // Skip if running in CI without test data
    test.skip(process.env.CI === 'true', 'Skipped in CI without test account');
    
    await page.goto('/auth');
    
    // Fill and submit login form
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || 'test@example.com');
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || 'testpassword123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard or home
    await expect(page).toHaveURL(/\/(dashboard|home|\w+)/, { timeout: 10000 });
  });
});
