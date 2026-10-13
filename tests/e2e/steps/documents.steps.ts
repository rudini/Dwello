import { createBdd } from 'playwright-bdd';
import { inDays } from '../fixtures/dates';
import { test } from '../fixtures/test';
import { deliveryOf, documentFor, documentsFor, mailsTo, reminderOffers, reminderOutcome } from '../questions/documents';
import { markLetterSent, openDocuments, openDocumentsToSend, sendReminder } from '../tasks/documents';

const { Given, When, Then } = createBdd(test);

const CHANNELS: Record<string, 'email' | 'letter'> = { 'E-Mail': 'email', Brief: 'letter' };

Given('{string} wünscht Korrespondenz per {word}', async ({ seed }, tenant: string, channel: string) => {
	await seed.correspondence(tenant, CHANNELS[channel]);
});

Given(
	'{string} hat für die Abrechnung {int} bereits eine Zahlungserinnerung erhalten',
	async ({ seed }, tenant: string, year: number) => {
		await seed.remind(tenant, year);
	}
);

Given('der Liegenschaftsverwalter ist bei den zu versendenden Dokumenten', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDocumentsToSend);
});

When('der Liegenschaftsverwalter eine Mahnung sendet', async ({ verwalter }) => {
	await verwalter.attemptsTo(sendReminder);
});

When(
	'der Liegenschaftsverwalter die {string} an {string} als versendet markiert',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(markLetterSent(title, names.get(tenant) ?? tenant));
	}
);

Then('meldet die Abrechnung {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(reminderOutcome).toBe(message);
});

// one mail «Zahlungserinnerung – …» with one PDF attached
Then(
	'{string} hat die Zahlungserinnerung per E-Mail mit PDF erhalten',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(mailsTo(names.get(`E-Mail ${tenant}`)!)).toEqual([['Zahlungserinnerung', ['pdf']]]);
	}
);

Then('die Abrechnung führt die {string} als {string}', async ({ verwalter }, title: string, delivery: string) => {
	await verwalter.sees(deliveryOf(title)).toBe(delivery);
});

Then('ist die {string} an {string} zu versenden', async ({ verwalter, names }, title: string, tenant: string) => {
	await verwalter.sees(documentFor(title, names.get(tenant) ?? tenant)).toContain('Zu versenden');
});

Then(
	'ist die {string} an {string} nicht mehr zu versenden',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.sees(documentsFor(title, names.get(tenant) ?? tenant)).toBe(0);
	}
);

Then(
	'ist die {string} an {string} als versendet festgehalten',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(openDocuments);
		await verwalter.sees(documentFor(title, names.get(tenant) ?? tenant)).toContain('Versendet');
	}
);

// Set after sending, which dates the statement and its deadline from that day; two days ago, so it has passed both
// in Switzerland and in the backend's UTC day (issue #123)
Given('die Zahlungsfrist der Abrechnung {int} von {string} ist abgelaufen', async ({ seed }, year: number, tenant: string) => {
	await seed.paymentDeadline(tenant, year, inDays(-2));
});

Given('die Zahlungsfrist der Abrechnung {int} von {string} läuft noch', async ({ seed }, year: number, tenant: string) => {
	await seed.paymentDeadline(tenant, year, inDays(10));
});

Then('bietet die Abrechnung keine Mahnung an', async ({ verwalter }) => {
	await verwalter.sees(reminderOffers).toBe(0);
});
