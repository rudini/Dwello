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
	await expect(page.getByTestId('contracts-page')).toBeVisible({ timeout: 5000 });
});

Then('I should see the contracts search input', async ({ page }) => {
	await expect(page.locator('input#search')).toBeVisible({ timeout: 5000 });
});

// Note: 'I should see the building filter' step is defined in apartments.steps.ts

Then('I should see the status filter', async ({ page }) => {
	await expect(page.locator('select#status')).toBeVisible({ timeout: 5000 });
});

Then('I should be on the new contract page', async ({ page }) => {
	expect(page.url()).toContain('/contracts/new');
});

// ============================================
// Data loading verification steps
// ============================================

Then('I should see contracts in the list', async ({ page }) => {
	// Wait for contract cards/rows to be visible
	const contractLinks = page.locator('a[href^="/contracts/"]');
	await expect(contractLinks.first()).toBeVisible({ timeout: 5000 });
	const count = await contractLinks.count();
	expect(count).toBeGreaterThan(0);
});

Then('I should see contract tenant names', async ({ page }) => {
	// Check for known tenant names from test data
	const tenantNames = ['Hans Müller', 'Anna Schmidt', 'Pierre Dubois', 'Marco Bernasconi', 'Laura Keller'];
	let foundCount = 0;
	for (const name of tenantNames) {
		const count = await page.getByText(name).count();
		if (count > 0) foundCount++;
	}
	expect(foundCount).toBeGreaterThan(0);
});

Then('I should see contract building names', async ({ page }) => {
	// Check that building names are displayed
	const buildingNames = ['Musterhaus Zentrum', 'Alpenblick', 'Seepark Residenz'];
	let found = false;
	for (const name of buildingNames) {
		const count = await page.getByText(name).count();
		if (count > 0) {
			found = true;
			break;
		}
	}
	expect(found).toBe(true);
});

Then('I should see contract apartment numbers', async ({ page }) => {
	// Check for apartment number patterns like "1.01", "2.01", "A1", etc.
	await expect(page.getByText(/\d\.\d{2}|[A-Z]\d/).first()).toBeVisible({ timeout: 5000 });
});

Then('I should see at least one {string} contract status badge', async ({ page }, status: string) => {
	// Look for status badges - StatusBadge has green/gray background with text inside
	// Exclude option elements which also contain status text
	const statusBadge = page.locator('div').filter({ hasText: status }).filter({ has: page.locator('span.rounded-full') }).first();
	await expect(statusBadge).toBeVisible({ timeout: 5000 });
});
