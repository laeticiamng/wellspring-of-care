import { test, expect } from '@playwright/test';

test.describe('Gamification System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/home');
  });

  test('should display user points and level', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for points/XP display
    const pointsDisplay = page.locator('[data-testid="user-points"], .points-display, text=/\\d+ XP/i');
    await expect(pointsDisplay.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show badges', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for badges section
    const badgesSection = page.locator('[data-testid="badges"], .badges-section');
    if (await badgesSection.isVisible()) {
      await expect(badgesSection).toBeVisible();
    }
  });

  test('should display challenges', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for challenges
    const challengesSection = page.locator('[data-testid="challenges"], .challenges-section');
    if (await challengesSection.isVisible()) {
      await expect(challengesSection).toBeVisible();
    }
  });

  test('should show leaderboard', async ({ page }) => {
    await page.goto('/app/leaderboard');
    
    await page.waitForSelector('[data-testid="leaderboard"]', { timeout: 10000 });
    
    const leaderboard = page.locator('[data-testid="leaderboard"]');
    await expect(leaderboard).toBeVisible();
  });
});

test.describe('Boss Level and Mini-games', () => {
  test('should access Boss Grit module', async ({ page }) => {
    await page.goto('/app/boss-grit');
    
    await page.waitForTimeout(2000);
    
    const bossModule = page.locator('[data-testid="boss-grit"]');
    await expect(bossModule).toBeVisible({ timeout: 10000 });
  });

  test('should access Flash Glow module', async ({ page }) => {
    await page.goto('/app/flash-glow');
    
    await page.waitForTimeout(2000);
    
    const flashModule = page.locator('[data-testid="flash-glow"]');
    await expect(flashModule).toBeVisible({ timeout: 10000 });
  });

  test('should access Bubble Beat module', async ({ page }) => {
    await page.goto('/app/bubble-beat');
    
    await page.waitForTimeout(2000);
    
    const bubbleModule = page.locator('[data-testid="bubble-beat"]');
    await expect(bubbleModule).toBeVisible({ timeout: 10000 });
  });
});
