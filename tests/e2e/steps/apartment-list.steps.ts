import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { apartmentCount, occupancyOf } from '../questions/apartments';
import {
	openApartment,
	openApartmentList,
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
