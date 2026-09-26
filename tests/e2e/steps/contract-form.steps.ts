import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { apartmentChoice } from '../questions/contract-form';
import { listedContract } from '../questions/contracts';
import { registerContract, saveContract } from '../tasks/contract-form';
import { searchContracts } from '../tasks/contracts';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Seite "Neuer Mietvertrag"', async ({ verwalter }) => {
	await visit(verwalter.page, '/contracts/new');
});

When(
	'der Liegenschaftsverwalter {string} die Wohnung {string} ab {string} für {string} Franken vermietet',
	async ({ verwalter, seed }, tenant: string, apartment: string, startDate: string, baseRent: string) => {
		await verwalter.perform(
			registerContract({ tenantId: seed.idOf(tenant)!, apartmentId: seed.idOf(apartment)!, startDate, baseRent })
		);
	}
);

When('der Liegenschaftsverwalter den Mietvertrag ohne Angaben speichert', async ({ verwalter }) => {
	await verwalter.perform(saveContract);
});

Then('der Mietvertrag von {string} ist in der Liste auffindbar', async ({ verwalter, names }, tenant: string) => {
	const name = names.get(tenant) ?? tenant;
	await verwalter.perform(searchContracts(name));
	await expect(listedContract(verwalter, name)).toBeVisible();
});

Then(
	'kann der Liegenschaftsverwalter die Wohnung {string} nicht auswählen',
	async ({ verwalter, seed }, apartment: string) => {
		await expect(apartmentChoice(verwalter, seed.idOf(apartment)!)).toBeDisabled();
	}
);
