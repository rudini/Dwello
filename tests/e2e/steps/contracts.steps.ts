import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { allListedContracts, listedAmount, listedContract } from '../questions/contracts';
import {
	editContract,
	filterContracts,
	searchContracts,
	startNewContract,
	viewContract
} from '../tasks/contracts';

const { Given, When, Then } = createBdd(test);

Given('der Mieter {string} existiert', async ({ seed }, title: string) => {
	await seed.tenant(title);
});

Given(
	'{string} mietet die Wohnung {string} seit {string} für {string} Franken',
	async ({ seed }, tenant: string, apartment: string, startDate: string, baseRent: string) => {
		await seed.contract(tenant, apartment, { startDate, baseRent });
	}
);

Given(
	'{string} mietete die Wohnung {string} von {string} bis {string} für {string} Franken',
	async ({ seed }, tenant: string, apartment: string, startDate: string, endDate: string, baseRent: string) => {
		await seed.contract(tenant, apartment, { startDate, endDate, baseRent });
	}
);

// the row's period ends with how the contract ends: «…, befristet» or «…, gekündigt»
Then(
	'nennt die Mietvertragsliste den Mietvertrag von {string} {string}',
	async ({ verwalter, names }, tenant: string, kind: string) => {
		const name = names.get(tenant) ?? tenant;
		await visit(verwalter.page, '/contracts');
		await verwalter.perform(searchContracts(name));
		await expect(listedContract(verwalter, name)).toContainText(`, ${kind}`);
	}
);

Given('der Liegenschaftsverwalter ist auf der Mietvertragsliste', async ({ verwalter }) => {
	await visit(verwalter.page, '/contracts');
});

Then(
	'sieht der Liegenschaftsverwalter den Mietvertrag von {string} mit dem Status {string}',
	async ({ verwalter, names }, tenant: string, status: string) => {
		await expect(listedContract(verwalter, names.get(tenant) ?? tenant)).toContainText(status);
	}
);

// from any page: a running contract reads «seit TT.MM.JJJJ, unbefristet» in the list
Then(
	'beginnt der Mietvertrag von {string} laut Liste seit {string}',
	async ({ verwalter, names }, tenant: string, date: string) => {
		const name = names.get(tenant) ?? tenant;
		await visit(verwalter.page, '/contracts');
		await verwalter.perform(searchContracts(name));
		await expect(listedContract(verwalter, name)).toContainText(`seit ${date}`);
	}
);

Then(
	'beginnt der Mietvertrag von {string} laut Liste am {string}',
	async ({ verwalter, names }, tenant: string, date: string) => {
		await expect(listedContract(verwalter, names.get(tenant) ?? tenant)).toContainText(`ab ${date}`);
	}
);

Then(
	'nennt die Mietvertragsliste für {string} die Nettomiete {string} und monatlich total {string}',
	async ({ verwalter, names }, tenant: string, baseRent: string, total: string) => {
		const name = names.get(tenant) ?? tenant;
		await expect(listedAmount(verwalter, name, 'Nettomiete')).toHaveText(baseRent);
		await expect(listedAmount(verwalter, name, 'Monatlich total')).toHaveText(total);
	}
);

When('der Liegenschaftsverwalter nach dem Mieter {string} sucht', async ({ verwalter, names }, tenant: string) => {
	await verwalter.perform(searchContracts(names.get(tenant) ?? tenant));
});

Then('die Mietvertragsliste enthält genau {int} Mietvertrag', async ({ verwalter }, count: number) => {
	await expect(allListedContracts(verwalter)).toHaveCount(count);
});

When(
	'der Liegenschaftsverwalter die Mietverträge nach dem Gebäude {string} filtert',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(filterContracts({ buildingId: seed.idOf(building) }));
	}
);

When(
	'der Liegenschaftsverwalter die beendeten Mietverträge im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(filterContracts({ buildingId: seed.idOf(building), status: 'ended' }));
	}
);

When('der Liegenschaftsverwalter einen neuen Mietvertrag erfassen will', async ({ verwalter }) => {
	await verwalter.perform(startNewContract);
});

When('der Liegenschaftsverwalter den Mietvertrag von {string} ansieht', async ({ verwalter, names }, tenant: string) => {
	await verwalter.perform(viewContract(names.get(tenant) ?? tenant));
});

When(
	'der Liegenschaftsverwalter den Mietvertrag von {string} bearbeiten will',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.perform(editContract(names.get(tenant) ?? tenant));
	}
);

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von {string}',
	async ({ verwalter, names }, tenant: string) => {
		await expect(verwalter.page).toHaveTitle(`Mietvertrag - ${names.get(tenant) ?? tenant} - Dwello`);
	}
);

Then('ist der Liegenschaftsverwalter auf der Mietvertragsliste', async ({ verwalter }) => {
	await expect(verwalter.page).toHaveURL(/\/contracts$/);
});
