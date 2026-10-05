import { test as base } from 'playwright-bdd';
import { Actor } from './actor';
import { testData, type TestData } from './backend';
import { sessionCookies, sessionToken } from './session';

// Protocol driver the scenarios talk to the system through (Dave Farley): the browser, or the backend API.
// Steps that interact with the system choose by `driver`; the project "api" runs the @api scenarios with it.
export type Driver = 'ui' | 'api';

// Define custom fixtures for Dwello E2E tests
export const test = base.extend<{
	driver: Driver;
	verwalter: Actor;
	besucher: Actor;
	seed: TestData;
	names: Map<string, string>;
}>({
	driver: ['ui', { option: true }],

	// Every page belongs to the signed-in Liegenschaftsverwalter
	page: async ({ page, baseURL }, use) => {
		await page.context().addCookies(await sessionCookies(baseURL!));
		await use(page);
	},

	verwalter: async ({ page }, use) => use(new Actor('Liegenschaftsverwalter', page)),

	// Someone who has not signed in: same browser, no session cookies
	besucher: async ({ page }, use) => {
		await page.context().clearCookies();
		await use(new Actor('Besucher', page));
	},

	seed: async ({ request }, use) => {
		const data = testData(request, await sessionToken());
		await use(data);
		await data.cleanUp();
	},

	names: async ({ seed }, use) => use(seed.names)
});
