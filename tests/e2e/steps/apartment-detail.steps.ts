import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	apartmentInfo,
	buildingOfApartment,
	contractHistory,
	currentTenant,
	grossMonthlyRent,
	vacancy
} from '../questions/apartment-detail';
import {
	editApartment,
	openContractFromHistory,
	openTenantProfile
} from '../tasks/apartment-detail';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite der Wohnung {string}',
	async ({ verwalter, seed }, number: string) => {
		await visit(verwalter.page, `/apartments/${seed.idOf(number)}`);
	}
);

When('der Liegenschaftsverwalter die Wohnung bearbeiten will', async ({ verwalter }) => {
	await verwalter.perform(editApartment);
});

When('der Liegenschaftsverwalter das Profil des Mieters öffnet', async ({ verwalter }) => {
	await verwalter.perform(openTenantProfile);
});

When(
	'der Liegenschaftsverwalter den Mietvertrag von {string} aus der Historie öffnet',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.perform(openContractFromHistory(names.get(tenant)!));
	}
);

Then('wohnt {string} in der Wohnung', async ({ verwalter, names }, tenant: string) => {
	await expect(currentTenant(verwalter)).toHaveText(names.get(tenant)!);
});

Then('kostet die Wohnung monatlich {string} brutto', async ({ verwalter }, amount: string) => {
	await expect(grossMonthlyRent(verwalter)).toHaveText(amount);
});

Then('hat die Wohnung den Status {string}', async ({ verwalter }, status: string) => {
	await expect(apartmentInfo(verwalter, 'status')).toContainText(status);
});

Then(
	'hat die Wohnung {string} Zimmer und {string} im Stockwerk {string}',
	async ({ verwalter }, rooms: string, area: string, floor: string) => {
		await expect(apartmentInfo(verwalter, 'rooms')).toContainText(rooms);
		await expect(apartmentInfo(verwalter, 'area')).toContainText(area);
		await expect(apartmentInfo(verwalter, 'floor')).toContainText(floor);
	}
);

Then('gehört die Wohnung zum Gebäude {string}', async ({ verwalter, names }, building: string) => {
	await expect(buildingOfApartment(verwalter, names.get(building)!)).toBeVisible();
});

Then('ist die Wohnung nicht vermietet', async ({ verwalter }) => {
	await expect(vacancy(verwalter)).toBeVisible();
});

Then(
	'enthält die Vertragshistorie die Mietverträge von {string} und {string}',
	async ({ verwalter, names }, current: string, former: string) => {
		await expect(contractHistory(verwalter)).toHaveText([
			new RegExp(names.get(current)!),
			new RegExp(names.get(former)!)
		]);
	}
);
