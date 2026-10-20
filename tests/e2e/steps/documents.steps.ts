import { createBdd } from 'playwright-bdd';
import { inDays, swissDate } from '../fixtures/dates';
import { test } from '../fixtures/test';
import {
	deliveryOf,
	documentFor,
	documentsFor,
	justMarkedSent,
	mailsTo,
	nextReminder,
	printOffers,
	reminderOffers,
	reminderDelivery,
	reminderOutcome
} from '../questions/documents';
import { pageTitleText } from '../questions/app-frame';
import { listedStatement } from '../questions/statements';
import { downloadDocument, markLetterSent, openDocuments, openDocumentsToSend, openReminder, sendReminder } from '../tasks/documents';
import { openStatementList } from '../tasks/statements';

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
	'der Liegenschaftsverwalter die {string} an {string} in den Dokumenten als versendet markiert',
	async ({ verwalter, names }, title: string, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.attemptsTo(openDocumentsToSend, markLetterSent(title, name));
		await verwalter.sees(documentsFor(title, name)).toBe(0); // saved: no longer to send
	}
);

When(
	'der Liegenschaftsverwalter die {string} an {string} als versendet markiert',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(markLetterSent(title, names.get(tenant) ?? tenant));
	}
);

When(
	'der Liegenschaftsverwalter das PDF der {string} an {string} in den Dokumenten herunterlädt',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(downloadDocument(title, names.get(tenant) ?? tenant));
	}
);

Then('meldet die Abrechnung {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(reminderOutcome).toBe(message);
});

// one mail «<title> – …» with one PDF attached
Then('hat {string} per E-Mail {string} mit PDF erhalten', async ({ verwalter, names }, tenant: string, title: string) => {
	await verwalter.sees(mailsTo(names.get(`E-Mail ${tenant}`)!)).toEqual([[title, [true]]]);
});

Then('die Abrechnung führt die {string} als {string}', async ({ verwalter }, title: string, delivery: string) => {
	await verwalter.sees(deliveryOf(title)).toBe(delivery);
});

Then('ist die {string} an {string} zu versenden', async ({ verwalter, names }, title: string, tenant: string) => {
	await verwalter.sees(documentFor(title, names.get(tenant) ?? tenant)).toContain('Zu versenden');
});

// a letter once it was sent; an uploaded document never
Then(
	/^ist (?:die|das Dokument) "([^"]+)" (?:an|zu) "([^"]+)" nicht (?:mehr )?zu versenden$/,
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

// the e-mail of the reminder cannot reach the tenant, so the reminder waits to be printed and posted
Given('{string} wünscht Korrespondenz per E-Mail, hat aber keine E-Mail-Adresse', async ({ seed }, tenant: string) => {
	await seed.correspondence(tenant, 'email');
	await seed.noEmail(tenant);
});

Then(
	'führt die Abrechnung die {string} mit der Zahlungsfrist in {int} Tagen',
	async ({ verwalter }, title: string, days: number) => {
		await verwalter.sees(documentFor(title, '')).toContain(`Zahlungsfrist der Mahnung: ${swissDate(inDays(days))}`);
	}
);

Then('nennt die Abrechnung die nächste Mahnung ab dem Tag in {int} Tagen', async ({ verwalter }, days: number) => {
	await verwalter.sees(nextReminder).toBe(swissDate(inDays(days)));
});

Then(
	'nennt die Liste der Abrechnungen bei {string} die nächste Mahnung ab dem Tag in {int} Tagen',
	async ({ verwalter, names }, tenant: string, days: number) => {
		await verwalter.attemptsTo(openStatementList);
		await verwalter
			.sees(listedStatement(names.get(tenant) ?? tenant))
			.toContain(`Nächste Mahnung möglich ab ${swissDate(inDays(days))}`);
	}
);

Then(
	'ist die {string} an {string} per Brief versendet festgehalten',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(openDocuments);
		await verwalter.sees(documentFor(title, names.get(tenant) ?? tenant)).toMatch(/per Brief.*Versendet/);
	}
);

// #193: marked as sent, the letter is remade; the page names it and offers its new PDF to print now
Then(
	'bietet die Seite die {string} an {string} zum Ausdrucken an',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.sees(justMarkedSent).toContain(`«${title}» an ${names.get(tenant) ?? tenant} ist als versendet markiert.`);
		await verwalter.sees(printOffers).toBe(1);
	}
);

When('der Liegenschaftsverwalter eine Mahnung senden will', async ({ verwalter }) => {
	await verwalter.attemptsTo(openReminder);
});

Then('sagt die Mahnung vor dem Senden {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(reminderDelivery).toContain(text);
});

Then(
	'sagt die Mahnung vor dem Senden, dass für {string} keine E-Mail-Adresse erfasst ist',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(reminderDelivery).toContain(
			`Für ${names.get(tenant) ?? tenant} ist keine E-Mail-Adresse erfasst. Dwello erstellt die Mahnung als PDF. Sie liegt danach unter «Dokumente» zum Ausdrucken.`
		);
	}
);

Then(
	'führen die Dokumente die {string} an {string} als {string}',
	async ({ verwalter, names }, title: string, tenant: string, status: string) => {
		await verwalter.sees(documentFor(title, names.get(tenant) ?? tenant)).toContain(status);
	}
);

// no row of that title for the tenant on «Dokumente», or only among those to send
const listsNo =
	(open: typeof openDocuments): Extract<Parameters<typeof Then>[1], (...args: never[]) => unknown> =>
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(open);
		await verwalter.sees(pageTitleText).toBe('Dokumente');
		await verwalter.sees(documentsFor(title, names.get(tenant) ?? tenant)).toBe(0);
	};

Then('ist die {string} an {string} nicht mehr bei den zu versendenden Dokumenten', listsNo(openDocumentsToSend));

Then('ist die {string} an {string} nicht unter «Dokumente» abgelegt', listsNo(openDocuments));
