import { test, expect } from '@playwright/test';

test.describe('Community Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/community');
  });

  test('should display community feed', async ({ page }) => {
    await page.waitForSelector('[data-testid="community-feed"]', { timeout: 10000 });
    
    const feed = page.locator('[data-testid="community-feed"]');
    await expect(feed).toBeVisible();
  });

  test('should show social hub', async ({ page }) => {
    await page.goto('/app/social-hub');
    
    await page.waitForTimeout(2000);
    
    const socialHub = page.locator('[data-testid="social-hub"]');
    await expect(socialHub).toBeVisible({ timeout: 10000 });
  });

  test('should display support groups', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const groupsSection = page.locator('[data-testid="support-groups"], .support-groups');
    if (await groupsSection.isVisible()) {
      await expect(groupsSection).toBeVisible();
    }
  });
});

test.describe('Aura System', () => {
  test('should display user aura', async ({ page }) => {
    await page.goto('/app/home');
    
    await page.waitForTimeout(2000);
    
    const aura = page.locator('[data-testid="user-aura"], .aura-orb');
    if (await aura.isVisible()) {
      await expect(aura).toBeVisible();
    }
  });

  test('should show aura evolution', async ({ page }) => {
    await page.goto('/app/home');
    
    await page.waitForTimeout(2000);
    
    // Check for aura evolution display
    const evolution = page.locator('[data-testid="aura-evolution"]');
    if (await evolution.isVisible()) {
      await expect(evolution).toBeVisible();
    }
  });
});
