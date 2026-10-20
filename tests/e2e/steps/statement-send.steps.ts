import { createBdd } from 'playwright-bdd';
import { inDays, swissDate } from '../fixtures/dates';
import { test } from '../fixtures/test';
import { history, letterInsteadOffers, sendConfirmLabel, sendConfirmation } from '../questions/statement-detail';
import { correspondence } from '../questions/tenant-form';
import { openTenantDetail } from '../tasks/tenant-detail';
import { paymentDeadline } from '../questions/statement-edit';
import { deliverByLetter, deliverByLetterInstead, openSendConfirmation, sendStatement } from '../tasks/statement-detail';

const { Given, When, Then } = createBdd(test);

Given(
	'{string} wünscht Korrespondenz per E-Mail an eine Adresse, die der Mailserver abweist',
	async ({ seed }, tenant: string) => {
		await seed.correspondence(tenant, 'email');
		await seed.email(tenant, 'abgewiesen.dwello.test');
	}
);

When('der Liegenschaftsverwalter die Abrechnung per E-Mail senden will', async ({ verwalter }) => {
	await verwalter.attemptsTo(openSendConfirmation);
});

When('der Liegenschaftsverwalter die Abrechnung per E-Mail sendet', async ({ verwalter }) => {
	await verwalter.attemptsTo(sendStatement);
});

When('der Liegenschaftsverwalter die Abrechnung stattdessen per Brief zustellt', async ({ verwalter }) => {
	await verwalter.attemptsTo(deliverByLetter);
});

Then(
	'sagt die Bestätigung, dass Dwello die Abrechnung per E-Mail sendet und die Zahlungsfrist ab dem Tag des Versands rechnet',
	async ({ verwalter }) => {
		await verwalter.sees(sendConfirmation).toContain('Dwello sendet die Abrechnung als PDF per E-Mail');
		await verwalter.sees(sendConfirmation).toContain('Die Zahlungsfrist ist so viele Tage danach, wie in den Einstellungen festgelegt');
	}
);

// the Zahlungsfrist of the default settings (30 days), counted from the day the statement went out (#86)
Then('ist die Zahlungsfrist {int} Tage nach dem Tag des Versands', async ({ verwalter }, days: number) => {
	await verwalter.sees(paymentDeadline).toBe(swissDate(inDays(days)));
});

When('der Liegenschaftsverwalter die Abrechnung statt per E-Mail per Brief zustellt', async ({ verwalter }) => {
	await verwalter.attemptsTo(deliverByLetterInstead);
});

Then('erklärt die Bestätigung des Versands {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(sendConfirmation).toContain(text);
});

Then('bietet die Bestätigung nur den Brief an', async ({ verwalter }) => {
	await verwalter.sees(sendConfirmLabel).toBe('Als versendet markieren');
	await verwalter.sees(letterInsteadOffers).toBe(0);
});

// the address the fixture gave the tenant (seed.correspondence)
Then(
	'nennt der Verlauf den Versand per E-Mail an {string} am Tag des Versands',
	async ({ verwalter, seed }, tenant: string) => {
		const email = `${seed.idOf(tenant)}@dwello.test`;
		await verwalter.sees(history).toMatch(new RegExp(`Versendet per E-Mail an ${email.replace(/\./g, '\\.')}\\s*${swissDate(inDays(0)).replace(/\./g, '\\.')}`));
	}
);

Then('wünscht {string} weiterhin Korrespondenz per E-Mail', async ({ verwalter, seed }, tenant: string) => {
	await verwalter.attemptsTo(openTenantDetail(seed.idOf(tenant)!));
	await verwalter.sees(correspondence).toBe('Per E-Mail');
});
