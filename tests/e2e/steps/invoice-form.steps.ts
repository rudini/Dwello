import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { nonAllocableCategoryWarning, utilityCostChoice } from '../questions/invoice-form';
import { amountOfListedInvoice, categoryOfListedInvoice } from '../questions/invoices';
import { chooseCategory, clearSupplier, correctAmount, recategorize, registerInvoice, saveInvoice } from '../tasks/invoice-form';
import { searchInvoices } from '../tasks/invoices';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Neue Rechnung"', async ({ verwalter }) => {
	await visit(verwalter.page, '/invoices/new');
});

Given('der Liegenschaftsverwalter bearbeitet die Rechnung von {string}', async ({ verwalter, seed }, supplier: string) => {
	await visit(verwalter.page, `/invoices/${seed.idOf(`Rechnung ${supplier}`)}/edit`);
});

When(
	'der Liegenschaftsverwalter die Rechnung von {string} über {string} Franken für {string} im Gebäude {string} in der Kategorie {string} erfasst',
	async ({ verwalter, seed }, supplier: string, amount: string, description: string, building: string, category: string) => {
		await verwalter.perform(
			registerInvoice({ buildingId: seed.idOf(building)!, supplier: seed.unique(supplier), amount, description, category })
		);
	}
);

When('der Liegenschaftsverwalter die Kategorie {string} wählt', async ({ verwalter }, category: string) => {
	await verwalter.perform(chooseCategory(category));
});

When('der Liegenschaftsverwalter die Rechnung ohne Angaben speichert', async ({ verwalter }) => {
	await verwalter.perform(saveInvoice);
});

When('der Liegenschaftsverwalter den Betrag auf {string} Franken korrigiert', async ({ verwalter }, amount: string) => {
	await verwalter.perform(correctAmount(amount));
});

When('der Liegenschaftsverwalter die Rechnung der Kategorie {string} zuordnet', async ({ verwalter }, category: string) => {
	await verwalter.perform(recategorize(category));
});

When('der Liegenschaftsverwalter die Rechnung ohne Rechnungssteller speichert', async ({ verwalter }) => {
	await verwalter.perform(clearSupplier);
});

Then(
	'die Rechnung von {string} über {string} in der Kategorie {string} ist auffindbar',
	async ({ verwalter, names }, supplier: string, amount: string, category: string) => {
		const name = names.get(supplier) ?? supplier;
		await verwalter.perform(searchInvoices(name));
		await expect(amountOfListedInvoice(verwalter, name)).toHaveText(amount);
		await expect(categoryOfListedInvoice(verwalter, name)).toHaveText(category);
	}
);

Then('ist die Rechnung nicht als umlagefähig markiert', async ({ verwalter }) => {
	await expect(utilityCostChoice(verwalter)).not.toBeChecked();
});

Then(
	'weist ein Hinweis darauf hin, dass die Kosten nicht auf die Mieter umgelegt werden können',
	async ({ verwalter }) => {
		await expect(nonAllocableCategoryWarning(verwalter)).toContainText('nicht auf Mieter übertragen');
	}
);
