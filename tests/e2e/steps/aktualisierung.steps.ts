import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { pageTitle } from '../questions/navigation';
import { atBackupCode, updateRunning, failureText, noticeShown, orderOfUpdate, noticeText, shownStep, unsavedWarningText, updateOffered, updateServiceState, whatsNewAddress } from '../questions/aktualisierung';
import {
	cancelUpdate,
	askToUpdate,
	confirmUpdate,
	followBackupLink,
	goToFreshTenants,
	openFreshTenants,
	postponeUpdate,
	switchOffUpdateCheck,
	waitForFailure,
	waitForUpdate
} from '../tasks/aktualisierung';
import { openFreshOverview } from '../tasks/einrichtung';
import { signInFreshWithPassword } from '../tasks/sicherung';

const { Given, When, Then } = createBdd(test);

// #1453: the update of the fresh installation, through the stand-in of GitHub and the update service
Given('Dwello {word} ist erschienen', async ({ frisch }, release: string) => {
	await frisch.newVersion(release);
});

Given('das Update auf Dwello {word} wird fehlschlagen', async ({ frisch }, _release: string) => {
	await frisch.updateFails('failed');
});

Given('das Update auf Dwello {word} wird fehlschlagen, nachdem es die Datenbank geändert hat', async ({ frisch }, _release: string) => {
	await frisch.updateFails('restore');
});

Given('der Liegenschaftsverwalter hat die Übersicht der frischen Installation geöffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshOverview);
});

Given('der Liegenschaftsverwalter hat die Mieter der frischen Installation geöffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openFreshTenants);
});

// in the same sign-in
When('der Liegenschaftsverwalter die Mieter der frischen Installation öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToFreshTenants);
});

When('der Liegenschaftsverwalter das Update auf später verschiebt', async ({ verwalter }) => {
	await verwalter.attemptsTo(postponeUpdate);
});

When('der Liegenschaftsverwalter sich bei der frischen Installation wieder anmeldet', async ({ verwalter, frisch }) => {
	await verwalter.attemptsTo(signInFreshWithPassword(frisch.account.email, frisch.account.password));
});

When('der Liegenschaftsverwalter das Update starten will', async ({ verwalter }) => {
	await verwalter.attemptsTo(askToUpdate);
});

When('der Liegenschaftsverwalter das Update starten will, es aber abbricht', async ({ verwalter }) => {
	await verwalter.attemptsTo(cancelUpdate);
});

When('der Liegenschaftsverwalter das Update bestätigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(confirmUpdate);
});

When('der Liegenschaftsverwalter dem Hinweis zur Sicherung folgt', async ({ verwalter }) => {
	await verwalter.attemptsTo(followBackupLink);
});

When('der Liegenschaftsverwalter in den Einstellungen der frischen Installation die Suche nach neuen Versionen ausschaltet', async ({ verwalter }) => {
	await verwalter.attemptsTo(switchOffUpdateCheck);
});

Then('sagt der Hinweis zur neuen Version {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(noticeText).toContain(text);
});

Then('führt «Was ist neu?» zu den Versionshinweisen von Dwello {word}', async ({ verwalter }, release: string) => {
	await verwalter.sees(whatsNewAddress).toBe(`https://github.com/rudini/Dwello/releases/tag/v${release}`);
});

// after the page's title, so it does not pass on an error page
Then('meldet Dwello keine neue Version', async ({ verwalter }) => {
	await verwalter.sees(pageTitle).toMatch(/ - Dwello$/);
	await verwalter.sees(noticeShown).toBe(false);
});

Then('fragt Dwello vor dem Update {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(unsavedWarningText).toBe(text);
});

Then('zeigt das Update den Schritt {string}', async ({ verwalter }, step: string) => {
	await verwalter.sees(shownStep).toContain(step);
});

Then('ist der Liegenschaftsverwalter nach dem Update wieder auf der Seite {string}', async ({ verwalter }, title: string) => {
	await verwalter.attemptsTo(waitForUpdate);
	await verwalter.sees(pageTitle).toBe(`${title} - Dwello`);
});

Then('kann der Liegenschaftsverwalter das Update nicht starten', async ({ verwalter }) => {
	await verwalter.sees(noticeShown).toBe(true);
	await verwalter.sees(updateOffered).toBe(false);
});

Then('steht der Liegenschaftsverwalter beim Wiederherstellungscode', async ({ verwalter }) => {
	await verwalter.sees(atBackupCode).toBe(true);
});

Then('meldet das Update {string}', async ({ verwalter }, text: string) => {
	await verwalter.attemptsTo(waitForFailure);
	await verwalter.sees(failureText).toContain(text);
});

// after the notice, which the step before checks; the update would start at once
Then('läuft kein Update', async ({ verwalter }) => {
	await verwalter.sees(updateRunning).toBe(false);
});

// #1457: after the message of the failed Sicherung, which the step before checks
Then('hat Dwello nichts heruntergeladen', async ({ verwalter, frisch }) => {
	await verwalter.sees(updateServiceState(frisch)).toBe('idle');
});

// #1457: the Sicherung after the version appeared (not the one of the setup) and before the update service was asked
Then('hat Dwello eine Sicherung erstellt, bevor das Update etwas heruntergeladen hat', async ({ verwalter, frisch }) => {
	await verwalter.sees(orderOfUpdate(frisch)).toEqual(['erschienen', 'gesichert', 'heruntergeladen']);
});
