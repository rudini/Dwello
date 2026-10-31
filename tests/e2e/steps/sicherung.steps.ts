import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { downloadedPdfText } from '../questions/download';
import {
	backupConfirmed,
	backupGuide,
	backupHint,
	backupPageText,
	backupWarningText,
	focusedOnBackupPage,
	googleSignInAgain,
	newCodeConfirmed,
	shownBackupCode
} from '../questions/sicherung';
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
	reopenBackup,
	confirmNewShownCode,
	createNewCode,
	createdNewCode,
	openBackupSettings,
	openNewCodePage,
	signInFreshWithPassword,
	signedInFreshWithGoogleAnHourAgo
} from '../tasks/sicherung';

const { Given, When, Then } = createBdd(test);

// #718: the Sicherung of the fresh installation (fixtures/fresh-installation.ts), which has a folder for it
Given('Dwello ist eingerichtet, die Sicherung aber noch nicht', async ({ frisch }) => {
	await frisch.setUpWithoutBackup();
});

Given('Dwello ist eingerichtet und die Sicherung auch', async ({ frisch }) => {
	await frisch.setUp();
});

Given('Dwello ist eingerichtet, konnte aber seit 2 Tagen keine Sicherung erstellen', async ({ frisch }) => {
	await frisch.setUpWithoutBackupForTwoDays();
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

// «{vor 2 Tagen}»: the Swiss date two days ago
Then('warnt die Übersicht {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(backupWarningText).toContain(text.replace('{vor 2 Tagen}', swissDate(inDays(-2))));
});

// #718, part 3: a new Wiederherstellungscode in the settings, after signing in again
Given('der Liegenschaftsverwalter hat sich in der frischen Installation mit Passwort angemeldet', async ({ verwalter, frisch }) => {
	await verwalter.attemptsTo(signInFreshWithPassword(frisch.account.email, frisch.account.password));
});

Given('der Liegenschaftsverwalter hat sich in der frischen Installation vor einer Stunde mit Google angemeldet', async ({ verwalter }) => {
	await verwalter.attemptsTo(signedInFreshWithGoogleAnHourAgo);
});

When('der Liegenschaftsverwalter in den Einstellungen die Sicherung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openBackupSettings);
});

When('der Liegenschaftsverwalter die Seite für einen neuen Wiederherstellungscode öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewCodePage);
});

Then('erklärt die Seite für einen neuen Wiederherstellungscode {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(backupPageText).toContain(text);
});

Then('zeigt die Seite für einen neuen Wiederherstellungscode noch keinen Code', async ({ verwalter }) => {
	await verwalter.sees(backupPageText).toContain('Neuer Wiederherstellungscode');
	await verwalter.sees(shownBackupCode).toBeNull();
});

When('der Liegenschaftsverwalter mit seinem Passwort einen neuen Wiederherstellungscode erstellt', async ({ verwalter, frisch }) => {
	await verwalter.attemptsTo(createNewCode(frisch.account.password));
});

Given('der Liegenschaftsverwalter hat mit seinem Passwort einen neuen Wiederherstellungscode erstellt', async ({ verwalter, frisch }) => {
	await verwalter.attemptsTo(createdNewCode(frisch.account.password));
});

When('der Liegenschaftsverwalter mit einem falschen Passwort einen neuen Wiederherstellungscode erstellt', async ({ verwalter }) => {
	await verwalter.attemptsTo(createNewCode('falsches-Passwort'));
});

When(
	'der Liegenschaftsverwalter den angezeigten Wiederherstellungscode erneut eingibt und den neuen Code bestätigt',
	async ({ verwalter }) => {
		await verwalter.attemptsTo(confirmNewShownCode);
	}
);

When('der Liegenschaftsverwalter einen anderen Wiederherstellungscode eingibt und den neuen Code bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmBackupCode('AAAA-BBBB-CCCC-DDDD-EEEE-FFFF'));
});

Then('bestätigt die Seite für einen neuen Wiederherstellungscode {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(newCodeConfirmed).toBe(text);
});

Then('führt die Seite für einen neuen Wiederherstellungscode zur erneuten Anmeldung mit Google', async ({ verwalter }) => {
	await verwalter.sees(googleSignInAgain).toBe('/auth/login?provider=google&reauth=1&redirectTo=%2Fconfig%2Fbackup');
});

Then('steht der Fokus auf dem neuen Wiederherstellungscode', async ({ verwalter }) => {
	await verwalter.sees(focusedOnBackupPage).toBe('backup-code');
});

Then('steht der Fokus auf der Bestätigung des neuen Wiederherstellungscodes', async ({ verwalter }) => {
	await verwalter.sees(focusedOnBackupPage).toBe('backup-new-confirmed');
});
