import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	changePostalCode,
	changeYearBuilt,
	markNoTank,
	openBuildingEdit,
	openNewBuilding,
	openNewBuildingAtContent,
	registerBuilding,
	saveBuilding
} from '../tasks/building-form';

import { focusedField } from '../questions/building-form';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Neues Gebäude"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewBuilding);
});

When(
	'der Liegenschaftsverwalter folgendes Gebäude erfasst:',
	async ({ verwalter, seed }, table: DataTable) => {
		const fields = table.rowsHash();
		await verwalter.attemptsTo(
			registerBuilding({
				name: seed.unique(fields.Name),
				address: fields.Adresse,
				postalCode: fields.PLZ,
				city: fields.Ort,
				canton: fields.Kanton
			})
		);
	}
);

When('der Liegenschaftsverwalter das Gebäude ohne Angaben speichert', async ({ verwalter }) => {
	await verwalter.attemptsTo(saveBuilding);
});

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite von {string}',
	async ({ verwalter, seed }, title: string) => {
		await verwalter.attemptsTo(openBuildingEdit(seed.idOf(title)!));
	}
);

When('der Liegenschaftsverwalter das Baujahr auf {string} ändert', async ({ verwalter }, year: string) => {
	await verwalter.attemptsTo(changeYearBuilt(year));
});

When('der Liegenschaftsverwalter die PLZ auf {string} ändert', async ({ verwalter }, postalCode: string) => {
	await verwalter.attemptsTo(changePostalCode(postalCode));
});

When(
	'der Liegenschaftsverwalter festhält, dass das Gebäude keinen Tank hat oder der Tank stillgelegt ist',
	async ({ verwalter }) => {
		await verwalter.attemptsTo(markNoTank);
	}
);

Given('der Liegenschaftsverwalter ist zum Inhalt der Seite "Neues Gebäude" gesprungen', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewBuildingAtContent);
});

Then('steht der Fokus im Feld {string}', async ({ verwalter }, field: string) => {
	await verwalter.sees(focusedField).toBe(field);
});
