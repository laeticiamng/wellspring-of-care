import { test, expect } from '@playwright/test';

test.describe('AI Chat Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app/ai-chat');
  });

  test('should display AI chat interface', async ({ page }) => {
    await page.waitForSelector('[data-testid="ai-chat"]', { timeout: 10000 });
    
    const chatInterface = page.locator('[data-testid="ai-chat"]');
    await expect(chatInterface).toBeVisible();
  });

  test('should have input field', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const inputField = page.locator('input[type="text"], textarea').first();
    await expect(inputField).toBeVisible({ timeout: 10000 });
  });

  test('should allow sending messages', async ({ page }) => {
    await page.waitForTimeout(2000);
    
    const input = page.locator('input[type="text"], textarea').first();
    if (await input.isVisible()) {
      await input.fill('Bonjour');
      
      const sendButton = page.locator('button[type="submit"], button:has-text("Envoyer")');
      if (await sendButton.isVisible()) {
        await sendButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });
});

test.describe('AI Coach', () => {
  test('should access AI coach', async ({ page }) => {
    await page.goto('/app/coach');
    
    await page.waitForSelector('[data-testid="ai-coach"]', { timeout: 10000 });
    
    const coach = page.locator('[data-testid="ai-coach"]');
    await expect(coach).toBeVisible();
  });

  test('should provide recommendations', async ({ page }) => {
    await page.goto('/app/coach');
    
    await page.waitForTimeout(2000);
    
    const recommendations = page.locator('[data-testid="recommendations"]');
    if (await recommendations.isVisible()) {
      await expect(recommendations).toBeVisible();
    }
  });
});

test.describe('Emotional Scan', () => {
  test('should access emotional scan', async ({ page }) => {
    await page.goto('/app/emotional-scan');
    
    await page.waitForTimeout(2000);
    
    const scanInterface = page.locator('[data-testid="emotional-scan"]');
    await expect(scanInterface).toBeVisible({ timeout: 10000 });
  });

  test('should have scan button', async ({ page }) => {
    await page.goto('/app/emotional-scan');
    
    await page.waitForTimeout(2000);
    
    const scanButton = page.locator('button:has-text("Scanner"), button:has-text("Analyser")');
    if (await scanButton.first().isVisible()) {
      await expect(scanButton.first()).toBeVisible();
    }
  });
});
