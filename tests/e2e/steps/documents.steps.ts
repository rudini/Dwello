import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { inDays } from '../fixtures/dates';
import { test } from '../fixtures/test';
import { reminderButton } from '../interactions/documents';
import { visit } from '../interactions/navigation';
import { deliveryOf, documentFor, mailsTo, reminderOutcome } from '../questions/documents';
import { markLetterSent, sendReminder } from '../tasks/documents';

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
	await visit(verwalter.page, '/documents?status=to_send');
});

When('der Liegenschaftsverwalter eine Mahnung sendet', async ({ verwalter }) => {
	await verwalter.perform(sendReminder);
});

When(
	'der Liegenschaftsverwalter die {string} an {string} als versendet markiert',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.perform(markLetterSent(title, names.get(tenant) ?? tenant));
	}
);

Then('meldet die Abrechnung {string}', async ({ verwalter }, message: string) => {
	await expect(reminderOutcome(verwalter)).toHaveText(message);
});

Then(
	'{string} hat die Zahlungserinnerung per E-Mail mit PDF erhalten',
	async ({ request, names }, tenant: string) => {
		const address = names.get(`E-Mail ${tenant}`)!;
		await expect
			.poll(async () => (await mailsTo(request, address)).map((m) => [m.subject.split(' – ')[0], m.attachments]))
			.toEqual([['Zahlungserinnerung', [expect.stringMatching(/\.pdf$/)]]]);
	}
);

Then('die Abrechnung führt die {string} als {string}', async ({ verwalter }, title: string, delivery: string) => {
	await expect(deliveryOf(verwalter, title)).toHaveText(delivery);
});

Then('ist die {string} an {string} zu versenden', async ({ verwalter, names }, title: string, tenant: string) => {
	await expect(documentFor(verwalter, title, names.get(tenant) ?? tenant)).toContainText('Zu versenden');
});

Then(
	'ist die {string} an {string} nicht mehr zu versenden',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await expect(documentFor(verwalter, title, names.get(tenant) ?? tenant)).toHaveCount(0);
	}
);

Then(
	'ist die {string} an {string} als versendet festgehalten',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await visit(verwalter.page, '/documents');
		await expect(documentFor(verwalter, title, names.get(tenant) ?? tenant)).toContainText('Versendet');
	}
);

// Set after sending, which dates the statement and its deadline from that day
Given('die Zahlungsfrist der Abrechnung {int} von {string} ist abgelaufen', async ({ seed }, year: number, tenant: string) => {
	await seed.paymentDeadline(tenant, year, inDays(-1));
});

Given('die Zahlungsfrist der Abrechnung {int} von {string} läuft noch', async ({ seed }, year: number, tenant: string) => {
	await seed.paymentDeadline(tenant, year, inDays(10));
});

Then('bietet die Abrechnung keine Mahnung an', async ({ verwalter }) => {
	await expect(reminderButton(verwalter.page)).toHaveCount(0);
});
