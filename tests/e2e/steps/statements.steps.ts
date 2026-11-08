import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	buildingChoiceShown,
	listedStatement,
	countedStatements,
	listedStatementCount,
	listScope,
	listStatusShown,
	listBuildingShown,
	pageAddressInApp,
	resetFiltersShown,
	statementOfYearListed,
	statementPath,
	statusFilterText,
	statusFilterShareInWindow,
	focusedElement,
	roomBesideSearchForm,
	statusFilterResultText,
	statusFilterResultShareInWindow,
	emptyListText
} from '../questions/statements';
import {
	downloadStatementPdfFromList,
	focusBuildingFilter,
	goToScopeContract,
	requestStatementPdfFromList,
	openStatement,
	openStatementWithoutPdf,
	openStatementList,
	resetStatementFilters,
	resetStatementFiltersWithoutResults,
	searchStatements,
	showDraftsOfBuilding,
	showSettledOfBuilding,
	openDraftsPageOfBuilding,
	showOverdueOfBuilding,
	showStatementsOfBuilding,
	showStatementsOfBuildingWhileLoading,
	startGeneratingStatements,
	turnToNextPage,
	clearDraftFilter
} from '../tasks/statements';
import { inDays } from '../fixtures/dates';
import { listHeading } from '../questions/list';

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
		await seed.statement(tenant, building, Number(inDays(0).slice(0, 4))); // the year of the invoice dated today
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

When('der Liegenschaftsverwalter beginnt, die Liste nach einem anderen Gebäude zu filtern', async ({ verwalter }) => {
	await verwalter.attemptsTo(focusBuildingFilter);
});

// #733 (Helga P-1), #1113: the whole filter, so «Suchen» beside the focused field is free too
Then('verdeckt die Erfolgsmeldung nichts, was zum Filter gehört', async ({ verwalter }) => {
	await verwalter.sees(roomBesideSearchForm).toBeGreaterThanOrEqual(8);
});

When(
	'der Liegenschaftsverwalter nur die Entwürfe im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showDraftsOfBuilding(seed.idOf(building)!));
	}
);

When(
	'der Liegenschaftsverwalter die Seite {int} der Entwürfe im Gebäude {string} aufruft',
	async ({ verwalter, seed }, page: number, building: string) => {
		await verwalter.attemptsTo(openDraftsPageOfBuilding(seed.idOf(building)!, page));
	}
);

When(
	'der Liegenschaftsverwalter nur die erledigten Abrechnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showSettledOfBuilding(seed.idOf(building)!));
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

// #465: a global setting; every scenario sets the same phone and e-mail
Given(
	'die Verwaltung hat das Telefon {string} und die E-Mail {string} hinterlegt',
	async ({ seed }, phone: string, email: string) => {
		await seed.contact(phone, email);
	}
);

Given('für die Abrechnung {int} von {string} gibt es ein PDF', async ({ seed }, year: number, tenant: string) => {
	await seed.statementPdf(tenant, year);
});

When(
	'der Liegenschaftsverwalter das PDF der Abrechnung {int} von {string} herunterlädt',
	async ({ verwalter, names }, year: number, tenant: string) => {
		await verwalter.attemptsTo(downloadStatementPdfFromList(names.get(tenant) ?? tenant, year));
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen des Mietvertrags von {string} in der Wohnung {string} zeigt',
	async ({ verwalter, names }, tenant: string, apartment: string) => {
		await verwalter.sees(listScope).toContain(`Mietvertrags von ${names.get(tenant) ?? tenant}, Wohnung ${apartment}`);
	}
);

Then('nicht die Abrechnung {int} von {string}', async ({ verwalter, names }, year: number, tenant: string) => {
	await verwalter.sees(statementOfYearListed(names.get(tenant) ?? tenant, year)).toBe(false);
});

Then(
	'erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen der Abrechnungsperiode {string} zeigt',
	async ({ verwalter }, period: string) => {
		await verwalter.sees(listScope).toContain(`Abrechnungsperiode ${period}`);
	}
);

Then(
	'erfährt der Liegenschaftsverwalter, dass die Liste nur die Abrechnungen der Abrechnungsperiode des laufenden Jahres zeigt',
	async ({ verwalter }) => {
		const year = inDays(0).slice(0, 4);
		await verwalter.sees(listScope).toContain(`Abrechnungsperiode 01.01.${year} – 31.12.${year}`);
	}
);

// the status tabs count what the list can show, not every statement
Then('zählt die Liste {int} Entwurf/Entwürfe', async ({ verwalter }, count: number) => {
	await verwalter.sees(countedStatements('draft')).toBe(String(count));
});

Given('die Abrechnung {int} von {string} wurde inzwischen gelöscht', async ({ seed }, year: number, tenant: string) => {
	await seed.removeStatement(tenant, year);
});

When(
	'der Liegenschaftsverwalter in der Liste das PDF der Abrechnung {int} von {string} anfordert',
	async ({ verwalter, names }, year: number, tenant: string) => {
		await verwalter.attemptsTo(requestStatementPdfFromList(names.get(tenant) ?? tenant, year));
	}
);

Then(
	'zeigt die Abrechnungsliste bei der Abrechnung von {string} {string}',
	async ({ verwalter, names }, tenant: string, text: string) => {
		await verwalter.sees(listedStatement(names.get(tenant) ?? tenant)).toContain(text);
	}
);

Then(
	'die Abrechnungsliste zeigt bei der Abrechnung von {string} nicht {string}',
	async ({ verwalter, names }, tenant: string, text: string) => {
		await verwalter.sees(listedStatement(names.get(tenant) ?? tenant)).not.toContain(text);
	}
);

When(
	'der Liegenschaftsverwalter beim fehlenden PDF der Abrechnung {int} von {string} weitergeht',
	async ({ verwalter, names }, year: number, tenant: string) => {
		await verwalter.attemptsTo(openStatementWithoutPdf(names.get(tenant) ?? tenant, year));
	}
);

Then(
	'zeigt die Abrechnungsliste nur die Entwürfe im Gebäude {string}',
	async ({ verwalter, names }, building: string) => {
		await verwalter.sees(listStatusShown).toBe('true');
		await verwalter.sees(listBuildingShown).toBe(names.get(building) ?? building);
	}
);

// #1047: the address changes at once on browser back, the title only once the page has loaded
Then('ist der Liegenschaftsverwalter wieder auf der Abrechnungsliste', async ({ verwalter }) => {
	await verwalter.sees(pageAddressInApp).toBe('/statements');
});

// #673: the list filtered by a contract leads back to it, keeps it on a reset and offers no other building
When('der Liegenschaftsverwalter von der Abrechnungsliste zum Mietvertrag geht', async ({ verwalter }) => {
	await verwalter.attemptsTo(goToScopeContract);
});

When('der Liegenschaftsverwalter die Filter der Abrechnungsliste zurücksetzt', async ({ verwalter }) => {
	await verwalter.attemptsTo(resetStatementFilters);
});

When('der Liegenschaftsverwalter die Filter im Hinweis ohne Treffer zurücksetzt', async ({ verwalter }) => {
	await verwalter.attemptsTo(resetStatementFiltersWithoutResults);
});

Then('die Abrechnungsliste bietet nicht an, die Filter zurückzusetzen', async ({ verwalter }) => {
	await verwalter.sees(resetFiltersShown).toBe(false);
});

Then('die Abrechnungsliste bietet keine Wahl des Gebäudes an', async ({ verwalter }) => {
	await verwalter.sees(buildingChoiceShown).toBe(false);
});

// #673 (Helga P-2): the sentence above the list names the building and the status «Entwurf», not only the period
Then(
	'erfährt der Liegenschaftsverwalter, dass die Liste nur die Entwürfe im Gebäude {string} zeigt',
	async ({ verwalter, names }, building: string) => {
		await verwalter.sees(listScope).toContain(names.get(building) ?? building);
		await verwalter.sees(listScope).toContain('Entwurf');
	}
);

const STATUSES: Record<string, string> = { Entwurf: 'draft', Überfällig: 'overdue' };
// #673 (Marco P-7): the chosen tab says so in words, not only by its colour
Then('sagt der Statusfilter {string} {string}', async ({ verwalter }, status: string, text: string) => {
	await verwalter.sees(statusFilterText(STATUSES[status])).toContain(text);
});

// #1162 (Marco M-2, Helga H-1)
When('der Liegenschaftsverwalter den Statusfilter "Entwurf" wieder aufhebt', async ({ verwalter }) => {
	await verwalter.attemptsTo(clearDraftFilter);
});

Then('ist der Statusfilter {string} ganz im Fenster zu sehen', async ({ verwalter }, status: string) => {
	await verwalter.sees(statusFilterShareInWindow(STATUSES[status])).toBeGreaterThan(0.99);
});

Then('steht der Fokus auf dem Statusfilter {string}', async ({ verwalter }, status: string) => {
	await verwalter.sees(focusedElement).toBe(`filter-${STATUSES[status]}`);
});

// #1186 (Marco P-1, P-2, Helga P-1, P-2): what a status tile changed, said at the tiles and at the list
When(
	'der Liegenschaftsverwalter nur die überfälligen Abrechnungen im Gebäude {string} anzeigt',
	async ({ verwalter, seed }, building: string) => {
		await verwalter.attemptsTo(showOverdueOfBuilding(seed.idOf(building)!));
	}
);

Then('steht unter den Statusfiltern {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(statusFilterResultText).toBe(text);
});

Then('ist der Satz unter den Statusfiltern ganz im Fenster zu sehen', async ({ verwalter }) => {
	await verwalter.sees(statusFilterResultShareInWindow).toBeGreaterThan(0.99);
});

Then('steht über der Abrechnungsliste {string}', async ({ verwalter }, heading: string) => {
	await verwalter.sees(listHeading).toBe(heading);
});

Then('sagt die leere Abrechnungsliste {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(emptyListText).toContain(text);
});
