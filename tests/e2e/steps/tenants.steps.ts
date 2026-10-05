import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { activeBadge, allListedTenants, listedTenant } from '../questions/tenants';
import {
	createTenantByEmail,
	openTenant,
	searchTenant,
	startNewTenant,
	submitEmptyTenant
} from '../tasks/tenants';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Mieterliste', async ({ verwalter }) => {
	await visit(verwalter.page, '/tenants');
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neuer Mieter"', async ({ verwalter }) => {
	await visit(verwalter.page, '/tenants/new');
});

Given(
	'der Liegenschaftsverwalter sucht den Mieter {string}',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.perform(searchTenant(names.get(tenant) ?? tenant));
	}
);

When(
	'der Liegenschaftsverwalter den Mieter {string} sucht',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.perform(searchTenant(names.get(tenant) ?? tenant));
	}
);

When('der Liegenschaftsverwalter einen neuen Mieter erfassen will', async ({ verwalter }) => {
	await verwalter.perform(startNewTenant);
});

When(
	'der Liegenschaftsverwalter den Mieter {string} öffnet',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.perform(openTenant(names.get(tenant) ?? tenant));
	}
);

When(
	'der Liegenschaftsverwalter den Mieter {string} mit Korrespondenz per E-Mail erfasst',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.perform(createTenantByEmail(seed.unique(tenant)));
	}
);

When('der Liegenschaftsverwalter den Mieter ohne Namen erfassen will', async ({ verwalter }) => {
	await verwalter.perform(submitEmptyTenant);
});

Then(
	'sieht der Liegenschaftsverwalter den Mieter {string}',
	async ({ verwalter, names }, tenant: string) => {
		await expect(listedTenant(verwalter, names.get(tenant) ?? tenant)).toBeVisible();
	}
);

Then('die Mieterliste enthält genau {int} Mieter', async ({ verwalter }, count: number) => {
	await expect(allListedTenants(verwalter)).toHaveCount(count);
});

Then(
	'wohnt {string} laut Mieterliste in der Wohnung {string}',
	async ({ verwalter, names }, tenant: string, apartment: string) => {
		await expect(listedTenant(verwalter, names.get(tenant) ?? tenant)).toContainText(
			`${apartment} - `
		);
	}
);

Then('ist der Liegenschaftsverwalter auf der Mieterliste', async ({ verwalter }) => {
	await expect(verwalter.page).toHaveTitle('Mieter - Dwello');
});

When(
	'der Liegenschaftsverwalter die {word} Mieter mit dem Namen {string} sucht',
	async ({ verwalter, names }, kind: string, tenant: string) => {
		const status = { aktiven: 'active', ehemaligen: 'inactive' }[kind]!;
		await verwalter.perform(searchTenant(names.get(tenant) ?? tenant, status));
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Mieter {string} als {word} Mieter',
	async ({ verwalter, names }, tenant: string, kind: string) => {
		await expect(listedTenant(verwalter, names.get(tenant)!)).toBeVisible();
		await expect(activeBadge(verwalter, names.get(tenant)!)).toHaveCount(
			kind === 'aktiven' ? 1 : 0
		);
	}
);
