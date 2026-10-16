import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { addressHelpText, correspondence, correspondenceLanguage } from '../questions/tenant-form';
import { correspondenceAddress } from '../questions/tenant-detail';
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

When(
	'der Liegenschaftsverwalter die Korrespondenz per Brief an {string}, {string} in {string} festlegt',
	async ({ verwalter }, address: string, place: string, country: string) => {
		await verwalter.attemptsTo(correspondByLetter(address, place, country));
	}
);

Then('erklärt die Seite bei der Korrespondenzadresse {string}', async ({ verwalter }, help: string) => {
	await verwalter.sees(addressHelpText).toBe(help);
});

// the lines of the address, written with commas in the scenario
Then('die Korrespondenzadresse von {string} ist {string}', async ({ verwalter }, _tenant: string, address: string) => {
	await verwalter.sees(correspondenceAddress).toBe(address.split(', ').join(' '));
});

const COUNTRIES: Record<string, string> = { Deutschland: 'DE' };

Given(
	'die Korrespondenzadresse von {string} ist {string}, {string} in {string}',
	async ({ seed }, tenant: string, address: string, place: string, country: string) => {
		const [postalCode, city] = place.split(' ');
		await seed.address(tenant, address, postalCode, city, COUNTRIES[country]);
	}
);

Given(
	'die Korrespondenzadresse von {string} ist noch die Adresse des Gebäudes {string}',
	async ({ seed }, tenant: string, building: string) => {
		await seed.buildingAddress(tenant, building);
	}
);
