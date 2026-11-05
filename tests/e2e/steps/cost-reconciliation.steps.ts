import type { DataTable } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { cellsOf, draftsNamed, helpOf, noteCount, notesOf, reportPeriodName, rowOf, shown, textOf } from '../questions/cost-reconciliation';
import { invoicesOfBuilding } from '../questions/statement-generate';
import { pageAddressInApp } from '../questions/statements';
import { openStatementInReport, openReportOf, openReports } from '../tasks/cost-reconciliation';

const { Given, When, Then } = createBdd(test);

// #1126: the Kostenabstimmung in the preview of a run and on «Berichte»
const inPreview = (seed: { idOf(title: string): string | undefined }, names: Map<string, string>, building: string) => ({
	name: names.get(building) ?? building,
	id: seed.idOf(building)!
});
const inReport = null;
const yearStart = (year: number) => `${year}-01-01`;
const isoOf = (swiss: string) => swiss.split('.').reverse().join('-');

Given(
	'im Gebäude {string} gibt es eine nicht umlagefähige Rechnung der Kategorie {string} über {string} Franken vom {string}',
	async ({ seed }, building: string, category: string, amount: string, date: string) => {
		await seed.nonAllocableInvoiceOn(building, category, amount, date);
	}
);

Then('zeigt die Kostenabstimmung der Vorschau für {string}:', async ({ verwalter, seed, names }, building: string, table: DataTable) => {
	await verwalter.sees(cellsOf(inPreview(seed, names, building))).toEqual(table.raw().flat());
});

Then(
	'erklärt die Kostenabstimmung der Vorschau für {string} {string}',
	async ({ verwalter, seed, names }, building: string, text: string) => {
		await verwalter.sees(helpOf(inPreview(seed, names, building))).toBe(text);
	}
);

Then(
	'nennt die Kostenabstimmung der Vorschau für {string} {string} mit {string}',
	async ({ verwalter, seed, names }, building: string, label: string, amount: string) => {
		await verwalter.sees(rowOf(inPreview(seed, names, building), label)).toContain(amount);
	}
);

Then(
	'nennt die Kostenabstimmung der Vorschau für {string} nicht {string}',
	async ({ verwalter, seed, names }, building: string, text: string) => {
		await verwalter.sees(textOf(inPreview(seed, names, building))).not.toContain(text);
	}
);

Then('zeigt die Vorschau keine Kostenabstimmung für {string}', async ({ verwalter, seed, names }, building: string) => {
	await verwalter.sees(shown(inPreview(seed, names, building))).toBe(false);
});

Then('nennt die Vorschau bei den Rechnungen von {string} {string}', async ({ verwalter, names }, building: string, text: string) => {
	await verwalter.sees(invoicesOfBuilding(names.get(building) ?? building)).toContain(text);
});

Given('der Liegenschaftsverwalter ist in den Berichten', async ({ verwalter }) => {
	await verwalter.attemptsTo(openReports);
});

Then('nennen die Berichte die Kostenabstimmung {string}', async ({ verwalter, seed, names }, name: string) => {
	const [building, period] = name.split(', ');
	const start = isoOf(period.split(' – ')[0]);
	await verwalter.sees(reportPeriodName(seed.idOf(building)!, start)).toBe(`${names.get(building)}, ${period}`);
});

// from «Berichte», by the link of the building's period
When(
	'der Liegenschaftsverwalter die Kostenabstimmung {int} von {string} öffnet',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.attemptsTo(openReports, openReportOf(seed.idOf(building)!, yearStart(year)));
	}
);

Then(
	'ist der Liegenschaftsverwalter auf der Kostenabstimmung {int} von {string}',
	async ({ verwalter, seed }, year: number, building: string) => {
		await verwalter.sees(pageAddressInApp).toBe(
			`/reports/${seed.idOf(building)}?periodStart=${yearStart(year)}&periodEnd=${year}-12-31`
		);
	}
);

Then('zeigt die Kostenabstimmung der Berichte:', async ({ verwalter }, table: DataTable) => {
	await verwalter.sees(cellsOf(inReport)).toEqual(table.raw().flat());
});

Then('erklärt die Kostenabstimmung der Berichte {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(helpOf(inReport)).toBe(text);
});

Then(
	'nennt die Kostenabstimmung der Berichte {string} mit {string}, {string} und {string}',
	async ({ verwalter }, label: string, costs: string, tenants: string, landlord: string) => {
		await verwalter.sees(rowOf(inReport, label)).toEqual([label, costs, tenants, landlord]);
	}
);

Then('nennt die Kostenabstimmung der Berichte den Hinweis {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(notesOf(inReport)).toContain(text);
});

Then('nennt die Kostenabstimmung der Berichte keinen Hinweis', async ({ verwalter }) => {
	await verwalter.sees(noteCount(inReport)).toBe(0);
});

When(
	'der Liegenschaftsverwalter in der Kostenabstimmung die Abrechnung von {string} öffnet',
	async ({ verwalter, names }, tenant: string) => {
		await verwalter.attemptsTo(openStatementInReport(names.get(tenant) ?? tenant));
	}
);

Then('nennt der Hinweis zu den Entwürfen die Abrechnung von {string}', async ({ verwalter, names }, tenant: string) => {
	await verwalter.sees(draftsNamed).toEqual([names.get(tenant) ?? tenant]);
});
