import { test as base } from 'playwright-bdd';
import { randomUUID } from 'crypto';
import type { Page } from '@playwright/test';
import { Actor } from './actor';

const BACKEND_API = 'http://localhost:3001/api/v1';

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
	names: Map<string, string>;
	seed: {
		building: (title: string, city: string) => Promise<void>;
		apartment: (buildingTitle: string, number: string, status: string) => Promise<void>;
		idOf: (title: string) => string | undefined;
	};
}>({
	verwalter: async ({ page }, use) => use(new Actor('Liegenschaftsverwalter', page)),

	// Gherkin name -> UUID-namespaced name. Every building registered here is removed after the scenario.
	names: async ({ request }, use) => {
		const names = new Map<string, string>();
		await use(names);
		for (const unique of names.values()) {
			const { buildings } = await (await request.get(`${BACKEND_API}/buildings`, { params: { search: unique } })).json();
			for (const building of buildings) {
				const apartmentsUrl = `${BACKEND_API}/apartments?buildingId=${building.id}&limit=100`;
				const { apartments } = await (await request.get(apartmentsUrl)).json();
				for (const apartment of apartments) await request.delete(`${BACKEND_API}/apartments/${apartment.id}`);
				await request.delete(`${BACKEND_API}/buildings/${building.id}`);
			}
		}
	},

	seed: async ({ request, names }, use) => {
		const ids = new Map<string, string>();
		await use({
			building: async (title, city) => {
				const unique = `${title} ${randomUUID()}`;
				const response = await request.post(`${BACKEND_API}/buildings`, {
					data: { name: unique, address: 'Testweg 1', postalCode: '8400', city, canton: 'ZH' }
				});
				if (!response.ok()) throw new Error(`Gebäude anlegen fehlgeschlagen: ${response.status()}`);
				names.set(title, unique);
				ids.set(title, (await response.json()).id);
			},
			apartment: async (buildingTitle, number, status) => {
				const response = await request.post(`${BACKEND_API}/apartments`, {
					data: { buildingId: ids.get(buildingTitle), number, floor: 1, area: '70', rooms: '3.5', status }
				});
				if (!response.ok()) throw new Error(`Wohnung anlegen fehlgeschlagen: ${response.status()}`);
			},
			idOf: (title) => ids.get(title)
		});
	},

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
