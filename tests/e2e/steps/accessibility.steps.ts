import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { address, check, screens, seedFor, variants } from '../interactions/accessibility';

const { Then } = createBdd(test);

Then(
	'ist der Bildschirm {string} im Zustand {string} in allen Ansichten barrierefrei',
	async ({ page, seed, $testInfo }, name: string, state: string) => {
		$testInfo.setTimeout(180_000); // every viewport and colour scheme of the screen in one example
		const screen = screens.find((candidate) => candidate.name === name)!;
		if (screen.public) await page.context().clearCookies();
		const path = await seedFor(seed, address(screen, state), state);
		for (const { viewport, scheme } of variants) {
			const found = await check(page, path, state, viewport, scheme);
			expect(found, `${viewport}, ${scheme}`).toEqual([]);
		}
	}
);
