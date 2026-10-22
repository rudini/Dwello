import { createBdd } from 'playwright-bdd';
import { SETUP_CODE } from '../fixtures/fresh-installation';
import { test } from '../fixtures/test';
import { shownUserName } from '../questions/authentication';
import { enteredSetupPassword, kiModelHint, repeatedSetupPassword, setupHint } from '../questions/einrichtung';
import { openFreshDwello, openFreshOverview, openKiFromFreshOverview, openOverviewWithFailedModel, openSetup, openSetupPrivacy, openSetupTerms, setUpDwello, setUpDwelloWithKi } from '../tasks/einrichtung';

const { Given, When, Then } = createBdd(test);

// #577: the fresh installation of the stack (fixtures/fresh-installation.ts)
Given('Dwello ist frisch installiert', async ({ frisch }) => {
	void frisch; // the fixture holds the installation for this scenario; it has no account
});

Given('Dwello ist eingerichtet', async ({ frisch }) => {
	await frisch.setUp();
});

When('ein Besucher Dwello öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openFreshDwello);
});

When('ein Besucher die Einrichtung öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openSetup);
});

Given('ein Besucher hat die Einrichtung geöffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openSetup);
});

When('der Besucher mit dem Einrichtungscode ein Konto mit Passwort anlegt', async ({ besucher, frisch }) => {
	await besucher.attemptsTo(setUpDwello(SETUP_CODE, frisch.newAccount()));
});

When('der Besucher mit einem falschen Einrichtungscode ein Konto mit Passwort anlegt', async ({ besucher, frisch }) => {
	await besucher.attemptsTo(setUpDwello('FALS-CHER', frisch.newAccount()));
});

When('der Besucher das Passwort bei der Einrichtung zweimal verschieden eingibt', async ({ besucher, frisch }) => {
	await besucher.attemptsTo(setUpDwello(SETUP_CODE, frisch.newAccount(), 'ein-anderes-Passwort'));
});

When('der Besucher bei der Einrichtung das Passwort {string} wählt', async ({ besucher, frisch }, password: string) => {
	await besucher.attemptsTo(setUpDwello(SETUP_CODE, { ...frisch.newAccount(), password }));
});

Then('zeigt die Kopfzeile die E-Mail-Adresse des neuen Kontos', async ({ besucher, frisch }) => {
	await besucher.sees(shownUserName).toBe(frisch.account.email);
});

Then('sieht der Besucher in der Einrichtung den Hinweis {string}', async ({ besucher }, text: string) => {
	await besucher.sees(setupHint).toBe(text);
});

When('der Besucher in der Einrichtung die Datenschutzerklärung öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openSetupPrivacy);
});

When('der Besucher in der Einrichtung die Nutzungsbedingungen öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openSetupTerms);
});

Given('das KI-Modell ist zu {int} % geladen', async ({ frisch }, percent: number) => {
	await frisch.modelLoaded(percent);
});

When('der Liegenschaftsverwalter der frischen Installation die Übersicht öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshOverview);
});

Then('zeigt die Übersicht den Hinweis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(kiModelHint).toBe(text);
});


Then('stehen in der Einrichtung die Passwörter noch da', async ({ besucher, frisch }) => {
	await besucher.sees(enteredSetupPassword).toBe(frisch.account.password);
	await besucher.sees(repeatedSetupPassword).toBe(frisch.account.password);
});

When(
	'der Liegenschaftsverwalter die Übersicht einer Installation öffnet, deren KI-Modell nicht geladen werden konnte',
	async ({ verwalter }) => {
		await verwalter.attemptsTo(openOverviewWithFailedModel);
	}
);

// #620: the KI chosen at the setup
When(
	/^der Besucher mit dem Einrichtungscode ein Konto mit Passwort anlegt und die (KI später|lokale KI) wählt$/,
	async ({ besucher, frisch }, choice: string) => {
		await besucher.attemptsTo(setUpDwelloWithKi(SETUP_CODE, frisch.newAccount(), choice === 'lokale KI' ? 'local' : 'none'));
	}
);

Then('zeigt die Übersicht nach der Einrichtung den Hinweis {string}', async ({ besucher }, text: string) => {
	await besucher.sees(kiModelHint).toBe(text);
});

Given('in der frischen Installation ist keine KI gewählt', async ({ frisch }) => {
	await frisch.kiNone();
});

When('der Liegenschaftsverwalter in der Übersicht der frischen Installation die KI öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openKiFromFreshOverview);
});
