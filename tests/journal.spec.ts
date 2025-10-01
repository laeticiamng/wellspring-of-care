import { test, expect } from '@playwright/test';

test.describe('Journal Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to journal page
    // Note: This assumes user is already authenticated or bypasses auth
    await page.goto('/journal');
  });

  test('should display journal page', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/journal|humeur|mood/i);
  });

  test('should show mood entry form', async ({ page }) => {
    // Look for new entry button or form
    const hasNewEntryButton = await page.locator('button:has-text("Nouvelle entrée"), button:has-text("New entry")').isVisible().catch(() => false);
    const hasForm = await page.locator('form').isVisible().catch(() => false);
    
    expect(hasNewEntryButton || hasForm).toBeTruthy();
  });

  test('should display mood history or empty state', async ({ page }) => {
    // Check if there's either a list of entries or an empty state message
    const hasList = await page.locator('[data-testid="mood-list"], .mood-entries').isVisible().catch(() => false);
    const hasEmptyState = await page.locator('text=/aucune entrée|no entries|empty/i').isVisible().catch(() => false);
    
    expect(hasList || hasEmptyState).toBeTruthy();
  });

  test('should allow mood selection', async ({ page }) => {
    // Look for mood selectors (buttons, emojis, etc.)
    const moodSelectors = page.locator('button[aria-label*="mood"], button[aria-label*="humeur"], [role="radiogroup"]');
    const count = await moodSelectors.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have navigation back to dashboard', async ({ page }) => {
    // Should have a way to navigate back
    const hasBackButton = await page.locator('button:has-text("Retour"), a[href="/dashboard"], a[href="/"]').isVisible().catch(() => false);
    
    expect(hasBackButton).toBeTruthy();
  });
});
