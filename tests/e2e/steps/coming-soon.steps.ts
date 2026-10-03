import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { announcement } from '../questions/coming-soon';

const { When, Then } = createBdd(test);

When('der Liegenschaftsverwalter die Analytics öffnet', async ({ verwalter }) => {
	await visit(verwalter.page, '/analytics');
});

When('der Liegenschaftsverwalter die Berichte öffnet', async ({ verwalter }) => {
	await visit(verwalter.page, '/reports');
});

Then(
	'sieht der Liegenschaftsverwalter die Ankündigung {string}',
	async ({ verwalter }, text: string) => {
		await expect(announcement(verwalter)).toHaveText(text);
	}
);
