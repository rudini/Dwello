import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { When, Then } = createBdd(test);

// ============================================
// When steps
// ============================================

When('I open the apartments page', async ({ page }) => {
	await page.goto('/apartments');
	await page.waitForLoadState('networkidle');
});

When('I open the new apartment page', async ({ page }) => {
	await page.goto('/apartments/new');
	await page.waitForLoadState('networkidle');
});

When('I open the new apartment page with building {string}', async ({ page }, buildingId: string) => {
	await page.goto(`/apartments/new?building=${buildingId}`);
	await page.waitForLoadState('networkidle');
});

When('I submit the new apartment form', async ({ page }) => {
	await page.getByRole('button', { name: /Wohnung erstellen/ }).click();
	await page.waitForTimeout(300);
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

Then('I should see the building filter', async ({ page }) => {
	await expect(page.locator('select#building')).toBeVisible({ timeout: 10000 });
});

Then('I should see the apartment status filter', async ({ page }) => {
	await expect(page.locator('select#status')).toBeVisible({ timeout: 10000 });
});

Then('I should be on the new apartment page', async ({ page }) => {
	expect(page.url()).toContain('/apartments/new');
});

Then('I should see the building dropdown', async ({ page }) => {
	await expect(page.locator('select#building')).toBeVisible({ timeout: 10000 });
});

Then('the building dropdown should have all buildings', async ({ page }) => {
	const select = page.locator('select#building');
	const options = await select.locator('option').count();
	// Should have at least 4 buildings + 1 placeholder
	expect(options).toBeGreaterThanOrEqual(5);
});

Then('the building dropdown should be visible', async ({ page }) => {
	await expect(page.locator('select#building')).toBeVisible({ timeout: 10000 });
});

Then('the building field should be readonly', async ({ page }) => {
	const readonlyInput = page.locator('input#building[readonly]');
	await expect(readonlyInput).toBeVisible({ timeout: 10000 });
});

Then('the building field should not be readonly', async ({ page }) => {
	const readonlyInput = page.locator('input#building[readonly]');
	await expect(readonlyInput).toHaveCount(0);
});

Then('the building field should show {string}', async ({ page }, buildingName: string) => {
	const readonlyInput = page.locator('input#building[readonly]');
	await expect(readonlyInput).toHaveValue(buildingName, { timeout: 10000 });
});

Then('I should see a lock icon on the building field', async ({ page }) => {
	// Look for the lock icon (Material Symbol)
	const lockIcon = page.locator('text=lock').first();
	await expect(lockIcon).toBeVisible({ timeout: 10000 });
});

Then('the breadcrumb should show {string}', async ({ page }, text: string) => {
	const breadcrumb = page.locator('nav.flex.items-center.text-sm');
	await expect(breadcrumb.getByText(text)).toBeVisible({ timeout: 10000 });
});

Then('the cancel button should link to {string}', async ({ page }, href: string) => {
	const cancelButton = page.getByRole('link', { name: 'Abbrechen' });
	await expect(cancelButton).toHaveAttribute('href', href, { timeout: 10000 });
});

Then('I should see the floor dropdown', async ({ page }) => {
	await expect(page.locator('select#floor')).toBeVisible({ timeout: 10000 });
});

Then('I should see the apartment number input', async ({ page }) => {
	await expect(page.locator('input#addressUnit')).toBeVisible({ timeout: 10000 });
});

Then('I should see the size input', async ({ page }) => {
	await expect(page.locator('input#sizeM2')).toBeVisible({ timeout: 10000 });
});

Then('I should see the room count dropdown', async ({ page }) => {
	await expect(page.locator('select#roomCount')).toBeVisible({ timeout: 10000 });
});

Then('I should see the building validation error', async ({ page }) => {
	await expect(page.getByText('Bitte wählen Sie ein Gebäude aus')).toBeVisible({ timeout: 10000 });
});

Then('I should see the floor validation error', async ({ page }) => {
	await expect(page.getByText('Stockwerk ist erforderlich')).toBeVisible({ timeout: 10000 });
});

Then('I should see the apartment number validation error', async ({ page }) => {
	await expect(page.getByText('Wohnungsnummer ist erforderlich')).toBeVisible({ timeout: 10000 });
});
