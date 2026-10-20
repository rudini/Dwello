import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	amountOfListedInvoice,
	categoryOfListedInvoice,
	invoiceListEmpty,
	listedInvoiceCount,
	listedInvoicesOf,
	invoicePeriodFilterText,
	invoiceShown,
	statusOfListedInvoice
} from '../questions/invoices';
import { pageAddress, pageTitle } from '../questions/navigation';
import { editInvoice, filterInvoices, openInvoiceList, openInvoicesOfPeriod, searchInvoices, startNewInvoice, viewInvoice } from '../tasks/invoices';

const { Given, When, Then } = createBdd(test);

Given(
	'{string} stellt dem Gebäude {string} {string} Franken für {string} in der Kategorie {string} in Rechnung',
	async ({ seed }, supplier: string, building: string, amount: string, description: string, category: string) => {
		await seed.supplierInvoice(supplier, building, amount, description, category);
	}
);

Given('der Liegenschaftsverwalter ist auf der Rechnungsliste', async ({ verwalter }) => {
	await verwalter.attemptsTo(openInvoiceList);
});

When('der Liegenschaftsverwalter nach dem Rechnungssteller {string} sucht', async ({ verwalter, names }, supplier: string) => {
	await verwalter.attemptsTo(searchInvoices(names.get(supplier) ?? supplier));
});

When(
	'der Liegenschaftsverwalter die Rechnungen des Jahres {int} im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.attemptsTo(filterInvoices({ buildingId: seed.idOf(building)!, year: String(year) }));
	}
);

When(
	'der Liegenschaftsverwalter die Rechnungen nach dem Gebäude {string} filtert',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(filterInvoices({ buildingId: seed.idOf(building)! }));
	}
);

When(
	'der Liegenschaftsverwalter die nicht umlagefähigen Rechnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(filterInvoices({ buildingId: seed.idOf(building)!, validity: 'invalid' }));
	}
);

When('der Liegenschaftsverwalter eine neue Rechnung erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startNewInvoice);
});

When('der Liegenschaftsverwalter die Rechnung von {string} ansieht', async ({ verwalter, names }, supplier: string) => {
	await verwalter.attemptsTo(viewInvoice(names.get(supplier) ?? supplier));
});

When(
	'der Liegenschaftsverwalter die Rechnung von {string} bearbeiten will',
	async ({ verwalter, names }, supplier: string) => {
		await verwalter.attemptsTo(editInvoice(names.get(supplier) ?? supplier));
	}
);

Then(
	'sieht der Liegenschaftsverwalter die Rechnung von {string} über {string} in der Kategorie {string}',
	async ({ verwalter, names }, supplier: string, amount: string, category: string) => {
		const name = names.get(supplier) ?? supplier;
		await verwalter.sees(amountOfListedInvoice(name)).toBe(amount);
		await verwalter.sees(categoryOfListedInvoice(name)).toBe(category);
	}
);

Then('die Rechnungsliste enthält genau {int} Rechnung', async ({ verwalter }, count: number) => {
	await verwalter.sees(listedInvoiceCount).toBe(count);
});

Then(
	'ist die Rechnung von {string} als {string} kategorisiert',
	async ({ verwalter, names }, supplier: string, status: string) => {
		await verwalter.sees(statusOfListedInvoice(names.get(supplier) ?? supplier)).toBe(status);
	}
);

Then('ist der Liegenschaftsverwalter auf der Rechnungsliste', async ({ verwalter }) => {
	await verwalter.sees(pageAddress).toMatch(/\/invoices(\?.*)?$/);
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite der Rechnung von {string}',
	async ({ verwalter, names }, supplier: string) => {
		await verwalter.sees(pageTitle).toBe(`${names.get(supplier) ?? supplier} - Rechnung - Dwello`);
	}
);

Then(
	'die Rechnung von {string} ist nicht mehr auffindbar',
	async ({ verwalter, names }, supplier: string) => {
		const name = names.get(supplier) ?? supplier;
		await verwalter.attemptsTo(searchInvoices(name));
		await verwalter.sees(invoiceListEmpty).toBe(true);
		await verwalter.sees(listedInvoicesOf(name)).toBe(0);
	}
);

When(
	'der Liegenschaftsverwalter die Rechnungen der Abrechnungsperiode vom {string} bis {string} im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, start: string, end: string, building: string) => {
		await verwalter.attemptsTo(openInvoicesOfPeriod(seed.idOf(building)!, start, end));
	}
);

// the filter names the building: by its seeded name
Then('nennt die Rechnungsliste den Filter {string}', async ({ verwalter, names }, text: string) => {
	const named = [...names.entries()].reduce((all, [title, name]) => all.replaceAll(` ${title},`, ` ${name},`), text);
	await verwalter.sees(invoicePeriodFilterText).toBe(named);
});

Then('sieht der Liegenschaftsverwalter die Rechnung {string}', async ({ verwalter }, description: string) => {
	await verwalter.sees(invoiceShown(description)).toBe(true);
});
