import { test } from '@playwright/test';
import { readFileSync } from 'fs';
import { testData } from '../e2e/fixtures/backend';
import { sessionCookies, sessionToken } from '../e2e/fixtures/session';

// Routes to capture, one per line (written by affected-routes.ts)
const routes = readFileSync(process.env.UI_ROUTES_FILE || 'ui-routes.txt', 'utf8').split('\n').filter(Boolean);
const PUBLIC = ['/login'];

// Record behind `[id]` of each detail page, keyed by the route in front of it
let ids: Record<string, string | undefined> = {};

test.describe.configure({ mode: 'serial' });

test.beforeAll(async ({ request }) => {
	const seed = testData(request, await sessionToken());
	await seed.building('Seeblick', 'Winterthur');
	await seed.apartment('Seeblick', '1.01', 'vacant');
	await seed.tenant('Anna');
	await seed.contract('Anna', '1.01', { startDate: '2025-01-01', baseRent: '1800.00', monthlyAdvancePayment: '200.00' });
	await seed.heatingInvoice('Seeblick', '3600.00', 2025);
	await seed.supplierInvoice('Hauswart Huber', 'Seeblick', '450.00', 'Treppenhausreinigung Q1', 'Hauswart');
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
		if (!PUBLIC.includes(route)) await page.context().addCookies(await sessionCookies(baseURL!));
		await page.goto(url, { waitUntil: 'networkidle' });
		await page.evaluate(() => document.fonts.ready);
		await page.screenshot({ path: `ui-screenshots/${route.split(/[/[\]]+/).filter(Boolean).join('_') || 'home'}.png`, fullPage: true });
	});
}
