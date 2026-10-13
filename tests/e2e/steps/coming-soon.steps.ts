import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { announcement } from '../questions/coming-soon';
import { openPage } from '../tasks/navigation';

const { When, Then } = createBdd(test);

When('der Liegenschaftsverwalter die Auswertungen öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/analytics'));
});

When('der Liegenschaftsverwalter die Berichte öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/reports'));
});

Then(
	'sieht der Liegenschaftsverwalter die Ankündigung {string}',
	async ({ verwalter }, text: string) => {
		await verwalter.sees(announcement).toBe(text);
	}
);
