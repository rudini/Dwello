import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	amountOfInvoice,
	categoryOfInvoice,
	distributionKeyOfInvoice,
	tenancyLawNote,
	utilityCostOfInvoice
} from '../questions/invoice-detail';
import { deleteInvoice, openBuildingOfInvoice, startEditingInvoice } from '../tasks/invoice-detail';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite der Rechnung von {string}',
	async ({ verwalter, seed }, supplier: string) => {
		await visit(verwalter.page, `/invoices/${seed.idOf(`Rechnung ${supplier}`)}`);
	}
);

When('der Liegenschaftsverwalter die Rechnung löscht', async ({ verwalter }) => {
	await verwalter.perform(deleteInvoice);
});

When('der Liegenschaftsverwalter die Rechnung bearbeiten will', async ({ verwalter }) => {
	await verwalter.perform(startEditingInvoice);
});

When('der Liegenschaftsverwalter das Gebäude der Rechnung öffnet', async ({ verwalter }) => {
	await verwalter.perform(openBuildingOfInvoice);
});

Then('sieht der Liegenschaftsverwalter den Betrag {string}', async ({ verwalter }, amount: string) => {
	await expect(amountOfInvoice(verwalter)).toHaveText(amount);
});

Then(
	'sieht der Liegenschaftsverwalter die Kategorie {string} und den Verteilschlüssel {string}',
	async ({ verwalter }, category: string, key: string) => {
		await expect(categoryOfInvoice(verwalter)).toHaveText(category);
		await expect(distributionKeyOfInvoice(verwalter)).toHaveText(key);
	}
);

Then('ist die Rechnung umlagefähig', async ({ verwalter }) => {
	await expect(utilityCostOfInvoice(verwalter)).toHaveText('Umlagefähig');
});

Then('ist die Rechnung nicht umlagefähig', async ({ verwalter }) => {
	await expect(utilityCostOfInvoice(verwalter)).toHaveText('Nicht umlagefähig');
});

Then(
	'erklärt ein Hinweis, dass die Kosten nach Mietrecht nicht auf die Mieter umlegbar sind',
	async ({ verwalter }) => {
		await expect(tenancyLawNote(verwalter)).toContainText('nicht auf Mieter umlegbar');
	}
);
