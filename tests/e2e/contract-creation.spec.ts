/**
 * Contract Creation E2E Test
 * Tests the full flow of creating a new contract
 */

import { test, expect } from '@playwright/test';

test.describe('Contract Creation', () => {
	test.beforeEach(async ({ page, context }) => {
		// Set up XSRF cookie (required for POST requests)
		const xsrfToken = 'test-xsrf-token-12345';
		await context.addCookies([
			{
				name: 'dwello_xsrf',
				value: xsrfToken,
				domain: 'localhost',
				path: '/'
			},
			{
				name: 'dwello_session',
				value: 'mock-jwt-token',
				domain: 'localhost',
				path: '/'
			}
		]);

		// Mock auth endpoints
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

		await page.route('**/auth/refresh', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			});
		});
	});

	test('should load contract creation page with tenants and apartments', async ({ page }) => {
		await page.goto('/contracts/new');
		await page.waitForLoadState('domcontentloaded');

		// Check page title
		await expect(page.locator('h1')).toContainText('Mietvertrag');

		// Check tenant dropdown has options
		const tenantSelect = page.locator('#tenant');
		await expect(tenantSelect).toBeVisible();
		const tenantOptions = tenantSelect.locator('option');
		const tenantCount = await tenantOptions.count();
		console.log(`Found ${tenantCount} tenant options`);
		expect(tenantCount).toBeGreaterThan(1); // More than just the placeholder

		// Check apartment dropdown has options
		const apartmentSelect = page.locator('#apartment');
		await expect(apartmentSelect).toBeVisible();
		const apartmentOptions = apartmentSelect.locator('option');
		const apartmentCount = await apartmentOptions.count();
		console.log(`Found ${apartmentCount} apartment options`);
		expect(apartmentCount).toBeGreaterThan(1);
	});

	test('should show validation errors when submitting empty form', async ({ page }) => {
		await page.goto('/contracts/new');
		await page.waitForLoadState('domcontentloaded');

		// Click submit without filling form
		await page.getByRole('button', { name: /Vertrag erstellen/i }).click();

		// Should show validation errors
		await expect(page.getByText('Bitte wählen Sie einen Mieter aus')).toBeVisible();
		await expect(page.getByText('Bitte wählen Sie eine Wohnung aus')).toBeVisible();
	});

	test('should submit contract and capture API request', async ({ page }) => {
		// Intercept the API request to see what's being sent
		let capturedRequest: { body: any; headers: Record<string, string> } | null = null;

		await page.route('**/api/contracts', async (route, request) => {
			if (request.method() === 'POST') {
				capturedRequest = {
					body: request.postDataJSON(),
					headers: Object.fromEntries(
						Object.entries(request.headers()).filter(([k]) =>
							k.toLowerCase().includes('xsrf') ||
							k.toLowerCase().includes('content-type')
						)
					)
				};
				console.log('Captured request body:', JSON.stringify(capturedRequest.body, null, 2));
				console.log('Captured request headers:', capturedRequest.headers);

				// Fulfill with success response
				await route.fulfill({
					status: 201,
					contentType: 'application/json',
					body: JSON.stringify({
						id: 'new-contract-123',
						apartmentId: capturedRequest.body?.apartmentId,
						tenantId: capturedRequest.body?.tenantId,
						startDate: capturedRequest.body?.startDate,
						baseRent: capturedRequest.body?.baseRent
					})
				});
			} else {
				await route.continue();
			}
		});

		await page.goto('/contracts/new');
		await page.waitForLoadState('domcontentloaded');

		// Fill in the form
		// Select first tenant (skip placeholder)
		await page.locator('#tenant').selectOption({ index: 1 });

		// Select first vacant apartment (skip placeholder)
		const apartmentSelect = page.locator('#apartment');
		const options = apartmentSelect.locator('option');
		const count = await options.count();
		for (let i = 1; i < count; i++) {
			const text = await options.nth(i).textContent();
			if (text?.includes('verfügbar') || text?.includes('Leer')) {
				await apartmentSelect.selectOption({ index: i });
				break;
			}
		}

		// Fill start date
		await page.locator('#startDate').fill('2026-03-01');

		// Fill rent
		await page.locator('#baseRent').fill('1500');

		// Fill advance payment (Nebenkosten)
		await page.locator('#additionalRent').fill('200');

		// Click submit
		await page.getByRole('button', { name: /Vertrag erstellen/i }).click();

		// Wait for request to be captured
		await page.waitForTimeout(1000);

		// Log what we captured
		console.log('Final captured request:', capturedRequest);

		// Verify request was made with correct structure
		expect(capturedRequest).not.toBeNull();
		expect(capturedRequest?.body).toHaveProperty('tenantId');
		expect(capturedRequest?.body).toHaveProperty('apartmentId');
		expect(capturedRequest?.body).toHaveProperty('startDate');
		expect(capturedRequest?.body).toHaveProperty('baseRent');
		expect(capturedRequest?.headers['x-xsrf-token']).toBe('test-xsrf-token-12345');
	});

	test('should test actual API call without mocking', async ({ page, context }) => {
		// This test goes through the real API to debug the 422 error
		const xsrfToken = 'real-test-xsrf-' + Date.now();

		// Set cookies
		await context.addCookies([
			{
				name: 'dwello_xsrf',
				value: xsrfToken,
				domain: 'localhost',
				path: '/'
			}
		]);

		// Listen for API responses
		page.on('response', async (response) => {
			if (response.url().includes('/api/contracts') && response.request().method() === 'POST') {
				console.log('API Response status:', response.status());
				console.log('API Response headers:', response.headers());
				try {
					const body = await response.json();
					console.log('API Response body:', JSON.stringify(body, null, 2));
				} catch (e) {
					console.log('Could not parse response body');
				}
			}
		});

		// Listen for API requests
		page.on('request', (request) => {
			if (request.url().includes('/api/contracts') && request.method() === 'POST') {
				console.log('API Request URL:', request.url());
				console.log('API Request headers:', request.headers());
				console.log('API Request body:', request.postData());
			}
		});

		await page.goto('/contracts/new');
		await page.waitForLoadState('domcontentloaded');

		// Fill in the form with valid data
		await page.locator('#tenant').selectOption({ index: 1 });

		// Find a vacant apartment
		const apartmentSelect = page.locator('#apartment');
		const options = apartmentSelect.locator('option');
		const count = await options.count();
		let selectedApartment = false;
		for (let i = 1; i < count; i++) {
			const text = await options.nth(i).textContent();
			if (text?.includes('verfügbar') || text?.includes('Leer')) {
				await apartmentSelect.selectOption({ index: i });
				selectedApartment = true;
				console.log('Selected apartment:', text);
				break;
			}
		}

		if (!selectedApartment && count > 1) {
			await apartmentSelect.selectOption({ index: 1 });
		}

		await page.locator('#startDate').fill('2026-04-01');
		await page.locator('#baseRent').fill('1800');
		await page.locator('#additionalRent').fill('250');
		await page.locator('#advancePayment').fill('100');

		// Log the form values before submit
		const tenantValue = await page.locator('#tenant').inputValue();
		const apartmentValue = await page.locator('#apartment').inputValue();
		const startDateValue = await page.locator('#startDate').inputValue();
		const baseRentValue = await page.locator('#baseRent').inputValue();

		console.log('Form values before submit:');
		console.log('  tenantId:', tenantValue);
		console.log('  apartmentId:', apartmentValue);
		console.log('  startDate:', startDateValue);
		console.log('  baseRent:', baseRentValue);

		// Click submit
		await page.getByRole('button', { name: /Vertrag erstellen/i }).click();

		// Wait and check for errors
		await page.waitForTimeout(2000);

		// Check if there's an error message on the page
		const errorMessage = page.locator('.text-red-700, .text-red-600, [class*="error"]');
		const errorCount = await errorMessage.count();
		if (errorCount > 0) {
			for (let i = 0; i < errorCount; i++) {
				const text = await errorMessage.nth(i).textContent();
				console.log('Error on page:', text);
			}
		}
	});
});
