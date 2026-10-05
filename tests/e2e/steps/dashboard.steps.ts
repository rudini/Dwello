import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import {
	occupancyOf,
	rentedApartmentsOf,
	statusFilter,
	statusFilterFor
} from '../questions/dashboard';
import {
	chooseHeaderAction,
	chooseQuickAction,
	openBuildingFromOccupancy,
	openStatementsWithStatus,
	openTile
} from '../tasks/dashboard';

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

When(
	'der Liegenschaftsverwalter die Kennzahl {string} öffnet',
	async ({ verwalter }, label: string) => {
		await verwalter.perform(openTile(label));
	}
);

When(
	'der Liegenschaftsverwalter die Abrechnungen {string} öffnet',
	async ({ verwalter }, label: string) => {
		await verwalter.perform(openStatementsWithStatus(label));
	}
);

When(
	'der Liegenschaftsverwalter die Schnellaktion {string} wählt',
	async ({ verwalter }, label: string) => {
		await verwalter.perform(chooseQuickAction(label));
	}
);

When(
	'der Liegenschaftsverwalter oben die Aktion {string} wählt',
	async ({ verwalter }, label: string) => {
		await verwalter.perform(chooseHeaderAction(label));
	}
);

Then(
	'ist das Gebäude {string} zu {string} belegt',
	async ({ verwalter, names }, building: string, rate: string) => {
		await expect(occupancyOf(verwalter, names.get(building)!)).toHaveText(rate);
	}
);

Then(
	'sind im Gebäude {string} {string} Wohnungen vermietet',
	async ({ verwalter, names }, building: string, count: string) => {
		await expect(rentedApartmentsOf(verwalter, names.get(building)!)).toHaveText(count);
	}
);

Then('die Liste zeigt nur {string}', async ({ verwalter }, label: string) => {
	await expect(verwalter.page).toHaveURL(/status=/);
	expect(statusFilter(verwalter)).toBe(statusFilterFor(label));
});
