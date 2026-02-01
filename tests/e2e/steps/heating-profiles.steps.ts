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
	// Map profile name to ID for data-testid
	const profileIdMap: Record<string, string> = {
		'Standard': 'hp-standard',
		'Mittelland': 'hp-mittelland',
		'Bergregion': 'hp-mountain',
		'Tessin': 'hp-tessin',
		'Eigenes Profil 1': 'hp-custom-1'
	};
	const profileId = profileIdMap[profileName] || profileName.toLowerCase().replace(/\s+/g, '-');
	await page.getByTestId(`view-profile-${profileId}`).click();
	await page.waitForURL(/\/config\/heating-profiles\/hp-/, { timeout: 5000 });
});

When('I click the view button for {string} profile', async ({ page }, profileName: string) => {
	// Map profile name to ID for data-testid
	const profileIdMap: Record<string, string> = {
		'Standard': 'hp-standard',
		'Mittelland': 'hp-mittelland',
		'Bergregion': 'hp-mountain',
		'Tessin': 'hp-tessin',
		'Eigenes Profil 1': 'hp-custom-1'
	};
	const profileId = profileIdMap[profileName] || profileName.toLowerCase().replace(/\s+/g, '-');
	await page.getByTestId(`view-profile-${profileId}`).click();
	await page.waitForURL(/\/config\/heating-profiles\/hp-/, { timeout: 5000 });
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
		{ timeout: 5000 }
	);
	await page.waitForLoadState('domcontentloaded');
});

When('I click the first profile in the list', async ({ page }) => {
	// Click the first visibility link (profile view link)
	const firstProfileLink = page.locator('a[href^="/config/heating-profiles/"]').filter({ hasNotText: 'new' }).first();
	await firstProfileLink.click();
	await page.waitForURL(/\/config\/heating-profiles\/[a-f0-9-]{36}/, { timeout: 5000 });
});

When('I click the first profile link', async ({ page }) => {
	// Click the first profile view link - match links with UUID pattern in href
	// We need to find links that go to a profile detail page (with UUID), not the "new" page
	// Use a more specific approach: find all profile links and filter out "new"
	const allProfileLinks = page.locator('a[href^="/config/heating-profiles/"]');

	// Filter to only links with UUIDs (exclude /new, /edit, etc.)
	const profileDetailLinks = allProfileLinks.filter({
		has: page.locator(':scope'),
	});

	// Get all hrefs and find the first one with a UUID pattern
	const links = await allProfileLinks.all();
	for (const link of links) {
		const href = await link.getAttribute('href');
		// Match UUID pattern: 8-4-4-4-12 hex characters
		if (href && /\/config\/heating-profiles\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/.test(href)) {
			await link.click();
			await page.waitForURL(/\/config\/heating-profiles\/[a-f0-9-]{36}/, { timeout: 5000 });
			return;
		}
	}

	throw new Error('No profile detail link found on the page');
});

When('I click the back link', async ({ page }) => {
	// Find and click the back link (breadcrumb or dedicated back link)
	const breadcrumbBack = page.locator('nav a').filter({ hasText: 'Heizprofile' });
	const backLink = page.getByRole('link', { name: /zurück/i });
	const backButton = page.getByRole('button', { name: /zurück/i });

	// Try breadcrumb first, then back link/button
	if (await breadcrumbBack.isVisible().catch(() => false)) {
		await breadcrumbBack.click();
	} else if (await backLink.isVisible().catch(() => false)) {
		await backLink.click();
	} else {
		await backButton.click();
	}

	await page.waitForURL(/\/config\/heating-profiles(?!\/[a-f0-9-]{36})/, { timeout: 5000 });
});

// ============================================
// Then steps
// ============================================

Then('I should see the heating profiles page', async ({ page }) => {
	// Check for the page heading using data-testid to avoid strict mode violation
	// (There are multiple headings with 'Heizprofile' text on the page)
	await expect(page.getByTestId('page-title')).toHaveText('Heizprofile', { timeout: 5000 });
});

Then('I should see at least {int} heating profiles', async ({ page }, count: number) => {
	// Wait for the page to load - use data-testid to avoid strict mode violation
	await expect(page.getByTestId('page-title')).toHaveText('Heizprofile', { timeout: 5000 });
	// Count profile cards by looking for links with UUID pattern (exclude /new)
	const allLinks = await page.locator('a[href^="/config/heating-profiles/"]').all();
	let profileCount = 0;
	for (const link of allLinks) {
		const href = await link.getAttribute('href');
		// Only count links with UUID pattern (not /new or other paths)
		if (href && /\/config\/heating-profiles\/[a-f0-9]{8}-/.test(href)) {
			profileCount++;
		}
	}
	expect(profileCount).toBeGreaterThanOrEqual(count);
});

Then('I should be on the heating profile detail page', async ({ page }) => {
	// Should be on a profile detail page (URL contains UUID)
	expect(page.url()).toMatch(/\/config\/heating-profiles\/[a-f0-9-]{36}/);
});

Then('I should be on a heating profile detail page', async ({ page }) => {
	// Should be on any profile detail page (URL contains UUID)
	expect(page.url()).toMatch(/\/config\/heating-profiles\/[a-f0-9-]{36}/);
});

Then('I should be on the heating profile detail page for {string}', async ({ page }, profileId: string) => {
	expect(page.url()).toContain(`/config/heating-profiles/${profileId}`);
});

Then('I should be on the heating profiles page', async ({ page }) => {
	expect(page.url()).toContain('/config/heating-profiles');
	// Should not be on a detail page (no UUID in URL)
	expect(page.url()).not.toMatch(/\/config\/heating-profiles\/[a-f0-9-]{36}/);
});

Then('I should see the profile name {string}', async ({ page }, name: string) => {
	await expect(page.getByTestId('profile-name')).toHaveText(name, { timeout: 5000 });
});

Then('I should see the monthly distribution chart', async ({ page }) => {
	await expect(page.getByTestId('monthly-distribution-title')).toBeVisible({ timeout: 5000 });
});

Then('I should see the profile information section', async ({ page }) => {
	await expect(page.getByTestId('profile-info-title')).toBeVisible({ timeout: 5000 });
});

Then('I should see the total percentage {string}', async ({ page }, percentage: string) => {
	await expect(page.getByTestId('total-percentage')).toContainText(percentage, { timeout: 5000 });
});

Then('the total percentage should be displayed in green', async ({ page }) => {
	const sumElement = page.getByTestId('total-percentage');
	await expect(sumElement).toBeVisible({ timeout: 5000 });
	await expect(sumElement).toHaveClass(/text-green-600/, { timeout: 5000 });
});

Then('the total percentage should be displayed in red', async ({ page }) => {
	const sumElement = page.getByTestId('total-percentage');
	await expect(sumElement).toBeVisible({ timeout: 5000 });
	await expect(sumElement).toHaveClass(/text-red-600/, { timeout: 5000 });
});

Then('I should see the heating profile edit form', async ({ page }) => {
	await expect(page.getByRole('heading', { name: 'Heizprofil bearbeiten' })).toBeVisible({ timeout: 5000 });
});

Then('I should see the monthly percentage inputs', async ({ page }) => {
	await expect(page.locator('input[name="january"]')).toBeVisible({ timeout: 5000 });
	await expect(page.locator('input[name="december"]')).toBeVisible({ timeout: 5000 });
});

Then('I should see the preview chart', async ({ page }) => {
	await expect(page.getByText('Vorschau')).toBeVisible({ timeout: 5000 });
});

Then('the sum should update accordingly', async ({ page }) => {
	// The sum text should exist and contain a percentage
	await expect(page.getByText(/Summe:.*\d+%/)).toBeVisible({ timeout: 5000 });
});

Then('the sum color should reflect validity', async ({ page }) => {
	// Should show either green (100%) or red (not 100%)
	const sumSpan = page.locator('.font-semibold').filter({ hasText: '%' }).first();
	await expect(sumSpan).toBeVisible({ timeout: 5000 });
	const classes = await sumSpan.getAttribute('class');
	expect(classes).toMatch(/text-(green|red)-600/);
});

Then('I should not see the {string} button for predefined profile', async ({ page }, buttonText: string) => {
	// For predefined profiles, the edit button should not be shown
	const editButton = page.getByRole('link', { name: buttonText });
	await expect(editButton).toHaveCount(0);
});
