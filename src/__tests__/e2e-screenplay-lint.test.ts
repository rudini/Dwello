import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

// The Screenplay layers of the acceptance tests are enforced by eslint.config.js (tests/e2e/CLAUDE.md)
const eslint = new ESLint();
const problems = async (filePath: string, code: string) => {
	const [result] = await eslint.lintText(code, { filePath });
	return result.messages.map((message) => message.ruleId);
};

describe('Screenplay-Schichten der Akzeptanztests', () => {
	it('lässt einen Step zu, der nur Tasks und Questions über den Actor nutzt', async () => {
		const step = `
			import { createBdd } from 'playwright-bdd';
			import { test } from '../fixtures/test';
			import { confirmation } from '../questions/contract-form';
			import { openNewContract } from '../tasks/contract-form';
			const { When } = createBdd(test);
			When('x', async ({ verwalter }) => {
				await verwalter.attemptsTo(openNewContract);
				await verwalter.sees(confirmation).toContain('gespeichert');
			});`;
		expect(await problems('tests/e2e/steps/example.steps.ts', step)).toEqual([]);
	});

	it.each([
		["import { expect } from '@playwright/test';", 'no-restricted-imports'],
		["import { tenantSelect } from '../targets/contract-form';", 'no-restricted-imports'],
		["import { Click } from '../screenplay/interactions';", 'no-restricted-imports'],
		['await verwalter.page.goto("/");', 'no-restricted-syntax'],
		['await locator.click();', 'no-restricted-syntax'],
		["page.getByTestId('x');", 'no-restricted-syntax'],
		['expect(1).toBe(1);', 'no-restricted-syntax'],
		['When("x", async ({ page }) => {});', 'no-restricted-syntax']
	])('lehnt im Step ab: %s', async (code, rule) => {
		expect(await problems('tests/e2e/steps/example.steps.ts', code)).toContain(rule);
	});

	it.each([
		['tests/e2e/tasks/example.ts', 'await actor.page.getByTestId("x").click();'],
		['tests/e2e/tasks/example.ts', 'await field.fill("x");'],
		['tests/e2e/questions/example.ts', 'element.isVisible();'],
		['tests/e2e/questions/example.ts', 'target.locate(page);']
	])('lehnt Playwright in %s ab: %s', async (filePath, code) => {
		expect(await problems(filePath, code)).toContain('no-restricted-syntax');
	});

	it.each([
		['tests/e2e/tasks/example.ts', 'const { page } = actor.abilityTo(BrowseTheWeb);'],
		['tests/e2e/questions/example.ts', 'await page.$eval("x", () => 1);'],
		['tests/e2e/tasks/example.ts', 'await browser.mouse.wheel(0, 10);'],
		['tests/e2e/tasks/example.ts', 'await browser.keyboard.insertText("x");'],
		['tests/e2e/steps/example.steps.ts', 'await element["click"]();'],
		['tests/e2e/tasks/example.ts', "type P = import('@playwright/test').Page;"]
	])('lehnt Umwege zur Page in %s ab: %s', async (filePath, code) => {
		expect(await problems(filePath, code)).toContain('no-restricted-syntax');
	});

	it.each([
		['tests/e2e/tasks/example.ts', "import { BrowseTheWeb } from '../screenplay/abilities';"],
		['tests/e2e/steps/example.steps.ts', "import { expect as check } from 'vitest';"],
		['tests/e2e/steps/example.steps.ts', "import assert from 'node:assert';"],
		['tests/e2e/targets/example.ts', "import { Click } from '../screenplay/interactions';"]
	])('lehnt den Import in %s ab: %s', async (filePath, code) => {
		expect(await problems(filePath, code)).toContain('no-restricted-imports');
	});

	it.each([
		['tests/e2e/tasks/example.ts', 'const { BrowseTheWeb } = await import("../screenplay/abilities");'],
		['tests/e2e/steps/example.steps.ts', 'const { expect } = await import("@playwright/test");'],
		['tests/e2e/questions/example.ts', 'const playwright = require("@playwright/test");'],
		['tests/e2e/tasks/example.ts', 'const page = ability["page"];'],
		['tests/e2e/tasks/example.ts', 'await element[act]();'],
		['tests/e2e/tasks/example.ts', 'await element[`click`]();'],
		['tests/e2e/questions/example.ts', 'await actor.recall(DOWNLOAD).path();'],
		['tests/e2e/questions/example.ts', 'await api.request.post("x");'],
		['tests/e2e/fixtures/example.ts', 'export const save = (page) => page.getByTestId("save").click();'],
		['tests/e2e/fixtures/example.ts', "export const f = async ({ page }) => page.on('dialog', (d) => d.accept());"],
		['tests/e2e/fixtures/example.ts', "export const f = async ({ request }) => request.get('/api/buildings');"],
		['tests/e2e/fixtures/example.ts', 'export const f = async ({ page: browserPage }) => browserPage;'],
		['tests/e2e/targets/example.ts', "export const x = target('X', (page) => { page.on('dialog', () => {}); return page.getByTestId('x'); });"],
		['tests/e2e/targets/example.ts', "export const x = target('X', (page) => { page.url(); return page.getByTestId('x'); });"]
	])('lehnt weitere Umwege in %s ab: %s', async (filePath, code) => {
		expect(await problems(filePath, code)).toContain('no-restricted-syntax');
	});

	it.each([
		"import { BrowseTheWeb } from '../screenplay/./abilities';",
		"import { BrowseTheWeb } from '../screenplay/abilities.js';"
	])('lehnt die Ability des Browsers in Tasks auch über Pfadvarianten ab: %s', async (code) => {
		expect(await problems('tests/e2e/tasks/example.ts', code)).toContain('no-restricted-imports');
	});

	it('lässt in Fixtures Playwright-Typen und die page als Parameter zu, aber keine Playwright-Werte', async () => {
		const wiring = "import type { Page } from '@playwright/test';\nexport const f = async ({ page }: { page: Page }) => page;";
		expect(await problems('tests/e2e/fixtures/example.ts', wiring)).toEqual([]);
		const value = "import { chromium } from '@playwright/test';\nexport const browser = chromium;";
		expect(await problems('tests/e2e/fixtures/example.ts', value)).toContain('no-restricted-imports');
	});

	it.each([
		['tests/e2e/steps/example.steps.ts', "When('x', async ({ verwalter, driver }) => { if (driver === 'api') await verwalter.attemptsTo(a); });"],
		['tests/e2e/steps/example.steps.ts', "When('x', async (fixtures) => fixtures.driver);"],
		['tests/e2e/tasks/example.ts', 'export const a = (actor) => (actor.can(CallTheApi) ? api(actor) : ui(actor));'],
		['tests/e2e/questions/example.ts', 'export const q = (actor) => actor.can(CallTheApi);'],
		['tests/e2e/steps/example.steps.ts', "Then('x', async ({ verwalter }) => { if ((await verwalter.answer(q)) !== 'a') throw new Error(); });"],
		['tests/e2e/fixtures/example.ts', "export const acceptDialogs = (p) => p.on('dialog', (d) => d.accept());"]
	])('lehnt Treiber-Weichen und Prüfungen ohne sees in %s ab: %s', async (filePath, code) => {
		expect(await problems(filePath, code)).toContain('no-restricted-syntax');
	});

	it('lässt Fixtures keine Targets nutzen: Vorbedingungen laufen über die API', async () => {
		const code = "import { saveButton } from '../targets/form';";
		expect(await problems('tests/e2e/fixtures/example.ts', code)).toContain('no-restricted-imports');
	});

	it('lehnt Playwright-Importe in Tasks und Questions ab', async () => {
		const code = "import type { Page } from '@playwright/test';";
		expect(await problems('tests/e2e/tasks/example.ts', code)).toContain('no-restricted-imports');
		expect(await problems('tests/e2e/questions/example.ts', code)).toContain(
			'no-restricted-imports'
		);
	});

	it('lässt in Targets nur Fundstellen zu, keine Handlungen', async () => {
		const locate = "export const x = target('X', (page) => page.getByTestId('x'));";
		expect(await problems('tests/e2e/targets/example.ts', locate)).toEqual([]);
		const act =
			"export const x = target('X', (page) => { page.getByTestId('x').click(); return page.getByTestId('x'); });";
		expect(await problems('tests/e2e/targets/example.ts', act)).toContain('no-restricted-syntax');
	});

	it('lässt keine Ausnahme per Kommentar zu', async () => {
		const code = '/* eslint-disable no-restricted-syntax */\nawait verwalter.page.goto("/");';
		expect(await problems('tests/e2e/steps/example.steps.ts', code)).toContain('no-restricted-syntax');
	});

	it('lässt Playwright im Screenplay-Kern zu', async () => {
		expect(
			await problems('tests/e2e/screenplay/example.ts', 'await page.getByTestId("x").click();')
		).toEqual([]);
	});
});
