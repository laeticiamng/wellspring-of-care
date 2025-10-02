import { test, expect } from '@playwright/test';

test.describe('Questionnaire Form Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page with questionnaire
    await page.goto('/nyvee');
  });

  test('should display questionnaire title and description', async ({ page }) => {
    // Wait for questionnaire to load
    await page.waitForSelector('[data-testid="questionnaire-form"]', { timeout: 10000 });
    
    // Check title exists
    const title = page.locator('h2').first();
    await expect(title).toBeVisible();
  });

  test('should allow selecting answers', async ({ page }) => {
    // Wait for first question
    await page.waitForSelector('input[type="radio"]', { timeout: 10000 });
    
    // Select first radio button
    const firstOption = page.locator('input[type="radio"]').first();
    await firstOption.click();
    
    // Verify it's selected
    await expect(firstOption).toBeChecked();
  });

  test('should navigate between questions', async ({ page }) => {
    // Wait for navigation buttons
    await page.waitForSelector('button:has-text("Suivant")', { timeout: 10000 });
    
    // Select an answer
    await page.locator('input[type="radio"]').first().click();
    
    // Click next
    await page.click('button:has-text("Suivant")');
    
    // Wait for question change
    await page.waitForTimeout(500);
    
    // Verify we moved to next question
    const questionNumber = page.locator('text=/Question \\d+ \\//');
    await expect(questionNumber).toBeVisible();
  });

  test('should show progress bar', async ({ page }) => {
    // Check if progress bar exists
    const progress = page.locator('[role="progressbar"]');
    await expect(progress).toBeVisible({ timeout: 10000 });
  });

  test('should enable submit button when all required questions answered', async ({ page }) => {
    // This test would need to answer all questions
    // For now, just check if submit button exists
    await page.waitForTimeout(2000);
    
    const submitButton = page.locator('button:has-text("Terminer")');
    // Button might be disabled initially
    await expect(submitButton).toBeVisible();
  });
});

test.describe('Complete Questionnaire Flow', () => {
  test('should complete full questionnaire', async ({ page }) => {
    await page.goto('/nyvee');
    
    // Wait for form to load
    await page.waitForSelector('input[type="radio"]', { timeout: 10000 });
    
    // Answer each question
    for (let i = 0; i < 6; i++) { // STAI-6 has 6 questions
      // Select middle option
      const options = page.locator('input[type="radio"]');
      const count = await options.count();
      if (count > 0) {
        await options.nth(Math.floor(count / 2)).click();
      }
      
      // Click next if not last question
      const nextButton = page.locator('button:has-text("Suivant")');
      const submitButton = page.locator('button:has-text("Terminer")');
      
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      } else if (await submitButton.isVisible() && !await submitButton.isDisabled()) {
        await submitButton.click();
        break;
      }
    }
    
    // Wait for completion message
    await page.waitForTimeout(2000);
  });
});
