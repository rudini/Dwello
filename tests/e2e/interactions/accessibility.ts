import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { readFileSync } from 'fs';
import type { TestData } from '../fixtures/backend';
import { visit } from './navigation';

// WCAG levels the check enforces (docs/REDESIGN_BRIEF.md "Automated Checks")
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const screenList: typeof import('../../a11y/screens.json') = JSON.parse(
	readFileSync('tests/a11y/screens.json', 'utf8')
);
type Viewport = keyof typeof screenList.viewports;
export const screens = screenList.screens;
export const variants = Object.keys(screenList.viewports).flatMap((viewport) =>
	screenList.colorSchemes.map((scheme) => ({ viewport: viewport as Viewport, scheme: scheme as 'light' | 'dark' }))
);

// Query strings that put a screen into a state before it loads; a screen may override them in screens.json
const query: Record<string, string> = {
	'filtered-empty': '?search=keine-treffer-a11y',
	'login-error': '?error=failed'
};

/** Path and query string of a screen in a state, ids still as {placeholders} */
export const address = (screen: { path: string; queries?: object }, state: string) =>
	screen.path + ((screen.queries as Record<string, string> | undefined)?.[state] ?? query[state] ?? '');

// The building of the example being checked (one example at a time per worker); the statement wizard checks it
let exampleBuilding = '';

/** Records every screen with an id in its address needs; returns the address with the ids filled in */
export async function seedFor(seed: TestData, path: string, state: string) {
	if (!path.includes('{') && !['delete-dialog', 'mark-paid-dialog', 'category-check', 'preview-empty'].includes(state)) return path;
	await seed.building('Seeblick', 'Winterthur');
	await seed.apartment('Seeblick', '1.01', 'vacant');
	await seed.apartment('Seeblick', '1.02', 'vacant');
	await seed.apartment('Seeblick', '1.03', 'vacant'); // free: never rented
	await seed.apartment('Seeblick', '1.04', 'vacant'); // free only from 2100
	await seed.tenant('Anna');
	await seed.tenant('Bruno');
	await seed.tenant('Carla');
	await seed.contract('Anna', '1.01', { startDate: '2015-01-01', baseRent: '1800.00', monthlyAdvancePayment: '200.00' });
	await seed.contract('Bruno', '1.02', { startDate: '2015-01-01', baseRent: '1500.00', monthlyAdvancePayment: '150.00' });
	await seed.contract('Carla', '1.04', { startDate: '2015-01-01', endDate: '2099-12-31', baseRent: '1400.00' });
	await seed.heatingProfile('Standard', [18, 16, 13, 8, 4, 1, 0, 0, 3, 9, 13, 15]);
	await seed.heatingInvoice('Seeblick', '3600.00', 2025);
	await seed.invoiceOn('Seeblick', 'Hauswart', '300.00', '2025-01-31'); // 2025 recorded from its start: a year to compare 2026 with
	await seed.supplierInvoice('Hauswart Huber', 'Seeblick', '450.00', 'Treppenhausreinigung Q1', 'Hauswart');
	await seed.statement('Anna', 'Seeblick', 2025, 'Standard');
	await seed.statement('Bruno', 'Seeblick', 2025, 'Standard');
	await seed.sendStatement('Bruno', 2025);
	await seed.statement('Carla', 'Seeblick', 2023, 'Standard'); // no invoices in 2023: no positions
	await seed.category('Gartenpflege', true);
	await seed.distributionKey('Nach Wohnungen', '{units}');
	const ids: Record<string, string | undefined> = {
		building: seed.idOf('Seeblick'),
		apartment: seed.idOf('1.01'),
		tenant: seed.idOf('Anna'),
		contract: seed.idOf('Mietvertrag Anna'),
		invoice: seed.idOf('Rechnung Hauswart Huber'),
		statement: seed.idOf('Abrechnung Anna 2025'),
		sentStatement: seed.idOf('Abrechnung Bruno 2025'),
		emptyStatement: seed.idOf('Abrechnung Carla 2023'),
		freeApartment: seed.idOf('1.03'),
		limitedApartment: seed.idOf('1.04'),
		heatingProfile: seed.idOf('Standard'),
		category: seed.idOf('Gartenpflege'),
		distributionKey: seed.idOf('Nach Wohnungen')
	};
	exampleBuilding = ids.building!;
	return path.replace(/\{(\w+)\}/g, (_, key: string) => ids[key]!);
}

// 'empty' and 'first-use' need a database without records: the empty instance of the stack (playwright.config.ts)
const EMPTY_INSTANCE = 'http://localhost:3102';
const onEmptyInstance = ['empty', 'first-use'];

const press = (page: Page, testid: string) => page.getByTestId(testid).click();
// Proves the state is reached before axe looks, so a state that never appears fails instead of passing silently
const shows = (page: Page, selector: string) => page.locator(selector).first().waitFor();
// Confirmation dialogs end with a button whose test id ends in -confirm
const dialog = (page: Page) => shows(page, '[data-testid$="-confirm"]');

// The statement wizard's preview of a calendar year for this example's building, heating profile and fee as proposed
async function previewOf(page: Page, year: string, shown: string) {
	await page.getByTestId('period-start-input').fill(`${year}-01-01`);
	await page.getByTestId('period-end-input').fill(`${year}-12-31`);
	await press(page, 'wizard-next');
	await page.getByTestId(`generate-building-${exampleBuilding}`).check();
	await press(page, 'wizard-next');
	await press(page, 'wizard-next');
	await page.getByTestId(shown).waitFor();
}

// What a user does to reach each state
const states: Record<string, (page: Page, viewport: Viewport) => Promise<unknown>> = {
	default: async () => {},
	'filtered-empty': async (page) => shows(page, '[data-testid$="-empty"]'),
	empty: async (page) => shows(page, '[data-testid$="-empty"]'),
	'first-use': async (page) => page.getByText('Erstes Gebäude erfassen').waitFor(),
	'login-error': async (page) => shows(page, '[data-testid="login-error"]'),
	'submit-empty': async (page) => {
		await page.locator('main [type=submit]').last().click(); // the save button closes a form
		await shows(page, '[data-testid="form-error"], [aria-invalid="true"]');
	},
	'submit-cleared': async (page) => {
		const required = 'main :is(input, textarea)[aria-required="true"]:not([type=radio], [type=checkbox])';
		for (const field of await page.locator(required).all()) await field.fill('');
		await page.locator('main [type=submit]').last().click();
		await shows(page, '[data-testid="form-error"], [aria-invalid="true"]');
	},
	'saved-toast': async (page) => {
		await page.locator('main [type=submit]').last().click(); // saved as loaded
		await shows(page, '[data-testid="toast-success"]');
	},
	'server-error': async (page) => page.getByText('Versuchen Sie es später erneut.').waitFor(),
	'delete-dialog': async (page) => {
		await page.locator('[data-testid$="-delete-button"]').first().click();
		await dialog(page);
	},
	'dialog-open': async (page) => {
		await page.getByTestId('gallery-open-dialog').press('Enter'); // by keyboard: the gallery's toasts cover the page
		await shows(page, '[role="dialog"]');
	},
	'busy-dialog-open': async (page) => {
		await page.getByTestId('gallery-open-busy-dialog').press('Enter');
		await shows(page, '[role="dialog"][aria-labelledby]');
	},
	'end-dialog': async (page) => {
		await press(page, 'contract-end-button');
		await dialog(page);
	},
	'send-dialog': async (page) => {
		await press(page, 'statement-send-button');
		await dialog(page);
	},
	'action-error': async (page) => {
		// As from a tab that still shows the draft: deleting the sent statement is refused by the server
		await page.evaluate(() => {
			const form = Object.assign(document.createElement('form'), { method: 'POST', action: '?/delete' });
			document.body.append(form);
			form.submit();
		});
		await shows(page, '[data-testid="form-error"]');
	},
	'reminder-dialog': async (page) => {
		await press(page, 'statement-reminder-button');
		await dialog(page);
	},
	'mark-paid-dialog': async (page) => {
		// the detail page's button, or the first one in the list
		await page.locator('[data-testid="statement-mark-paid-button"], [data-testid="statement-row-mark-paid"]').first().click();
		await dialog(page);
	},
	'formula-tested': async (page) => {
		await page.getByTestId('distribution-key-formula-input').fill('{area}');
		await press(page, 'distribution-key-test-button');
		await page.getByTestId('formula-test-result').or(page.getByTestId('formula-test-error')).first().waitFor();
	},
	'profile-sum-invalid': async (page) => {
		await page.getByTestId('heating-profile-month-january').fill('50');
		await shows(page, '[data-testid="heating-profile-form-total"].text-critical');
	},
	'mobile-menu-open': async (page, viewport) => {
		if (viewport === 'desktop') return; // the sidebar is always open from 1024 px
		await press(page, 'mobile-menu-button');
		await shows(page, '[role="dialog"][aria-label="Hauptnavigation"]');
	},
	'user-menu-open': async (page) => {
		await press(page, 'user-menu-button');
		await shows(page, '[data-testid="user-menu-settings"]');
	},
	'overlap-warning': async (page) => {
		await page.getByTestId('wizard-next').click(); // tenant and apartment come from the address
		await page.getByTestId('wizard-next').click();
		await page.getByTestId('start-date-input').fill('2020-01-01'); // the apartment is rented until 2099
		await shows(page, '[data-testid="overlap-warning"]');
	},
	'draft-restored': async (page) => {
		await startDraft[new URL(page.url()).pathname](page); // a draft starts with an input
		await page.getByTestId('save-status').getByText('Entwurf gespeichert').waitFor();
		await page.reload();
		await shows(page, '[data-testid="draft-restored"]');
	},
	// 2026 against 2025: the heating invoice of 2025 has no successor yet
	'category-check': (page) => previewOf(page, '2026', 'category-check'),
	'preview-empty': (page) => previewOf(page, '2000', 'preview-empty')
};

/** Rule violations axe finds on the page as it is now, as readable lines */
async function violations(page: Page) {
	// From the top of the page: a scrolled page slides content under the sticky header, and target-size would
	// then judge a 48 px link by the part the header leaves visible
	await page.evaluate(() => window.scrollTo(0, 0));
	const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze();
	return violations.flatMap((violation) =>
		violation.nodes.map((node) => `${violation.id}: ${violation.help} – ${node.target.join(' ')}`)
	);
}

/** Opens the screen in the state for one viewport and colour scheme and returns what axe finds */
export async function check(
	page: Page,
	path: string,
	state: string,
	viewport: Viewport,
	scheme: 'light' | 'dark'
) {
	await page.setViewportSize(screenList.viewports[viewport]);
	await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
	await page.evaluate(() => localStorage.clear()).catch(() => {}); // no draft from the previous viewport
	await visit(page, onEmptyInstance.includes(state) ? EMPTY_INSTANCE + path : path);
	if (state === 'every-wizard-step') return wizards[new URL(path, 'http://x').pathname](page);
	await states[state](page, viewport);
	return violations(page);
}

// Rental contract wizard, tenant and a free apartment from the address: every step up to "Prüfen"
async function contractWizardSteps(page: Page) {
	const found = await violations(page); // "Mieter"
	const nextStep = async (shown: string) => {
		await press(page, 'wizard-next');
		await page.getByTestId(shown).first().waitFor();
	};
	await nextStep('apartment-select'); // "Wohnung", once the apartments are checked
	found.push(...(await violations(page)));
	await nextStep('start-date-input'); // "Vertragsdauer", limited: end date and both dates in words
	await page.getByTestId('contract-duration').getByText('Befristet', { exact: true }).click();
	await page.getByTestId('start-date-input').fill('2030-01-01');
	await page.getByTestId('end-date-input').fill('2031-12-31');
	found.push(...(await violations(page)));
	await nextStep('contract-base-rent-input'); // "Miete"
	await page.getByTestId('contract-base-rent-input').fill('1500');
	found.push(...(await violations(page)));
	await nextStep('contract-review-item'); // "Prüfen"
	found.push(...(await violations(page)));
	return found;
}

// Statement wizard: period, buildings, preview; every step is checked before going on
async function statementWizardSteps(page: Page) {
	const found = await violations(page); // "Abrechnungsperiode"
	const building = page.locator('[data-testid^="generate-building-"]').first();
	const nextStep = async (shown: string) => {
		await press(page, 'wizard-next');
		await page.getByTestId(shown).first().waitFor();
		found.push(...(await violations(page)));
	};
	await nextStep('generate-all-buildings'); // "Gebäude"
	await building.check();
	await nextStep('heating-profile-select'); // "Heizprofil und Verwaltungspauschale"
	await nextStep('preview-count'); // "Vorschau", calculated on the server
	const confirm = page.getByTestId('confirm-missing-invoices');
	if (await confirm.isVisible()) await confirm.check(); // a building without invoices must be confirmed
	await nextStep('generate-drafts-note'); // "Erstellen"
	return found;
}

// The first input of each wizard, which starts its draft
const startDraft: Record<string, (page: Page) => Promise<unknown>> = {
	'/contracts/new': (page) => page.getByTestId('contract-tenant-select').selectOption({ index: 1 }),
	'/statements/generate': async (page) => {
		await press(page, 'wizard-next');
		await page.locator('[data-testid^="generate-building-"]').first().check();
	}
};

const wizards: Record<string, (page: Page) => Promise<string[]>> = {
	'/contracts/new': contractWizardSteps,
	'/statements/generate': statementWizardSteps
};
