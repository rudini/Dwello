import { test } from '@playwright/test';
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { changedAreas, looksTheSame, markAreas } from './changed-areas';
import { shot, statesOf } from './shots';
import { testData } from '../e2e/fixtures/backend';
import { exampleOf, viewports, type Example } from '../e2e/fixtures/screens';
import { Actor } from '../e2e/screenplay/actor';
import { BrowseTheWeb, CallTheApi } from '../e2e/screenplay/abilities';
import { sessionCookies, sessionToken } from '../e2e/fixtures/session';
import { instanceOf, lookAt } from '../e2e/tasks/accessibility';

// Routes to capture, one per line (written by affected-routes.ts); «pdf» is captured by statement-pdf.ts
const routes = readFileSync(process.env.UI_ROUTES_FILE || 'ui-routes.txt', 'utf8')
	.split('\n')
	.filter((line) => line.startsWith('/'));
const PUBLIC = ['/login'];
const BASE_URL = process.env.UI_BASE_DIR && 'http://localhost:3200'; // frontend of the base branch (playwright.screenshots.config.ts)

mkdirSync('ui-screenshots', { recursive: true });

// Every page in three looks (#697); tablet and mobile dark stay with the axe check, which sees every look
const LOOKS = [
	{ parts: [], viewport: viewports.desktop, colorScheme: 'light' },
	{ parts: ['mobile'], viewport: viewports.mobile, colorScheme: 'light' },
	{ parts: ['dark'], viewport: viewports.desktop, colorScheme: 'dark' }
] as const;

/** Keeps a shot for the comment: none when it looks as on the base branch, else the head's image with the changes
 * framed in red, and the base's next to it; ui-screenshots/shots.txt lists every shot taken, one per line */
function keep({ file, title }: ReturnType<typeof shot>, before: Buffer | undefined, after: Buffer) {
	appendFileSync('ui-screenshots/shots.txt', `${file}\t${title}\n`);
	if (!before) return writeFileSync(`ui-screenshots/${file}.png`, after);
	if (looksTheSame(before, after)) return;
	writeFileSync(`ui-screenshots/${file}.before.png`, before);
	writeFileSync(`ui-screenshots/${file}.png`, markAreas(after, changedAreas(before, after)));
}

// Record behind `[id]` of each detail page, keyed by the route in front of it
let ids: Record<string, string | undefined> = {};

// the pages share their records; one failing page skips the rest
test.describe('pages', () => {
	test.describe.configure({ mode: 'serial' });

	test.beforeAll(async ({ request }) => {
		const seed = testData(new CallTheApi(request, await sessionToken()));
		await seed.building('Seeblick', 'Winterthur');
		await seed.apartment('Seeblick', '1.01', 'vacant');
		await seed.tenant('Anna');
		await seed.contract('Anna', '1.01', {
			startDate: '2025-01-01',
			baseRent: '1800.00',
			monthlyAdvancePayment: '200.00'
		});
		await seed.heatingInvoice('Seeblick', '3600.00', 2025);
		await seed.supplierInvoice(
			'Hauswart Huber',
			'Seeblick',
			'450.00',
			'Treppenhausreinigung Q1',
			'Hauswart'
		);
		await seed.heatingProfile('Standard', [18, 16, 13, 8, 4, 1, 0, 0, 3, 9, 13, 15]);
		await seed.statement('Anna', 'Seeblick', 2025, 'Standard');
		await seed.category('Gartenpflege', true);
		await seed.distributionKey('Nach Wohnungen', '{units}');
		ids = {
			'/buildings': seed.idOf('Seeblick'),
			'/apartments': seed.idOf('1.01'),
			'/tenants': seed.idOf('Anna'),
			'/contracts': seed.idOf('Mietvertrag Anna'),
			'/invoices': seed.idOf('Rechnung Hauswart Huber'),
			'/statements': seed.idOf('Abrechnung Anna 2025'),
			'/config/heating-profiles': seed.idOf('Standard'),
			'/config/categories': seed.idOf('Gartenpflege'),
			'/config/distribution-keys': seed.idOf('Nach Wohnungen'),
			// the Kostenabstimmung of the building's billed period 2025 (#1172: without it the page answered 404 on both
			// branches and was listed as a new page)
			'/reports': `${seed.idOf('Seeblick')}?periodStart=2025-01-01&periodEnd=2025-12-31`
		};
	});

	for (const route of routes) {
		test(route, async ({ page, baseURL }) => {
			const url = route.replace(/^(.*?)\/\[\w+\]/, (_, list: string) => `${list}/${ids[list]}`);
			if (!PUBLIC.includes(route)) await page.context().addCookies(await sessionCookies(baseURL!));
			const shoot = async (origin: string) => {
				const response = await page.goto(new URL(url, origin).href, { waitUntil: 'networkidle' });
				await page.evaluate(() => document.fonts.ready);
				return { ok: response?.ok() ?? false, image: await page.screenshot({ fullPage: true }) };
			};

			for (const { parts, viewport, colorScheme } of LOOKS) {
				await page.setViewportSize(viewport);
				await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
				// The page as the base branch renders it, on the same backend and data, for marking what changed
				const before = BASE_URL ? await shoot(BASE_URL) : undefined;
				keep(
					shot(route, ...parts),
					before?.ok ? before.image : undefined,
					(await shoot(baseURL!)).image
				);
			}
		});
	}
});

// The page's dialog and wizard states of tests/a11y/screens.json, reached as the axe check reaches them (#697)
const screens: Parameters<typeof statesOf>[1] = JSON.parse(
	readFileSync('tests/a11y/screens.json', 'utf8')
).screens;

for (const route of routes) {
	for (const { screen, state } of statesOf(route, screens)) {
		test(`${route}, ${screen}, ${state}`, async ({ browser, request, baseURL, locale }) => {
			// the other instances of the stack (empty, fresh installation, demo) have no base branch to compare with
			const path = screens.find((candidate) => candidate.name === screen)!.path;
			test.skip(!!instanceOf({ state, path } as Example), 'state on another instance of the stack');
			test.setTimeout(180_000);
			// The same records for both branches, so their names match; a state that changes them on the base branch
			// would show that change on the head as well; none does: a state confirms its dialog only to be refused
			const seed = testData(new CallTheApi(request, await sessionToken()));
			const example = await exampleOf(seed, screen, state);
			// the same time on both branches: a wizard shows when its draft was saved, to the minute
			const now = new Date();
			const shots = async (origin: string) => {
				const context = await browser.newContext({ baseURL: origin, locale });
				if (!example.public) await context.addCookies(await sessionCookies(origin));
				const page = await context.newPage();
				await page.clock.setFixedTime(now);
				const images: Buffer[] = []; // one per wizard step
				await new Actor('Liegenschaftsverwalter')
					.whoCan(new BrowseTheWeb(page))
					.attemptsTo(
						lookAt(example, 'desktop', 'light', async () => {
							await page.evaluate(() => document.fonts.ready);
							images.push(await page.screenshot({ fullPage: true }));
						})
					)
					.finally(() => context.close());
				return images;
			};

			try {
				// a state the base branch does not have yet is a new one
				const before = BASE_URL ? await shots(BASE_URL).catch(() => []) : [];
				const after = await shots(baseURL!);
				after.forEach((image, step) =>
					keep(
						shot(route, screen, state, ...(after.length > 1 ? [`step-${step + 1}`] : [])),
						before[step],
						image
					)
				);
			} finally {
				await seed.cleanUp();
			}
		});
	}
}
