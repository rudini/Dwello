/**
 * E2E Tests for Tenants CRUD
 * Tests tenant list, create, edit, and view workflows
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

const mockTenants = [
	{
		id: 'tenant-1',
		first_name: 'Hans',
		last_name: 'Müller',
		email: 'h.mueller@email.com',
		phone: '+41 79 123 45 67',
		current_apartment: { unit_number: '2.04', building: { name: 'Musterhaus A' } }
	},
	{
		id: 'tenant-2',
		first_name: 'Sarah',
		last_name: 'Weber',
		email: 's.weber@email.com',
		phone: '+41 79 234 56 78',
		current_apartment: null
	}
];

// Mock tenants API
async function mockTenantsApi(page: Page, tenants: unknown[] = mockTenants) {
	await page.route('**/api/tenants', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(tenants)
			});
		} else if (route.request().method() === 'POST') {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({ id: 'new-tenant-1', ...body })
			});
		}
	});
}

// Mock single tenant API
async function mockTenantApi(page: Page, tenant: unknown) {
	await page.route('**/api/tenants/*', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(tenant)
			});
		} else if (route.request().method() === 'PUT') {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ ...tenant, ...body })
			});
		} else if (route.request().method() === 'DELETE') {
			await route.fulfill({ status: 204, body: '' });
		}
	});
}

test.describe('Tenants List Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockTenantsApi(page);
	});

	test('should display tenants list', async ({ page }) => {
		await page.goto('/tenants');

		await expect(page.locator('h1')).toContainText('Mieter');
		await expect(page.locator('text=Hans Müller')).toBeVisible();
		await expect(page.locator('text=Sarah Weber')).toBeVisible();
	});

	test('should display tenant contact info', async ({ page }) => {
		await page.goto('/tenants');

		await expect(page.locator('text=h.mueller@email.com')).toBeVisible();
	});

	test('should show current apartment assignment', async ({ page }) => {
		await page.goto('/tenants');

		await expect(page.locator('text=2.04').or(page.locator('text=Musterhaus A'))).toBeVisible();
	});

	test('should have create tenant button', async ({ page }) => {
		await page.goto('/tenants');

		const createButton = page.locator('a[href="/tenants/new"]');
		await expect(createButton).toBeVisible();
	});

	test('should navigate to tenant details on click', async ({ page }) => {
		await mockTenantApi(page, mockTenants[0]);

		await page.goto('/tenants');

		await page.locator('text=Hans Müller').click();

		await page.waitForURL(/\/tenants\/tenant-1/);
	});
});

test.describe('Create Tenant Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockTenantsApi(page);
	});

	test('should display create tenant form', async ({ page }) => {
		await page.goto('/tenants/new');

		await expect(page.locator('h1')).toContainText('Neuer Mieter');
		await expect(page.locator('label:has-text("Vorname")')).toBeVisible();
		await expect(page.locator('label:has-text("Nachname")')).toBeVisible();
		await expect(page.locator('label:has-text("E-Mail")')).toBeVisible();
	});

	test('should validate required fields', async ({ page }) => {
		await page.goto('/tenants/new');

		await page.locator('button[type="submit"]').click();

		await expect(page.locator('text=erforderlich').first()).toBeVisible();
	});

	test('should validate email format', async ({ page }) => {
		await page.goto('/tenants/new');

		// Fill with invalid email
		await page.locator('#first_name, input[name="first_name"]').fill('Test');
		await page.locator('#last_name, input[name="last_name"]').fill('User');
		await page.locator('#email, input[name="email"]').fill('invalid-email');

		await page.locator('button[type="submit"]').click();

		await expect(page.locator('text=gültige E-Mail').or(page.locator('text=E-Mail'))).toBeVisible();
	});

	test('should submit valid tenant form', async ({ page }) => {
		await page.goto('/tenants/new');

		// Fill form
		await page.locator('#first_name, input[name="first_name"]').fill('Max');
		await page.locator('#last_name, input[name="last_name"]').fill('Mustermann');
		await page.locator('#email, input[name="email"]').fill('max@example.com');
		await page.locator('#phone, input[name="phone"]').fill('+41 79 111 22 33');

		await page.locator('button[type="submit"]').click();

		await page.waitForURL(/\/tenants/);
	});

	test('should have cancel button', async ({ page }) => {
		await page.goto('/tenants/new');

		const cancelButton = page.locator('a:has-text("Abbrechen")');
		await expect(cancelButton).toBeVisible();

		await cancelButton.click();
		await page.waitForURL(/\/tenants$/);
	});
});

test.describe('Tenant Details Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockTenantApi(page, mockTenants[0]);
	});

	test('should display tenant details', async ({ page }) => {
		await page.goto('/tenants/tenant-1');

		await expect(page.locator('h1')).toContainText('Hans Müller');
	});

	test('should display contact information', async ({ page }) => {
		await page.goto('/tenants/tenant-1');

		await expect(page.locator('text=h.mueller@email.com')).toBeVisible();
		await expect(page.locator('text=+41 79 123 45 67')).toBeVisible();
	});

	test('should have edit button', async ({ page }) => {
		await page.goto('/tenants/tenant-1');

		const editLink = page.locator('a[href*="edit"]');
		await expect(editLink).toBeVisible();
	});

	test('should show current apartment if assigned', async ({ page }) => {
		await page.goto('/tenants/tenant-1');

		await expect(page.locator('text=2.04').or(page.locator('text=Aktuelle Wohnung'))).toBeVisible();
	});
});

test.describe('Edit Tenant Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockTenantApi(page, mockTenants[0]);
	});

	test('should load existing tenant data', async ({ page }) => {
		await page.goto('/tenants/tenant-1/edit');

		await expect(page.locator('#first_name, input[name="first_name"]')).toHaveValue('Hans');
		await expect(page.locator('#last_name, input[name="last_name"]')).toHaveValue('Müller');
		await expect(page.locator('#email, input[name="email"]')).toHaveValue('h.mueller@email.com');
	});

	test('should update tenant on submit', async ({ page }) => {
		await page.goto('/tenants/tenant-1/edit');

		// Change phone
		await page.locator('#phone, input[name="phone"]').fill('+41 79 999 88 77');

		await page.locator('button[type="submit"]').click();

		await page.waitForURL(/\/tenants\/tenant-1$/);
	});
});

test.describe('Search Tenants', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockTenantsApi(page);
	});

	test('should have search input', async ({ page }) => {
		await page.goto('/tenants');

		const searchInput = page.locator('input[type="search"], input[placeholder*="Suchen"]');
		await expect(searchInput).toBeVisible();
	});

	test('should filter tenants by name', async ({ page }) => {
		await page.goto('/tenants');

		const searchInput = page.locator('input[type="search"], input[placeholder*="Suchen"]');
		await searchInput.fill('Hans');

		await expect(page.locator('text=Hans Müller')).toBeVisible();
	});
});
