import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { sectionText } from '../questions/app-frame';
import { demoNoticeLinkText, demoNoticeShown, demoNoticeText } from '../questions/demo';
import {
	followDemoNoticeLink,
	openDemoHelp,
	openDemoOverview,
	openDemoPrivacy,
	openDemoSignIn,
	openDemoTerms
} from '../tasks/demo';

const { Given, When, Then } = createBdd(test);

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

// #675: the full notice on the sign-in page, one line with a link inside the app
Then(
	'sagt der Demo-Hinweis dem Besucher, dass er alles ausprobieren darf und für echte Daten eine eigene Installation braucht',
	async ({ besucher }) => {
		await besucher.sees(demoNoticeText).toContain('Probieren Sie alles aus');
		await besucher.sees(demoNoticeText).toContain('eigene Installation');
	}
);

Then(
	'nennt der Demo-Hinweis dem Besucher für eine eigene Installation den Kontakt {string}',
	async ({ besucher }, contact: string) => {
		await besucher.sees(demoNoticeText).toContain(`Fragen Sie dafür den Betreiber dieser Demo: ${contact}.`);
	}
);

Then('zeigt der Demo-Hinweis nur eine Zeile mit dem Link {string}', async ({ verwalter }, link: string) => {
	await verwalter.sees(demoNoticeLinkText(link)).toBe(link);
	// the rule of the full notice stays on the sign-in page and in the help
	await verwalter.sees(demoNoticeText).not.toContain('erfundene');
});

Given('der Liegenschaftsverwalter ist auf der Übersicht der Demo', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDemoOverview);
});

When('der Liegenschaftsverwalter im Demo-Hinweis {string} wählt', async ({ verwalter }, link: string) => {
	await verwalter.attemptsTo(followDemoNoticeLink(link));
});

When('der Liegenschaftsverwalter die Hilfe der Demo liest', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDemoHelp);
});
