import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { downloadedPdfText } from '../questions/download';
import { backupConfirmed, backupGuide, backupHint, backupPageText, shownBackupCode } from '../questions/sicherung';
import { inDays, swissDate } from '../fixtures/dates';
import { FRESH_APP } from '../fixtures/fresh-installation';
import {
	SHOWN_CODE,
	confirmBackupCode,
	confirmShownBackupCode,
	downloadEmergencySheet,
	goToFreshBackup,
	openBackupPrivacy,
	openFreshBackup,
	reopenBackup
} from '../tasks/sicherung';

const { Given, When, Then } = createBdd(test);

// #718: the Sicherung of the fresh installation (fixtures/fresh-installation.ts), which has a folder for it
Given('Dwello ist eingerichtet, die Sicherung aber noch nicht', async ({ frisch }) => {
	await frisch.setUpWithoutBackup();
});

Given('Dwello ist eingerichtet und die Sicherung auch', async ({ frisch }) => {
	await frisch.setUp();
});

When('der Liegenschaftsverwalter die Sicherung einrichtet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshBackup);
});

Given('der Liegenschaftsverwalter hat die Sicherung geöffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshBackup);
});

When('der Liegenschaftsverwalter die Sicherung erneut öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(reopenBackup);
});

Then('zeigt die Sicherung einen Wiederherstellungscode aus 6 Gruppen zu 4 Zeichen', async ({ verwalter }) => {
	await verwalter.sees(shownBackupCode).toMatch(/^([2-9A-HJ-NP-Z]{4}-){5}[2-9A-HJ-NP-Z]{4}$/);
});

Then('zeigt die Sicherung denselben Wiederherstellungscode', async ({ verwalter }) => {
	await verwalter.sees(shownBackupCode).toMatch(/^([2-9A-HJ-NP-Z]{4}-){5}[2-9A-HJ-NP-Z]{4}$/);
	await verwalter.sees(shownBackupCode).toBe(verwalter.recall<string>(SHOWN_CODE));
});

When('der Liegenschaftsverwalter die Sicherung der frischen Installation öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToFreshBackup);
});

Then('enthält das Notfallblatt das Datum von heute', async ({ verwalter }) => {
	await verwalter.sees(downloadedPdfText).toContain(swissDate(inDays(0)));
});

Then('enthält das Notfallblatt die Adresse, unter der der Liegenschaftsverwalter Dwello öffnet', async ({ verwalter }) => {
	await verwalter.sees(downloadedPdfText).toContain(FRESH_APP);
});

Then('verweist die Sicherung auf die Installationsanleitung {string}', async ({ verwalter }, address: string) => {
	await verwalter.sees(backupGuide).toBe(address);
});

Then('erklärt die Sicherung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(backupPageText).toContain(text);
});

When('der Liegenschaftsverwalter das Notfallblatt herunterlädt', async ({ verwalter }) => {
	await verwalter.attemptsTo(downloadEmergencySheet);
});

Then('enthält das Notfallblatt den angezeigten Wiederherstellungscode', async ({ verwalter }) => {
	await verwalter.sees(downloadedPdfText).toContain(verwalter.recall<string>(SHOWN_CODE));
});

Then('enthält das Notfallblatt {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(downloadedPdfText).toContain(text);
});

When(
	'der Liegenschaftsverwalter den angezeigten Wiederherstellungscode erneut eingibt und die Sicherung startet',
	async ({ verwalter }) => {
		await verwalter.attemptsTo(confirmShownBackupCode);
	}
);

When('der Liegenschaftsverwalter einen anderen Wiederherstellungscode eingibt und die Sicherung startet', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmBackupCode('AAAA-BBBB-CCCC-DDDD-EEEE-FFFF'));
});

When('der Besucher richtet die Sicherung ein', async ({ besucher }) => {
	await besucher.attemptsTo(confirmShownBackupCode);
});

Then('bestätigt die Übersicht {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(backupConfirmed).toBe(text);
});

Then('sieht der Liegenschaftsverwalter bei der Sicherung den Hinweis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(backupHint).toBe(text);
});

When('der Liegenschaftsverwalter bei der Sicherung die Datenschutzerklärung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openBackupPrivacy);
});
