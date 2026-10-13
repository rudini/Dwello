import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { emailLinkAddress, emailLinks, phoneLinkAddress } from '../questions/contact';
import { pageTitle } from '../questions/navigation';

const { Given, Then } = createBdd(test);

Given('{string} hat eine E-Mail-Adresse', async ({ seed }, tenant: string) => {
	await seed.email(tenant);
});

Given(
	'{string} hat die Telefonnummer {string}',
	async ({ seed }, tenant: string, phone: string) => {
		await seed.phone(tenant, phone);
	}
);

// The mail program and the phone open outside the browser, so the link itself is checked
Then(
	'kann der Liegenschaftsverwalter {string} eine E-Mail schreiben',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(emailLinkAddress).toBe(`mailto:${names.get(`E-Mail ${tenant}`)}`);
	}
);

Then(
	'kann der Liegenschaftsverwalter {string} keine E-Mail schreiben',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(pageTitle).toMatch(new RegExp(names.get(tenant) ?? tenant));
		await verwalter.sees(emailLinks).toBe(0);
	}
);

Then(
	'kann der Liegenschaftsverwalter {string} unter {string} anrufen',
	async ({ verwalter }, _tenant: string, phone: string) => {
		await verwalter.sees(phoneLinkAddress).toBe(`tel:${phone}`);
	}
);
