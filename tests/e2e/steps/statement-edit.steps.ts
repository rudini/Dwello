import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	costsAreRecalculated,
	deadlineFields,
	notes,
	notesField,
	notesHelp,
	paymentDeadline,
	paymentDeadlineInvalid,
	paymentDeadlineProblem
} from '../questions/statement-edit';
import { statementPath } from '../questions/statements';
import { clearPaymentDeadline, extendPaymentDeadline, keepNote, openStatementEdit } from '../tasks/statement-edit';
import { escapeRegExp } from '../questions/pattern';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openStatementEdit(statementPath(seed, tenant, year)));
	}
);

When(
	'der Liegenschaftsverwalter die Zahlungsfrist auf {string} verlängert mit der Bemerkung {string}',
	async ({ verwalter }, deadline: string, note: string) => {
		await verwalter.attemptsTo(extendPaymentDeadline(deadline, note));
	}
);

// #966: an earlier day than the one the tenant was told, without a remark
When('der Liegenschaftsverwalter die Zahlungsfrist auf {string} vorverlegt', async ({ verwalter }, deadline: string) => {
	await verwalter.attemptsTo(extendPaymentDeadline(deadline, ''));
});

When('der Liegenschaftsverwalter die Zahlungsfrist leert und speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(clearPaymentDeadline);
});

Then('meldet das Feld «Zahlungsfrist» {string}', async ({ verwalter }, message: string) => {
	await verwalter.sees(paymentDeadlineInvalid).toBe('true');
	await verwalter.sees(paymentDeadlineProblem).toMatch(new RegExp(escapeRegExp(message)));
});

When('der Liegenschaftsverwalter nur die Bemerkung {string} festhält', async ({ verwalter }, note: string) => {
	await verwalter.attemptsTo(keepNote(note));
});

Then('fragt die Bearbeitungsseite nur nach einer Bemerkung', async ({ verwalter }) => {
	await verwalter.sees(notesField).toBe(true);
	await verwalter.sees(deadlineFields).toBe(0);
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

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der berichtigten Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openStatementEdit(`/statements/${seed.idOf(`Berichtigte Abrechnung ${tenant} ${year}`)}`));
	}
);

// #403 (6): visible help at the field, not a tooltip
Then('erklärt die Bearbeitungsseite die Bemerkung mit {string}', async ({ verwalter }, help: string) => {
	await verwalter.sees(notesHelp).toBe(help);
});
