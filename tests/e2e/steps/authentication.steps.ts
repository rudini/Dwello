import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { googleSignInParameter, loginHint, shownUserName, signInOffered, signInOptions } from '../questions/authentication';
import { pageTitle } from '../questions/navigation';
import { expireSession, signInWith, signOut } from '../tasks/authentication';
import { openPage } from '../tasks/navigation';

const { Given, When, Then } = createBdd(test);

When('ein Besucher die Anmeldeseite öffnet', async ({ besucher }) => {
	await besucher.attemptsTo(openPage('/login'));
});

When('ein Besucher die überfälligen Abrechnungen aufruft', async ({ besucher }) => {
	await besucher.attemptsTo(openPage('/statements?status=overdue'));
});

Given('ein Besucher hat die überfälligen Abrechnungen aufgerufen', async ({ besucher }) => {
	await besucher.attemptsTo(openPage('/statements?status=overdue'));
});

When('Google den Besucher nach einer abgebrochenen Anmeldung zurückschickt', async ({ besucher }) => {
	await besucher.attemptsTo(openPage('/auth/callback?error=access_denied&error_description=The+user+denied+access'));
});

Given('die Sitzung des Liegenschaftsverwalters ist abgelaufen', async ({ verwalter, baseURL }) => {
	await verwalter.attemptsTo(expireSession(baseURL!));
});

When('der Liegenschaftsverwalter die Anmeldeseite öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/login'));
});

When('der Besucher sich mit {string} anmeldet', async ({ besucher }, provider: string) => {
	await besucher.attemptsTo(signInWith(provider));
});

When('der Liegenschaftsverwalter sich abmeldet', async ({ verwalter }) => {
	await verwalter.attemptsTo(signOut);
});

Then('kann sich der Besucher mit {string} anmelden', async ({ besucher }, provider: string) => {
	await besucher.sees(signInOffered(provider)).toBe(true);
});

Then('nicht mit {string}', async ({ besucher }, provider: string) => {
	await besucher.sees(signInOptions(provider)).toBe(0);
});

Then('ist der Besucher auf der Seite {string}', async ({ besucher }, title: string) => {
	await besucher.sees(pageTitle).toBe(`${title} - Dwello`);
});

Then('sieht der Besucher den Hinweis {string}', async ({ besucher }, text: string) => {
	await besucher.sees(loginHint).toBe(text);
});

Then('leitet Dwello den Besucher zur Anmeldung bei Google weiter', async ({ besucher }) => {
	await besucher.sees(googleSignInParameter('client_id')).toBe('e2e-google-client');
	await besucher.sees(googleSignInParameter('redirect_uri')).toBe('http://localhost:3100/auth/callback');
	await besucher.sees(googleSignInParameter('state')).toMatch(/^[0-9a-f]{64}$/);
});

Then('bittet Dwello Google nicht um dauerhaften Zugriff auf das Konto', async ({ besucher }) => {
	await besucher.sees(googleSignInParameter('client_id')).toBe('e2e-google-client');
	await besucher.sees(googleSignInParameter('access_type')).toBeNull();
	await besucher.sees(googleSignInParameter('prompt')).toBeNull();
});

Then(
	'sieht der Liegenschaftsverwalter seinen Namen {string} in der Kopfzeile',
	async ({ verwalter }, name: string) => {
		await verwalter.sees(shownUserName).toBe(name);
	}
);

Then('führt die Übersicht den Liegenschaftsverwalter wieder zur Anmeldung', async ({ verwalter }) => {
	await verwalter.attemptsTo(openPage('/dashboard'));
	await verwalter.sees(pageTitle).toBe('Anmelden - Dwello');
});
