import { createBdd } from 'playwright-bdd';
import { SETUP_CODE } from '../fixtures/fresh-installation';
import { test } from '../fixtures/test';
import { shownUserName } from '../questions/authentication';
import { kiModelHint, setupHint } from '../questions/einrichtung';
import { openFreshDwello, openFreshOverview, openSetup, openSetupPrivacy, openSetupTerms, setUpDwello } from '../tasks/einrichtung';

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

