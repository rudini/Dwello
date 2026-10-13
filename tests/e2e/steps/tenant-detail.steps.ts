import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { contractHistoryNaming } from '../questions/apartment-detail';
import { monthlyRent, rentalStartDate, rentedApartment } from '../questions/tenant-detail';
import { emptyTenantListShown, listedTenantCount } from '../questions/tenants';
import {
	deleteTenant,
	editTenant,
	openContractOfApartment,
	openTenantApartment,
	openTenantDetail,
	startContractForTenant,
	startDeletingTenant
} from '../tasks/tenant-detail';
import { searchTenant } from '../tasks/tenants';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite des Mieters {string}',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(openTenantDetail(seed.idOf(tenant)!));
	}
);

When('der Liegenschaftsverwalter den Mieter löscht', async ({ verwalter }) => {
	await verwalter.attemptsTo(deleteTenant);
});

When('der Liegenschaftsverwalter den Mieter löschen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startDeletingTenant);
});

When('der Liegenschaftsverwalter den Mieter bearbeiten will', async ({ verwalter }) => {
	await verwalter.attemptsTo(editTenant);
});

When('der Liegenschaftsverwalter einen Mietvertrag für den Mieter erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startContractForTenant);
});

When('der Liegenschaftsverwalter die Wohnung des Mieters öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openTenantApartment);
});

When(
	'der Liegenschaftsverwalter den Mietvertrag der Wohnung {string} aus der Historie öffnet',
	async ({ verwalter }, number: string) => {
		await verwalter.attemptsTo(openContractOfApartment(number));
	}
);

Then(
	'mietet der Mieter die Wohnung {string} für {string} im Monat',
	async ({ verwalter }, number: string, rent: string) => {
		await verwalter.sees(rentedApartment).toBe(`Wohnung ${number}`);
		await verwalter.sees(monthlyRent).toBe(rent);
	}
);

Then(
	'zieht der Mieter am {string} in die Wohnung {string} ein',
	async ({ verwalter }, date: string, number: string) => {
		await verwalter.sees(rentedApartment).toBe(`Wohnung ${number}`);
		await verwalter.sees(rentalStartDate).toBe(date);
	}
);

Then(
	'enthält die Vertragshistorie die Wohnungen {string} und {string}',
	async ({ verwalter }, current: string, former: string) => {
		const [now, before] = [`Wohnung ${current}`, `Wohnung ${former}`];
		await verwalter.sees(contractHistoryNaming(now, before)).toEqual([now, before]);
	}
);

Then(
	'findet der Liegenschaftsverwalter den Mieter {string} nicht mehr',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.attemptsTo(searchTenant(names.get(tenant)!));
		await verwalter.sees(emptyTenantListShown).toBe(true);
		await verwalter.sees(listedTenantCount(names.get(tenant)!)).toBe(0);
	}
);
