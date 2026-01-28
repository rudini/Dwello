import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

// ============================================
// Given steps
// ============================================

Given('there are statements in the system', async ({ page }) => {
	await page.route('**/api/statements**', async (route) => {
		if (route.request().url().includes('/api/statements') && route.request().method() === 'GET') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					data: [
						{
							id: 'stmt-001',
							statementNumber: 'NK-2024-001',
							tenantName: 'Hans Müller',
							status: 'sent',
							balance: 350.0,
							periodStart: '2024-01-01',
							periodEnd: '2024-12-31'
						},
						{
							id: 'stmt-002',
							statementNumber: 'NK-2024-002',
							tenantName: 'Anna Schmidt',
							status: 'overdue',
							balance: 520.0,
							periodStart: '2024-01-01',
							periodEnd: '2024-12-31'
						}
					],
					total: 2,
					counts: { draft: 2, sent: 5, paid: 18, overdue: 3 }
				})
			});
		} else {
			await route.continue();
		}
	});
});

Given('there is a statement {string}', async ({ page }, statementNumber: string) => {
	await page.route('**/api/statements/**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				id: 'stmt-001',
				statementNumber: statementNumber,
				tenantName: 'Hans Müller',
				tenantEmail: 'hans@example.com',
				apartmentUnit: '1.01',
				buildingName: 'Musterhaus',
				status: 'sent',
				balance: 350.0,
				totalCosts: 3950.0,
				totalAdvancePayments: 3600.0,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				lineItems: [
					{ categoryName: 'Heizung', tenantShare: 1500.0 },
					{ categoryName: 'Wasser', tenantShare: 500.0 }
				]
			})
		});
	});
});

// ============================================
// When steps
// ============================================

When('I open the statements page', async ({ page }) => {
	await page.goto('/statements');
	await page.waitForLoadState('domcontentloaded');
});

When('I open the statement generation wizard', async ({ page }) => {
	await page.goto('/statements/generate');
	await page.waitForLoadState('domcontentloaded');
});

When('I open the statement detail page', async ({ page }) => {
	await page.goto('/statements/stmt-001');
	await page.waitForLoadState('domcontentloaded');
});

When('I filter by status {string}', async ({ page }, status: string) => {
	await page.getByTestId(`filter-${status}`).click();
	await page.waitForTimeout(500);
});

// ============================================
// Then steps
// ============================================

Then('I should see the statements page', async ({ page }) => {
	await expect(page.getByTestId('statements-page')).toBeVisible({ timeout: 10000 });
});

Then('I should see the status overview cards', async ({ page }) => {
	await expect(page.getByTestId('status-overview')).toBeVisible({ timeout: 10000 });
});

Then('I should see draft filter button', async ({ page }) => {
	await expect(page.getByTestId('filter-draft')).toBeVisible({ timeout: 10000 });
});

Then('I should see sent filter button', async ({ page }) => {
	await expect(page.getByTestId('filter-sent')).toBeVisible({ timeout: 10000 });
});

Then('I should see paid filter button', async ({ page }) => {
	await expect(page.getByTestId('filter-paid')).toBeVisible({ timeout: 10000 });
});

Then('I should see overdue filter button', async ({ page }) => {
	await expect(page.getByTestId('filter-overdue')).toBeVisible({ timeout: 10000 });
});

Then('I should be on the statement generation wizard', async ({ page }) => {
	expect(page.url()).toContain('/statements/generate');
});

Then('I should see the statement number {string}', async ({ page }, statementNumber: string) => {
	await expect(page.getByText(statementNumber)).toBeVisible({ timeout: 10000 });
});

Then('I should see the tenant name', async ({ page }) => {
	await expect(page.getByText('Hans Müller')).toBeVisible({ timeout: 10000 });
});

Then('I should see the cost breakdown', async ({ page }) => {
	await expect(page.getByText('Heizung')).toBeVisible({ timeout: 10000 });
});

Then('I should see the balance', async ({ page }) => {
	await expect(page.getByText(/CHF\s*[\d.,]+/)).toBeVisible({ timeout: 10000 });
});
