import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	amountOfInvoice,
	categoryOfInvoice,
	distributionKeyOfInvoice,
	reasonForOverride,
	recategorizationFailure,
	tenancyLawNote,
	utilityCostOfInvoice
} from '../questions/invoice-detail';
import {
	deleteInvoice,
	openBuildingOfInvoice,
	openInvoice,
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
	'erklärt ein Hinweis, dass die Kosten nach Mietrecht nicht auf die Mieter umlegbar sind',
	async ({ verwalter }) => {
		await verwalter.sees(tenancyLawNote).toContain('nicht auf Mieter umlegbar');
	}
);

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
