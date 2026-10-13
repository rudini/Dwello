import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	listedStatement,
	listedStatementCount,
	pageAddressInApp,
	statementOfYearListed,
	statementPath
} from '../questions/statements';
import {
	downloadStatementPdfFromList,
	openStatement,
	openStatementList,
	searchStatements,
	showDraftsOfBuilding,
	showStatementsOfBuilding,
	showStatementsOfBuildingWhileLoading,
	startGeneratingStatements,
	turnToNextPage
} from '../tasks/statements';

const { Given, When, Then } = createBdd(test);

Given(
	'{string} mietet die Wohnung {string} seit {string} für {string} Franken mit {string} Franken Akonto',
	async ({ seed }, tenant: string, apartment: string, startDate: string, baseRent: string, advance: string) => {
		await seed.contract(tenant, apartment, { startDate, baseRent, monthlyAdvancePayment: advance });
	}
);

Given(
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnung des laufenden Jahres',
	async ({ seed }, tenant: string, building: string) => {
		await seed.statement(tenant, building, Number(new Date().toISOString().slice(0, 4))); // the year of the invoice dated today (UTC)
	}
);

Given(
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnung {int}',
	async ({ seed }, tenant: string, building: string, year: number) => {
		await seed.statement(tenant, building, year);
	}
);

Given('der Liegenschaftsverwalter ist auf der Abrechnungsliste', async ({ verwalter }) => {
	await verwalter.attemptsTo(openStatementList);
});

Then(
	'sieht der Liegenschaftsverwalter die Abrechnung von {string} mit dem Status {string}',
	async ({ verwalter, names }, tenant: string, status: string) => {
		await verwalter.sees(listedStatement(names.get(tenant) ?? tenant)).toContain(status);
	}
);

Given(
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnungen {int} bis {int}',
	async ({ seed }, tenant: string, building: string, from: number, to: number) => {
		for (let year = from; year <= to; year++) await seed.statement(tenant, building, year);
	}
);

When('der Liegenschaftsverwalter die Abrechnungen von {string} sucht', async ({ verwalter, names }, tenant: string) => {
	await verwalter.attemptsTo(searchStatements(names.get(tenant) ?? tenant));
});

When('der Liegenschaftsverwalter zur nächsten Seite blättert', async ({ verwalter }) => {
	await verwalter.attemptsTo(turnToNextPage);
});

When(
	'der Liegenschaftsverwalter nur die Entwürfe im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showDraftsOfBuilding(seed.idOf(building)!));
	}
);

When('der Liegenschaftsverwalter neue Abrechnungen erstellen will', async ({ verwalter }) => {
	await verwalter.attemptsTo(startGeneratingStatements);
});

When(
	'der Liegenschaftsverwalter die Abrechnung {int} von {string} öffnet',
	async ({ verwalter, names }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openStatement(names.get(tenant) ?? tenant, year));
	}
);

Then(
	'sieht der Liegenschaftsverwalter die Abrechnung {int} von {string}',
	async ({ verwalter, names }, year: number, tenant: string) => {
		await verwalter.sees(statementOfYearListed(names.get(tenant) ?? tenant, year)).toBe(true);
	}
);

Then('die Abrechnungsliste enthält genau {int} Abrechnung', async ({ verwalter }, count: number) => {
	await verwalter.sees(listedStatementCount).toBe(count);
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await verwalter.sees(pageAddressInApp).toBe(statementPath(seed, tenant, year));
	}
);

When(
	'der Liegenschaftsverwalter die Abrechnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showStatementsOfBuilding(seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter das Gebäude {string} wählt, bevor die Abrechnungsliste fertig geladen ist, und sucht',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showStatementsOfBuildingWhileLoading(seed.idOf(building)!));
	}
);

Given(
	'der Liegenschaftsverwalter zeigt die Abrechnungen im Gebäude {string} an',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showStatementsOfBuilding(seed.idOf(building)!));
	}
);

Given('die Verwaltung hat die IBAN {string} hinterlegt', async ({ seed }, iban: string) => {
	await seed.iban(iban);
});

Given('für die Abrechnung {int} von {string} gibt es ein PDF', async ({ seed }, year: number, tenant: string) => {
	await seed.statementPdf(tenant, year);
});

When(
	'der Liegenschaftsverwalter das PDF der Abrechnung {int} von {string} herunterlädt',
	async ({ verwalter, names }, year: number, tenant: string) => {
		await verwalter.attemptsTo(downloadStatementPdfFromList(names.get(tenant) ?? tenant, year));
	}
);
