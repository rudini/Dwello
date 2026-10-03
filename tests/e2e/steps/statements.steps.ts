import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { visit } from '../interactions/navigation';
import { allListedStatements, listedStatement, statementOfYear, statementPath } from '../questions/statements';
import {
	downloadStatementPdfFromList,
	openStatement,
	searchStatements,
	showDraftsOfBuilding,
	showStatementsOfBuilding,
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
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnung {int}',
	async ({ seed }, tenant: string, building: string, year: number) => {
		await seed.statement(tenant, building, year);
	}
);

Given('der Liegenschaftsverwalter ist auf der Abrechnungsliste', async ({ verwalter }) => {
	await visit(verwalter.page, '/statements');
});

Then(
	'sieht der Liegenschaftsverwalter die Abrechnung von {string} mit dem Status {string}',
	async ({ verwalter, names }, tenant: string, status: string) => {
		await expect(listedStatement(verwalter, names.get(tenant) ?? tenant)).toContainText(status);
	}
);

Given(
	'für {string} im Gebäude {string} gibt es die Nebenkostenabrechnungen {int} bis {int}',
	async ({ seed }, tenant: string, building: string, from: number, to: number) => {
		for (let year = from; year <= to; year++) await seed.statement(tenant, building, year);
	}
);

When('der Liegenschaftsverwalter die Abrechnungen von {string} sucht', async ({ verwalter, names }, tenant: string) => {
	await verwalter.perform(searchStatements(names.get(tenant) ?? tenant));
});

When('der Liegenschaftsverwalter zur nächsten Seite blättert', async ({ verwalter }) => {
	await verwalter.perform(turnToNextPage);
});

When(
	'der Liegenschaftsverwalter nur die Entwürfe im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(showDraftsOfBuilding(seed.idOf(building)!));
	}
);

When('der Liegenschaftsverwalter neue Abrechnungen erstellen will', async ({ verwalter }) => {
	await verwalter.perform(startGeneratingStatements);
});

When(
	'der Liegenschaftsverwalter die Abrechnung {int} von {string} öffnet',
	async ({ verwalter, names }, year: number, tenant: string) => {
		await verwalter.perform(openStatement(names.get(tenant) ?? tenant, year));
	}
);

Then(
	'sieht der Liegenschaftsverwalter die Abrechnung {int} von {string}',
	async ({ verwalter, names }, year: number, tenant: string) => {
		await expect(statementOfYear(verwalter, names.get(tenant) ?? tenant, year)).toBeVisible();
	}
);

Then('die Abrechnungsliste enthält genau {int} Abrechnung', async ({ verwalter }, count: number) => {
	await expect(allListedStatements(verwalter)).toHaveCount(count);
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung {int} von {string}',
	async ({ verwalter, seed }, year: number, tenant: string) => {
		await expect(verwalter.page).toHaveURL(statementPath(seed, tenant, year));
	}
);

When(
	'der Liegenschaftsverwalter die Abrechnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(showStatementsOfBuilding(seed.idOf(building)!));
	}
);

Given(
	'der Liegenschaftsverwalter zeigt die Abrechnungen im Gebäude {string} an',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.perform(showStatementsOfBuilding(seed.idOf(building)!));
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
		await verwalter.perform(downloadStatementPdfFromList(names.get(tenant) ?? tenant, year));
	}
);
