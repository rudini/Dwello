import { test as base } from 'playwright-bdd';
import type { Page } from '@playwright/test';

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
}>({
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
