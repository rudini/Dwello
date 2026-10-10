import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { sessionCookies } from '../fixtures/session';
import { visit } from '../interactions/navigation';
import { googleSignInRequest, loginHint, shownUserName, signInOption } from '../questions/authentication';
import { signInWith, signOut } from '../tasks/authentication';

const { Given, When, Then } = createBdd(test);

When('ein Besucher die Anmeldeseite öffnet', async ({ besucher }) => {
	await visit(besucher.page, '/login');
});

When('ein Besucher die überfälligen Abrechnungen aufruft', async ({ besucher }) => {
	await visit(besucher.page, '/statements?status=overdue');
});

Given('ein Besucher hat die überfälligen Abrechnungen aufgerufen', async ({ besucher }) => {
	await visit(besucher.page, '/statements?status=overdue');
});

When('Google den Besucher nach einer abgebrochenen Anmeldung zurückschickt', async ({ besucher }) => {
	await visit(besucher.page, '/auth/callback?error=access_denied&error_description=The+user+denied+access');
});

Given('die Sitzung des Liegenschaftsverwalters ist abgelaufen', async ({ verwalter, baseURL }) => {
	await verwalter.page.context().addCookies(await sessionCookies(baseURL!, Math.floor(Date.now() / 1000) - 60));
});

When('der Liegenschaftsverwalter die Anmeldeseite öffnet', async ({ verwalter }) => {
	await visit(verwalter.page, '/login');
});

When('der Besucher sich mit {string} anmeldet', async ({ besucher }, provider: string) => {
	await besucher.perform(signInWith(provider));
});

When('der Liegenschaftsverwalter sich abmeldet', async ({ verwalter }) => {
	await verwalter.perform(signOut);
});

Then('kann sich der Besucher mit {string} anmelden', async ({ besucher }, provider: string) => {
	await expect(signInOption(besucher, provider)).toBeVisible();
});

Then('nicht mit {string}', async ({ besucher }, provider: string) => {
	await expect(signInOption(besucher, provider)).toHaveCount(0);
});

Then('ist der Besucher auf der Seite {string}', async ({ besucher }, title: string) => {
	await expect(besucher.page).toHaveTitle(`${title} - Dwello`);
});

Then('sieht der Besucher den Hinweis {string}', async ({ besucher }, text: string) => {
	await expect(loginHint(besucher)).toHaveText(text);
});

Then('leitet Dwello den Besucher zur Anmeldung bei Google weiter', async ({ besucher }) => {
	const request = await googleSignInRequest(besucher);
	expect(request.get('client_id')).toBe('e2e-google-client');
	expect(request.get('redirect_uri')).toBe('http://localhost:3100/auth/callback');
	expect(request.get('state')).toMatch(/^[0-9a-f]{64}$/);
});

Then(
	'sieht der Liegenschaftsverwalter seinen Namen {string} in der Kopfzeile',
	async ({ verwalter }, name: string) => {
		await expect(shownUserName(verwalter)).toHaveText(name);
	}
);

Then('führt die Übersicht den Liegenschaftsverwalter wieder zur Anmeldung', async ({ verwalter }) => {
	await visit(verwalter.page, '/dashboard');
	await expect(verwalter.page).toHaveTitle('Anmelden - Dwello');
});
