import { test as base } from 'playwright-bdd';
import { Actor } from '../screenplay/actor';
import { BrowseTheWeb, CallTheApi } from '../screenplay/abilities';
import { Cookies } from '../screenplay/interactions';
import { testData, type TestData } from './backend';
import { sessionCookies, sessionToken } from './session';

// Protocol driver the scenarios talk to the system through (Dave Farley): the browser, or the backend API.
// The Liegenschaftsverwalter gets the matching ability; the project "api" runs the @api scenarios with it.
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

	verwalter: async ({ driver, page, seed }, use) =>
		use(
			new Actor('Liegenschaftsverwalter').whoCan(
				driver === 'api' ? new CallTheApi(seed.backend) : new BrowseTheWeb(page)
			)
		),

	// Someone who has not signed in: same browser, no session cookies
	besucher: async ({ page }, use) => {
		const besucher = new Actor('Besucher').whoCan(new BrowseTheWeb(page));
		await besucher.attemptsTo(Cookies.clear);
		await use(besucher);
	},

	seed: async ({ request }, use) => {
		const data = testData(request, await sessionToken());
		await use(data);
		await data.cleanUp();
	},

	names: async ({ seed }, use) => use(seed.names)
});
