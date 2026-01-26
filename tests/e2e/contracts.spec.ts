/**
 * E2E Tests for Contracts CRUD
 * Tests rental contract list, create, edit, and view workflows
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
	{ id: 'tenant-1', first_name: 'Hans', last_name: 'Müller' },
	{ id: 'tenant-2', first_name: 'Sarah', last_name: 'Weber' }
];

const mockApartments = [
	{ id: 'apt-1', unit_number: '2.04', building: { name: 'Musterhaus A' } },
	{ id: 'apt-2', unit_number: '1.01', building: { name: 'Musterhaus A' } }
];

const mockContracts = [
	{
		id: 'contract-1',
		tenant_id: 'tenant-1',
		apartment_id: 'apt-1',
		start_date: '2021-03-01',
		end_date: null,
		base_rent_chf: 2100,
		additional_costs_chf: 250,
		status: 'AKTIV',
		tenant: mockTenants[0],
		apartment: mockApartments[0]
	},
	{
		id: 'contract-2',
		tenant_id: 'tenant-2',
		apartment_id: 'apt-1',
		start_date: '2018-01-01',
		end_date: '2021-02-28',
		base_rent_chf: 1950,
		additional_costs_chf: 200,
		status: 'Beendet',
		tenant: mockTenants[1],
		apartment: mockApartments[0]
	}
];

// Mock contracts API
async function mockContractsApi(page: Page, contracts: unknown[] = mockContracts) {
	await page.route('**/api/contracts', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(contracts)
			});
		} else if (route.request().method() === 'POST') {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 201,
				contentType: 'application/json',
				body: JSON.stringify({ id: 'new-contract-1', ...body })
			});
		}
	});
}

// Mock single contract API
async function mockContractApi(page: Page, contract: unknown) {
	await page.route('**/api/contracts/*', async (route) => {
		if (route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify(contract)
			});
		} else if (route.request().method() === 'PUT') {
			const body = route.request().postDataJSON();
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ ...contract, ...body })
			});
		} else if (route.request().method() === 'DELETE') {
			await route.fulfill({ status: 204, body: '' });
		}
	});
}

// Mock related APIs for dropdowns
async function mockRelatedApis(page: Page) {
	await page.route('**/api/tenants', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockTenants)
		});
	});

	await page.route('**/api/apartments', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockApartments)
		});
	});
}

test.describe('Contracts List Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockContractsApi(page);
	});

	test('should display contracts list', async ({ page }) => {
		await page.goto('/contracts');

		await expect(page.locator('h1')).toContainText('Mietverträge');
		await expect(page.locator('text=Hans Müller')).toBeVisible();
		await expect(page.locator('text=Sarah Weber')).toBeVisible();
	});

	test('should display contract rent amounts', async ({ page }) => {
		await page.goto('/contracts');

		// Check for rent amounts (CHF formatting)
		await expect(page.locator("text=2'100").or(page.locator('text=2100'))).toBeVisible();
	});

	test('should show contract status badges', async ({ page }) => {
		await page.goto('/contracts');

		await expect(page.locator('text=AKTIV')).toBeVisible();
		await expect(page.locator('text=Beendet')).toBeVisible();
	});

	test('should have create contract button', async ({ page }) => {
		await page.goto('/contracts');

		const createButton = page.locator('a[href="/contracts/new"]');
		await expect(createButton).toBeVisible();
	});

	test('should display apartment info in list', async ({ page }) => {
		await page.goto('/contracts');

		await expect(page.locator('text=2.04').or(page.locator('text=Musterhaus A'))).toBeVisible();
	});

	test('should navigate to contract details on click', async ({ page }) => {
		await mockContractApi(page, mockContracts[0]);

		await page.goto('/contracts');

		// Click on a contract
		await page.locator('text=Hans Müller').click();

		await page.waitForURL(/\/contracts\/contract-1/);
	});
});

test.describe('Create Contract Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockRelatedApis(page);
		await mockContractsApi(page);
	});

	test('should display create contract form', async ({ page }) => {
		await page.goto('/contracts/new');

		await expect(page.locator('h1')).toContainText('Neuer Mietvertrag');
		await expect(page.locator('label:has-text("Mieter")')).toBeVisible();
		await expect(page.locator('label:has-text("Wohnung")')).toBeVisible();
		await expect(page.locator('label:has-text("Startdatum")')).toBeVisible();
	});

	test('should show tenant and apartment dropdowns', async ({ page }) => {
		await page.goto('/contracts/new');

		const tenantSelect = page.locator('select[name="tenant_id"], #tenant_id');
		const apartmentSelect = page.locator('select[name="apartment_id"], #apartment_id');

		await expect(tenantSelect).toBeVisible();
		await expect(apartmentSelect).toBeVisible();
	});

	test('should validate required fields', async ({ page }) => {
		await page.goto('/contracts/new');

		await page.locator('button[type="submit"]').click();

		await expect(page.locator('text=erforderlich').first()).toBeVisible();
	});

	test('should validate rent amount is positive', async ({ page }) => {
		await page.goto('/contracts/new');

		// Fill with negative rent
		await page.locator('#base_rent_chf, input[name="base_rent_chf"]').fill('-100');
		await page.locator('button[type="submit"]').click();

		await expect(page.locator('text=positiv').or(page.locator('text=grösser'))).toBeVisible();
	});

	test('should submit valid contract form', async ({ page }) => {
		await page.goto('/contracts/new');

		// Select tenant and apartment
		await page.locator('select[name="tenant_id"], #tenant_id').selectOption('tenant-1');
		await page.locator('select[name="apartment_id"], #apartment_id').selectOption('apt-1');

		// Fill dates and rent
		await page.locator('#start_date, input[name="start_date"]').fill('2024-01-01');
		await page.locator('#base_rent_chf, input[name="base_rent_chf"]').fill('2000');
		await page.locator('#additional_costs_chf, input[name="additional_costs_chf"]').fill('200');

		await page.locator('button[type="submit"]').click();

		await page.waitForURL(/\/contracts/);
	});

	test('should have cancel button', async ({ page }) => {
		await page.goto('/contracts/new');

		const cancelButton = page.locator('a:has-text("Abbrechen")');
		await expect(cancelButton).toBeVisible();

		await cancelButton.click();
		await page.waitForURL(/\/contracts$/);
	});
});

test.describe('Contract Details Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockContractApi(page, mockContracts[0]);
	});

	test('should display contract details', async ({ page }) => {
		await page.goto('/contracts/contract-1');

		await expect(page.locator('text=Hans Müller')).toBeVisible();
		await expect(page.locator('text=2.04').or(page.locator('text=Musterhaus'))).toBeVisible();
	});

	test('should display rent breakdown', async ({ page }) => {
		await page.goto('/contracts/contract-1');

		// Check base rent
		await expect(page.locator("text=2'100").or(page.locator('text=2100'))).toBeVisible();
		// Check additional costs
		await expect(page.locator('text=250')).toBeVisible();
	});

	test('should display contract dates', async ({ page }) => {
		await page.goto('/contracts/contract-1');

		await expect(page.locator('text=01.03.2021').or(page.locator('text=2021-03-01'))).toBeVisible();
	});

	test('should show active status badge', async ({ page }) => {
		await page.goto('/contracts/contract-1');

		await expect(page.locator('text=AKTIV')).toBeVisible();
	});

	test('should have edit button', async ({ page }) => {
		await page.goto('/contracts/contract-1');

		const editLink = page.locator('a[href*="edit"]');
		await expect(editLink).toBeVisible();
	});

	test('should display total rent calculation', async ({ page }) => {
		await page.goto('/contracts/contract-1');

		// Total should be base + additional = 2350
		await expect(page.locator("text=2'350").or(page.locator('text=2350'))).toBeVisible();
	});
});

test.describe('Edit Contract Page', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockRelatedApis(page);
		await mockContractApi(page, mockContracts[0]);
	});

	test('should load existing contract data', async ({ page }) => {
		await page.goto('/contracts/contract-1/edit');

		await expect(page.locator('#base_rent_chf, input[name="base_rent_chf"]')).toHaveValue('2100');
		await expect(page.locator('#additional_costs_chf, input[name="additional_costs_chf"]')).toHaveValue('250');
	});

	test('should pre-select tenant and apartment', async ({ page }) => {
		await page.goto('/contracts/contract-1/edit');

		const tenantSelect = page.locator('select[name="tenant_id"], #tenant_id');
		await expect(tenantSelect).toHaveValue('tenant-1');

		const apartmentSelect = page.locator('select[name="apartment_id"], #apartment_id');
		await expect(apartmentSelect).toHaveValue('apt-1');
	});

	test('should update contract on submit', async ({ page }) => {
		await page.goto('/contracts/contract-1/edit');

		// Change rent
		await page.locator('#base_rent_chf, input[name="base_rent_chf"]').fill('2200');

		await page.locator('button[type="submit"]').click();

		await page.waitForURL(/\/contracts\/contract-1$/);
	});
});

test.describe('End Contract Flow', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockContractApi(page, mockContracts[0]);
	});

	test('should have end contract option for active contracts', async ({ page }) => {
		await page.goto('/contracts/contract-1');

		// Look for end contract button or link
		const endButton = page.locator('button:has-text("Beenden"), a:has-text("Beenden")');
		await expect(endButton).toBeVisible();
	});
});

test.describe('Filter Contracts by Status', () => {
	test.beforeEach(async ({ page }) => {
		await mockAuth(page);
		await mockContractsApi(page);
	});

	test('should have status filter', async ({ page }) => {
		await page.goto('/contracts');

		// Look for filter dropdown or tabs
		const statusFilter = page.locator('select:has-text("Status"), button:has-text("AKTIV"), [role="tablist"]');
		await expect(statusFilter.first()).toBeVisible();
	});
});
