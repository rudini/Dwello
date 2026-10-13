import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { manualStatusChoices, numberTaken, statusFromContracts } from '../questions/apartment-form';
import {
	blockApartment,
	changeArea,
	changeNumber,
	chooseBuilding,
	enterNumber,
	openApartmentEdit,
	openNewApartment,
	openNewApartmentInBuilding,
	registerApartment,
	saveApartment
} from '../tasks/apartment-form';

const { Given, When, Then } = createBdd(test);

const apartmentFrom = (table: DataTable) => {
	const fields = table.rowsHash();
	return { number: fields.Nummer, floor: fields.Stockwerk, area: fields.Fläche, rooms: fields.Zimmer };
};

Given('der Liegenschaftsverwalter ist auf der Seite "Neue Wohnung"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewApartment);
});

Given(
	'der Liegenschaftsverwalter erfasst eine neue Wohnung im Gebäude {string}',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(openNewApartmentInBuilding(seed.idOf(building)!));
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung {string}',
	async ({ verwalter, seed }, number: string) => {
		await verwalter.attemptsTo(openApartmentEdit(seed.idOf(number)!));
	}
);

When(
	'der Liegenschaftsverwalter im Gebäude {string} folgende Wohnung erfasst:',
	async ({ verwalter, seed }, building: string, table: DataTable) => {
		await verwalter.attemptsTo(chooseBuilding(seed.idOf(building)!), registerApartment(apartmentFrom(table)));
	}
);

When('der Liegenschaftsverwalter folgende Wohnung erfasst:', async ({ verwalter }, table: DataTable) => {
	await verwalter.attemptsTo(registerApartment(apartmentFrom(table)));
});

When('der Liegenschaftsverwalter die Wohnung ohne Angaben speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(saveApartment);
});

When('der Liegenschaftsverwalter die Wohnungsnummer {string} eingibt', async ({ verwalter }, number: string) => {
	await verwalter.attemptsTo(enterNumber(number));
});

When('der Liegenschaftsverwalter die Wohnungsnummer auf {string} ändert', async ({ verwalter }, number: string) => {
	await verwalter.attemptsTo(changeNumber(number));
});

When('der Liegenschaftsverwalter die Fläche auf {string} ändert', async ({ verwalter }, area: string) => {
	await verwalter.attemptsTo(changeArea(area));
});

When('der Liegenschaftsverwalter die Wohnung sperrt', async ({ verwalter }) => {
	await verwalter.attemptsTo(blockApartment);
});

Then(
	'warnt das Formular, dass die Wohnungsnummer {string} vergeben ist',
	async ({ verwalter }, number: string) => {
		await verwalter.sees(numberTaken).toContain(`"${number}" existiert bereits`);
	}
);

Then(
	'kann der Liegenschaftsverwalter den Status {string} nicht von Hand ändern',
	async ({ verwalter }, status: string) => {
		await verwalter.sees(statusFromContracts).toBe(status);
		await verwalter.sees(manualStatusChoices).toBe(0);
	}
);
