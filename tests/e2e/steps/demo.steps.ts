import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { sectionText } from '../questions/app-frame';
import { demoNoticeShown, demoNoticeText } from '../questions/demo';
import { openDemoOverview, openDemoPrivacy, openDemoSignIn, openDemoTerms } from '../tasks/demo';

const { When, Then } = createBdd(test);

When('ein Besucher die Anmeldeseite der Demo öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openDemoSignIn);
});

When('der Liegenschaftsverwalter die Übersicht der Demo öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDemoOverview);
});

When('der Liegenschaftsverwalter die Datenschutzerklärung der Demo liest', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDemoPrivacy);
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
	'erfährt der Liegenschaftsverwalter unter {string}, dass alle Besucher dieselben Daten sehen, jede Nacht alles gelöscht wird und andere Besucher seinen Namen und seine E-Mail-Adresse nicht sehen',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('dieselben Daten');
		await verwalter.sees(sectionText(heading)).toContain('jede Nacht');
		await verwalter.sees(sectionText(heading)).toContain('Ihren Namen und Ihre E-Mail-Adresse sehen andere Besucher nicht, nur der Betreiber');
	}
);

When('der Liegenschaftsverwalter die Nutzungsbedingungen der Demo liest', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDemoTerms);
});

Then(
	'erfährt der Liegenschaftsverwalter unter {string}, dass alle Besucher dieselben Daten sehen, jede Nacht alles gelöscht wird und er keine echten Daten eingeben soll',
	async ({ verwalter }, heading: string) => {
		await verwalter.sees(sectionText(heading)).toContain('dieselben Daten');
		await verwalter.sees(sectionText(heading)).toContain('jede Nacht');
		await verwalter.sees(sectionText(heading)).toContain('keine echten Daten');
	}
);

Then('sieht der Besucher keinen Demo-Hinweis', async ({ besucher }) => {
	await besucher.sees(demoNoticeShown).toBe(false);
});
