import { expect } from '@playwright/test';
import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { manualStatusChoice, numberTaken, statusFromContracts } from '../questions/apartment-form';
import {
	blockApartment,
	changeArea,
	changeNumber,
	chooseBuilding,
	enterNumber,
	registerApartment,
	saveApartment
} from '../tasks/apartment-form';

const { Given, When, Then } = createBdd(test);

const apartmentFrom = (table: DataTable) => {
	const fields = table.rowsHash();
	return { number: fields.Nummer, floor: fields.Stockwerk, area: fields.Fläche, rooms: fields.Zimmer };
};

Given('der Liegenschaftsverwalter ist auf der Seite "Neue Wohnung"', async ({ verwalter }) => {
	await visit(verwalter.page, '/apartments/new');
});

Given(
	'der Liegenschaftsverwalter erfasst eine neue Wohnung im Gebäude {string}',
	async ({ verwalter, seed }, building: string) => {
		await visit(verwalter.page, `/apartments/new?building=${seed.idOf(building)}`);
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite der Wohnung {string}',
	async ({ verwalter, seed }, number: string) => {
		await visit(verwalter.page, `/apartments/${seed.idOf(number)}/edit`);
	}
);

When(
	'der Liegenschaftsverwalter im Gebäude {string} folgende Wohnung erfasst:',
	async ({ verwalter, seed }, building: string, table: DataTable) => {
		await verwalter.perform(chooseBuilding(seed.idOf(building)!));
		await verwalter.perform(registerApartment(apartmentFrom(table)));
	}
);

When('der Liegenschaftsverwalter folgende Wohnung erfasst:', async ({ verwalter }, table: DataTable) => {
	await verwalter.perform(registerApartment(apartmentFrom(table)));
});

When('der Liegenschaftsverwalter die Wohnung ohne Angaben speichert', async ({ verwalter }) => {
	await verwalter.perform(saveApartment);
});

When('der Liegenschaftsverwalter die Wohnungsnummer {string} eingibt', async ({ verwalter }, number: string) => {
	await verwalter.perform(enterNumber(number));
});

When('der Liegenschaftsverwalter die Wohnungsnummer auf {string} ändert', async ({ verwalter }, number: string) => {
	await verwalter.perform(changeNumber(number));
});

When('der Liegenschaftsverwalter die Fläche auf {string} ändert', async ({ verwalter }, area: string) => {
	await verwalter.perform(changeArea(area));
});

When('der Liegenschaftsverwalter die Wohnung sperrt', async ({ verwalter }) => {
	await verwalter.perform(blockApartment);
});

Then(
	'warnt das Formular, dass die Wohnungsnummer {string} vergeben ist',
	async ({ verwalter }, number: string) => {
		await expect(numberTaken(verwalter)).toContainText(`"${number}" existiert bereits`);
	}
);

Then(
	'kann der Liegenschaftsverwalter den Status {string} nicht von Hand ändern',
	async ({ verwalter }, status: string) => {
		await expect(statusFromContracts(verwalter)).toHaveText(status);
		await expect(manualStatusChoice(verwalter)).toHaveCount(0);
	}
);
