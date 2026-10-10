import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { buildingAddress, listedApartment, yearBuilt } from '../questions/building-detail';
import { emptyList, listedBuilding } from '../questions/buildings';
import {
	deleteBuilding,
	openApartment,
	startDeletingBuilding,
	startEditing,
	startFirstApartment,
	startNewApartment
} from '../tasks/building-detail';
import { searchBuildings } from '../tasks/buildings';

const { Given, When, Then } = createBdd(test);

Given(
	'im Gebäude {string} gibt es die leere Wohnung {string} mit {int} m²',
	async ({ seed }, buildingTitle: string, number: string, area: number) => {
		await seed.apartment(buildingTitle, number, 'vacant', String(area));
	}
);

Given(
	'im Gebäude {string} gibt es die leere Wohnung {string}',
	async ({ seed }, buildingTitle: string, number: string) => {
		await seed.apartment(buildingTitle, number, 'vacant');
	}
);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite von {string}',
	async ({ verwalter, seed }, title: string) => {
		await visit(verwalter.page, `/buildings/${seed.idOf(title)}`);
	}
);

When('der Liegenschaftsverwalter das Gebäude löscht', async ({ verwalter }) => {
	await verwalter.perform(deleteBuilding);
});

When('der Liegenschaftsverwalter das Gebäude löschen will', async ({ verwalter }) => {
	await verwalter.perform(startDeletingBuilding);
});

When('der Liegenschaftsverwalter das Gebäude bearbeiten will', async ({ verwalter }) => {
	await verwalter.perform(startEditing);
});

When('der Liegenschaftsverwalter eine Wohnung hinzufügen will', async ({ verwalter }) => {
	await verwalter.perform(startNewApartment);
});

When('der Liegenschaftsverwalter die erste Wohnung erstellen will', async ({ verwalter }) => {
	await verwalter.perform(startFirstApartment);
});

When('der Liegenschaftsverwalter die Wohnung {string} öffnet', async ({ verwalter }, number: string) => {
	await verwalter.perform(openApartment(number));
});

Then(
	'sieht der Liegenschaftsverwalter die Wohnung {string} mit dem Status {string}',
	async ({ verwalter }, number: string, status: string) => {
		await expect(listedApartment(verwalter, number)).toContainText(status);
	}
);

Then('das Gebäude {string} ist nicht mehr in der Liste', async ({ verwalter, names }, title: string) => {
	const name = names.get(title) ?? title;
	await verwalter.perform(searchBuildings(name));
	await expect(emptyList(verwalter)).toBeVisible();
	await expect(listedBuilding(verwalter, name)).toHaveCount(0);
});

Then('sieht der Liegenschaftsverwalter das Baujahr {string}', async ({ verwalter }, year: string) => {
	await expect(yearBuilt(verwalter)).toHaveText(year);
});


Then('sieht der Liegenschaftsverwalter die Adresse {string}', async ({ verwalter }, address: string) => {
	await expect(buildingAddress(verwalter)).toContainText(address);
});
