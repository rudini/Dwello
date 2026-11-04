import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	buildingAddress,
	fuelStockCategoryNames,
	fuelStocksHelp,
	fuelStockDateExample,
	fuelStockDateExampleRecent,
	fuelStockDateExampleDay,
	fuelStocksHelpNamesExample,
	fuelStocksTitle,
	listedApartment,
	shownMaps,
	periodOfBuilding,
	tankOfBuilding,
	yearBuilt
} from '../questions/building-detail';
import { emptyListShown, listedBuildingCount } from '../questions/buildings';
import { chosenInvoiceBuilding } from '../questions/invoices';
import {
	deleteBuilding,
	openApartment,
	openBuildingDetail,
	openBuildingInvoices,
	recordFuelStock,
	saveFuelStockWithoutDate,
	startDeletingBuilding,
	startEditing,
	startFirstApartment,
	startNewApartment
} from '../tasks/building-detail';
import { searchBuildings } from '../tasks/buildings';

const { Given, When, Then } = createBdd(test);

Given(
	'im Gebäude {string} gibt es die leere Wohnung {string} mit {int} m²',
	async ({ seed }, buildingTitle: string, number: string, area: number) => {
		await seed.apartment(buildingTitle, number, 'vacant', String(area));
	}
);

Given(
	'im Gebäude {string} gibt es die leere Wohnung {string}',
	async ({ seed }, buildingTitle: string, number: string) => {
		await seed.apartment(buildingTitle, number, 'vacant');
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite von {string}',
	async ({ verwalter, seed }, title: string) => {
		await verwalter.attemptsTo(openBuildingDetail(seed.idOf(title)!));
	}
);

When('der Liegenschaftsverwalter das Gebäude löscht', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteBuilding);
});

When('der Liegenschaftsverwalter das Gebäude löschen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startDeletingBuilding);
});

When('der Liegenschaftsverwalter das Gebäude bearbeiten will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startEditing);
});

When('der Liegenschaftsverwalter die Rechnungen des Gebäudes öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openBuildingInvoices);
});

Then('zeigt die Rechnungsliste die Rechnungen im Gebäude {string}', async ({ verwalter, names }, building: string) => {
	await verwalter.sees(chosenInvoiceBuilding).toBe(names.get(building)!);
});

When('der Liegenschaftsverwalter eine Wohnung hinzufügen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startNewApartment);
});

When('der Liegenschaftsverwalter die erste Wohnung erstellen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startFirstApartment);
});

When('der Liegenschaftsverwalter die Wohnung {string} öffnet', async ({ verwalter }, number: string) => {
	await verwalter.attemptsTo(openApartment(number));
});

Then(
	'sieht der Liegenschaftsverwalter die Wohnung {string} mit dem Status {string}',
	async ({ verwalter }, number: string, status: string) => {
		await verwalter.sees(listedApartment(number)).toContain(status);
	}
);

Then('das Gebäude {string} ist nicht mehr in der Liste', async ({ verwalter, names }, title: string) => {
	const name = names.get(title) ?? title;
	await verwalter.attemptsTo(searchBuildings(name));
	await verwalter.sees(emptyListShown).toBe(true);
	await verwalter.sees(listedBuildingCount(name)).toBe(0);
});

Then('sieht der Liegenschaftsverwalter das Baujahr {string}', async ({ verwalter }, year: string) => {
	await verwalter.sees(yearBuilt).toBe(year);
});

Given('für das Gebäude {string} sind Koordinaten erfasst', async ({ seed }, title: string) => {
	await seed.buildingCoordinates(title);
});

Then('sieht der Liegenschaftsverwalter keine Karte des Gebäudes', async ({ verwalter }) => {
	await verwalter.sees(shownMaps).toBe(0);
});

Then('sieht der Liegenschaftsverwalter die Adresse {string}', async ({ verwalter }, address: string) => {
	await verwalter.sees(buildingAddress).toContain(address);
});

When(
	'der Liegenschaftsverwalter für das Gebäude {string} den Tankbestand vom {string} mit {string} Franken erfasst',
	async ({ verwalter, seed }, title: string, date: string, amount: string) => {
		await verwalter.attemptsTo(openBuildingDetail(seed.idOf(title)!), recordFuelStock(date, amount));
	}
);

When(
	'der Liegenschaftsverwalter für das Gebäude {string} einen Tankbestand mit {string} Franken speichert, nachdem er den Stichtag {string} eingegeben und wieder gelöscht hat',
	async ({ verwalter, seed }, title: string, amount: string, date: string) => {
		await verwalter.attemptsTo(openBuildingDetail(seed.idOf(title)!), saveFuelStockWithoutDate(date, amount));
	}
);

Then('nennt die Gebäudeseite die Abrechnungsperiode {string}', async ({ verwalter }, label: string) => {
	await verwalter.sees(periodOfBuilding).toBe(label);
});

Then('nennt die Gebäudeseite zum Tank {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(tankOfBuilding).toContain(text);
});

Then('heisst der Abschnitt zum Heizmaterial auf der Gebäudeseite {string}', async ({ verwalter }, title: string) => {
	await verwalter.sees(fuelStocksTitle).toBe(title);
});

Then(
	'bietet der Tankbestand des Gebäudes {string} die Kategorie {string} an',
	async ({ verwalter, seed, names }, title: string, category: string) => {
		await verwalter.attemptsTo(openBuildingDetail(seed.idOf(title)!));
		await verwalter.sees(fuelStockCategoryNames).toContain(names.get(category) ?? category);
	}
);

Then(
	'weder die Kategorie {string} noch die Kategorie {string}',
	async ({ verwalter, names }, first: string, second: string) => {
		await verwalter.sees(fuelStockCategoryNames).not.toContain(names.get(first) ?? first);
		await verwalter.sees(fuelStockCategoryNames).not.toContain(names.get(second) ?? second);
	}
);

// #1098: the building's own Abrechnungsperiode (#1088); «von Juli bis Juni» is in statement-generate.steps.ts
Given('das Gebäude {string} rechnet im Kalenderjahr ab', async ({ seed }, building: string) => {
	await seed.accountingPeriod(building, 'calendar');
});

Given('das Gebäude {string} rechnet von November bis Oktober ab', async ({ seed }, building: string) => {
	await seed.accountingPeriod(building, 'november-october');
});

Then('nennt die Hilfe zum Tankbestand den Stichtag {string}', async ({ verwalter }, day: string) => {
	await verwalter.sees(fuelStocksHelp).toContain(day);
});

Then('nicht den Stichtag {string}', async ({ verwalter }, day: string) => {
	await verwalter.sees(fuelStocksHelp).not.toContain(day);
});

// Fachreview 1098-1 V-1: the example of the field is the next end of the building's period, so only its day is fixed
Then('nennt das Beispiel beim Stichtag den Tag {string}', async ({ verwalter }, day: string) => {
	await verwalter.sees(fuelStockDateExample).toContain(`Beispiel: ${day}`);
});

// #1103: the day the field's example names, also in the help
Then('nennt die Hilfe zum Tankbestand den Stichtag aus dem Beispiel beim Stichtag', async ({ verwalter }) => {
	await verwalter.sees(fuelStockDateExampleDay).not.toBeNull(); // Fachreview 1103-1 V-4
	await verwalter.sees(fuelStocksHelpNamesExample).toBe(true);
});

// Fachreview 1103-1 V-1: the last ended end, by its day and month, neither after today nor a year or more before it
Then(
	'ist das Beispiel beim Stichtag der {string} der zuletzt abgelaufenen Abrechnungsperiode',
	async ({ verwalter }, end: string) => {
		await verwalter.sees(fuelStockDateExample).toContain(`Beispiel: ${end}`);
		await verwalter.sees(fuelStockDateExampleRecent).toBe(true);
	}
);
