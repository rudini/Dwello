import { execFileSync } from 'child_process';
import { readFileSync } from 'fs';
import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

// The Screenplay layers of the acceptance tests are enforced by eslint.config.js (tests/e2e/CLAUDE.md)
const eslint = new ESLint();
const problems = async (filePath: string, code: string) => {
	const [result] = await eslint.lintText(code, { filePath });
	return result.messages.map((message) => message.ruleId);
};

// The files git knows or will know below tests/e2e, split into their parts; ignored tool caches (fallow's .fallow/
// carries its own .gitignore) are not part of the layers
const e2eFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', 'tests/e2e'], {
	encoding: 'utf8'
})
	.split('\n')
	.filter(Boolean)
	.map((path) => path.split('/').slice(2));

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
		const dirs = new Set(e2eFiles.filter((parts) => parts.length > 1).map(([dir]) => dir));
		expect([...dirs].filter((dir) => !layers.includes(dir))).toEqual([]);
	});

	// Schluss-Review Endstand 2, M-1: der Lint prüft nur .ts, also gibt es nur .ts (neben Szenarien und Doku)
	it('hat in tests/e2e nur TypeScript, Szenarien und Doku', () => {
		const names = e2eFiles.map((parts) => parts.join('/'));
		expect(names.filter((name) => !/\.(ts|feature|md)$/.test(name) || /\.d\.ts$/.test(name))).toEqual([]);
	});

	// Schluss-Review Endstand 3, M-1: der Kern ist kein Helfer-Ordner; oben in tests/e2e liegt nur die Doku
	it('hält den Screenplay-Kern bei seinen fünf Dateien und die Schichten flach', () => {
		const core = e2eFiles.filter(([dir]) => dir === 'screenplay').map((parts) => parts.slice(1).join('/'));
		expect(core.sort()).toEqual([
			'abilities.ts',
			'actor.ts',
			'interactions.ts',
			'questions.ts',
			'target.ts'
		]);
		expect(e2eFiles.filter((parts) => parts.length > 2).map((parts) => parts.join('/'))).toEqual([]);
		expect(e2eFiles.filter((parts) => parts.length === 1).map(([name]) => name)).toEqual(['CLAUDE.md']);
	});

	// Schluss-Review Endstand 4: Freigabelisten statt Sperrlisten
	it('lässt in target.ts nur die Fundstellen-Bausteine des Kerns zu', async () => {
		const core = await import('../../tests/e2e/screenplay/target');
		expect(Object.keys(core).sort()).toEqual(['hydratedPage', 'target']);
		expect(readFileSync('tests/e2e/screenplay/target.ts', 'utf8')).not.toMatch(/^export (?!type Target |const (target|hydratedPage) )/m);
	});

	// Schluss-Review Endstand 5, m-2: der Kern sucht im Browser nur mit festen, allgemeinen Selektoren
	it('sucht im Kern nur mit den freigegebenen Selektoren', () => {
		const allowed = [
			"':scope > legend'",
			"'[aria-label], [title], [placeholder], [alt]'",
			"'input[type=submit], input[type=button]'",
			"'*'",
			"'script, style, noscript, #language-menu'",
			`'.sr-only, [role="region"], #svelte-announcer'`,
			'id' // getElementById for the ids an aria-labelledby or aria-describedby names
		];
		const used = e2eFiles.filter(([dir]) => dir === 'screenplay').map(([, file]) => file).flatMap((file) =>
			[...readFileSync(`tests/e2e/screenplay/${file}`, 'utf8').matchAll(/\b(?:querySelector(?:All)?|closest|getElementById|getElementsBy\w+|elementFromPoint|elementsFromPoint)(?:<[^>]*>)?\(([^)]*)\)/g)].map(
				([, argument]) => argument.trim()
			)
		);
		expect(used.filter((argument) => !allowed.includes(argument))).toEqual([]);
	});

	it.each([
		['tests/e2e/screenplay/interactions.ts', "await pageOf(actor).click('[data-testid=\"save\"]');"],
		['tests/e2e/screenplay/questions.ts', 'await page.textContent(sel);'],
		['tests/e2e/screenplay/interactions.ts', "await pageOf(actor).evaluate(() => document.querySelector('x').click());"],
		['tests/e2e/screenplay/questions.ts', "await page.evaluate(() => document.body.querySelector('[data-testid=x]'));"],
		['tests/e2e/steps/example.steps.ts', 'for (let i = 0; i < 5; i++) if (await verwalter.answer(confirmation)) break;'],
		['tests/e2e/steps/example.steps.ts', "import { save } from '../../support/web';\nexport const x = save;"],
		['tests/e2e/steps/example.steps.ts', "import { save } from 'some-helper';\nexport const x = save;"],
		['tests/e2e/tasks/example.ts', "import { save } from '../../support/web';\nexport const x = save;"],
		['tests/e2e/questions/example.ts', "import { save } from '../../support/web';\nexport const x = save;"],
		['tests/e2e/targets/example.ts', 'await new Promise((r) => setTimeout(r, 1));'],
		['tests/e2e/targets/example.ts', "await fetch('http://localhost:3101');"]
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
	});

	// Schluss-Review Endstand 5: M-1 Nachfragen über try/catch, m-1, m-4, m-5
	it.each([
		['tests/e2e/steps/example.steps.ts', "try { await verwalter.sees(confirmation).toContain('x'); } catch { await verwalter.attemptsTo(reloadPage); }"],
		['tests/e2e/steps/example.steps.ts', 'await verwalter.sees(confirmation).toContain("x").catch(() => verwalter.attemptsTo(reloadPage));'],
		['tests/e2e/steps/example.steps.ts', 'await verwalter.sees(confirmation).toContain("x").then(() => true, () => false);'],
		['tests/e2e/screenplay/interactions.ts', 'await actor.abilityTo(BrowseTheWeb).page.click(sel);'],
		['tests/e2e/screenplay/interactions.ts', 'await pageOf(actor).mouse.click(1, 2);'],
		['tests/e2e/screenplay/interactions.ts', "export { clickSave } from '../../zzsupport/web';"],
		['tests/e2e/screenplay/questions.ts', "import { x } from '../../zzsupport/web';\nexport const y = x;"],
		['tests/e2e/screenplay/questions.ts', 'if (test.info().project.name === "api") return;'],
		['tests/e2e/screenplay/interactions.ts', 'await new Promise((r) => setTimeout(r, 1));'],
		['tests/e2e/targets/example.ts', "import { setTimeout as pause } from 'node:timers/promises';\nexport const x = pause;"],
		['tests/e2e/targets/example.ts', "import { x } from '../../zzsupport/web';\nexport const y = x;"]
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
	});

	// Schluss-Review Endstand 6: M-1 Handlung über seed im When/Then, Minors
	it.each([
		['tests/e2e/steps/example.steps.ts', "When('x', async ({ seed }) => { await seed.sendStatement('a', 2024); });"],
		['tests/e2e/steps/example.steps.ts', "Then('x', async ({ seed }) => { await seed.statement('a', 'b', 2024); });"],
		['tests/e2e/steps/example.steps.ts', 'await confirmation.answeredBy(verwalter);'],
		['tests/e2e/steps/example.steps.ts', 'await Promise.allSettled([verwalter.sees(q).toBe(1)]);'],
		['tests/e2e/steps/example.steps.ts', "verwalter.sees(confirmation).toContain('x');"],
		['tests/e2e/steps/example.steps.ts', "verwalter.sees(confirmation).not.toContain('x');"],
		['tests/e2e/steps/example.steps.ts', "When('x', async ({ browserName }) => browserName);"],
		['tests/e2e/steps/example.steps.ts', "test.skip(true, 'flaky');"],
		['tests/e2e/screenplay/questions.ts', "await expect(locate(actor, x)).toBeVisible();"],
		['tests/e2e/screenplay/questions.ts', "await pageOf(actor).waitForURL('/x');"],
		['tests/e2e/tasks/example.ts', "import { m } from '$lib/paraglide/messages';\nexport const x = m;"],
		['tests/e2e/questions/example.ts', "import { x } from './../../ui-screenshots/helpers';\nexport const y = x;"]
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
	});

	it('lässt seed in Given-Steps und Namen überall zu', async () => {
		const given = "Given('x', async ({ seed }) => { await seed.statement('a', 'b', 2024); });\nWhen('y', async ({ seed, verwalter }) => { await verwalter.attemptsTo(open(seed.idOf('a'), seed.unique('b'))); });";
		expect(await restricted('tests/e2e/steps/example.steps.ts', given)).toEqual([]);
	});

	it('lässt die bestehenden Importe zu', async () => {
		const step = "import { createBdd } from 'playwright-bdd';\nimport { test } from '../fixtures/test';\nimport { open } from '../tasks/x';\nimport { shown } from '../questions/x';\nexport const x = [createBdd, test, open, shown];";
		expect(await restricted('tests/e2e/steps/example.steps.ts', step)).toEqual([]);
		const question = "import { readPdf } from '../../../backend/src/__tests__/helpers/pdf-text';\nexport const x = readPdf;";
		expect(await restricted('tests/e2e/questions/example.ts', question)).toEqual([]);
	});

	// Schluss-Review Endstand 3: M-1 Kern, M-2 test.info(), M-3 fetch, Minors
	it.each([
		['tests/e2e/screenplay/example.ts', "import { openDashboard } from '../tasks/dashboard';\nexport const x = openDashboard;"],
		['tests/e2e/steps/example.steps.ts', "if (test.info().project.name === 'api') return;"],
		['tests/e2e/tasks/example.ts', "if (test.info().project.name === 'api') return;"],
		['tests/e2e/steps/example.steps.ts', "await fetch('http://localhost:3101/api/v1/buildings');"],
		['tests/e2e/fixtures/example.ts', "await fetch('http://localhost:3101/api/v1/buildings');"],
		['tests/e2e/tasks/example.ts', 'await new Promise((r) => setTimeout(r, 1000));'],
		['tests/e2e/tasks/example.ts', "import { Click } from '../screenplay/interactions';\nexport { Click };"],
		['tests/e2e/steps/example.steps.ts', 'while (!(await verwalter.answer(ready))) {}']
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
	});

	// Schluss-Review Endstand 2: M-2 Weiche über das Projekt, M-3 Schleifen, und die Minors als Klassen
	it.each([
		['tests/e2e/steps/example.steps.ts', "if ($testInfo.project.name === 'api') return;"],
		['tests/e2e/steps/example.steps.ts', 'if (verwalter.can(Api)) await verwalter.abilityTo(Api).post("x", {});'],
		['tests/e2e/steps/example.steps.ts', 'await new Promise((r) => globalThis.setTimeout(r, 1000));'],
		['tests/e2e/steps/example.steps.ts', 'await scheduler.wait(1000);'],
		['tests/e2e/steps/example.steps.ts', "import { setTimeout as pause } from 'node:timers/promises';\nawait pause(1);"],
		['tests/e2e/questions/example.ts', 'for (let i = 0; i < 9; i++) await actor.answer(ready);'],
		['tests/e2e/questions/example.ts', 'for (const x of xs) await actor.answer(x);'],
		['tests/e2e/questions/example.ts', "import { setTimeout as pause } from 'timers/promises';\nawait pause(1);"],
		['tests/e2e/questions/example.ts', "await actor.abilityTo(CallTheApi).post('buildings', {});"],
		['tests/e2e/tasks/example.ts', "await globalThis.fetch('http://localhost:3101/api/v1/buildings');"],
		['tests/e2e/tasks/example.ts', "export { Click } from '../screenplay/interactions';"],
		['tests/e2e/tasks/example.ts', "export * from '../targets/contract-form';"],
		['tests/e2e/fixtures/example.ts', "export { CallTheApi } from '../screenplay/abilities';"]
	])('lehnt in %s ab: %s', async (filePath, code) => {
		expect(await restricted(filePath, code)).not.toEqual([]);
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
			await problems('tests/e2e/screenplay/interactions.ts', 'await target.locate(page).click();')
		).toEqual([]);
	});

	// Schluss-Review Endstand 3, M-1: Fundstellen beschreibt im Kern nur target.ts, sonst wird der Kern ein Helfer-Ordner
	it('lässt im Kern Locators nur in target.ts zu', async () => {
		const code = 'await page.getByTestId("contract-tenant-select").selectOption("x");';
		expect(await restricted('tests/e2e/screenplay/interactions.ts', code)).not.toEqual([]);
		const where = "export const body = target('Seite', (page) => page.locator('body'));";
		expect(await restricted('tests/e2e/screenplay/target.ts', where)).toEqual([]);
	});
});
