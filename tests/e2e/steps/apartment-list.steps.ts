import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { allListedApartments, occupancyOf } from '../questions/apartments';
import { openApartment, showApartmentsOfBuilding, startNewApartment } from '../tasks/apartments';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Wohnungsliste', async ({ verwalter }) => {
	await visit(verwalter.page, '/apartments');
});

Given(
	'der Liegenschaftsverwalter zeigt die Wohnungen im Gebäude {string} an',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(showApartmentsOfBuilding(seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter die Wohnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(showApartmentsOfBuilding(seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter nur die leeren Wohnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(showApartmentsOfBuilding(seed.idOf(building)!, 'vacant'));
	}
);

When('der Liegenschaftsverwalter eine neue Wohnung erfassen will', async ({ verwalter }) => {
	await verwalter.perform(startNewApartment);
});

When('der Liegenschaftsverwalter die Wohnung {string} aus der Liste öffnet', async ({ verwalter }, number: string) => {
	await verwalter.perform(openApartment(number));
});

Then('ist die Wohnung {string} {string}', async ({ verwalter }, number: string, occupancy: string) => {
	await expect(occupancyOf(verwalter, number)).toHaveText(occupancy);
});

Then('die Wohnungsliste enthält genau {int} Wohnung(en)', async ({ verwalter }, count: number) => {
	await expect(allListedApartments(verwalter)).toHaveCount(count);
});
