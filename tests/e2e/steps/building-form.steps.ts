import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	changeAccountingPeriod,
	changePostalCode,
	changeYearBuilt,
	markNoTank,
	openBuildingEdit,
	openNewBuilding,
	openNewBuildingAtContent,
	registerBuilding,
	saveBuilding
} from '../tasks/building-form';

import {
	accountingPeriodChangeable,
	accountingPeriodHelpText,
	chosenAccountingPeriod,
	focusedField
} from '../questions/building-form';

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
				canton: fields.Kanton,
				accountingPeriod: fields.Abrechnungsperiode
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

When('der Liegenschaftsverwalter die Abrechnungsperiode auf {string} ändert', async ({ verwalter }, label: string) => {
	await verwalter.attemptsTo(changeAccountingPeriod(label));
});

Then('schlägt das Formular die Abrechnungsperiode {string} vor', async ({ verwalter }, label: string) => {
	await verwalter.sees(chosenAccountingPeriod).toBe(label);
});

// the text may name the building: by its seeded name
Then('sagt das Formular zur Abrechnungsperiode {string}', async ({ verwalter, names }, text: string) => {
	const named = [...names.entries()].reduce((all, [title, name]) => all.replaceAll(title, name), text);
	await verwalter.sees(accountingPeriodHelpText).toBe(named);
});

Then('lässt das Formular die Abrechnungsperiode nicht ändern', async ({ verwalter }) => {
	await verwalter.sees(accountingPeriodChangeable).toBe(false);
});
