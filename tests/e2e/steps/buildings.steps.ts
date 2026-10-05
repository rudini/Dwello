import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { allListedBuildings, emptyList, listedBuilding, routeTo } from '../questions/buildings';
import {
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


Then('ist der Liegenschaftsverwalter auf der Gebäudeliste', async ({ verwalter }) => {
	await expect(verwalter.page).toHaveURL(/\/buildings$/);
});

// Google Maps opens in a new tab outside Dwello, so the link itself is checked
Then(
	'führt die Route in Google Maps von der Liste zu {string} an {string}',
	async ({ verwalter, names }, building: string, address: string) => {
		const destination = encodeURIComponent(`${address}, Switzerland`);
		await expect(routeTo(verwalter, names.get(building) ?? building)).toHaveAttribute(
			'href',
			`https://www.google.com/maps/dir/?api=1&destination=${destination}`
		);
	}
);
