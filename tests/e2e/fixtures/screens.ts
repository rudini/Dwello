import { readFileSync } from 'fs';
import type { TestData } from './backend';

// The screens the axe check and the language check visit (tests/a11y/screens.json), and the records they need
const screenList: typeof import('../../a11y/screens.json') = JSON.parse(
	readFileSync('tests/a11y/screens.json', 'utf8')
);
export type Viewport = keyof typeof screenList.viewports;
export const viewports = screenList.viewports;
export const variants = Object.keys(screenList.viewports).flatMap((viewport) =>
	screenList.colorSchemes.map((scheme) => ({ viewport: viewport as Viewport, scheme: scheme as 'light' | 'dark' }))
);

// Query strings that put a screen into a state before it loads; a screen may override them in screens.json
const query: Record<string, string> = {
	'filtered-empty': '?search=keine-treffer-a11y',
	'login-error': '?error=failed'
};

/** Path and query string of a screen in a state, ids still as {placeholders} */
const address = (screen: { path: string; queries?: object }, state: string) =>
	screen.path + ((screen.queries as Record<string, string> | undefined)?.[state] ?? query[state] ?? '');

/** The example's address with its ids filled in, and the buildings the statement wizard checks */
export type Example = { path: string; state: string; public: boolean; building: string; tankBuilding: string };

/** A screen in a state, with the records it needs */
export async function exampleOf(seed: TestData, name: string, state: string): Promise<Example> {
	const screen = screenList.screens.find((candidate) => candidate.name === name)!;
	return { state, public: 'public' in screen && !!screen.public, ...(await seedFor(seed, address(screen, state), state)) };
}

/** Title of the document uploaded to the tenant Anna: a file name, not a German word the language check would flag */
export const UPLOADED = 'IMG_0412';

/** Records every screen with an id in its address needs */
async function seedFor(seed: TestData, path: string, state: string) {
	if (!path.includes('{') && !['delete-dialog', 'mark-paid-dialog', 'category-check', 'invoice-hints', 'preview-empty', 'fuel-stock-dialog', 'tank-question', 'every-wizard-step', 'preview-all-billed', 'buildings-billed', 'upload-dialog', 'upload-discard-dialog', 'upload-partial', 'upload-discard-created', 'upload-unreadable'].includes(state)) return { path, building: '', tankBuilding: '' };
	await seed.building('Seeblick', 'Winterthur');
	await seed.apartment('Seeblick', '1.01', 'vacant');
	await seed.apartment('Seeblick', '1.02', 'vacant');
	await seed.apartment('Seeblick', '1.03', 'vacant'); // free: never rented
	await seed.apartment('Seeblick', '1.04', 'vacant'); // free only from 2100
	await seed.tenant('Anna');
	await seed.tenant('Bruno');
	await seed.tenant('Carla');
	await seed.upload('Anna', UPLOADED);
	await seed.contract('Anna', '1.01', { startDate: '2015-01-01', baseRent: '1800.00', monthlyAdvancePayment: '200.00' });
	await seed.contract('Bruno', '1.02', { startDate: '2015-01-01', baseRent: '1500.00', monthlyAdvancePayment: '150.00' });
	await seed.contract('Carla', '1.04', { startDate: '2015-01-01', endDate: '2099-12-31', baseRent: '1400.00' });
	await seed.managementFee('Carla', false); // step «Einstellungen» of the statement wizard names her contract (#89)
	await seed.heatingProfile('Standard', [18, 16, 13, 8, 4, 1, 0, 0, 3, 9, 13, 15]);
	await seed.heatingInvoice('Seeblick', '9000.00', 2025); // Bruno pays more than his Akonto: a reminder can be sent
	await seed.fuelStock('Seeblick', '2025-12-31', '800.00'); // a Tankbestand to list and to delete
	// 2025 recorded from its start: a year to compare 2026 with; the 2025 statements take it
	const billedInvoice = await seed.invoiceOn('Seeblick', 'Hauswart', '300.00', '2025-01-31');
	await seed.belegFor(billedInvoice, '2025-01.pdf'); // its delete dialog advises to keep the Beleg first
	// the detail page shows its Beleg with what the KI saw on it, the delete dialog names it
	await seed.supplierInvoice('Hauswart Huber', 'Seeblick', '450.00', 'Treppenhausreinigung Q1', 'Hauswart', {
		fileName: 'huber-q1.pdf',
		deductedAmount: '1000.00',
		nonAllocableItems: true
	});
	await seed.statement('Anna', 'Seeblick', 2025, 'Standard');
	await seed.statement('Bruno', 'Seeblick', 2025, 'Standard');
	await seed.sendStatement('Bruno', 2025);
	await seed.paymentDeadline('Bruno', 2025, '2026-01-31'); // overdue: only then a reminder can be sent
	await seed.statement('Carla', 'Seeblick', 2023, 'Standard'); // no invoices in 2023: no positions
	await seed.heatingInvoice('Seeblick', '9000.00', 2024); // Bruno owes for 2024 too
	for (const tenant of ['Anna', 'Bruno', 'Carla']) await seed.statement(tenant, 'Seeblick', 2024, 'Standard'); // 2024 all billed
	await seed.sendStatement('Anna', 2024);
	await seed.markPaid('Anna', 2024); // paid: its payment can be reset (#92)
	// reminded today: the Zahlungsfrist of the Mahnung runs, the next one is possible only later (#107)
	await seed.sendStatement('Bruno', 2024);
	await seed.paymentDeadline('Bruno', 2024, '2025-01-31');
	await seed.remind('Bruno', 2024);
	const lateInvoice = await seed.invoiceOn('Seeblick', 'Lift', '200.00', '2025-06-30'); // recorded after the 2025 statements
	// heating costs without any Tankbestand: the wizard asks about a tank; rented, so its preview has a row too
	await seed.building('Bergsicht', 'Winterthur');
	await seed.apartment('Bergsicht', '2.01', 'vacant');
	await seed.tenant('Dora');
	await seed.contract('Dora', '2.01', { startDate: '2015-01-01', baseRent: '1600.00', additionalRent: '80.00' }); // a parking space: the wizard's note after her contract names it (#144)
	await seed.notice('Dora', '2099-03-31'); // open-ended and ended by notice: the form offers to withdraw it
	await seed.heatingInvoice('Bergsicht', '1200.00', 2025);
	// A-6 (#115): an agreed end in the past, the 2025 statement bills the time after it as Leerstand
	await seed.building('Talblick', 'Winterthur');
	await seed.apartment('Talblick', '3.01', 'vacant');
	await seed.tenant('Emil');
	await seed.contract('Emil', '3.01', { startDate: '2024-01-01', endDate: '2025-06-30', baseRent: '1300.00' });
	await seed.heatingInvoice('Talblick', '1200.00', 2025);
	await seed.statement('Emil', 'Talblick', 2025, 'Standard');
	await seed.category('Gartenpflege', true);
	await seed.distributionKey('Nach Wohnungen', '{units}');
	const ids: Record<string, string | undefined> = {
		building: seed.idOf('Seeblick'),
		apartment: seed.idOf('1.01'),
		tenant: seed.idOf('Anna'), // rents 1.01 without an end: the contract wizard's step «Wohnung» names it (#156)
		contract: seed.idOf('Mietvertrag Anna'),
		noticedContract: seed.idOf('Mietvertrag Dora'),
		expiredContract: seed.idOf('Mietvertrag Emil'),
		invoice: seed.idOf('Rechnung Hauswart Huber'),
		billedInvoice,
		lateInvoice,
		statement: seed.idOf('Abrechnung Anna 2025'),
		sentStatement: seed.idOf('Abrechnung Bruno 2025'),
		emptyStatement: seed.idOf('Abrechnung Carla 2023'),
		paidStatement: seed.idOf('Abrechnung Anna 2024'),
		remindedStatement: seed.idOf('Abrechnung Bruno 2024'),
		remindedLetter: seed.idOf('Mahnung Bruno 2024'),
		freeApartment: seed.idOf('1.03'),
		limitedApartment: seed.idOf('1.04'),
		noticedApartment: seed.idOf('2.01'), // free from 01.04.2099, after Dora's contract
		heatingProfile: seed.idOf('Standard'),
		category: seed.idOf('Gartenpflege'),
		// a predefined category shows the reason of its allocability (#186)
		predefinedCategory: await seed.predefinedCategoryId('Feuerlöscher-Wartung'),
		distributionKey: seed.idOf('Nach Wohnungen')
	};
	return {
		path: path.replace(/\{(\w+)\}/g, (_, key: string) => ids[key]!),
		building: ids.building!,
		tankBuilding: seed.idOf('Bergsicht')!
	};
}

