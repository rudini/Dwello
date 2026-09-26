import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { allListedBuildings, emptyList, listedBuilding } from '../questions/buildings';
import {
	chooseBreadcrumb,
	filterByCity,
	openBuilding,
	searchBuildings,
	startNewBuilding
} from '../tasks/buildings';

const { Given, When, Then } = createBdd(test);

Given('das Gebäude {string} in {string} existiert', async ({ seed }, title: string, city: string) => {
	await seed.building(title, city);
});

Given('der Liegenschaftsverwalter ist auf der Gebäudeliste', async ({ verwalter }) => {
	await visit(verwalter.page, '/buildings');
});

Then(
	'sieht der Liegenschaftsverwalter das Gebäude {string} in der Liste',
	async ({ verwalter, names }, title: string) => {
		await expect(listedBuilding(verwalter, names.get(title) ?? title)).toBeVisible();
	}
);

When('der Liegenschaftsverwalter nach {string} sucht', async ({ verwalter, names }, term: string) => {
	await verwalter.perform(searchBuildings(names.get(term) ?? term));
});

Then('die Liste enthält genau {int} Gebäude', async ({ verwalter }, count: number) => {
	await expect(allListedBuildings(verwalter)).toHaveCount(count);
});

Then('sieht der Liegenschaftsverwalter den Hinweis {string}', async ({ verwalter }, text: string) => {
	await expect(emptyList(verwalter)).toContainText(text);
});

When(
	'der Liegenschaftsverwalter die Gebäude nach der Stadt {string} filtert',
	async ({ verwalter }, city: string) => {
		await verwalter.perform(filterByCity(city));
	}
);

When('der Liegenschaftsverwalter ein neues Gebäude erfassen will', async ({ verwalter }) => {
	await verwalter.perform(startNewBuilding);
});

When('der Liegenschaftsverwalter das Gebäude {string} öffnet', async ({ verwalter, names }, title: string) => {
	await verwalter.perform(openBuilding(names.get(title) ?? title));
});

Then('ist der Liegenschaftsverwalter auf der Seite {string}', async ({ verwalter }, title: string) => {
	await expect(verwalter.page).toHaveTitle(`${title} - Dwello`);
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite von {string}',
	async ({ verwalter, names }, title: string) => {
		await expect(verwalter.page).toHaveTitle(`${names.get(title) ?? title} - Dwello`);
	}
);

When('der Liegenschaftsverwalter im Breadcrumb {string} wählt', async ({ verwalter, names }, label: string) => {
	await verwalter.perform(chooseBreadcrumb(names.get(label) ?? label));
});

Then('ist der Liegenschaftsverwalter auf der Gebäudeliste', async ({ verwalter }) => {
	await expect(verwalter.page).toHaveURL(/\/buildings$/);
});
