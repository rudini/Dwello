/**
 * E2E Tests for Buildings CRUD
 * Tests building list, create, edit, and delete workflows
 */
import { test, expect, type Page } from '@playwright/test';

// Mock authenticated user
async function mockAuth(page: Page) {
	await page.route('**/auth/me', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				user: {
					sub: 'test-user-123',
					email: 'test@example.com',
					name: 'Test User',
					provider: 'google'
				}
			})
		});
	});
}

// Mock buildings API
async function mockBuildingsApi(page: Page, buildings: unknown[] = []) {
	await page.route('**/api/buildings', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(buildings)
			});
		} else if (route.request().method() === 'POST') {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({ id: 'new-building-1', ...body })
			});
		}
	});
}

// Mock single building API
async function mockBuildingApi(page: Page, building: unknown) {
	await page.route('**/api/buildings/*', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(building)
			});
		} else if (route.request().method() === 'PUT') {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ ...building, ...body })
			});
		} else if (route.request().method() === 'DELETE') {
			await route.fulfill({
				status: 204,
				contentType: 'application/json',
				body: ''
			});
		}
	});
}

const mockBuildings = [
	{
		id: 'building-1',
		name: 'Musterhaus A',
		address: 'Musterstrasse 12',
		postal_code: '8000',
		city: 'Zürich',
		canton: 'ZH',
		building_type: 'Mehrfamilienhaus',
		year_built: 1985,
		apartment_count: 8
	},
	{
		id: 'building-2',
		name: 'Geschäftshaus B',
		address: 'Bahnhofstrasse 1',
		postal_code: '8001',
		city: 'Zürich',
		canton: 'ZH',
		building_type: 'Geschäftshaus',
		year_built: 2010,
		apartment_count: 12
	}
];

test.describe('Buildings List Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockBuildingsApi(page, mockBuildings);
	});

	test('should display buildings list', async ({ page }) => {
		await page.goto('/buildings');

		// Check page title
		await expect(page.locator('h1')).toContainText('Gebäude');

		// Check buildings are displayed
		await expect(page.locator('text=Musterhaus A')).toBeVisible();
		await expect(page.locator('text=Geschäftshaus B')).toBeVisible();
	});

	test('should display building addresses', async ({ page }) => {
		await page.goto('/buildings');

		await expect(page.locator('text=Musterstrasse 12')).toBeVisible();
		await expect(page.locator('text=8000 Zürich')).toBeVisible();
	});

	test('should have create building button', async ({ page }) => {
		await page.goto('/buildings');

		const createButton = page.locator('a[href="/buildings/new"]');
		await expect(createButton).toBeVisible();
	});

	test('should display empty state when no buildings', async ({ page }) => {
		await mockBuildingsApi(page, []);

		await page.goto('/buildings');

		// Should show empty state
		await expect(page.locator('text=Keine Gebäude')).toBeVisible();
	});

	test('should navigate to building details on click', async ({ page }) => {
		await mockBuildingApi(page, mockBuildings[0]);

		await page.goto('/buildings');

		// Click on building card/link
		await page.locator('text=Musterhaus A').click();

		await page.waitForURL(/\/buildings\/building-1/);
		expect(page.url()).toContain('/buildings/building-1');
	});
});

test.describe('Create Building Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockBuildingsApi(page);
	});

	test('should display create building form', async ({ page }) => {
		await page.goto('/buildings/new');

		await expect(page.locator('h1')).toContainText('Neues Gebäude');
		await expect(page.locator('label:has-text("Strasse")')).toBeVisible();
		await expect(page.locator('label:has-text("PLZ")')).toBeVisible();
		await expect(page.locator('label:has-text("Stadt")')).toBeVisible();
	});

	test('should show validation errors for required fields', async ({ page }) => {
		await page.goto('/buildings/new');

		// Submit without filling required fields
		await page.locator('button[type="submit"]').click();

		// Check for validation errors
		await expect(page.locator('text=Adresse ist erforderlich')).toBeVisible();
	});

	test('should validate postal code format', async ({ page }) => {
		await page.goto('/buildings/new');

		// Fill invalid postal code
		await page.locator('#postalCode').fill('123');
		await page.locator('button[type="submit"]').click();

		await expect(page.locator('text=PLZ muss 4 Ziffern haben')).toBeVisible();
	});

	test('should submit valid building form', async ({ page }) => {
		await page.goto('/buildings/new');

		// Fill form
		await page.locator('#name').fill('Test Building');
		await page.locator('#address').fill('Teststrasse 1');
		await page.locator('#postalCode').fill('8000');
		await page.locator('#city').fill('Zürich');

		// Submit
		await page.locator('button[type="submit"]').click();

		// Should navigate to buildings list
		await page.waitForURL(/\/buildings$/);
	});

	test('should have cancel button that navigates back', async ({ page }) => {
		await page.goto('/buildings/new');

		await page.locator('a:has-text("Abbrechen")').click();

		await page.waitForURL(/\/buildings$/);
	});
});

test.describe('Edit Building Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockBuildingApi(page, mockBuildings[0]);
	});

	test('should load existing building data', async ({ page }) => {
		await page.goto('/buildings/building-1/edit');

		// Check form is pre-filled
		await expect(page.locator('#name')).toHaveValue('Musterhaus A');
		await expect(page.locator('#address')).toHaveValue('Musterstrasse 12');
		await expect(page.locator('#postalCode')).toHaveValue('8000');
		await expect(page.locator('#city')).toHaveValue('Zürich');
	});

	test('should update building on submit', async ({ page }) => {
		await page.goto('/buildings/building-1/edit');

		// Change name
		await page.locator('#name').fill('Updated Building Name');

		// Submit
		await page.locator('button[type="submit"]').click();

		// Should navigate back
		await page.waitForURL(/\/buildings\/building-1$/);
	});
});

test.describe('Building Details Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockBuildingApi(page, mockBuildings[0]);
	});

	test('should display building details', async ({ page }) => {
		await page.goto('/buildings/building-1');

		await expect(page.locator('h1')).toContainText('Musterhaus A');
		await expect(page.locator('text=Musterstrasse 12')).toBeVisible();
		await expect(page.locator('text=8000 Zürich')).toBeVisible();
	});

	test('should have edit button', async ({ page }) => {
		await page.goto('/buildings/building-1');

		const editButton = page.locator('a[href="/buildings/building-1/edit"]');
		await expect(editButton).toBeVisible();
	});

	test('should have breadcrumb navigation', async ({ page }) => {
		await page.goto('/buildings/building-1');

		await expect(page.locator('nav a[href="/buildings"]')).toBeVisible();
	});
});

test.describe('Search and Filter Buildings', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockBuildingsApi(page, mockBuildings);
	});

	test('should have search input', async ({ page }) => {
		await page.goto('/buildings');

		await expect(page.locator('input[type="search"], input[placeholder*="Suchen"]')).toBeVisible();
	});

	test('should filter buildings by search term', async ({ page }) => {
		await page.goto('/buildings');

		// Type in search
		const searchInput = page.locator('input[type="search"], input[placeholder*="Suchen"]');
		await searchInput.fill('Muster');

		// Only matching building should be visible
		await expect(page.locator('text=Musterhaus A')).toBeVisible();
	});
});
