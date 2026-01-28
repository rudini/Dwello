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
							balance: 350.00,
							periodStart: '2024-01-01',
							periodEnd: '2024-12-31'
						},
						{
							id: 'stmt-002',
							statementNumber: 'NK-2024-002',
							tenantName: 'Anna Schmidt',
							status: 'overdue',
							balance: 520.00,
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

Given('there are statements with different statuses', async ({ page }) => {
	// Same as above, already has different statuses
	await page.route('**/api/statements**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				data: [
					{ id: '1', statementNumber: 'NK-2024-001', status: 'draft', balance: 100 },
					{ id: '2', statementNumber: 'NK-2024-002', status: 'sent', balance: 200 },
					{ id: '3', statementNumber: 'NK-2024-003', status: 'paid', balance: 0 },
					{ id: '4', statementNumber: 'NK-2024-004', status: 'overdue', balance: 500 }
				],
				total: 4,
				counts: { draft: 1, sent: 1, paid: 1, overdue: 1 }
			})
		});
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
				balance: 350.00,
				totalCosts: 3950.00,
				totalAdvancePayments: 3600.00,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				lineItems: [
					{ categoryName: 'Heizung', tenantShare: 1500.00 },
					{ categoryName: 'Wasser', tenantShare: 500.00 }
				]
			})
		});
	});
});

Given('there is a sent statement', async ({ page }) => {
	await page.route('**/api/statements/**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				id: 'stmt-001',
				statementNumber: 'NK-2024-001',
				status: 'sent',
				balance: 350.00
			})
		});
	});
});

Given('there is an overdue statement', async ({ page }) => {
	await page.route('**/api/statements/**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				id: 'stmt-001',
				statementNumber: 'NK-2024-001',
				status: 'overdue',
				balance: 520.00
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
	const filterSelect = page.locator('select[name="status"], select:has-text("Status")');
	await filterSelect.selectOption(status);
	await page.waitForTimeout(500);
});

When('I select a period from {string} to {string}', async ({ page }, startDate: string, endDate: string) => {
	await page.locator('input[type="date"]').first().fill(startDate);
	await page.locator('input[type="date"]').last().fill(endDate);
});

When('I select a heating profile', async ({ page }) => {
	const select = page.locator('select#heatingProfile, select:has-text("Heizungsprofil")');
	await select.selectOption({ index: 0 });
});

When('I click {string}', async ({ page }, buttonText: string) => {
	await page.getByRole('button', { name: buttonText }).click();
});

When('I am on step 2 of the statement wizard', async ({ page }) => {
	await page.goto('/statements/generate');
	await page.waitForLoadState('domcontentloaded');
	// Click next to go to step 2
	await page.getByRole('button', { name: 'Weiter' }).click();
});

When('I select buildings to include', async ({ page }) => {
	// Select all buildings checkbox
	const checkbox = page.locator('input[type="checkbox"]').first();
	await checkbox.check();
});

When('I confirm the payment', async ({ page }) => {
	await page.getByRole('button', { name: /bestätigen|confirm/i }).click();
});

When('I select reminder level 1', async ({ page }) => {
	await page.getByRole('button', { name: '1. Mahnung' }).click();
});

When('I confirm sending', async ({ page }) => {
	await page.getByRole('button', { name: /senden|send/i }).click();
});

// ============================================
// Then steps
// ============================================

Then('I should see a list of statements', async ({ page }) => {
	await expect(page.locator('table, [class*="list"]').first()).toBeVisible({ timeout: 10000 });
});

Then('I should see status overview cards', async ({ page }) => {
	await expect(page.locator('text=Entwürfe')).toBeVisible();
	await expect(page.locator('text=Versendet')).toBeVisible();
});

Then('I should only see overdue statements', async ({ page }) => {
	await expect(page.locator('text=overdue, text=Überfällig').first()).toBeVisible();
});

Then('I should be on the statement generation wizard', async ({ page }) => {
	expect(page.url()).toContain('/statements/generate');
});

Then('I should see step {int} of {int}', async ({ page }, currentStep: number, _totalSteps: number) => {
	await expect(page.locator(`text=Schritt ${currentStep}`)).toBeVisible();
});

Then('I should be on step {int} of the wizard', async ({ page }, step: number) => {
	// Check progress indicator shows correct step
	await expect(page.locator(`text=Schritt ${step}`)).toBeVisible();
});

Then('I should see a preview of the statements', async ({ page }) => {
	await expect(page.locator('text=Vorschau')).toBeVisible();
});

Then('I should see the statement number {string}', async ({ page }, statementNumber: string) => {
	await expect(page.locator(`text=${statementNumber}`)).toBeVisible();
});

Then('I should see the tenant name', async ({ page }) => {
	await expect(page.locator('text=Hans Müller')).toBeVisible();
});

Then('I should see the cost breakdown', async ({ page }) => {
	await expect(page.locator('text=Heizung')).toBeVisible();
});

Then('I should see the balance', async ({ page }) => {
	await expect(page.locator('text=/CHF\\s*[\\d.,]+/')).toBeVisible();
});

Then('the statement status should be {string}', async ({ page }, status: string) => {
	await expect(page.locator(`text=${status}`)).toBeVisible();
});

Then('a reminder should be sent', async ({ page }) => {
	await expect(page.locator('text=/erfolgreich|gesendet|sent/i')).toBeVisible();
});
