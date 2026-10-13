import { readdirSync } from 'fs';
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

	// Schluss-Review M-1: kein Wechsel zwischen UI und API im Step, kein Backend und kein expect am Actor vorbei
	it.each([
		["When('a', async ({ driver }) => { if (driver === 'api') return; });", 'no-restricted-syntax'],
		["await seed.backend.post('statements/generate', {});", 'no-restricted-syntax'],
		['test.expect(1).toBe(1);', 'no-restricted-syntax']
	])('lehnt im Step ab: %s', async (code, rule) => {
		expect(await problems('tests/e2e/steps/example.steps.ts', code)).toContain(rule);
	});

	// Schluss-Review M-2: Questions fragen nur, Fixtures reichen keine Handlungen an Steps weiter
	const restricted = async (filePath: string, code: string) =>
		(await problems(filePath, code)).filter((rule) => rule?.startsWith('no-restricted-'));
	it.each([
		[
			'tests/e2e/questions/example.ts',
			"import { Click } from '../screenplay/interactions';\nexport const x = Click;"
		],
		['tests/e2e/questions/example.ts', 'export const x = (actor) => actor.attemptsTo(open);'],
		[
			'tests/e2e/fixtures/example.ts',
			"import { saveButton } from '../targets/contract-form';\nexport const x = saveButton;"
		],
		[
			'tests/e2e/fixtures/example.ts',
			"import { Click } from '../screenplay/interactions';\nexport const x = Click;"
		]
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
	});

	// Schluss-Review, Minor: eine Prüfung per throw im Step, eine Question, die wartet
	it.each([
		['tests/e2e/steps/example.steps.ts', "if (!text) throw new Error('missing');"],
		['tests/e2e/questions/example.ts', 'await new Promise((r) => setTimeout(r, 5000));']
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
	});

	// Re-Review, Minor: dieselben Umwege ohne Destrukturieren, über globalThis oder über einen Namespace
	it.each([
		['tests/e2e/steps/example.steps.ts', "When('a', async (fx) => fx.driver);"],
		['tests/e2e/steps/example.steps.ts', 'const { backend } = seed;'],
		['tests/e2e/steps/example.steps.ts', 'const { expect: e } = test;'],
		['tests/e2e/questions/example.ts', 'await new Promise((r) => globalThis.setTimeout(r, 5000));'],
		['tests/e2e/questions/example.ts', 'export const q = async (actor) => { await goToNextStep(actor); };'],
		['tests/e2e/fixtures/example.ts', "import * as I from '../screenplay/interactions';\nexport const x = I;"],
		['tests/e2e/fixtures/example.ts', "export { Click } from '../screenplay/interactions';"],
		['tests/e2e/fixtures/example.ts', "export * from '../screenplay/interactions';"]
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
	});

	// Schluss-Review Endstand, M-1: ausserhalb der Schichtordner gelten dieselben Grenzen
	it.each([
		"import { expect } from '@playwright/test';\nexport const x = expect;",
		'export const clickSave = async (actor) => { const { page } = actor.abilityTo(Web); await page.getByTestId("s").click(); };'
	])('lehnt in einem Helfer-Ordner ab: %s', async (code) => {
		expect(await restricted('tests/e2e/helpers/example.ts', code)).not.toEqual([]);
	});

	it('hat in tests/e2e nur die Schichtordner', () => {
		const layers = ['features', 'fixtures', 'questions', 'screenplay', 'steps', 'targets', 'tasks'];
		const dirs = readdirSync('tests/e2e', { withFileTypes: true })
			.filter((entry) => entry.isDirectory())
			.map((entry) => entry.name);
		expect(dirs.filter((dir) => !layers.includes(dir))).toEqual([]);
	});

	// Schluss-Review Endstand, Minors
	it.each([
		['tests/e2e/tasks/example.ts', 'await test.expect.poll(() => 1).toBe(1);'],
		['tests/e2e/questions/example.ts', 'const { expect: check } = test;'],
		['tests/e2e/questions/example.ts', 'export const q = async (actor) => actor.sees(other).toBe(1);'],
		['tests/e2e/questions/example.ts', 'while (!(await actor.answer(ready))) {}'],
		['tests/e2e/tasks/example.ts', "await fetch('http://localhost:3101/api/v1/buildings');"],
		['tests/e2e/steps/example.steps.ts', 'await new Promise((r) => setTimeout(r, 1000));'],
		['tests/e2e/fixtures/example.ts', "import { openDashboard } from '../tasks/dashboard';\nexport const x = openDashboard;"]
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
	});

	it('lässt in Fixtures aus den Interactions nur die Cookies zu', async () => {
		const code = "import { Cookies } from '../screenplay/interactions';\nexport const x = Cookies;";
		expect(await restricted('tests/e2e/fixtures/example.ts', code)).toEqual([]);
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
