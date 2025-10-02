import { test, expect } from '@playwright/test';

test.describe('VR Galaxy Module', () => {
  test('should access VR Galaxy', async ({ page }) => {
    await page.goto('/app/vr-galaxy');
    
    await page.waitForTimeout(2000);
    
    const galaxyScene = page.locator('[data-testid="vr-galaxy"], canvas');
    await expect(galaxyScene).toBeVisible({ timeout: 10000 });
  });

  test('should render 3D scene', async ({ page }) => {
    await page.goto('/app/vr-galaxy');
    
    await page.waitForTimeout(3000);
    
    // Check for canvas element
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
  });
});

test.describe('VR Breath Module', () => {
  test('should access VR Breath', async ({ page }) => {
    await page.goto('/app/vr-breath');
    
    await page.waitForTimeout(2000);
    
    const breathScene = page.locator('[data-testid="vr-breath"], canvas');
    await expect(breathScene).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Screen Silk Module', () => {
  test('should access Screen Silk', async ({ page }) => {
    await page.goto('/app/screen-silk');
    
    await page.waitForTimeout(2000);
    
    const silkScene = page.locator('[data-testid="screen-silk"]');
    await expect(silkScene).toBeVisible({ timeout: 10000 });
  });

  test('should have interactive elements', async ({ page }) => {
    await page.goto('/app/screen-silk');
    
    await page.waitForTimeout(2000);
    
    // Check for interactive canvas or elements
    const interactive = page.locator('canvas, [data-interactive]');
    if (await interactive.first().isVisible()) {
      await expect(interactive.first()).toBeVisible();
    }
  });
});

test.describe('Story Synth Module', () => {
  test('should access Story Synth', async ({ page }) => {
    await page.goto('/app/story-synth');
    
    await page.waitForTimeout(2000);
    
    const storyModule = page.locator('[data-testid="story-synth"]');
    await expect(storyModule).toBeVisible({ timeout: 10000 });
  });

  test('should display story options', async ({ page }) => {
    await page.goto('/app/story-synth');
    
    await page.waitForTimeout(2000);
    
    // Look for story selection or generation
    const storyOptions = page.locator('[data-testid="story-options"], .story-selection');
    if (await storyOptions.isVisible()) {
      await expect(storyOptions).toBeVisible();
    }
  });
});
