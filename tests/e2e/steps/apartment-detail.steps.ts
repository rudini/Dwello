import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	apartmentInfo,
	buildingOfApartmentShown,
	contractHistoryNaming,
	currentContractsListed,
	currentTenant,
	earlierContractShown,
	earlierContractsListed,
	monthlyTotalOfApartment,
	nextTenant,
	vacancyShown
} from '../questions/apartment-detail';
import {
	editApartment,
	openApartmentDetail,
	openContractFromHistory,
	openTenantProfile
} from '../tasks/apartment-detail';

const { Given, When, Then } = createBdd(test);

Given(
	'der Liegenschaftsverwalter ist auf der Detailseite der Wohnung {string}',
	async ({ verwalter, seed }, number: string) => {
		await verwalter.attemptsTo(openApartmentDetail(seed.idOf(number)!));
	}
);

When('der Liegenschaftsverwalter die Wohnung bearbeiten will', async ({ verwalter }) => {
	await verwalter.attemptsTo(editApartment);
});

When('der Liegenschaftsverwalter das Profil des Mieters öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openTenantProfile);
});

When(
	'der Liegenschaftsverwalter den Mietvertrag von {string} aus der Historie öffnet',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.attemptsTo(openContractFromHistory(names.get(tenant)!));
	}
);

Then('wohnt {string} in der Wohnung', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(currentTenant).toBe(names.get(tenant)!);
});

Then('beträgt das Monatlich total der Wohnung {string}', async ({ verwalter }, amount: string) => {
	await verwalter.sees(monthlyTotalOfApartment).toBe(amount);
});

Then('hat die Wohnung den Status {string}', async ({ verwalter }, status: string) => {
	await verwalter.sees(apartmentInfo('status')).toContain(status);
});

Then(
	'hat die Wohnung {string} Zimmer und {string} im Stockwerk {string}',
	async ({ verwalter }, rooms: string, area: string, floor: string) => {
		await verwalter.sees(apartmentInfo('rooms')).toContain(rooms);
		await verwalter.sees(apartmentInfo('area')).toContain(area);
		await verwalter.sees(apartmentInfo('floor')).toContain(floor);
	}
);

Then('gehört die Wohnung zum Gebäude {string}', async ({ verwalter, names }, building: string) => {
	await verwalter.sees(buildingOfApartmentShown(names.get(building)!)).toBe(true);
});

Then('ist die Wohnung nicht vermietet', async ({ verwalter }) => {
	await verwalter.sees(vacancyShown).toBe(true);
});

Then(
	'zieht {string} am {string} in die Wohnung ein',
	async ({ verwalter, names }, tenant: string, date: string) => {
		await verwalter.sees(nextTenant).toContain(`Ab ${date} vermietet an ${names.get(tenant)}`);
	}
);

Then(
	'enthält die Vertragshistorie die Mietverträge von {string} und {string}',
	async ({ verwalter, names }, current: string, former: string) => {
		const expected = [names.get(current)!, names.get(former)!];
		await verwalter.sees(contractHistoryNaming(...expected)).toEqual(expected);
	}
);

Then('erklärt die Wohnungsseite beim Mietstatus {string}', async ({ verwalter }, help: string) => {
	await verwalter.sees(apartmentInfo('status')).toContain(help);
});

Then(
	'steht der Mietvertrag von {string} über den früheren Mietverträgen',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(currentContractsListed).toContain(names.get(tenant)!);
	}
);

Then(
	'steht der Mietvertrag von {string} unter {string}',
	async ({ verwalter, names }, tenant: string, heading: string) => {
		await verwalter.sees(earlierContractsListed).toContain(heading);
		await verwalter.sees(earlierContractShown(names.get(tenant)!)).toContain(names.get(tenant)!);
	}
);

Then('erklärt der Mietvertrag von {string} {string}', async ({ verwalter, names }, tenant: string, help: string) => {
	await verwalter.sees(earlierContractShown(names.get(tenant)!)).toContain(help);
});
