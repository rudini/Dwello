import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { apartmentCount, apartmentEmptyHint, apartmentSearchTerm, occupancyOf } from '../questions/apartments';
import {
	openApartment,
	openApartmentList,
	searchApartments,
	showAllApartments,
	showApartmentsOfBuilding,
	showApartmentsOfBuildingWhileLoading,
	startNewApartment
} from '../tasks/apartments';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Wohnungsliste', async ({ verwalter }) => {
	await verwalter.attemptsTo(openApartmentList);
});

Given(
	'der Liegenschaftsverwalter zeigt die Wohnungen im Gebäude {string} an',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuilding(seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter die Wohnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuilding(seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter nur die leeren Wohnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuilding(seed.idOf(building)!, 'vacant'));
	}
);

When(
	'der Liegenschaftsverwalter das Gebäude {string} wählt, bevor die Wohnungsliste fertig geladen ist, und sucht',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showApartmentsOfBuildingWhileLoading(seed.idOf(building)!));
	}
);

When('der Liegenschaftsverwalter eine neue Wohnung erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startNewApartment);
});

When('der Liegenschaftsverwalter die Wohnung {string} aus der Liste öffnet', async ({ verwalter }, number: string) => {
	await verwalter.attemptsTo(openApartment(number));
});

Then('ist die Wohnung {string} {string}', async ({ verwalter }, number: string, occupancy: string) => {
	await verwalter.sees(occupancyOf(number)).toBe(occupancy);
});

Then('die Wohnungsliste enthält genau {int} Wohnung(en)', async ({ verwalter }, count: number) => {
	await verwalter.sees(apartmentCount).toBe(count);
});

When('der Liegenschaftsverwalter nach Wohnungen mit {string} sucht', async ({ verwalter, names }, term: string) => {
	await verwalter.attemptsTo(searchApartments(names.get(term) ?? term));
});

When('der Liegenschaftsverwalter wieder alle Wohnungen anzeigt', async ({ verwalter }) => {
	await verwalter.attemptsTo(showAllApartments);
});

When(
	'der Liegenschaftsverwalter im Gebäude {string} nach der Wohnung {string} sucht',
	async ({ verwalter, seed }, building: string, number: string) => {
		await verwalter.attemptsTo(searchApartments(number, seed.idOf(building)!));
	}
);

Then('sieht der Liegenschaftsverwalter in der Wohnungsliste den Hinweis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(apartmentEmptyHint).toContain(text);
});

// other scenarios add apartments in parallel: the unfiltered list is only known to be not empty
Then('zeigt die Wohnungsliste wieder Wohnungen', async ({ verwalter }) => {
	await verwalter.sees(apartmentCount).toBeGreaterThan(0);
});

Then('die Wohnungssuche ist leer', async ({ verwalter }) => {
	await verwalter.sees(apartmentSearchTerm).toBe('');
});
