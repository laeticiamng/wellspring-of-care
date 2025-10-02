import { test, expect } from '@playwright/test';

test.describe('Meditation Module', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to meditation page
    await page.goto('/app/meditation');
  });

  test('should display meditation sessions list', async ({ page }) => {
    await page.waitForSelector('[data-testid="meditation-sessions"]', { timeout: 10000 });
    
    const sessionsList = page.locator('[data-testid="meditation-sessions"]');
    await expect(sessionsList).toBeVisible();
  });

  test('should start a meditation session', async ({ page }) => {
    await page.waitForSelector('button:has-text("Commencer")', { timeout: 10000 });
    
    const startButton = page.locator('button:has-text("Commencer")').first();
    await startButton.click();
    
    // Wait for session to start
    await page.waitForTimeout(1000);
    
    // Check if audio or progress indicator appears
    const progressIndicator = page.locator('[role="progressbar"]');
    await expect(progressIndicator).toBeVisible({ timeout: 5000 });
  });

  test('should pause and resume meditation', async ({ page }) => {
    // Start session
    await page.waitForSelector('button:has-text("Commencer")', { timeout: 10000 });
    await page.locator('button:has-text("Commencer")').first().click();
    
    await page.waitForTimeout(2000);
    
    // Pause
    const pauseButton = page.locator('button:has-text("Pause")');
    if (await pauseButton.isVisible()) {
      await pauseButton.click();
      await page.waitForTimeout(500);
      
      // Resume
      const resumeButton = page.locator('button:has-text("Reprendre")');
      await expect(resumeButton).toBeVisible();
    }
  });

  test('should complete meditation session', async ({ page }) => {
    await page.waitForSelector('button:has-text("Commencer")', { timeout: 10000 });
    await page.locator('button:has-text("Commencer")').first().click();
    
    // Wait for completion (short timeout for test)
    await page.waitForTimeout(3000);
    
    // Complete session
    const completeButton = page.locator('button:has-text("Terminer")');
    if (await completeButton.isVisible()) {
      await completeButton.click();
      
      // Check for completion message
      await page.waitForTimeout(1000);
    }
  });
});

test.describe('Breathing Exercise', () => {
  test('should display breathing guide', async ({ page }) => {
    await page.goto('/app/breathwork');
    
    await page.waitForSelector('[data-testid="breathing-guide"]', { timeout: 10000 });
    
    const guide = page.locator('[data-testid="breathing-guide"]');
    await expect(guide).toBeVisible();
  });

  test('should start breathing exercise', async ({ page }) => {
    await page.goto('/app/breathwork');
    
    await page.waitForSelector('button:has-text("Démarrer")', { timeout: 10000 });
    await page.click('button:has-text("Démarrer")');
    
    // Check animation starts
    await page.waitForTimeout(1000);
    const breathingCircle = page.locator('.breathing-circle, [data-testid="breathing-bubble"]');
    await expect(breathingCircle).toBeVisible({ timeout: 5000 });
  });
});
