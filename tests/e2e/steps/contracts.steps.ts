import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { listedAmount, listedContract, listedContractCount, missingStatementOfContract } from '../questions/contracts';
import { pageAddress, pageTitle } from '../questions/navigation';
import {
	editContract,
	filterContracts,
	openContractList,
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
		await verwalter.attemptsTo(openContractList);
		await verwalter.attemptsTo(searchContracts(name));
		await verwalter.sees(listedContract(name)).toContain(`, ${kind}`);
	}
);

Given('der Liegenschaftsverwalter ist auf der Mietvertragsliste', async ({ verwalter }) => {
	await verwalter.attemptsTo(openContractList);
});

Then(
	'sieht der Liegenschaftsverwalter den Mietvertrag von {string} mit dem Status {string}',
	async ({ verwalter, names }, tenant: string, status: string) => {
		await verwalter.sees(listedContract(names.get(tenant) ?? tenant)).toContain(status);
	}
);

// from any page: a running contract reads «seit TT.MM.JJJJ, unbefristet» in the list
Then(
	'beginnt der Mietvertrag von {string} laut Liste seit {string}',
	async ({ verwalter, names }, tenant: string, date: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.attemptsTo(openContractList);
		await verwalter.attemptsTo(searchContracts(name));
		await verwalter.sees(listedContract(name)).toContain(`seit ${date}`);
	}
);

Then(
	'beginnt der Mietvertrag von {string} laut Liste am {string}',
	async ({ verwalter, names }, tenant: string, date: string) => {
		await verwalter.sees(listedContract(names.get(tenant) ?? tenant)).toContain(`ab ${date}`);
	}
);

Then(
	'nennt die Mietvertragsliste für {string} die Nettomiete {string} und monatlich total {string}',
	async ({ verwalter, names }, tenant: string, baseRent: string, total: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.sees(listedAmount(name, 'Nettomiete')).toBe(baseRent);
		await verwalter.sees(listedAmount(name, 'Monatlich total')).toBe(total);
	}
);

When('der Liegenschaftsverwalter nach dem Mieter {string} sucht', async ({ verwalter, names }, tenant: string) => {
	await verwalter.attemptsTo(searchContracts(names.get(tenant) ?? tenant));
});

Then('die Mietvertragsliste enthält genau {int} Mietvertrag', async ({ verwalter }, count: number) => {
	await verwalter.sees(listedContractCount).toBe(count);
});

When(
	'der Liegenschaftsverwalter die Mietverträge nach dem Gebäude {string} filtert',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(filterContracts({ buildingId: seed.idOf(building) }));
	}
);

When(
	'der Liegenschaftsverwalter die beendeten Mietverträge im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(filterContracts({ buildingId: seed.idOf(building), status: 'ended' }));
	}
);

When('der Liegenschaftsverwalter einen neuen Mietvertrag erfassen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startNewContract);
});

When('der Liegenschaftsverwalter den Mietvertrag von {string} ansieht', async ({ verwalter, names }, tenant: string) => {
	await verwalter.attemptsTo(viewContract(names.get(tenant) ?? tenant));
});

When(
	'der Liegenschaftsverwalter den Mietvertrag von {string} bearbeiten will',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.attemptsTo(editContract(names.get(tenant) ?? tenant));
	}
);

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite des Mietvertrags von {string}',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(pageTitle).toBe(`Mietvertrag - ${names.get(tenant) ?? tenant} - Dwello`);
	}
);

Then('ist der Liegenschaftsverwalter auf der Mietvertragsliste', async ({ verwalter }) => {
	await verwalter.sees(pageAddress).toMatch(/\/contracts$/);
});

Then(
	'zeigt die Mietvertragsliste beim Mietvertrag von {string} {string}',
	async ({ verwalter, names }, tenant: string, note: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.attemptsTo(openContractList, searchContracts(name));
		await verwalter.sees(missingStatementOfContract(name)).toBe(note);
	}
);

Then(
	'zeigt die Mietvertragsliste beim Mietvertrag von {string} keine fehlende Abrechnung',
	async ({ verwalter, names }, tenant: string) => {
		const name = names.get(tenant) ?? tenant;
		await verwalter.attemptsTo(openContractList, searchContracts(name));
		await verwalter.sees(listedContract(name)).toContain(name);
		await verwalter.sees(missingStatementOfContract(name)).toBeNull();
	}
);
