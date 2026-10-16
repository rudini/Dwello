import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { buildingCardText, buildingCount, buildingListed, emptyListHint, routeTo } from '../questions/buildings';
import { pageAddress } from '../questions/navigation';
import { filterByCity, openBuilding, openBuildingList, searchBuildings, startNewBuilding } from '../tasks/buildings';

const { Given, When, Then } = createBdd(test);

Given('das Gebäude {string} in {string} existiert', async ({ seed }, title: string, city: string) => {
	await seed.building(title, city);
});

Given('der Liegenschaftsverwalter ist auf der Gebäudeliste', async ({ verwalter }) => {
	await verwalter.attemptsTo(openBuildingList);
});

Then(
	'sieht der Liegenschaftsverwalter das Gebäude {string} in der Liste',
	async ({ verwalter, names }, title: string) => {
		await verwalter.sees(buildingListed(names.get(title) ?? title)).toBe(true);
	}
);

When('der Liegenschaftsverwalter nach {string} sucht', async ({ verwalter, names }, term: string) => {
	await verwalter.attemptsTo(searchBuildings(names.get(term) ?? term));
});

Then('die Liste enthält genau {int} Gebäude', async ({ verwalter }, count: number) => {
	await verwalter.sees(buildingCount).toBe(count);
});

Then('sieht der Liegenschaftsverwalter den Hinweis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(emptyListHint).toContain(text);
});

When(
	'der Liegenschaftsverwalter die Gebäude nach dem Ort {string} filtert',
	async ({ verwalter }, city: string) => {
		await verwalter.attemptsTo(filterByCity(city));
	}
);

When('der Liegenschaftsverwalter ein neues Gebäude erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startNewBuilding);
});

When('der Liegenschaftsverwalter das Gebäude {string} öffnet', async ({ verwalter, names }, title: string) => {
	await verwalter.attemptsTo(openBuilding(names.get(title) ?? title));
});

Then('ist der Liegenschaftsverwalter auf der Gebäudeliste', async ({ verwalter }) => {
	await verwalter.sees(pageAddress).toMatch(/\/buildings$/);
});

// Google Maps opens in a new tab outside Dwello, so the link itself is checked
Then(
	'führt die Route in Google Maps von der Liste zu {string} an {string}',
	async ({ verwalter, names }, building: string, address: string) => {
		const destination = encodeURIComponent(`${address}, Switzerland`);
		await verwalter
			.sees(routeTo(names.get(building) ?? building))
			.toBe(`https://www.google.com/maps/dir/?api=1&destination=${destination}`);
	}
);

Then('nennt die Karte des Gebäudes {string} {string}', async ({ verwalter, names }, building: string, text: string) => {
	await verwalter.sees(buildingCardText(names.get(building)!)).toContain(text);
});
