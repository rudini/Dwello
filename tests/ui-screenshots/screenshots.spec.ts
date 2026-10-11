import { test } from '@playwright/test';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { changedAreas, looksTheSame } from './changed-areas';
import { testData } from '../e2e/fixtures/backend';
import { sessionCookies, sessionToken } from '../e2e/fixtures/session';

// Routes to capture, one per line (written by affected-routes.ts); «pdf» is captured by statement-pdf.ts
const routes = readFileSync(process.env.UI_ROUTES_FILE || 'ui-routes.txt', 'utf8')
	.split('\n')
	.filter((line) => line.startsWith('/'));
const PUBLIC = ['/login'];
const BASE_URL = process.env.UI_BASE_DIR && 'http://localhost:3200'; // frontend of the base branch (playwright.screenshots.config.ts)

mkdirSync('ui-screenshots', { recursive: true });

// Record behind `[id]` of each detail page, keyed by the route in front of it
let ids: Record<string, string | undefined> = {};

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
	const seed = testData(request, await sessionToken());
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
		'/config/distribution-keys': seed.idOf('Nach Wohnungen')
	};
});

for (const route of routes) {
	test(route, async ({ page, baseURL }) => {
		const url = route.replace(/^(.*?)\/\[\w+\]/, (_, list: string) => `${list}/${ids[list]}`);
		const file = `ui-screenshots/${
			route
				.split(/[/[\]]+/)
				.filter(Boolean)
				.join('_') || 'home'
		}`;
		if (!PUBLIC.includes(route)) await page.context().addCookies(await sessionCookies(baseURL!));
		const shoot = async (origin: string) => {
			const response = await page.goto(new URL(url, origin).href, { waitUntil: 'networkidle' });
			await page.evaluate(() => document.fonts.ready);
			return { ok: response?.ok() ?? false, image: await page.screenshot({ fullPage: true }) };
		};

		// The page as the base branch renders it, on the same backend and data, for marking what changed
		const before = BASE_URL ? await shoot(BASE_URL) : undefined;
		const after = await shoot(baseURL!);
		if (!before?.ok) return writeFileSync(`${file}.png`, after.image);
		// no file: the comment lists the page as unchanged
		if (looksTheSame(before.image, after.image)) return;
		writeFileSync(`${file}.before.png`, before.image);

		const areas = changedAreas(before.image, after.image);
		await page.evaluate((areas) => {
			for (const { x, y, width, height } of areas) {
				const mark = document.createElement('div');
				mark.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${width}px;height:${height}px;outline:3px solid #dc2626;outline-offset:2px;pointer-events:none;z-index:2147483647`;
				document.documentElement.append(mark);
			}
		}, areas);
		await page.screenshot({ path: `${file}.png`, fullPage: true });
	});
}
