import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { exampleOf } from '../fixtures/screens';
import { findings } from '../questions/accessibility';
import { checkAccessibilityOf } from '../tasks/accessibility';

const { Then } = createBdd(test);

Then(
	'ist der Bildschirm {string} im Zustand {string} in allen Ansichten barrierefrei',
	async ({ verwalter, seed, $testInfo }, name: string, state: string) => {
		$testInfo.setTimeout(180_000); // every viewport and colour scheme of the screen in one example
		await verwalter.attemptsTo(checkAccessibilityOf(await exampleOf(seed, name, state)));
		await verwalter.sees(findings).toEqual([]);
	}
);
