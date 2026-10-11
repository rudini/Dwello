import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { costsAreRecalculated, notes, paymentDeadline, paymentDeadlineField } from '../questions/statement-edit';
import { statementPath } from '../questions/statements';
import { clearPaymentDeadline, extendPaymentDeadline } from '../tasks/statement-edit';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await visit(verwalter.page, `${statementPath(seed, tenant, year)}/edit`);
	}
);

When(
	'der Liegenschaftsverwalter die Zahlungsfrist auf {string} verlängert mit der Bemerkung {string}',
	async ({ verwalter }, deadline: string, note: string) => {
		await verwalter.perform(extendPaymentDeadline(deadline, note));
	}
);

When('der Liegenschaftsverwalter die Zahlungsfrist leert und speichert', async ({ verwalter }) => {
	await verwalter.perform(clearPaymentDeadline);
});

Then('meldet das Feld «Zahlungsfrist» {string}', async ({ verwalter }, message: string) => {
	const field = paymentDeadlineField(verwalter);
	await expect(field).toHaveAttribute('aria-invalid', 'true');
	await expect(field).toHaveAccessibleDescription(new RegExp(message.replace(/\./g, '\\.')));
});

Then('die Abrechnung ist zahlbar bis {string}', async ({ verwalter }, date: string) => {
	await expect(paymentDeadline(verwalter)).toHaveText(date);
});

Then('die Abrechnung enthält die Bemerkung {string}', async ({ verwalter }, note: string) => {
	await expect(notes(verwalter)).toHaveText(note);
});

Then(
	'sieht der Liegenschaftsverwalter, dass Kosten durch Neuerstellen der Abrechnung korrigiert werden',
	async ({ verwalter }) => {
		await expect(costsAreRecalculated(verwalter)).toBeVisible();
	}
);
