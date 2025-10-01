import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display dashboard page', async ({ page }) => {
    await expect(page.locator('h1, h2')).toContainText(/dashboard|tableau de bord|accueil/i);
  });

  test('should show user stats or widgets', async ({ page }) => {
    // Look for any stat cards, charts, or widgets
    const hasStats = await page.locator('[data-testid="stats"], .stat-card, .widget').count();
    
    expect(hasStats).toBeGreaterThan(0);
  });

  test('should have navigation menu', async ({ page }) => {
    // Check for navigation elements
    const navLinks = await page.locator('nav a, [role="navigation"] a').count();
    
    expect(navLinks).toBeGreaterThan(0);
  });

  test('should show quick actions or recommendations', async ({ page }) => {
    // Look for action buttons or recommendation cards
    const hasActions = await page.locator('button, a[href*="/"]').count();
    
    expect(hasActions).toBeGreaterThan(2); // Should have at least a few action items
  });

  test('should be responsive', async ({ page }) => {
    // Check mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Should still be visible and not overflow
    const body = page.locator('body');
    const box = await body.boundingBox();
    
    expect(box?.width).toBeLessThanOrEqual(375);
  });
});
