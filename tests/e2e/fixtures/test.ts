import type { TestInfo } from '@playwright/test';
import { test as base } from 'playwright-bdd';
import { Actor } from '../screenplay/actor';
import { BrowseTheWeb, CallTheApi, CallTheMcp } from '../screenplay/abilities';
import { Cookies } from '../screenplay/interactions';
import { testData, type TestData } from './backend';
import {
	FRESH_API,
	FRESH_APP,
	FRESH_KI_STUB,
	freshAccountingPeriod,
	freshInstallation,
	resetFreshBackup,
	type FreshInstallation
} from './fresh-installation';
import { withLock, withSettingsLock } from './settings-lock';
import { sessionCookies, sessionToken } from './session';

// Protocol driver the scenarios talk to the system through (Dave Farley): the browser, or the backend API.
// The Liegenschaftsverwalter gets the matching ability; the project "api" runs the @api scenarios with it.
export type Driver = 'ui' | 'api';

// The fresh installation's scenarios take turns; the turns of the others do not count against this one's time
async function inTurn(testInfo: TestInfo, work: () => Promise<void>) {
	const timeout = testInfo.timeout;
	const waiting = Date.now();
	testInfo.setTimeout(0);
	await withLock('installation', async () => {
		testInfo.setTimeout(timeout + Date.now() - waiting);
		await work();
	});
}

// Define custom fixtures for Dwello E2E tests
export const test = base.extend<{
	driver: Driver;
	verwalter: Actor;
	besucher: Actor;
	kiProgramm: Actor;
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

	// An AI program the Liegenschaftsverwalter gave an access key (#817): it reaches only the MCP server
	kiProgramm: async ({ request }, use) => use(new Actor('KI-Programm').whoCan(new CallTheMcp(request))),

	// #1036: a scenario tagged @frische-installation changes the Abrechnungsperiode, one setting for every scenario
	// (CLAUDE.md, "No scenario"): it runs on the fresh installation, set up, in its turn, and leaves the default
	baseURL: async ({ baseURL, $tags }, use) => use($tags.includes('@frische-installation') ? FRESH_APP : baseURL),

	seed: async ({ request, $tags }, use, testInfo) => {
		const fresh = $tags.includes('@frische-installation');
		const api = new CallTheApi(request, await sessionToken(), fresh ? FRESH_API : undefined);
		const data = testData(api);
		if (!fresh) {
			await use(data);
			return data.cleanUp();
		}
		const installation = freshInstallation(api, new CallTheApi(request, '', FRESH_KI_STUB));
		await inTurn(testInfo, async () => {
			resetFreshBackup();
			await installation.setUp();
			try {
				await use(data);
				await data.cleanUp();
				await installation.cleanUp();
			} finally {
				freshAccountingPeriod(); // code review 1036-1 C-2: the next scenario starts from the default period
			}
		});
	},

	names: async ({ seed }, use) => use(seed.names),

	// The fresh installation (#577) has one account at most: its scenarios take turns and remove what they created
	frisch: async ({ request }, use, testInfo) => {
		const installation = freshInstallation(
			new CallTheApi(request, await sessionToken(), FRESH_API),
			new CallTheApi(request, '', FRESH_KI_STUB)
		);
		await inTurn(testInfo, async () => {
			resetFreshBackup(); // a look of the axe check may have left a confirmed code (tasks/accessibility.ts)
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
