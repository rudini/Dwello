import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { confirmation } from '../questions/contract-form';
import { pageTitle } from '../questions/navigation';
import { listedTenant, tenantCount, tenantListed, tenantStatus } from '../questions/tenants';
import {
	createTenantByEmail,
	openNewTenant,
	openTenant,
	openTenantList,
	searchTenant,
	startNewTenant,
	submitEmptyTenant
} from '../tasks/tenants';

const { Given, When, Then } = createBdd(test);

Given('der Liegenschaftsverwalter ist auf der Mieterliste', async ({ verwalter }) => {
	await verwalter.attemptsTo(openTenantList);
});

Given('der Liegenschaftsverwalter ist auf der Seite "Neuer Mieter"', async ({ verwalter }) => {
	await verwalter.attemptsTo(openNewTenant);
});

Given('der Liegenschaftsverwalter sucht den Mieter {string}', async ({ verwalter, names }, tenant: string) => {
	await verwalter.attemptsTo(searchTenant(names.get(tenant) ?? tenant));
});

When('der Liegenschaftsverwalter den Mieter {string} sucht', async ({ verwalter, names }, tenant: string) => {
	await verwalter.attemptsTo(searchTenant(names.get(tenant) ?? tenant));
});

When('der Liegenschaftsverwalter einen neuen Mieter erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startNewTenant);
});

When('der Liegenschaftsverwalter den Mieter {string} öffnet', async ({ verwalter, names }, tenant: string) => {
	await verwalter.attemptsTo(openTenant(names.get(tenant) ?? tenant));
});

When(
	'der Liegenschaftsverwalter den Mieter {string} mit Korrespondenz per E-Mail erfasst',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.attemptsTo(createTenantByEmail(seed.unique(tenant)));
	}
);

When('der Liegenschaftsverwalter den Mieter ohne Namen erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(submitEmptyTenant);
});

Then('sieht der Liegenschaftsverwalter den Mieter {string}', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(tenantListed(names.get(tenant) ?? tenant)).toBe(true);
});

Then('die Mieterliste enthält genau {int} Mieter', async ({ verwalter }, count: number) => {
	await verwalter.sees(tenantCount).toBe(count);
});

Then(
	'wohnt {string} laut Mieterliste in der Wohnung {string}',
	async ({ verwalter, names }, tenant: string, apartment: string) => {
		await verwalter.sees(listedTenant(names.get(tenant) ?? tenant)).toContain(`${apartment} - `);
	}
);

Then('ist der Liegenschaftsverwalter auf der Mieterliste', async ({ verwalter }) => {
	await verwalter.sees(pageTitle).toBe('Mieter - Dwello');
});

When(
	'der Liegenschaftsverwalter die {word} Mieter mit dem Namen {string} sucht',
	async ({ verwalter, names }, kind: string, tenant: string) => {
		const status = { aktiven: 'active', künftigen: 'future', ehemaligen: 'inactive' }[kind]!;
		await verwalter.attemptsTo(searchTenant(names.get(tenant) ?? tenant, status));
	}
);

Then(
	'sieht der Liegenschaftsverwalter den Mieter {string} als {word} Mieter',
	async ({ verwalter, names }, tenant: string, kind: string) => {
		await verwalter.sees(tenantListed(names.get(tenant)!)).toBe(true);
		const status = { aktiven: 'Aktiv', künftigen: 'Künftig', ehemaligen: null }[kind];
		await verwalter.sees(tenantStatus(names.get(tenant)!)).toBe(status);
	}
);

Then(
	'sieht der Liegenschaftsverwalter die Bestätigung, dass {string} gespeichert ist',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(confirmation).toContain(`${names.get(tenant) ?? tenant} gespeichert`);
	}
);
