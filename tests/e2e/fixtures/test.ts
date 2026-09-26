import { test as base } from 'playwright-bdd';
import type { Page } from '@playwright/test';
import { Actor } from './actor';
import { testData, type TestData } from './backend';
import { sessionCookies } from './session';

// Define custom fixtures for Dwello E2E tests
export const test = base.extend<{
	authenticatedPage: Page;
	mockUser: {
		sub: string;
		email: string;
		name: string;
		provider: string;
		picture?: string;
	};
	verwalter: Actor;
	seed: TestData;
	names: Map<string, string>;
}>({
	verwalter: async ({ page, baseURL }, use) => {
		await page.context().addCookies(await sessionCookies(baseURL!));
		await use(new Actor('Liegenschaftsverwalter', page));
	},

	seed: async ({ request }, use) => {
		const data = testData(request);
		await use(data);
		await data.cleanUp();
	},

	names: async ({ seed }, use) => use(seed.names),

	// Default mock user
	mockUser: async ({}, use) => {
		await use({
			sub: 'test-user-123',
			email: 'test@example.com',
			name: 'Test User',
			provider: 'google',
			picture: 'https://example.com/avatar.jpg'
		});
	},

	// Page with authenticated state
	authenticatedPage: async ({ page, mockUser }, use) => {
		// Mock authenticated state
		await page.route('**/auth/me', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ user: mockUser })
			});
		});

		// Mock logout to succeed
		await page.route('**/auth/logout', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			});
		});

		// Mock token refresh to succeed
		await page.route('**/auth/refresh', async (route) => {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ success: true })
			});
		});

		await use(page);
	}
});
