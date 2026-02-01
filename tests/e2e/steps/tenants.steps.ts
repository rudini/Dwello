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

// ============================================
// Data loading verification steps
// ============================================

Then('I should see tenants in the list', async ({ page }) => {
	// Wait for tenant cards/rows to be visible
	const tenantLinks = page.locator('a[href^="/tenants/"]');
	await expect(tenantLinks.first()).toBeVisible({ timeout: 10000 });
	const count = await tenantLinks.count();
	expect(count).toBeGreaterThan(0);
});

Then('I should see tenant names', async ({ page }) => {
	// Check for known tenant names from test data
	const tenantNames = ['Hans Müller', 'Anna Schmidt', 'Pierre Dubois', 'Marco Bernasconi', 'Laura Keller'];
	let foundCount = 0;
	for (const name of tenantNames) {
		const count = await page.getByText(name).count();
		if (count > 0) foundCount++;
	}
	expect(foundCount).toBeGreaterThan(0);
});

Then('I should see tenant email addresses', async ({ page }) => {
	// Check for email pattern
	await expect(page.getByText(/@example\.ch/).first()).toBeVisible({ timeout: 10000 });
});

Then('I should see tenant apartment information', async ({ page }) => {
	// Check for "Wohnung" followed by apartment number
	await expect(page.getByText(/Wohnung \d/).first()).toBeVisible({ timeout: 10000 });
});
