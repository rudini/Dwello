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
