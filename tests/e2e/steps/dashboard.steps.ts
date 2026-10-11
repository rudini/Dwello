import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { currentNavItem, overviewDeadline, overviewTask } from '../interactions/dashboard';
import { occupancyOf, rentedApartmentsOf, statusFilter, statusFilterFor } from '../questions/dashboard';
import {
	chooseQuickAction,
	openBuildingFromOccupancy,
	openStatementsWithStatus,
	openTile
} from '../tasks/dashboard';
import type { TestData } from '../fixtures/backend';
import { inDays } from '../fixtures/dates';

const { Given, When, Then } = createBdd(test);

const lastYear = new Date().getFullYear() - 1;

// Sent earlier, with its deadline some days from today (the overview counts days from today); sending sets the
// deadline, so it is set afterwards
// A statement with an amount to pay: a Saldo of 0 is settled once sent and has no open deadline
async function sentWithDeadline(seed: TestData, tenant: string, days: number) {
	await seed.heatingInvoice('Seeblick', '1000', lastYear);
	await seed.statement(tenant, 'Seeblick', lastYear);
	await seed.sendStatement(tenant, lastYear);
	await seed.paymentDeadline(tenant, lastYear, inDays(days));
}

Given(
	'{string} hat eine versendete Abrechnung, deren Zahlungsfrist seit {int} Tagen abgelaufen ist',
	({ seed }, tenant: string, days: number) => sentWithDeadline(seed, tenant, -days)
);

Given(
	'{string} hat eine versendete Abrechnung, deren Zahlungsfrist in {int} Tagen abläuft',
	({ seed }, tenant: string, days: number) => sentWithDeadline(seed, tenant, days)
);

Given('{string} hat eine Abrechnung im Entwurf', async ({ seed }, tenant: string) => {
	await seed.statement(tenant, 'Seeblick', lastYear);
});

Given('der Mietvertrag von {string} endet in {int} Tagen', async ({ seed }, tenant: string, days: number) => {
	await seed.contractEnd(tenant, inDays(days));
});

When('der Liegenschaftsverwalter die Aufgabe {string} beginnt', async ({ verwalter }, title: string) => {
	await overviewTask(verwalter.page, title).getByRole('link').click();
});

Then('nennt die Übersicht die Aufgabe {string}', async ({ verwalter }, title: string) => {
	await expect(overviewTask(verwalter.page, title)).toBeVisible();
});

Then(
	/^(?:die Frist|ist die Frist) "([^"]+) ([^"]+ [^"]+)" (?:ist )?"([^"]+)"$/,
	async ({ verwalter, names }, kind: string, tenant: string, when: string) => {
		await expect(overviewDeadline(verwalter.page, kind, names.get(tenant)!)).toContainText(when);
	}
);

Then('ist in der Hauptnavigation nur {string} markiert', async ({ verwalter }, label: string) => {
	await expect(currentNavItem(verwalter.page)).toHaveCount(1);
	await expect(currentNavItem(verwalter.page)).toHaveText(label);
});

Given('der Liegenschaftsverwalter öffnet die Übersicht', async ({ verwalter }) => {
	await visit(verwalter.page, '/dashboard');
});

When('der Liegenschaftsverwalter die Übersicht öffnet', async ({ verwalter }) => {
	await visit(verwalter.page, '/dashboard');
});

When(
	'der Liegenschaftsverwalter in der Belegung das Gebäude {string} öffnet',
	async ({ verwalter, names }, building: string) => {
		await verwalter.perform(openBuildingFromOccupancy(names.get(building)!));
	}
);

When('der Liegenschaftsverwalter die Kennzahl {string} öffnet', async ({ verwalter }, label: string) => {
	await verwalter.perform(openTile(label));
});

When('der Liegenschaftsverwalter die Abrechnungen {string} öffnet', async ({ verwalter }, label: string) => {
	await verwalter.perform(openStatementsWithStatus(label));
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

Then('die Liste zeigt nur {string}', async ({ verwalter }, label: string) => {
	await expect(verwalter.page).toHaveURL(/status=/);
	expect(statusFilter(verwalter)).toBe(statusFilterFor(label));
});
