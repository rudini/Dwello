import { expect } from '@playwright/test';
import { createBdd, type DataTable } from 'playwright-bdd';
import { randomUUID } from 'crypto';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { errorMessage } from '../questions/building-form';
import {
	cancelEditing,
	changePostalCode,
	changeYearBuilt,
	registerBuilding,
	saveBuilding
} from '../tasks/building-form';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Neues Gebäude"', async ({ verwalter }) => {
	await visit(verwalter.page, '/buildings/new');
});

When(
	'der Liegenschaftsverwalter folgendes Gebäude erfasst:',
	async ({ verwalter, names }, table: DataTable) => {
		const fields = table.rowsHash();
		const name = `${fields.Name} ${randomUUID()}`;
		names.set(fields.Name, name);
		await verwalter.perform(
			registerBuilding({
				name,
				address: fields.Adresse,
				postalCode: fields.PLZ,
				city: fields.Ort,
				canton: fields.Kanton
			})
		);
	}
);

When('der Liegenschaftsverwalter das Gebäude ohne Angaben speichert', async ({ verwalter }) => {
	await verwalter.perform(saveBuilding);
});

When('der Liegenschaftsverwalter die Bearbeitung abbricht', async ({ verwalter }) => {
	await verwalter.perform(cancelEditing);
});

Then('sieht der Liegenschaftsverwalter die Fehlermeldung {string}', async ({ verwalter }, text: string) => {
	await expect(errorMessage(verwalter, text)).toBeVisible();
});

Given(
	'der Liegenschaftsverwalter ist auf der Bearbeitungsseite von {string}',
	async ({ verwalter, seed }, title: string) => {
		await visit(verwalter.page, `/buildings/${seed.idOf(title)}/edit`);
	}
);

When('der Liegenschaftsverwalter das Baujahr auf {string} ändert', async ({ verwalter }, year: string) => {
	await verwalter.perform(changeYearBuilt(year));
});

When('der Liegenschaftsverwalter die PLZ auf {string} ändert', async ({ verwalter }, postalCode: string) => {
	await verwalter.perform(changePostalCode(postalCode));
});
