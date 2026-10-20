import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import {
	deadlineText,
	deadlines,
	markedNavItems,
	occupancyHelp,
	occupancyText,
	occupancyShown,
	outdatedDraftsOf,
	outdatedDraftsText,
	outdatedDraftsAnd,
	overviewTaskShown,
	overviewTaskShownFor,
	overviewTaskText,
	overviewTasksNaming,
	rentedApartmentsOf,
	statusFilterShown
} from '../questions/dashboard';
import {
	chooseQuickAction,
	openBuildingFromOccupancy,
	openDashboard,
	openOutdatedDrafts,
	openStatementsWithStatus,
	openTile,
	startOverviewTask,
	startOverviewTaskFor
} from '../tasks/dashboard';
import type { TestData } from '../fixtures/backend';
import { inDays } from '../fixtures/dates';

const { Given, When, Then } = createBdd(test);

const lastYear = Number(inDays(0).slice(0, 4)) - 1;

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

// Moved out on 30.09. of the last year: the last Abrechnungsperiode still holds rent days
Given(
	'{string} ist im letzten Jahr aus der Wohnung {string} ausgezogen',
	async ({ seed }, tenant: string, apartment: string) => {
		await seed.contract(tenant, apartment, {
			startDate: `${lastYear - 1}-04-01`,
			endDate: `${lastYear}-09-30`,
			baseRent: '950'
		});
	}
);

Given(
	'{string} hat die Abrechnung des letzten Jahres für das Gebäude {string}',
	async ({ seed }, tenant: string, building: string) => {
		await seed.statement(tenant, building, lastYear);
	}
);

When('der Liegenschaftsverwalter die Aufgabe {string} beginnt', async ({ verwalter }, title: string) => {
	await verwalter.attemptsTo(startOverviewTask(title));
});

Then('nennt die Übersicht die Aufgabe {string}', async ({ verwalter }, title: string) => {
	await verwalter.sees(overviewTaskShown(title)).toBe(true);
});

Then(
	'nennt die Aufgabe {string} das Gebäude {string}',
	async ({ verwalter, names }, title: string, building: string) => {
		await verwalter.sees(overviewTaskText(title)).toContain(names.get(building)!);
	}
);

Then(
	'nennt die Aufgabe {string} das Gebäude {string}, aber nicht das Gebäude {string}',
	async ({ verwalter, names }, title: string, named: string, missing: string) => {
		await verwalter.sees(overviewTaskText(title)).toContain(names.get(named)!);
		await verwalter.sees(overviewTaskText(title)).not.toContain(names.get(missing)!);
	}
);

Then(
	/^(?:die Frist|ist die Frist) "([^"]+) ([^"]+ [^"]+)" (?:ist )?"([^"]+)"$/,
	async ({ verwalter, names }, kind: string, tenant: string, when: string) => {
		await verwalter.sees(deadlineText(kind, names.get(tenant)!)).toContain(when);
	}
);

Then('ist in der Hauptnavigation nur {string} markiert', async ({ verwalter }, label: string) => {
	await verwalter.sees(markedNavItems).toEqual([label]);
});

Given('der Liegenschaftsverwalter öffnet die Übersicht', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDashboard);
});

When('der Liegenschaftsverwalter die Übersicht öffnet', async ({ verwalter }) => {
	await verwalter.attemptsTo(openDashboard);
});

When(
	'der Liegenschaftsverwalter in der Belegung das Gebäude {string} öffnet',
	async ({ verwalter, names }, building: string) => {
		await verwalter.attemptsTo(openBuildingFromOccupancy(names.get(building)!));
	}
);

When('der Liegenschaftsverwalter die Kennzahl {string} öffnet', async ({ verwalter }, label: string) => {
	await verwalter.attemptsTo(openTile(label));
});

When('der Liegenschaftsverwalter die Abrechnungen {string} öffnet', async ({ verwalter }, label: string) => {
	await verwalter.attemptsTo(openStatementsWithStatus(label));
});

When('der Liegenschaftsverwalter die Schnellaktion {string} wählt', async ({ verwalter }, label: string) => {
	await verwalter.attemptsTo(chooseQuickAction(label));
});

Then('nennt die Belegung von {string} keinen Anteil in Prozent', async ({ verwalter, names }, building: string) => {
	await verwalter.sees(occupancyShown(names.get(building)!)).toBe(true);
	await verwalter.sees(occupancyText(names.get(building)!)).not.toContain('%');
});

Then(
	'sind im Gebäude {string} {string} Wohnungen vermietet',
	async ({ verwalter, names }, building: string, count: string) => {
		await verwalter.sees(rentedApartmentsOf(names.get(building)!)).toBe(count);
	}
);

Then('die Liste zeigt nur {string}', async ({ verwalter }, label: string) => {
	await verwalter.sees(statusFilterShown).toBe(label);
});

Given('der Mietvertrag von {string} ist in {int} Tagen gekündigt', async ({ seed }, tenant: string, days: number) => {
	await seed.notice(tenant, inDays(days));
});

Then(
	'nennt die Übersicht keine Aufgabe {string} für {string}',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.sees(overviewTaskShownFor(title, names.get(tenant)!)).toBe(false);
	}
);

Then(
	'nennt die Übersicht die Aufgabe {string} für {string}',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.sees(overviewTaskShownFor(title, names.get(tenant)!)).toBe(true);
	}
);

Then(
	/^nennt die Übersicht keine Frist "([^"]+) ([^"]+ [^"]+)"$/,
	async ({ verwalter, names }, kind: string, tenant: string) => {
		await verwalter.sees(deadlines(kind, names.get(tenant)!)).toBe(0);
	}
);

// anchored on the occupancy of the scenario's building: the overview has loaded its data
Then(
	'nennt die Übersicht keine Aufgabe für den Mietvertrag von {string}',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.sees(occupancyShown(names.get('Seeblick')!)).toBe(true);
		await verwalter.sees(overviewTasksNaming(names.get(tenant)!)).toBe(0);
	}
);

Given(
	'{string} hat die Abrechnungen der letzten beiden Jahre für das Gebäude {string}',
	async ({ seed }, tenant: string, building: string) => {
		await seed.statement(tenant, building, lastYear - 1);
		await seed.statement(tenant, building, lastYear);
	}
);

Given(
	'{string} hat die Abrechnung des vorletzten Jahres für das Gebäude {string}',
	async ({ seed }, tenant: string, building: string) => {
		await seed.statement(tenant, building, lastYear - 1);
	}
);

// the task names each building with its periods in brackets: «Ahornhof (2023, 01.07.2024 – 31.12.2024)»
Then(
	'nennt die Aufgabe {string} für das Gebäude {string} die Periode {string}',
	async ({ verwalter, names }, title: string, building: string, period: string) => {
		const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		await verwalter
			.sees(overviewTaskText(title))
			.toMatch(new RegExp(`${escape(names.get(building)!)} \\([^)]*(?<=[(, ])${escape(period)}[,)]`));
	}
);
Then('nennt die Belegung von {string} {string}', async ({ verwalter, names }, building: string, text: string) => {
	await verwalter.sees(occupancyText(names.get(building)!)).toContain(text);
});

Then('erklärt die Belegung {string}', async ({ verwalter }, help: string) => {
	await verwalter.sees(occupancyHelp).toBe(help);
});

// A-6 (#115): «Mieter ist ausgezogen» stored on the contract, as the contract page stores it
Given('der Liegenschaftsverwalter hat bestätigt, dass {string} ausgezogen ist', async ({ seed }, tenant: string) => {
	await seed.movedOut(tenant);
});

When(
	'der Liegenschaftsverwalter die Aufgabe {string} für {string} beginnt',
	async ({ verwalter, names }, title: string, tenant: string) => {
		await verwalter.attemptsTo(startOverviewTaskFor(title, names.get(tenant)!));
	}
);

// after the task for the same tenant: the overview has loaded its tasks
Then('nicht die Aufgabe {string} für {string}', async ({ verwalter, names }, title: string, tenant: string) => {
	await verwalter.sees(overviewTaskShownFor(title, names.get(tenant)!)).toBe(false);
});

// recorded after the statement: a statement of the last year lacks it (#96)
Given('im Gebäude {string} gibt es danach eine Rechnung des letzten Jahres', async ({ seed }, building: string) => {
	await seed.invoiceOn(building, 'Hauswart', '300.00', `${lastYear}-06-15`);
});

Then(
	'nennt die Aufgabe zu nicht aktuellen Entwürfen die Entwürfe von {string} des letzten Jahres',
	async ({ verwalter, names }, building: string) => {
		await verwalter.sees(outdatedDraftsOf(names.get(building)!)).toContain(String(lastYear));
	}
);

Then('sagt die Aufgabe zu nicht aktuellen Entwürfen {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(outdatedDraftsText).toContain(text);
});

Then(
	'steht die Aufgabe zu nicht aktuellen Entwürfen vor der Aufgabe {string}',
	async ({ verwalter }, title: string) => {
		await verwalter.sees(outdatedDraftsAnd(title)).toEqual(['nicht aktuell', title]);
	}
);

When(
	'der Liegenschaftsverwalter die nicht aktuellen Entwürfe von {string} des letzten Jahres öffnet',
	async ({ verwalter, names }, building: string) => {
		await verwalter.attemptsTo(openOutdatedDrafts(names.get(building)!));
	}
);

Then('zeigt die Abrechnungsliste die Entwürfe von {string} des letzten Jahres', async ({ verwalter, seed }, building: string) => {
	await verwalter.sees(pageAddress).toMatch(
		new RegExp(`/statements\\?building=${seed.idOf(building)}&periodStart=${lastYear}-01-01&periodEnd=${lastYear}-12-31&status=draft`)
	);
});

Then(
	'ist der Liegenschaftsverwalter auf der Detailseite der Abrechnung des letzten Jahres von {string}',
	async ({ verwalter, seed }, tenant: string) => {
		await verwalter.sees(pageAddress).toMatch(new RegExp(`/statements/${seed.idOf(`Abrechnung ${tenant} ${lastYear}`)}$`));
	}
);
