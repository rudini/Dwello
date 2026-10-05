import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	allListedInvoices,
	amountOfListedInvoice,
	categoryOfListedInvoice,
	listedInvoice,
	statusOfListedInvoice
} from '../questions/invoices';
import {
	editInvoice,
	filterInvoices,
	searchInvoices,
	startNewInvoice,
	viewInvoice
} from '../tasks/invoices';

const { Given, When, Then } = createBdd(test);

Given(
	'{string} stellt dem Gebäude {string} {string} Franken für {string} in der Kategorie {string} in Rechnung',
	async (
		{ seed },
		supplier: string,
		building: string,
		amount: string,
		description: string,
		category: string
	) => {
		await seed.supplierInvoice(supplier, building, amount, description, category);
	}
);

Given('der Liegenschaftsverwalter ist auf der Rechnungsliste', async ({ verwalter }) => {
	await visit(verwalter.page, '/invoices');
});

When(
	'der Liegenschaftsverwalter nach dem Rechnungssteller {string} sucht',
	async ({ verwalter, names }, supplier: string) => {
		await verwalter.perform(searchInvoices(names.get(supplier) ?? supplier));
	}
);

When(
	'der Liegenschaftsverwalter die Rechnungen nach dem Gebäude {string} filtert',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(filterInvoices({ buildingId: seed.idOf(building)! }));
	}
);

When(
	'der Liegenschaftsverwalter die nicht umlagefähigen Rechnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(
			filterInvoices({ buildingId: seed.idOf(building)!, validity: 'invalid' })
		);
	}
);

When('der Liegenschaftsverwalter eine neue Rechnung erfassen will', async ({ verwalter }) => {
	await verwalter.perform(startNewInvoice);
});

When(
	'der Liegenschaftsverwalter die Rechnung von {string} ansieht',
	async ({ verwalter, names }, supplier: string) => {
		await verwalter.perform(viewInvoice(names.get(supplier) ?? supplier));
	}
);

When(
	'der Liegenschaftsverwalter die Rechnung von {string} bearbeiten will',
	async ({ verwalter, names }, supplier: string) => {
		await verwalter.perform(editInvoice(names.get(supplier) ?? supplier));
	}
);

Then(
	'sieht der Liegenschaftsverwalter die Rechnung von {string} über {string} in der Kategorie {string}',
	async ({ verwalter, names }, supplier: string, amount: string, category: string) => {
		const name = names.get(supplier) ?? supplier;
		await expect(amountOfListedInvoice(verwalter, name)).toHaveText(amount);
		await expect(categoryOfListedInvoice(verwalter, name)).toHaveText(category);
	}
);

Then('die Rechnungsliste enthält genau {int} Rechnung', async ({ verwalter }, count: number) => {
	await expect(allListedInvoices(verwalter)).toHaveCount(count);
});

Then(
	'ist die Rechnung von {string} als {string} kategorisiert',
	async ({ verwalter, names }, supplier: string, status: string) => {
		await expect(statusOfListedInvoice(verwalter, names.get(supplier) ?? supplier)).toHaveText(
			status
		);
	}
);

Then('ist der Liegenschaftsverwalter auf der Rechnungsliste', async ({ verwalter }) => {
	await expect(verwalter.page).toHaveURL(/\/invoices(\?.*)?$/);
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von {string}',
	async ({ verwalter, names }, supplier: string) => {
		await expect(verwalter.page).toHaveTitle(
			`${names.get(supplier) ?? supplier} - Rechnung - Dwello`
		);
	}
);

Then(
	'die Rechnung von {string} ist nicht mehr auffindbar',
	async ({ verwalter, names }, supplier: string) => {
		const name = names.get(supplier) ?? supplier;
		await verwalter.perform(searchInvoices(name));
		await expect(listedInvoice(verwalter, name)).toHaveCount(0);
	}
);
