import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { contractHistory } from '../questions/apartment-detail';
import { monthlyRent, rentalStartDate, rentedApartment } from '../questions/tenant-detail';
import { listedTenant } from '../questions/tenants';
import {
	deleteTenant,
	editTenant,
	openContractOfApartment,
	openTenantApartment,
	startContractForTenant,
	startDeletingTenant
} from '../tasks/tenant-detail';
import { searchTenant } from '../tasks/tenants';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite des Mieters {string}',
	async ({ verwalter, seed }, tenant: string) => {
		await visit(verwalter.page, `/tenants/${seed.idOf(tenant)}`);
	}
);

When('der Liegenschaftsverwalter den Mieter löscht', async ({ verwalter }) => {
	await verwalter.perform(deleteTenant);
});

When('der Liegenschaftsverwalter den Mieter löschen will', async ({ verwalter }) => {
	await verwalter.perform(startDeletingTenant);
});

When('der Liegenschaftsverwalter den Mieter bearbeiten will', async ({ verwalter }) => {
	await verwalter.perform(editTenant);
});

When('der Liegenschaftsverwalter einen Mietvertrag für den Mieter erfassen will', async ({ verwalter }) => {
	await verwalter.perform(startContractForTenant);
});

When('der Liegenschaftsverwalter die Wohnung des Mieters öffnet', async ({ verwalter }) => {
	await verwalter.perform(openTenantApartment);
});

When(
	'der Liegenschaftsverwalter den Mietvertrag der Wohnung {string} aus der Historie öffnet',
	async ({ verwalter }, number: string) => {
		await verwalter.perform(openContractOfApartment(number));
	}
);

Then(
	'mietet der Mieter die Wohnung {string} für {string} im Monat',
	async ({ verwalter }, number: string, rent: string) => {
		await expect(rentedApartment(verwalter)).toHaveText(`Wohnung ${number}`);
		await expect(monthlyRent(verwalter)).toHaveText(rent);
	}
);

Then(
	'zieht der Mieter am {string} in die Wohnung {string} ein',
	async ({ verwalter }, date: string, number: string) => {
		await expect(rentedApartment(verwalter)).toHaveText(`Wohnung ${number}`);
		await expect(rentalStartDate(verwalter)).toHaveText(date);
	}
);

Then(
	'enthält die Vertragshistorie die Wohnungen {string} und {string}',
	async ({ verwalter }, current: string, former: string) => {
		await expect(contractHistory(verwalter)).toHaveText([
			new RegExp(`Wohnung ${current}`),
			new RegExp(`Wohnung ${former}`)
		]);
	}
);

Then(
	'findet der Liegenschaftsverwalter den Mieter {string} nicht mehr',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.perform(searchTenant(names.get(tenant)!));
		await expect(listedTenant(verwalter, names.get(tenant)!)).toHaveCount(0);
	}
);
