import { createBdd, type DataTable } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	changePostalCode,
	changeYearBuilt,
	registerBuilding,
	saveBuilding
} from '../tasks/building-form';

const { Given, When } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Neues Gebäude"', async ({ verwalter }) => {
	await visit(verwalter.page, '/buildings/new');
});

When(
	'der Liegenschaftsverwalter folgendes Gebäude erfasst:',
	async ({ verwalter, seed }, table: DataTable) => {
		const fields = table.rowsHash();
		await verwalter.perform(
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
	await verwalter.perform(saveBuilding);
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
