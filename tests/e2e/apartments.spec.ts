/**
 * E2E Tests for Apartments CRUD
 * Tests apartment list, create, edit, and view workflows
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

const mockBuildings = [
	{ id: 'building-1', name: 'Musterhaus A', address: 'Musterstrasse 12', postal_code: '8000', city: 'Zürich' }
];

const mockApartments = [
	{
		id: 'apt-1',
		building_id: 'building-1',
		unit_number: '2.04',
		floor: '2.OG',
		size_m2: 85,
		room_count: 3.5,
		status: 'Vermietet',
		building: mockBuildings[0]
	},
	{
		id: 'apt-2',
		building_id: 'building-1',
		unit_number: '1.01',
		floor: '1.OG',
		size_m2: 65,
		room_count: 2.5,
		status: 'Leer',
		building: mockBuildings[0]
	}
];

// Mock apartments API
async function mockApartmentsApi(page: Page, apartments: unknown[] = mockApartments) {
	await page.route('**/api/apartments', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(apartments)
			});
		} else if (route.request().method() === 'POST') {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({ id: 'new-apt-1', ...body })
			});
		}
	});
}

// Mock single apartment API
async function mockApartmentApi(page: Page, apartment: unknown) {
	await page.route('**/api/apartments/*', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(apartment)
			});
		} else if (route.request().method() === 'PUT') {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ ...apartment, ...body })
			});
		} else if (route.request().method() === 'DELETE') {
			await route.fulfill({ status: 204, body: '' });
		}
	});
}

// Mock buildings API for dropdowns
async function mockBuildingsApi(page: Page) {
	await page.route('**/api/buildings', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockBuildings)
		});
	});
}

test.describe('Apartments List Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockApartmentsApi(page);
	});

	test('should display apartments list', async ({ page }) => {
		await page.goto('/apartments');

		await expect(page.locator('h1')).toContainText('Wohnungen');
		await expect(page.locator('text=2.04')).toBeVisible();
		await expect(page.locator('text=1.01')).toBeVisible();
	});

	test('should display apartment details in list', async ({ page }) => {
		await page.goto('/apartments');

		// Check apartment info is displayed
		await expect(page.locator('text=85 m²').first()).toBeVisible();
		await expect(page.locator('text=3.5 Zimmer').or(page.locator('text=3.5'))).toBeVisible();
	});

	test('should show status badges', async ({ page }) => {
		await page.goto('/apartments');

		await expect(page.locator('text=Vermietet')).toBeVisible();
		await expect(page.locator('text=Leer')).toBeVisible();
	});

	test('should have create apartment button', async ({ page }) => {
		await page.goto('/apartments');

		const createButton = page.locator('a[href="/apartments/new"]');
		await expect(createButton).toBeVisible();
	});

	test('should navigate to apartment details on click', async ({ page }) => {
		await mockApartmentApi(page, mockApartments[0]);

		await page.goto('/apartments');

		await page.locator('text=2.04').click();

		await page.waitForURL(/\/apartments\/apt-1/);
		expect(page.url()).toContain('/apartments/apt-1');
	});
});

test.describe('Create Apartment Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockBuildingsApi(page);
		await mockApartmentsApi(page);
	});

	test('should display create apartment form', async ({ page }) => {
		await page.goto('/apartments/new');

		await expect(page.locator('h1')).toContainText('Neue Wohnung');
		await expect(page.locator('label:has-text("Gebäude")')).toBeVisible();
		await expect(page.locator('label:has-text("Wohnungsnummer")')).toBeVisible();
	});

	test('should show building dropdown', async ({ page }) => {
		await page.goto('/apartments/new');

		const buildingSelect = page.locator('select[name="building_id"], #building_id');
		await expect(buildingSelect).toBeVisible();
	});

	test('should validate required fields', async ({ page }) => {
		await page.goto('/apartments/new');

		await page.locator('button[type="submit"]').click();

		// Should show validation errors
		await expect(page.locator('text=erforderlich').first()).toBeVisible();
	});

	test('should submit valid apartment form', async ({ page }) => {
		await page.goto('/apartments/new');

		// Select building
		await page.locator('select[name="building_id"], #building_id').selectOption('building-1');

		// Fill required fields
		await page.locator('#unit_number, input[name="unit_number"]').fill('3.01');
		await page.locator('#floor, input[name="floor"]').fill('3.OG');
		await page.locator('#size_m2, input[name="size_m2"]').fill('75');
		await page.locator('#room_count, input[name="room_count"]').fill('3');

		await page.locator('button[type="submit"]').click();

		await page.waitForURL(/\/apartments/);
	});
});

test.describe('Apartment Details Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockApartmentApi(page, mockApartments[0]);
	});

	test('should display apartment details', async ({ page }) => {
		await page.goto('/apartments/apt-1');

		await expect(page.locator('h1')).toContainText('2.04');
		await expect(page.locator('text=85')).toBeVisible();
		await expect(page.locator('text=3.5')).toBeVisible();
	});

	test('should display floor information', async ({ page }) => {
		await page.goto('/apartments/apt-1');

		await expect(page.locator('text=2.OG')).toBeVisible();
	});

	test('should have edit button', async ({ page }) => {
		await page.goto('/apartments/apt-1');

		const editLink = page.locator('a[href*="edit"]');
		await expect(editLink).toBeVisible();
	});

	test('should show rental status', async ({ page }) => {
		await page.goto('/apartments/apt-1');

		await expect(page.locator('text=Vermietet')).toBeVisible();
	});
});

test.describe('Edit Apartment Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockBuildingsApi(page);
		await mockApartmentApi(page, mockApartments[0]);
	});

	test('should load existing apartment data', async ({ page }) => {
		await page.goto('/apartments/apt-1/edit');

		await expect(page.locator('#unit_number, input[name="unit_number"]')).toHaveValue('2.04');
		await expect(page.locator('#floor, input[name="floor"]')).toHaveValue('2.OG');
	});

	test('should update apartment on submit', async ({ page }) => {
		await page.goto('/apartments/apt-1/edit');

		// Change size
		await page.locator('#size_m2, input[name="size_m2"]').fill('90');

		await page.locator('button[type="submit"]').click();

		await page.waitForURL(/\/apartments\/apt-1$/);
	});

	test('should have cancel button', async ({ page }) => {
		await page.goto('/apartments/apt-1/edit');

		const cancelButton = page.locator('a:has-text("Abbrechen")');
		await expect(cancelButton).toBeVisible();
	});
});
