import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { correspondence, correspondenceLanguage } from '../questions/tenant-form';
import { chooseLanguage, correspondByEmailWithoutAddress, correspondByLetter, openTenantEdit } from '../tasks/tenant-form';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite des Mieters {string}',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(openTenantEdit(seed.idOf(tenant)!));
	}
);

When(
	'der Liegenschaftsverwalter die Korrespondenz per Brief an {string}, {string} festlegt',
	async ({ verwalter }, address: string, place: string) => {
		await verwalter.attemptsTo(correspondByLetter(address, place));
	}
);

When(
	'der Liegenschaftsverwalter die Korrespondenz per E-Mail festlegt, ohne E-Mail-Adresse',
	async ({ verwalter }) => {
		await verwalter.attemptsTo(correspondByEmailWithoutAddress);
	}
);

Then('{string} erhält Korrespondenz {string}', async ({ verwalter }, _tenant: string, channel: string) => {
	await verwalter.sees(correspondence).toBe(channel);
});

const LANGUAGES: Record<string, string> = { Deutsch: 'de', Französisch: 'fr', Italienisch: 'it', Rätoromanisch: 'rm', Englisch: 'en' };

Given('die Korrespondenz an {string} ist auf {string}', async ({ seed }, tenant: string, language: string) => {
	await seed.language(tenant, LANGUAGES[language]);
});

When('der Liegenschaftsverwalter die Sprache {string} festlegt', async ({ verwalter }, language: string) => {
	await verwalter.attemptsTo(chooseLanguage(language));
});

Then('{string} erhält Korrespondenz auf {string}', async ({ verwalter }, _tenant: string, language: string) => {
	await verwalter.sees(correspondenceLanguage).toBe(language);
});
