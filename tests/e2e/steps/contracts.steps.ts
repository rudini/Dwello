import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { When, Then } = createBdd(test);

// ============================================
// When steps
// ============================================

When('I open the contracts page', async ({ page }) => {
	await page.goto('/contracts');
	await page.waitForLoadState('domcontentloaded');
});

// ============================================
// Then steps
// ============================================

Then('I should see the contracts page', async ({ page }) => {
	await expect(page.getByTestId('contracts-page')).toBeVisible({ timeout: 10000 });
});

Then('I should see the contracts search input', async ({ page }) => {
	await expect(page.locator('input#search')).toBeVisible({ timeout: 10000 });
});

// Note: 'I should see the building filter' step is defined in apartments.steps.ts

Then('I should see the status filter', async ({ page }) => {
	await expect(page.locator('select#status')).toBeVisible({ timeout: 10000 });
});

Then('I should be on the new contract page', async ({ page }) => {
	expect(page.url()).toContain('/contracts/new');
});
