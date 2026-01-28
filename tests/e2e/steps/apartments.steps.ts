import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { When, Then } = createBdd(test);

// ============================================
// When steps
// ============================================

When('I open the apartments page', async ({ page }) => {
	await page.goto('/apartments');
	await page.waitForLoadState('domcontentloaded');
});

// ============================================
// Then steps
// ============================================

Then('I should see the apartments page', async ({ page }) => {
	await expect(page.getByTestId('apartments-page')).toBeVisible({ timeout: 10000 });
});

Then('I should see the apartments search input', async ({ page }) => {
	await expect(page.locator('input#search')).toBeVisible({ timeout: 10000 });
});

Then('I should see the apartment status filter', async ({ page }) => {
	await expect(page.locator('select#status')).toBeVisible({ timeout: 10000 });
});

Then('I should be on the new apartment page', async ({ page }) => {
	expect(page.url()).toContain('/apartments/new');
});
