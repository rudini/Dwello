import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { pageTitleText } from '../questions/app-frame';
import { documentsFor } from '../questions/documents';
import { sendConfirmation } from '../questions/statement-detail';
import { openDocuments } from '../tasks/documents';
import { deliverByLetter, openSendConfirmation, sendStatement } from '../tasks/statement-detail';

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
	'sagt die Bestätigung, dass Dwello die Abrechnung per E-Mail sendet und die Zahlungsfrist am Tag des Versands beginnt',
	async ({ verwalter }) => {
		await verwalter.sees(sendConfirmation).toContain('Dwello sendet die Abrechnung als PDF per E-Mail');
		await verwalter.sees(sendConfirmation).toContain('die Zahlungsfrist beginnt an diesem Tag');
	}
);

Then(
	'ist die {string} an {string} nicht unter «Dokumente» abgelegt',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(openDocuments);
		await verwalter.sees(pageTitleText).toBe('Dokumente');
		await verwalter.sees(documentsFor(title, names.get(tenant) ?? tenant)).toBe(0);
	}
);
