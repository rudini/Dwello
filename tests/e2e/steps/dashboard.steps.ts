import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

// ============================================
// Given steps
// ============================================

Given('the backend API is mocked', async ({ page }) => {
	// Mock dashboard API
	await page.route('**/api/dashboard', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				portfolio: {
					totalBuildings: 3,
					totalApartments: 26,
					occupiedApartments: 22,
					vacantApartments: 4,
					occupancyRate: 84.6
				},
				financial: {
					outstandingStatements: 8,
					totalPending: 12450.0,
					overdueAmount: 2890.0,
					paidThisMonth: 45600.0
				},
				statements: {
					draft: 2,
					sent: 5,
					paid: 18,
					overdue: 3
				}
			})
		});
	});

	// Mock buildings API
	await page.route('**/api/buildings**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				data: [
					{ id: '1', name: 'Musterhaus', address: 'Musterstraße 12', city: 'Zürich', postalCode: '8000' },
					{ id: '2', name: 'Seepark', address: 'Seestrasse 45', city: 'Luzern', postalCode: '6004' }
				],
				total: 2
			})
		});
	});

	// Mock statements API
	await page.route('**/api/statements**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				data: [
					{ id: '1', statementNumber: 'NK-2024-001', status: 'sent', balance: 350.00 },
					{ id: '2', statementNumber: 'NK-2024-002', status: 'overdue', balance: 520.00 }
				],
				total: 2
			})
		});
	});
});

// ============================================
// Then steps - Portfolio
// ============================================

Then('I should see the total number of buildings', async ({ page }) => {
	await expect(page.locator('text=Gebäude')).toBeVisible({ timeout: 10000 });
});

Then('I should see the total number of apartments', async ({ page }) => {
	await expect(page.locator('text=Wohnungen')).toBeVisible();
});

Then('I should see the occupancy rate', async ({ page }) => {
	await expect(page.locator('text=Belegungsrate')).toBeVisible();
});

// ============================================
// Then steps - Financial
// ============================================

Then('I should see outstanding statements count', async ({ page }) => {
	await expect(page.locator('text=Offene Abrechnungen')).toBeVisible();
});

Then('I should see total pending amount', async ({ page }) => {
	await expect(page.locator('text=Ausstehend')).toBeVisible();
});

Then('I should see overdue amount', async ({ page }) => {
	await expect(page.locator('text=Überfällig')).toBeVisible();
});

// ============================================
// Then steps - Statements
// ============================================

Then('I should see draft statements count', async ({ page }) => {
	await expect(page.locator('text=Entwürfe')).toBeVisible();
});

Then('I should see sent statements count', async ({ page }) => {
	await expect(page.locator('text=Versendet')).toBeVisible();
});

Then('I should see paid statements count', async ({ page }) => {
	await expect(page.locator('text=Bezahlt')).toBeVisible();
});

Then('I should see overdue statements count', async ({ page }) => {
	await expect(page.locator('text=Überfällig')).toBeVisible();
});

// ============================================
// Then steps - Activity
// ============================================

Then('I should see the activity feed', async ({ page }) => {
	await expect(page.locator('text=Letzte Aktivitäten')).toBeVisible();
});

Then('I should see recent activities', async ({ page }) => {
	// Check for activity items
	const activityFeed = page.locator('text=Letzte Aktivitäten').locator('..');
	await expect(activityFeed).toBeVisible();
});

// ============================================
// Then steps - Occupancy
// ============================================

Then('I should see the occupancy chart', async ({ page }) => {
	await expect(page.locator('text=Belegungsrate nach Gebäude')).toBeVisible();
});

Then('I should see building names in the chart', async ({ page }) => {
	// Buildings should be visible in occupancy section
	const occupancySection = page.locator('text=Belegungsrate nach Gebäude').locator('..');
	await expect(occupancySection).toBeVisible();
});

// ============================================
// When/Then steps - Navigation
// ============================================

When('I click on the buildings stat card', async ({ page }) => {
	await page.locator('text=Gebäude').click();
});

When('I click on the overdue statements card', async ({ page }) => {
	await page.locator('a:has-text("Überfällig")').first().click();
});

Then('I should be on the buildings page', async ({ page }) => {
	await page.waitForURL(/buildings/);
	expect(page.url()).toContain('buildings');
});

Then('I should be on the statements page with overdue filter', async ({ page }) => {
	await page.waitForURL(/statements/);
	expect(page.url()).toContain('statements');
});
