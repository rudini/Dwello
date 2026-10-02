import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { occupancyOf, rentedApartmentsOf, statusFilter } from '../questions/dashboard';
import { chooseQuickAction, openBuildingFromOccupancy, openOverdueStatements, openTile } from '../tasks/dashboard';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter öffnet das Dashboard', async ({ verwalter }) => {
	await visit(verwalter.page, '/dashboard');
});

When('der Liegenschaftsverwalter das Dashboard öffnet', async ({ verwalter }) => {
	await visit(verwalter.page, '/dashboard');
});

When(
	'der Liegenschaftsverwalter in der Belegung das Gebäude {string} öffnet',
	async ({ verwalter, names }, building: string) => {
		await verwalter.perform(openBuildingFromOccupancy(names.get(building)!));
	}
);

When('der Liegenschaftsverwalter die Kennzahl "Leer" öffnet', async ({ verwalter }) => {
	await verwalter.perform(openTile('Leer'));
});

When('der Liegenschaftsverwalter die überfälligen Abrechnungen öffnet', async ({ verwalter }) => {
	await verwalter.perform(openOverdueStatements);
});

When('der Liegenschaftsverwalter die Schnellaktion {string} wählt', async ({ verwalter }, label: string) => {
	await verwalter.perform(chooseQuickAction(label));
});

Then('ist das Gebäude {string} zu {string} belegt', async ({ verwalter, names }, building: string, rate: string) => {
	await expect(occupancyOf(verwalter, names.get(building)!)).toHaveText(rate);
});

Then(
	'sind im Gebäude {string} {string} Wohnungen vermietet',
	async ({ verwalter, names }, building: string, count: string) => {
		await expect(rentedApartmentsOf(verwalter, names.get(building)!)).toHaveText(count);
	}
);

Then('sieht der Liegenschaftsverwalter die leeren Wohnungen', async ({ verwalter }) => {
	await expect(verwalter.page).toHaveTitle('Wohnungen - Dwello');
	expect(statusFilter(verwalter)).toBe('vacant');
});

Then('sieht der Liegenschaftsverwalter die überfälligen Abrechnungen', async ({ verwalter }) => {
	await expect(verwalter.page).toHaveTitle('Nebenkostenabrechnungen - Dwello');
	expect(statusFilter(verwalter)).toBe('overdue');
});
