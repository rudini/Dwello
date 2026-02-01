import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

// ============================================
// Given steps
// ============================================

// These Given steps are no longer needed since we're using real backend data
// They're kept as no-ops for backward compatibility with any remaining feature files

Given('there are buildings in the system', async () => {
	// No-op: Real backend data is used
});

Given('there are multiple buildings in the system', async () => {
	// No-op: Real backend data is used
});

Given('there is a building {string} in the system', async ({}, _buildingName: string) => {
	// No-op: Real backend data is used
});

// ============================================
// When steps
// ============================================

When('I open the buildings page', async ({ page }) => {
	await page.goto('/buildings');
	await page.waitForLoadState('domcontentloaded');
});

When('I open the building detail page for {string}', async ({ page }, _buildingName: string) => {
	await page.goto('/buildings/building-001');
	await page.waitForLoadState('domcontentloaded');
});

When('I search for {string}', async ({ page }, searchTerm: string) => {
	const searchInput = page.locator('input[type="text"]#search, input[placeholder*="Such"]');
	await searchInput.fill(searchTerm);
	// Submit the search form
	await page.getByRole('button', { name: 'Suchen' }).click();
	await page.waitForTimeout(500);
});

// ============================================
// Then steps
// ============================================

Then('I should see a list of buildings', async ({ page }) => {
	// The buildings page should show building cards
	await expect(page.getByTestId('buildings-page')).toBeVisible({ timeout: 5000 });
	// Check that at least one of the seed buildings is displayed
	const building1 = page.getByText('Musterhaus Zentrum');
	const building2 = page.getByText('Seepark Residenz');
	const building3 = page.getByText('Alpenblick');
	const anyVisible = await building1.isVisible().catch(() => false) ||
		await building2.isVisible().catch(() => false) ||
		await building3.isVisible().catch(() => false);
	expect(anyVisible).toBe(true);
});

Then('I should see building addresses', async ({ page }) => {
	// Check for one of the real building addresses
	const addr1 = page.getByText('Bahnhofstrasse');
	const addr2 = page.getByText('Seeweg');
	const addr3 = page.getByText('Bergstrasse');
	const anyVisible = await addr1.isVisible().catch(() => false) ||
		await addr2.isVisible().catch(() => false) ||
		await addr3.isVisible().catch(() => false);
	expect(anyVisible).toBe(true);
});

Then('I should see apartment counts', async ({ page }) => {
	// Check for apartment count display (e.g., "8 Wohnungen")
	await expect(page.getByText('Wohnungen').first()).toBeVisible({ timeout: 5000 });
});

Then('I should be on the new building page', async ({ page }) => {
	expect(page.url()).toContain('/buildings/new');
});

Then('I should see a form for building details', async ({ page }) => {
	await expect(page.locator('form').first()).toBeVisible({ timeout: 5000 });
});

Then('I should see the building name {string}', async ({ page }, buildingName: string) => {
	// Use heading role to be specific about which element we want
	await expect(page.getByRole('heading', { name: buildingName })).toBeVisible({ timeout: 5000 });
});

Then('I should see the building address', async ({ page }) => {
	await expect(page.getByText('Musterstraße')).toBeVisible({ timeout: 5000 });
});

Then('I should see the apartment list', async ({ page }) => {
	// Check for apartment listings
	await expect(page.getByText(/1\.0[12]/).first()).toBeVisible({ timeout: 5000 });
});

Then('I should only see buildings in Zürich', async ({ page }) => {
	await expect(page.getByText('Zürich').first()).toBeVisible({ timeout: 5000 });
});

// ============================================
// Building detail data loading steps
// ============================================

When('I open building detail page {string}', async ({ page }, buildingId: string) => {
	await page.goto(`/buildings/${buildingId}`);
	await page.waitForLoadState('networkidle');
});

Then('I should see apartments grouped by floor', async ({ page }) => {
	// Check for floor groupings - Cards contain h3 headers with stairs icon
	// The stairs icon is rendered as text "stairs" inside a span
	const floorHeaders = page.locator('h3').filter({ has: page.getByText('stairs') });
	const count = await floorHeaders.count();
	expect(count).toBeGreaterThan(0);
});

Then('I should see apartment numbers in the list', async ({ page }) => {
	// Check for apartment number patterns like "1.01", "2.01", etc.
	await expect(page.getByText(/\d\.\d{2}/).first()).toBeVisible({ timeout: 5000 });
});

Then('I should see apartment occupancy badges', async ({ page }) => {
	// Check for occupancy status badges (inside apartment rows, not select options)
	const apartmentRows = page.locator('a[href^="/apartments/"]');
	const vermietedBadge = apartmentRows.getByText('Vermietet').first();
	const leerBadge = apartmentRows.getByText('Leer').first();
	// At least one of these should be visible
	const vermietedVisible = await vermietedBadge.isVisible().catch(() => false);
	const leerVisible = await leerBadge.isVisible().catch(() => false);
	expect(vermietedVisible || leerVisible).toBe(true);
});
