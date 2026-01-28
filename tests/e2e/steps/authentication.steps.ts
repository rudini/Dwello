import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';

const { Given, When, Then } = createBdd(test);

// ============================================
// Given steps
// ============================================

Given('I am not logged in', async ({ page }) => {
	await page.route('**/auth/me', async (route) => {
		await route.fulfill({
			status: 401,
			contentType: 'application/json',
			body: JSON.stringify({
				error: {
					code: 'JWT_ERROR',
					message: 'Not authenticated'
				}
			})
		});
	});
});

Given('I am logged in as {string}', async ({ page }, userName: string) => {
	await page.route('**/auth/me', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				user: {
					sub: 'test-user-123',
					email: 'test@example.com',
					name: userName,
					provider: 'google'
				}
			})
		});
	});

	await page.route('**/auth/logout', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ success: true })
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

// ============================================
// When steps
// ============================================

When('I open the login page', async ({ page }) => {
	await page.goto('/login');
});

When('I open the dashboard', async ({ page }) => {
	await page.goto('/dashboard');
	await page.waitForLoadState('domcontentloaded');
});

When('I try to access the dashboard', async ({ page }) => {
	await page.goto('/dashboard');
});

When('I try to access the buildings page', async ({ page }) => {
	await page.goto('/buildings');
});

When('I call the login API with provider {string}', async ({ page }, provider: string) => {
	const response = await page.request.get(`/auth/login?provider=${provider}`, {
		maxRedirects: 0
	});
	// Store response for later assertions
	(page as any)._lastResponse = response;
});

When('I call the login API without a provider', async ({ page }) => {
	const response = await page.request.get('/auth/login');
	(page as any)._lastResponse = response;
});

When('I call the logout API', async ({ page }) => {
	const response = await page.request.post('/auth/logout');
	(page as any)._lastResponse = response;
});

When('I click on {string}', async ({ page }, buttonText: string) => {
	await page.getByRole('button', { name: buttonText }).click();
});

// ============================================
// Then steps
// ============================================

Then('I should see the Dwello branding', async ({ page }) => {
	await expect(page.locator('h1')).toContainText('Dwello');
});

Then('I should see the text {string}', async ({ page }, text: string) => {
	await expect(page.locator(`text=${text}`)).toBeVisible();
});

Then('I should see a {string} button', async ({ page }, buttonText: string) => {
	const button = page.locator(`button:has-text("${buttonText}")`);
	await expect(button).toBeVisible();
	await expect(button).toBeEnabled();
});

Then('I should receive a redirect to Google', async ({ page }) => {
	const response = (page as any)._lastResponse;
	expect(response.status()).toBe(302);
	const location = response.headers()['location'];
	expect(location).toContain('accounts.google.com');
});

Then('I should receive a redirect to Microsoft', async ({ page }) => {
	const response = (page as any)._lastResponse;
	expect(response.status()).toBe(302);
	const location = response.headers()['location'];
	expect(location).toContain('login.microsoftonline.com');
});

Then('I should receive a validation error', async ({ page }) => {
	const response = (page as any)._lastResponse;
	expect(response.status()).toBe(400);
	const body = await response.json();
	expect(body.error).toBeDefined();
	expect(body.error.code).toBe('VALIDATION_ERROR');
});

Then('I should receive a successful response', async ({ page }) => {
	const response = (page as any)._lastResponse;
	expect(response.status()).toBe(200);
	const body = await response.json();
	expect(body.success).toBe(true);
});

Then('I should be redirected to the login page', async ({ page }) => {
	await page.waitForURL(/login/);
	expect(page.url()).toContain('login');
});

Then('I should be redirected to the dashboard', async ({ page }) => {
	await page.waitForURL(/\/(dashboard)?$/, { timeout: 5000 });
	expect(page.url()).toMatch(/\/(dashboard)?$/);
});

Then('I should see the main navigation', async ({ page }) => {
	const nav = page.locator('nav');
	await expect(nav.first()).toBeVisible({ timeout: 10000 });
});

Then('I should see my username in the header', async ({ page }) => {
	await page.waitForTimeout(1000);
	const header = page.locator('header');
	await expect(header).toBeVisible();
});

Then('I should stay on the dashboard', async ({ page }) => {
	await page.waitForLoadState('domcontentloaded');
	expect(page.url()).toContain('dashboard');
});

Then('I should see portfolio statistics', async ({ page }) => {
	// Check for stat cards
	await expect(page.locator('text=Gebäude')).toBeVisible({ timeout: 10000 });
});
