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

/** Records every screen with an id in its path needs; returns the path with the ids filled in */
export async function seedFor(seed: TestData, path: string, state: string) {
	if (!path.includes('{') && state !== 'delete-dialog') return path;
	await seed.building('Seeblick', 'Winterthur');
	await seed.apartment('Seeblick', '1.01', 'vacant');
	await seed.apartment('Seeblick', '1.02', 'vacant');
	await seed.tenant('Anna');
	await seed.tenant('Bruno');
	await seed.contract('Anna', '1.01', { startDate: '2015-01-01', baseRent: '1800.00', monthlyAdvancePayment: '200.00' });
	await seed.contract('Bruno', '1.02', { startDate: '2015-01-01', baseRent: '1500.00', monthlyAdvancePayment: '150.00' });
	await seed.heatingProfile('Standard', [18, 16, 13, 8, 4, 1, 0, 0, 3, 9, 13, 15]);
	await seed.heatingInvoice('Seeblick', '3600.00', 2025);
	await seed.supplierInvoice('Hauswart Huber', 'Seeblick', '450.00', 'Treppenhausreinigung Q1', 'Hauswart');
	await seed.statement('Anna', 'Seeblick', 2025, 'Standard');
	await seed.statement('Bruno', 'Seeblick', 2025, 'Standard');
	await seed.sendStatement('Bruno', 2025);
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
		heatingProfile: seed.idOf('Standard'),
		category: seed.idOf('Gartenpflege'),
		distributionKey: seed.idOf('Nach Wohnungen')
	};
	return path.replace(/\{(\w+)\}/g, (_, key: string) => ids[key]!);
}

const press = (page: Page, testid: string) => page.getByTestId(testid).click();
// Proves the state is reached before axe looks, so a state that never appears fails instead of passing silently
const shows = (page: Page, selector: string) => page.locator(selector).first().waitFor();
// Confirmation dialogs end with a button whose test id ends in -confirm
const dialog = (page: Page) => shows(page, '[data-testid$="-confirm"]');

// What a user does to reach each state
const states: Record<string, (page: Page, viewport: Viewport) => Promise<unknown>> = {
	default: async () => {},
	'filtered-empty': async (page) => shows(page, '[data-testid$="-empty"]'),
	'login-error': async (page) => shows(page, '[data-testid="login-error"]'),
	'submit-empty': async (page) => {
		await page.locator('main [type=submit]').last().click(); // the save button closes a form
		await shows(page, '[data-testid="form-error"], [aria-invalid="true"]');
	},
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
	'reminder-dialog': async (page) => {
		await press(page, 'statement-reminder-button');
		await dialog(page);
	},
	'mark-paid-dialog': async (page) => {
		await press(page, 'statement-mark-paid-button');
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
		// Only where the sidebar folds away (below md); tablet joins when the shell folds below 1024 px (stage 4)
		if (viewport !== 'mobile') return;
		await press(page, 'mobile-menu-button');
		await shows(page, '[role="dialog"][aria-label="Hauptnavigation"]');
	},
	'user-menu-open': async (page) => {
		await press(page, 'user-menu-button');
		await shows(page, '[data-testid="user-menu-settings"]');
	},
	'preview-empty': async (page) => {
		await page.getByTestId('period-start-input').fill('2000-01-01');
		await page.getByTestId('period-end-input').fill('2000-12-31');
		await press(page, 'wizard-next');
		await page.locator('[data-testid^="generate-building-"]').first().check();
		await press(page, 'wizard-next');
		await page.getByTestId('preview-empty').waitFor();
	}
};

// Query strings that put a screen into a state before it loads
const query: Record<string, string> = {
	'filtered-empty': '?search=keine-treffer-a11y',
	'login-error': '?error=failed'
};

/** Rule violations axe finds on the page as it is now, as readable lines */
async function violations(page: Page) {
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
	scheme: 'light' | 'dark',
	queries: Record<string, string> = {}
) {
	await page.setViewportSize(screenList.viewports[viewport]);
	await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
	await visit(page, path + (queries[state] ?? query[state] ?? ''));
	if (state === 'every-wizard-step') return wizardSteps(page);
	await states[state](page, viewport);
	return violations(page);
}

// Statement wizard: period, buildings, preview; every step is checked before going on
async function wizardSteps(page: Page) {
	const found = await violations(page);
	await page.getByTestId('wizard-next').click();
	const building = page.locator('[data-testid^="generate-building-"]').first();
	await building.waitFor(); // step 2 is shown
	found.push(...(await violations(page)));
	await building.check();
	await page.getByTestId('wizard-next').click();
	await page.getByTestId('preview-count').waitFor();
	found.push(...(await violations(page)));
	return found;
}
