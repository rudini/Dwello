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

When('I open the new apartment page', async ({ page }) => {
	await page.goto('/apartments/new');
	await page.waitForLoadState('domcontentloaded');
});

When('I open the new apartment page with building {string}', async ({ page }, buildingId: string) => {
	await page.goto(`/apartments/new?building=${buildingId}`);
	await page.waitForLoadState('domcontentloaded');
});

When('I submit the new apartment form', async ({ page }) => {
	await page.getByRole('button', { name: /Wohnung erstellen/ }).click();
	await page.waitForTimeout(300);
});

// ============================================
// Then steps
// ============================================

Then('I should see the apartments page', async ({ page }) => {
	await expect(page.getByTestId('apartments-page')).toBeVisible({ timeout: 5000 });
});

Then('I should see the apartments search input', async ({ page }) => {
	await expect(page.locator('input#search')).toBeVisible({ timeout: 5000 });
});

Then('I should see the building filter', async ({ page }) => {
	await expect(page.locator('select#building')).toBeVisible({ timeout: 5000 });
});

Then('I should see the apartment status filter', async ({ page }) => {
	await expect(page.locator('select#status')).toBeVisible({ timeout: 5000 });
});

Then('I should be on the new apartment page', async ({ page }) => {
	expect(page.url()).toContain('/apartments/new');
});

Then('I should see the building dropdown', async ({ page }) => {
	await expect(page.locator('select#building')).toBeVisible({ timeout: 5000 });
});

Then('the building dropdown should have all buildings', async ({ page }) => {
	const select = page.locator('select#building');
	await expect(select).toBeVisible({ timeout: 5000 });
	const options = await select.locator('option').count();
	// Should have at least 3 buildings + 1 placeholder = 4 options
	expect(options).toBeGreaterThanOrEqual(4);
});

Then('the building dropdown should be visible', async ({ page }) => {
	await expect(page.locator('select#building')).toBeVisible({ timeout: 5000 });
});

Then('the building field should be readonly', async ({ page }) => {
	const readonlyInput = page.locator('input#building[readonly]');
	await expect(readonlyInput).toBeVisible({ timeout: 5000 });
});

Then('the building field should not be readonly', async ({ page }) => {
	const readonlyInput = page.locator('input#building[readonly]');
	await expect(readonlyInput).toHaveCount(0);
});

Then('the building field should show {string}', async ({ page }, buildingName: string) => {
	const readonlyInput = page.locator('input#building[readonly]');
	await expect(readonlyInput).toHaveValue(buildingName, { timeout: 5000 });
});

Then('I should see a lock icon on the building field', async ({ page }) => {
	// Look for the lock icon (Material Symbol)
	const lockIcon = page.locator('text=lock').first();
	await expect(lockIcon).toBeVisible({ timeout: 5000 });
});

Then('the breadcrumb should show {string}', async ({ page }, text: string) => {
	const breadcrumb = page.locator('nav.flex.items-center.text-sm');
	await expect(breadcrumb.getByText(text)).toBeVisible({ timeout: 5000 });
});

Then('the cancel button should link to {string}', async ({ page }, href: string) => {
	const cancelButton = page.getByRole('link', { name: 'Abbrechen' });
	await expect(cancelButton).toHaveAttribute('href', href, { timeout: 5000 });
});

Then('I should see the floor dropdown', async ({ page }) => {
	await expect(page.locator('select#floor')).toBeVisible({ timeout: 5000 });
});

Then('I should see the apartment number input', async ({ page }) => {
	await expect(page.locator('input#addressUnit')).toBeVisible({ timeout: 5000 });
});

Then('I should see the size input', async ({ page }) => {
	await expect(page.locator('input#sizeM2')).toBeVisible({ timeout: 5000 });
});

Then('I should see the room count dropdown', async ({ page }) => {
	await expect(page.locator('select#roomCount')).toBeVisible({ timeout: 5000 });
});

Then('I should see the building validation error', async ({ page }) => {
	await expect(page.getByText('Bitte wählen Sie ein Gebäude aus')).toBeVisible({ timeout: 5000 });
});

Then('I should see the floor validation error', async ({ page }) => {
	await expect(page.getByText('Stockwerk ist erforderlich')).toBeVisible({ timeout: 5000 });
});

Then('I should see the apartment number validation error', async ({ page }) => {
	await expect(page.getByText('Wohnungsnummer ist erforderlich')).toBeVisible({ timeout: 5000 });
});

// ============================================
// Data loading verification steps
// ============================================

Then('I should see apartments in the list', async ({ page }) => {
	// Wait for apartment cards to be visible
	const apartmentLinks = page.locator('a[href^="/apartments/"]').filter({ hasText: 'Wohnung' });
	await expect(apartmentLinks.first()).toBeVisible({ timeout: 5000 });
	const count = await apartmentLinks.count();
	expect(count).toBeGreaterThan(0);
});

Then('I should see apartment building names', async ({ page }) => {
	// Check that building names are displayed (from API's buildingName field)
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

Then('I should see apartment occupancy status badges', async ({ page }) => {
	// Check for occupancy status badges (inside apartment cards, not select options)
	const apartmentCards = page.locator('a[href^="/apartments/"]');
	const vermietedBadge = apartmentCards.getByText('Vermietet').first();
	const leerBadge = apartmentCards.getByText('Leer').first();
	// At least one of these should be visible
	const vermietedVisible = await vermietedBadge.isVisible().catch(() => false);
	const leerVisible = await leerBadge.isVisible().catch(() => false);
	expect(vermietedVisible || leerVisible).toBe(true);
});

Then('I should see at least one {string} badge', async ({ page }, status: string) => {
	// Look for badges inside apartment cards, not in select dropdowns
	const apartmentCards = page.locator('a[href^="/apartments/"]');
	await expect(apartmentCards.getByText(status).first()).toBeVisible({ timeout: 5000 });
});

// ============================================
// Duplicate apartment number check steps
// ============================================

When('I select building {string} from the dropdown', async ({ page }, buildingName: string) => {
	const select = page.locator('select#building');
	await select.selectOption({ label: buildingName });
});

When('I enter apartment number {string}', async ({ page }, number: string) => {
	const input = page.locator('input#addressUnit');
	await input.fill(number);
});

When('I wait for the duplicate check', async ({ page }) => {
	// Wait for the debounce (500ms) plus API call
	await page.waitForTimeout(800);
	// Wait for any loading spinner to disappear
	const spinner = page.getByText('Prüfe Verfügbarkeit...');
	if (await spinner.isVisible().catch(() => false)) {
		await expect(spinner).toBeHidden({ timeout: 5000 });
	}
});

Then('I should see the duplicate apartment warning', async ({ page }) => {
	await expect(page.getByText('Wohnungsnummer bereits vergeben')).toBeVisible({ timeout: 5000 });
});

Then('I should not see the duplicate apartment warning', async ({ page }) => {
	await expect(page.getByText('Wohnungsnummer bereits vergeben')).toBeHidden({ timeout: 5000 });
});

Then('the warning should mention apartment number {string}', async ({ page }, number: string) => {
	await expect(page.getByText(`Die Wohnungsnummer "${number}" existiert bereits`)).toBeVisible({ timeout: 5000 });
});
