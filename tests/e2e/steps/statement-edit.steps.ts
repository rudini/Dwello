import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	costsAreRecalculated,
	notes,
	paymentDeadline,
	paymentDeadlineInvalid,
	paymentDeadlineProblem
} from '../questions/statement-edit';
import { statementPath } from '../questions/statements';
import { clearPaymentDeadline, extendPaymentDeadline, openStatementEdit } from '../tasks/statement-edit';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openStatementEdit(statementPath(seed.idOf(`Abrechnung ${tenant} ${year}`)!)));
	}
);

When(
	'der Liegenschaftsverwalter die Zahlungsfrist auf {string} verlängert mit der Bemerkung {string}',
	async ({ verwalter }, deadline: string, note: string) => {
		await verwalter.attemptsTo(extendPaymentDeadline(deadline, note));
	}
);

When('der Liegenschaftsverwalter die Zahlungsfrist leert und speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(clearPaymentDeadline);
});

Then('meldet das Feld «Zahlungsfrist» {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(paymentDeadlineInvalid).toBe('true');
	await verwalter.sees(paymentDeadlineProblem).toMatch(new RegExp(message.replace(/\./g, '\\.')));
});

Then('die Abrechnung ist zahlbar bis {string}', async ({ verwalter }, date: string) => {
	await verwalter.sees(paymentDeadline).toBe(date);
});

Then('die Abrechnung enthält die Bemerkung {string}', async ({ verwalter }, note: string) => {
	await verwalter.sees(notes).toBe(note);
});

Then(
	'sieht der Liegenschaftsverwalter, dass Kosten durch Neuerstellen der Abrechnung korrigiert werden',
	async ({ verwalter }) => {
		await verwalter.sees(costsAreRecalculated).toBe(true);
	}
);
