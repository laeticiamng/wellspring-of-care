import { test, expect } from '@playwright/test';

test.describe('Module Progress Migration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should persist journal progress after refresh', async ({ page }) => {
    // Login
    await page.getByRole('link', { name: /connexion/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /connexion/i }).click();

    // Navigate to Journal
    await page.getByRole('link', { name: /journal/i }).click();
    
    // Create entry to gain XP
    await page.getByRole('button', { name: /nouvelle entrée/i }).click();
    await page.getByLabel(/titre/i).fill('Test Entry');
    await page.getByRole('textbox', { name: /contenu/i }).fill('Test content for XP');
    await page.getByRole('button', { name: /sauvegarder/i }).click();

    // Check initial level/XP
    const initialLevel = await page.textContent('[data-testid="user-level"]');
    const initialXP = await page.textContent('[data-testid="user-xp"]');

    // Refresh page
    await page.reload();

    // Verify level/XP persisted
    const persistedLevel = await page.textContent('[data-testid="user-level"]');
    const persistedXP = await page.textContent('[data-testid="user-xp"]');

    expect(persistedLevel).toBe(initialLevel);
    expect(persistedXP).toBe(initialXP);
  });

  test('should persist meditation progress across devices', async ({ page, context }) => {
    // Login on first device
    await page.getByRole('link', { name: /connexion/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /connexion/i }).click();

    // Complete meditation session
    await page.getByRole('link', { name: /méditation/i }).click();
    await page.getByRole('button', { name: /commencer/i }).click();
    
    // Wait for session completion
    await page.waitForTimeout(5000); // Simulate 5s meditation
    await page.getByRole('button', { name: /terminer/i }).click();

    const xpAfterSession = await page.textContent('[data-testid="user-xp"]');

    // Open new context (simulate second device)
    const newPage = await context.newPage();
    await newPage.goto('/');
    
    // Login on second device
    await newPage.getByRole('link', { name: /connexion/i }).click();
    await newPage.getByLabel(/email/i).fill('test@example.com');
    await newPage.getByLabel(/mot de passe/i).fill('password123');
    await newPage.getByRole('button', { name: /connexion/i }).click();

    // Navigate to Meditation
    await newPage.getByRole('link', { name: /méditation/i }).click();

    // Verify XP synced
    const syncedXP = await newPage.textContent('[data-testid="user-xp"]');
    expect(syncedXP).toBe(xpAfterSession);
  });

  test('should unlock items based on level', async ({ page }) => {
    // Login
    await page.getByRole('link', { name: /connexion/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /connexion/i }).click();

    // Navigate to MoodMixer
    await page.getByRole('link', { name: /mood mixer/i }).click();

    // Check initial locked items
    const lockedItems = await page.locator('[data-testid="locked-item"]').count();

    // Generate multiple mixes to gain XP and level up
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: /générer/i }).click();
      await page.waitForTimeout(2000); // Wait for generation
    }

    // Check if items unlocked
    const newLockedItems = await page.locator('[data-testid="locked-item"]').count();
    expect(newLockedItems).toBeLessThan(lockedItems);
  });

  test('should not lose data on localStorage clear', async ({ page }) => {
    // Login
    await page.getByRole('link', { name: /connexion/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /connexion/i }).click();

    // Navigate to Breathwork
    await page.getByRole('link', { name: /breathwork/i }).click();

    // Complete session
    await page.getByRole('button', { name: /commencer/i }).click();
    await page.waitForTimeout(10000); // Complete 10s session
    await page.getByRole('button', { name: /terminer/i }).click();

    const xpBefore = await page.textContent('[data-testid="user-xp"]');

    // Clear localStorage
    await page.evaluate(() => localStorage.clear());

    // Refresh page
    await page.reload();

    // Login again
    await page.getByRole('link', { name: /connexion/i }).click();
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/mot de passe/i).fill('password123');
    await page.getByRole('button', { name: /connexion/i }).click();

    // Navigate to Breathwork
    await page.getByRole('link', { name: /breathwork/i }).click();

    // Verify XP still present (from backend)
    const xpAfter = await page.textContent('[data-testid="user-xp"]');
    expect(xpAfter).toBe(xpBefore);
  });
});
