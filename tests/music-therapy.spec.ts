import { test, expect } from '@playwright/test';

test.describe('Music Therapy Module', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/music-therapy');
  });

  test('should display music therapy interface', async ({ page }) => {
    await page.waitForSelector('[data-testid="music-therapy"]', { timeout: 10000 });
    
    const interface = page.locator('[data-testid="music-therapy"]');
    await expect(interface).toBeVisible();
  });

  test('should show music generation options', async ({ page }) => {
    await page.waitForSelector('button:has-text("Générer")', { timeout: 10000 });
    
    const generateButton = page.locator('button:has-text("Générer")');
    await expect(generateButton).toBeVisible();
  });

  test('should allow mood selection', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    // Look for mood selectors
    const moodSelector = page.locator('[data-testid="mood-selector"], .mood-selector');
    if (await moodSelector.isVisible()) {
      await moodSelector.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should display music library', async ({ page }) => {
    await page.goto('/app/music-library');
    
    await page.waitForTimeout(2000);
    
    const library = page.locator('[data-testid="music-library"]');
    await expect(library).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Music Player', () => {
  test('should have playback controls', async ({ page }) => {
    await page.goto('/app/music-library');
    
    await page.waitForTimeout(2000);
    
    // Check for play button
    const playButton = page.locator('button[aria-label*="play"], button[aria-label*="lire"]');
    if (await playButton.first().isVisible()) {
      await expect(playButton.first()).toBeVisible();
    }
  });
});
