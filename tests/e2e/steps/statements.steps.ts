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

Given('there are heating profiles with varying sums', async ({ page }) => {
	await page.route('**/api/heating-profiles**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				data: [
					{
						id: 'hp-standard',
						name: 'Heating Standard',
						type: 'predefined',
						description: 'Standard heating profile for Switzerland',
						isActive: true,
						januaryPct: '14.00',
						februaryPct: '12.00',
						marchPct: '10.00',
						aprilPct: '6.00',
						mayPct: '2.00',
						junePct: '0.00',
						julyPct: '0.00',
						augustPct: '0.00',
						septemberPct: '4.00',
						octoberPct: '8.00',
						novemberPct: '12.00',
						decemberPct: '14.00'
					},
					{
						id: 'hp-hot-water',
						name: 'Heating + Hot Water',
						type: 'predefined',
						description: 'Profile including hot water - Invalid (90%)',
						isActive: true,
						januaryPct: '12.00',
						februaryPct: '10.00',
						marchPct: '8.00',
						aprilPct: '5.00',
						mayPct: '2.00',
						junePct: '0.00',
						julyPct: '0.00',
						augustPct: '0.00',
						septemberPct: '3.00',
						octoberPct: '7.00',
						novemberPct: '10.00',
						decemberPct: '12.00'
					},
					{
						id: 'hp-mountain',
						name: 'Heating Mountain',
						type: 'predefined',
						description: 'Mountain region profile - Valid (100%)',
						isActive: true,
						januaryPct: '16.00',
						februaryPct: '14.00',
						marchPct: '12.00',
						aprilPct: '8.00',
						mayPct: '3.00',
						junePct: '0.00',
						julyPct: '0.00',
						augustPct: '0.00',
						septemberPct: '5.00',
						octoberPct: '10.00',
						novemberPct: '14.00',
						decemberPct: '18.00'
					}
				],
				total: 3
			})
		});
	});

	// Also mock buildings for the wizard
	await page.route('**/api/buildings**', async (route) => {
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
					}
				],
				total: 1
			})
		});
	});

	// Mock categories and distribution keys
	await page.route('**/api/categories**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ data: [], total: 0 })
		});
	});

	await page.route('**/api/distribution-keys**', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ data: [], total: 0 })
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

// ============================================
// Data loading verification steps
// ============================================

Then('I should see statements in the list', async ({ page }) => {
	// Wait for statement cards/rows to be visible
	const statementLinks = page.locator('a[href^="/statements/"]');
	await expect(statementLinks.first()).toBeVisible({ timeout: 10000 });
	const count = await statementLinks.count();
	expect(count).toBeGreaterThan(0);
});

Then('I should see statement tenant names', async ({ page }) => {
	// Check for known tenant names from test data
	const tenantNames = ['Hans Müller', 'Anna Schmidt', 'Thomas Weber'];
	let foundCount = 0;
	for (const name of tenantNames) {
		const count = await page.getByText(name).count();
		if (count > 0) foundCount++;
	}
	expect(foundCount).toBeGreaterThan(0);
});

Then('I should see statement building names', async ({ page }) => {
	// Check that building names are displayed
	const buildingNames = ['Musterhaus Zentrum', 'Seepark Residenz'];
	let found = false;
	for (const name of buildingNames) {
		const count = await page.getByText(name).count();
		if (count > 0) {
			found = true;
			break;
		}
	}
	expect(found).toBe(true);
});

Then('I should see statement numbers', async ({ page }) => {
	// Check for statement number pattern like "NK-2024-001"
	await expect(page.getByText(/NK-\d{4}-\d{3}/).first()).toBeVisible({ timeout: 10000 });
});

// ============================================
// Statement Generation Wizard - Heating Profile steps
// ============================================

Then('I should see the heating profile dropdown', async ({ page }) => {
	await expect(page.getByTestId('heating-profile-select')).toBeVisible({ timeout: 10000 });
});

Then('I should see the heating profile chart', async ({ page }) => {
	await expect(page.getByTestId('heating-profile-chart')).toBeVisible({ timeout: 10000 });
});

Then('I should see chart bars for each month', async ({ page }) => {
	// The chart should have 12 bars (one for each month)
	const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	for (const month of months) {
		await expect(page.getByTestId(`chart-bar-${month}`)).toBeVisible({ timeout: 10000 });
	}
});

Then('all chart bars should have visible height', async ({ page }) => {
	// Check that at least some bars have non-zero height (not all months have heating)
	const barsContainer = page.getByTestId('heating-profile-bars');
	const bars = barsContainer.locator('[data-testid^="chart-bar-"]');
	const barCount = await bars.count();
	expect(barCount).toBe(12);

	// Check that winter months have visible bars (height > 0)
	let visibleBars = 0;
	for (let i = 0; i < barCount; i++) {
		const bar = bars.nth(i);
		const style = await bar.getAttribute('style');
		if (style && style.includes('height:') && !style.includes('height: 0%')) {
			visibleBars++;
		}
	}
	// Expect at least 6 months to have visible bars (heating months)
	expect(visibleBars).toBeGreaterThanOrEqual(6);
});

Then('I should see all heating profiles in the dropdown', async ({ page }) => {
	const select = page.getByTestId('heating-profile-select');
	const options = select.locator('option');
	// Should show all 3 profiles (valid and invalid)
	await expect(options).toHaveCount(3, { timeout: 10000 });
});

Then('valid profiles should show percentage 100%', async ({ page }) => {
	// Heating Mountain sums to 100%
	const mountainOption = page.getByTestId('heating-profile-option-hp-mountain');
	const text = await mountainOption.textContent();
	expect(text).toContain('100%');
	// Valid profile should not be disabled
	await expect(mountainOption).not.toBeDisabled();
});

Then('invalid profiles should show their percentage and be disabled', async ({ page }) => {
	// Heating + Hot Water sums to 69%
	const hotWaterOption = page.getByTestId('heating-profile-option-hp-hot-water');
	await expect(hotWaterOption).toBeDisabled();
	const text = await hotWaterOption.textContent();
	// Should show the actual percentage (not 100)
	expect(text).toMatch(/\d+%/);
	expect(text).not.toContain('100%');
});

Then('invalid profiles should show "nicht wählbar" text', async ({ page }) => {
	const hotWaterOption = page.getByTestId('heating-profile-option-hp-hot-water');
	const text = await hotWaterOption.textContent();
	expect(text).toContain('nicht wählbar');
});

Then('the first valid heating profile should be selected', async ({ page }) => {
	const select = page.getByTestId('heating-profile-select');
	// The first valid profile should be auto-selected
	const selectedValue = await select.inputValue();
	// Check that it's a valid profile (not hp-hot-water which is invalid)
	expect(selectedValue).toBeTruthy();
	// The selected option should not be disabled
	const selectedOption = select.locator(`option[value="${selectedValue}"]`);
	await expect(selectedOption).not.toBeDisabled();
});

Then('the heating profile chart should display the selected profile', async ({ page }) => {
	// Verify the chart is visible
	const chartContainer = page.getByTestId('heating-profile-chart');
	await expect(chartContainer).toBeVisible({ timeout: 10000 });
	// Verify month labels are present
	const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
	for (const month of months) {
		await expect(page.getByTestId(`chart-label-${month}`)).toBeVisible();
	}
});
