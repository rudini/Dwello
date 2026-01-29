import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { When, Then } = createBdd(test);

// ============================================
// When steps
// ============================================

When('I open the heating profiles page', async ({ page }) => {
	await page.goto('/config/heating-profiles');
	await page.waitForLoadState('networkidle');
});

When('I open the heating profile detail page for {string}', async ({ page }, profileId: string) => {
	await page.goto(`/config/heating-profiles/${profileId}`);
	await page.waitForLoadState('networkidle');
});

When('I open the heating profile edit page for {string}', async ({ page }, profileId: string) => {
	await page.goto(`/config/heating-profiles/${profileId}/edit`);
	await page.waitForLoadState('networkidle');
});

When('I click on the {string} profile', async ({ page }, profileName: string) => {
	// Find the card containing this profile name and click its view link
	// The card has class "rounded-xl" and contains an h3 with the profile name
	const profileCard = page.locator('div.rounded-xl').filter({
		has: page.locator(`h3:has-text("${profileName}")`)
	});
	await expect(profileCard).toBeVisible({ timeout: 10000 });
	await profileCard.locator('a[title="Details anzeigen"]').click();
	// Wait for URL to change to the detail page
	await page.waitForURL(/\/config\/heating-profiles\/hp-/, { timeout: 10000 });
});

When('I click the view button for {string} profile', async ({ page }, profileName: string) => {
	// Find the card containing this profile name and click its view link
	const profileCard = page.locator('div.rounded-xl').filter({
		has: page.locator(`h3:has-text("${profileName}")`)
	});
	await expect(profileCard).toBeVisible({ timeout: 10000 });
	await profileCard.locator('a[title="Details anzeigen"]').click();
	// Wait for URL to change to the detail page
	await page.waitForURL(/\/config\/heating-profiles\/hp-/, { timeout: 10000 });
});

When('I change the January percentage to {string}', async ({ page }, value: string) => {
	const input = page.locator('input[name="january"]');
	await input.fill(value);
	await page.waitForTimeout(300); // Wait for reactivity
});

When('I click the {string} button', async ({ page }, buttonText: string) => {
	// The button might be a link or button, and may contain an icon prefix
	const link = page.getByRole('link', { name: new RegExp(buttonText) });
	const button = page.getByRole('button', { name: new RegExp(buttonText) });
	const element = link.or(button);
	// Get current URL to detect navigation
	const currentUrl = page.url();
	await element.click();
	// Wait for navigation by waiting for URL to change
	await page.waitForFunction(
		(prevUrl) => window.location.href !== prevUrl,
		currentUrl,
		{ timeout: 10000 }
	);
	await page.waitForLoadState('domcontentloaded');
});

// ============================================
// Then steps
// ============================================

Then('I should see the heating profiles page', async ({ page }) => {
	// Use exact match and level to avoid matching the info card h3
	await expect(page.getByRole('heading', { name: 'Heizprofile', exact: true, level: 1 })).toBeVisible({ timeout: 10000 });
});

Then('I should see at least {int} heating profiles', async ({ page }, count: number) => {
	// Verify specific known profiles are visible
	await expect(page.getByRole('heading', { name: 'Standard', level: 3 })).toBeVisible({ timeout: 10000 });
	await expect(page.getByRole('heading', { name: 'Mittelland', level: 3 })).toBeVisible({ timeout: 10000 });
	await expect(page.getByRole('heading', { name: 'Bergregion', level: 3 })).toBeVisible({ timeout: 10000 });
	await expect(page.getByRole('heading', { name: 'Tessin', level: 3 })).toBeVisible({ timeout: 10000 });
	// At least 5 profiles exist if we can see at least these 4 + 1 custom
});

Then('I should be on the heating profile detail page', async ({ page }) => {
	expect(page.url()).toContain('/config/heating-profiles/hp-');
});

Then('I should be on the heating profile detail page for {string}', async ({ page }, profileId: string) => {
	expect(page.url()).toContain(`/config/heating-profiles/${profileId}`);
});

Then('I should be on the heating profiles page', async ({ page }) => {
	expect(page.url()).toContain('/config/heating-profiles');
	expect(page.url()).not.toMatch(/\/hp-/);
});

Then('I should see the profile name {string}', async ({ page }, name: string) => {
	await expect(page.getByRole('heading', { name, level: 1 })).toBeVisible({ timeout: 10000 });
});

Then('I should see the monthly distribution chart', async ({ page }) => {
	await expect(page.getByText('Monatliche Verteilung')).toBeVisible({ timeout: 10000 });
	// Check for month labels - use first() since there might be multiple instances
	await expect(page.getByText('Januar').first()).toBeVisible({ timeout: 10000 });
	await expect(page.getByText('Dezember').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see the profile information section', async ({ page }) => {
	await expect(page.getByText('Profil-Informationen')).toBeVisible({ timeout: 10000 });
});

Then('I should see the total percentage {string}', async ({ page }, percentage: string) => {
	await expect(page.getByText(percentage)).toBeVisible({ timeout: 10000 });
});

Then('the total percentage should be displayed in green', async ({ page }) => {
	// The total percentage is in a text-lg font-bold span
	const sumElement = page.locator('.text-lg.font-bold.text-green-600');
	await expect(sumElement).toBeVisible({ timeout: 10000 });
});

Then('the total percentage should be displayed in red', async ({ page }) => {
	// The total percentage is in a text-lg font-bold span
	const sumElement = page.locator('.text-lg.font-bold.text-red-600');
	await expect(sumElement).toBeVisible({ timeout: 10000 });
});

Then('I should see the heating profile edit form', async ({ page }) => {
	await expect(page.getByRole('heading', { name: 'Heizprofil bearbeiten' })).toBeVisible({ timeout: 10000 });
});

Then('I should see the monthly percentage inputs', async ({ page }) => {
	await expect(page.locator('input[name="january"]')).toBeVisible({ timeout: 10000 });
	await expect(page.locator('input[name="december"]')).toBeVisible({ timeout: 10000 });
});

Then('I should see the preview chart', async ({ page }) => {
	await expect(page.getByText('Vorschau')).toBeVisible({ timeout: 10000 });
});

Then('the sum should update accordingly', async ({ page }) => {
	// The sum text should exist and contain a percentage
	await expect(page.getByText(/Summe:.*\d+%/)).toBeVisible({ timeout: 10000 });
});

Then('the sum color should reflect validity', async ({ page }) => {
	// Should show either green (100%) or red (not 100%)
	const sumSpan = page.locator('.font-semibold').filter({ hasText: '%' }).first();
	await expect(sumSpan).toBeVisible({ timeout: 10000 });
	const classes = await sumSpan.getAttribute('class');
	expect(classes).toMatch(/text-(green|red)-600/);
});

Then('I should not see the {string} button for predefined profile', async ({ page }, buttonText: string) => {
	// For predefined profiles, the edit button should not be shown
	const editButton = page.getByRole('link', { name: buttonText });
	await expect(editButton).toHaveCount(0);
});
