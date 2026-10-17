import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	amountOfInvoice,
	numberOfInvoice,
	categoryOfInvoice,
	distributionKeyOfInvoice,
	distributionKeyRows,
	missedWarningText,
	reasonForOverride,
	reasonOfCategory,
	reasonsOfCategory,
	recategorizationFailure,
	tenancyLawNote,
	tenancyLawNotes,
	utilityCostOfInvoice
} from '../questions/invoice-detail';
import { pageAddressInApp } from '../questions/statements';
import {
	deleteInvoice,
	openBuildingOfInvoice,
	openInvoice,
	openMissedStatements,
	recategorizeInvoice,
	startEditingInvoice
} from '../tasks/invoice-detail';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von {string}',
	async ({ verwalter, seed }, supplier: string) => {
		await verwalter.attemptsTo(openInvoice(seed.idOf(`Rechnung ${supplier}`)!));
	}
);

Given('die Rechnung von {string} hat keinen Verteilschlüssel', async ({ seed }, supplier: string) => {
	await seed.invoiceWithoutKey(supplier);
});

When('der Liegenschaftsverwalter die Rechnung löscht', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteInvoice);
});

When('der Liegenschaftsverwalter die Rechnung neu kategorisieren lässt', async ({ verwalter }) => {
	await verwalter.attemptsTo(recategorizeInvoice);
});

When('der Liegenschaftsverwalter die Rechnung bearbeiten will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startEditingInvoice);
});

When('der Liegenschaftsverwalter das Gebäude der Rechnung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openBuildingOfInvoice);
});

Then('sieht der Liegenschaftsverwalter den Betrag {string}', async ({ verwalter }, amount: string) => {
	await verwalter.sees(amountOfInvoice).toBe(amount);
});

Then(
	'sieht der Liegenschaftsverwalter die Kategorie {string} und den Verteilschlüssel {string}',
	async ({ verwalter }, category: string, key: string) => {
		await verwalter.sees(categoryOfInvoice).toBe(category);
		await verwalter.sees(distributionKeyOfInvoice).toBe(key);
	}
);

Then('ist die Rechnung umlagefähig', async ({ verwalter }) => {
	await verwalter.sees(utilityCostOfInvoice).toBe('Umlagefähig');
});

Then('ist die Rechnung nicht umlagefähig', async ({ verwalter }) => {
	await verwalter.sees(utilityCostOfInvoice).toBe('Nicht umlagefähig');
});

Then(
	'erklärt ein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst',
	async ({ verwalter }) => {
		await verwalter.sees(tenancyLawNote).toContain('Diese Rechnung fliesst nicht in die Nebenkostenabrechnung ein.');
	}
);

Then(
	'nennt die Rechnung als Grund der Umlagefähigkeit ihrer Kategorie {string}',
	async ({ verwalter }, text: string) => {
		await verwalter.sees(reasonOfCategory).toContain(text);
	}
);

Then('nennt die Rechnung keinen Grund der Umlagefähigkeit', async ({ verwalter }) => {
	await verwalter.sees(reasonsOfCategory).toBe(0);
});

// After the reason that anchors it: no «Keiner – … pro Wohnung verteilt» for an invoice nobody pays (#292, Helga P-1)
Then('sagt die Rechnung ohne Verteilschlüssel nicht, wie sie verteilt würde', async ({ verwalter }) => {
	await verwalter.sees(distributionKeyRows).toBe(0);
});

// After the reason that anchors it: the general note gives way to the category's reason (#292, Fachreview V-6)
Then('erklärt kein Hinweis, dass die Rechnung nicht in die Nebenkostenabrechnung einfliesst', async ({ verwalter }) => {
	await verwalter.sees(tenancyLawNotes).toBe(0);
});

Then(
	'erfährt der Liegenschaftsverwalter, dass die KI nicht erreichbar ist oder keine passende Kategorie geliefert hat',
	async ({ verwalter }) => {
		await verwalter
			.sees(recategorizationFailure)
			.toContain('Die KI ist nicht erreichbar oder hat keine passende Kategorie geliefert.');
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Grund {string} für die Änderung der KI-Kategorie',
	async ({ verwalter }, reason: string) => {
		await verwalter.sees(reasonForOverride).toBe(reason);
	}
);

Then('sieht der Liegenschaftsverwalter die Rechnungsnummer {string}', async ({ verwalter }, number: string) => {
	await verwalter.sees(numberOfInvoice).toBe(number);
});

Given('die Rechnung von {string} kostet danach {string} Franken', async ({ seed }, supplier: string, amount: string) => {
	await seed.invoiceAmount(`Rechnung ${supplier}`, amount);
});

Given('die Rechnung {string} kostet danach {string} Franken', async ({ seed }, invoice: string, amount: string) => {
	await seed.invoiceAmount(`Rechnung ${invoice}`, amount);
});

Then('ist der Liegenschaftsverwalter auf der Detailseite der Rechnung {string}', async ({ verwalter, seed }, invoice: string) => {
	await verwalter.sees(pageAddressInApp).toBe(`/invoices/${seed.idOf(`Rechnung ${invoice}`)}`);
});

Then('warnt die Rechnung {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(missedWarningText).toContain(text);
});

When('der Liegenschaftsverwalter die Abrechnungen ohne diese Rechnung öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openMissedStatements);
});
