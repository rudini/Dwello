import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { When, Then } = createBdd(test);

// ============================================
// When steps
// ============================================

When('I open the tenants page', async ({ page }) => {
	await page.goto('/tenants');
	await page.waitForLoadState('domcontentloaded');
});

// ============================================
// Then steps
// ============================================

Then('I should see the tenants page', async ({ page }) => {
	await expect(page.getByTestId('tenants-page')).toBeVisible({ timeout: 10000 });
});

Then('I should see the tenants search input', async ({ page }) => {
	await expect(page.locator('input#search')).toBeVisible({ timeout: 10000 });
});

Then('I should see the tenant status filter', async ({ page }) => {
	await expect(page.locator('select#status')).toBeVisible({ timeout: 10000 });
});

Then('I should be on the new tenant page', async ({ page }) => {
	expect(page.url()).toContain('/tenants/new');
});
