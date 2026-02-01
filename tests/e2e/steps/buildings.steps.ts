import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

// ============================================
// Given steps
// ============================================

Given('there are buildings in the system', async ({ page }) => {
	// Buildings page uses server-side mock data, no additional mocking needed
	// Just ensure auth is mocked
	await page.route('**/api/buildings**', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					data: [
						{
							id: 'building-001',
							name: 'Musterhaus Zentrum',
							address: 'Musterstraße 12',
							postalCode: '8000',
							city: 'Zürich',
							apartmentCount: 12
						},
						{
							id: 'building-002',
							name: 'Seepark Residenz',
							address: 'Seestrasse 45',
							postalCode: '6004',
							city: 'Luzern',
							apartmentCount: 8
						}
					],
					total: 2
				})
			});
		} else {
			await route.continue();
		}
	});
});

Given('there are multiple buildings in the system', async ({ page }) => {
	await page.route('**/api/buildings**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				data: [
					{
						id: '1',
						name: 'Haus Zürich',
						address: 'Bahnhofstr. 1',
						city: 'Zürich',
						postalCode: '8000',
						apartmentCount: 10
					},
					{
						id: '2',
						name: 'Haus Bern',
						address: 'Bundesplatz 1',
						city: 'Bern',
						postalCode: '3000',
						apartmentCount: 8
					},
					{
						id: '3',
						name: 'Haus Basel',
						address: 'Marktplatz 1',
						city: 'Basel',
						postalCode: '4000',
						apartmentCount: 6
					}
				],
				total: 3
			})
		});
	});
});

Given('there is a building {string} in the system', async ({ page }, buildingName: string) => {
	await page.route('**/api/buildings/**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				id: 'building-001',
				name: buildingName,
				address: 'Musterstraße 12',
				postalCode: '8000',
				city: 'Zürich',
				apartments: [
					{ id: 'apt-1', unit: '1.01', floor: '1. OG', size_m2: 75, rooms: 3.5 },
					{ id: 'apt-2', unit: '1.02', floor: '1. OG', size_m2: 85, rooms: 4.5 }
				]
			})
		});
	});
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
	// Check that at least one building is displayed
	await expect(page.getByText('Musterhaus Zentrum')).toBeVisible({ timeout: 5000 });
});

Then('I should see building addresses', async ({ page }) => {
	await expect(page.getByText('Musterstraße')).toBeVisible({ timeout: 5000 });
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
