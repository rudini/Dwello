import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { demoNoticeShown, demoNoticeText, sectionText } from '../questions/demo';
import { openDemoPage } from '../tasks/demo';

const { When, Then } = createBdd(test);

When('ein Besucher die Anmeldeseite der Demo öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openDemoPage('/login'));
});

When('der Liegenschaftsverwalter die Übersicht der Demo öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDemoPage('/dashboard'));
});

When('der Liegenschaftsverwalter die Datenschutzerklärung der Demo liest', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDemoPage('/privacy'));
});

// The two sentences together: shared data, then the nightly reset
const SHARED_AND_RESET = 'Alle Besucher sehen und ändern dieselben Daten. Jede Nacht';

Then(
	'sagt der Demo-Hinweis dem Besucher, dass alle Besucher dieselben Daten sehen und jede Nacht alles zurückgesetzt wird',
	async ({ besucher }) => {
		await besucher.sees(demoNoticeText).toContain(SHARED_AND_RESET);
	}
);

Then(
	'sagt der Demo-Hinweis dem Liegenschaftsverwalter, dass alle Besucher dieselben Daten sehen und jede Nacht alles zurückgesetzt wird',
	async ({ verwalter }) => {
		await verwalter.sees(demoNoticeText).toContain(SHARED_AND_RESET);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass alle Besucher dieselben Daten sehen, jede Nacht alles gelöscht wird und jede Anmeldung mit der E-Mail-Adresse protokolliert wird',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('dieselben Daten');
		await verwalter.sees(sectionText(heading)).toContain('jede Nacht');
		await verwalter.sees(sectionText(heading)).toContain('E-Mail-Adresse');
	}
);

Then('sieht der Besucher keinen Demo-Hinweis', async ({ besucher }) => {
	await besucher.sees(demoNoticeShown).toBe(false);
});
