import { test as base } from 'playwright-bdd';
import { Actor } from '../screenplay/actor';
import { BrowseTheWeb, CallTheApi } from '../screenplay/abilities';
import { Cookies } from '../screenplay/interactions';
import { testData, type TestData } from './backend';
import { FRESH_API, FRESH_KI_STUB, freshInstallation, type FreshInstallation } from './fresh-installation';
import { withLock, withSettingsLock } from './settings-lock';
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
	frisch: FreshInstallation;
	globalSettings: void;
}>({
	driver: ['ui', { option: true }],

	// Every page belongs to the signed-in Liegenschaftsverwalter
	page: async ({ page, baseURL }, use) => {
		const signedIn = new Actor('Liegenschaftsverwalter').whoCan(new BrowseTheWeb(page));
		await signedIn.attemptsTo(Cookies.add(await sessionCookies(baseURL!)));
		await use(page);
	},

	verwalter: async ({ driver, page, seed }, use) =>
		use(
			new Actor('Liegenschaftsverwalter').whoCan(
				driver === 'api' ? seed.backend : new BrowseTheWeb(page)
			)
		),

	// Someone who has not signed in: same browser, no session cookies
	besucher: async ({ page }, use) => {
		const besucher = new Actor('Besucher').whoCan(new BrowseTheWeb(page));
		await besucher.attemptsTo(Cookies.clear);
		await use(besucher);
	},

	seed: async ({ request }, use) => {
		const data = testData(new CallTheApi(request, await sessionToken()));
		await use(data);
		await data.cleanUp();
	},

	names: async ({ seed }, use) => use(seed.names),

	// The fresh installation (#577) has one account at most: its scenarios take turns and remove what they created
	frisch: async ({ request }, use, testInfo) => {
		const installation = freshInstallation(
			new CallTheApi(request, await sessionToken(), FRESH_API),
			new CallTheApi(request, '', FRESH_KI_STUB)
		);
		// the turns of the other scenarios do not count against this one's time
		const timeout = testInfo.timeout;
		const waiting = Date.now();
		testInfo.setTimeout(0);
		await withLock('installation', async () => {
			testInfo.setTimeout(timeout + Date.now() - waiting);
			await use(installation);
			await installation.cleanUp();
		});
	},

	// A scenario tagged @einstellungen-global saves the IBAN and reads it back: it has the settings to itself (O-34)
	globalSettings: [
		async ({ $tags }, use) =>
			$tags.includes('@einstellungen-global') ? withSettingsLock(() => use()) : use(),
		{ auto: true }
	]
});
