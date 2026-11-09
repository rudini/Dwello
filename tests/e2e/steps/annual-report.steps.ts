import type { DataTable } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { annualReportCellsOf, annualReportHelpOf, annualReportNotesText, csvAmountsOf } from '../questions/annual-report';
import { downloadedFileName, downloadedPdfText } from '../questions/download';
import { downloadAnnualReport, openAnnualReport } from '../tasks/annual-report';

const { When, Then } = createBdd(test);

// #1409: the Jahresbericht of a building and a calendar year on «Auswertungen»
When('der Liegenschaftsverwalter den Jahresbericht {int} des Gebäudes {string} öffnet', async ({ verwalter, seed }, year: number, building: string) => {
	await verwalter.attemptsTo(openAnnualReport(seed.idOf(building)!, year));
});

When(
	/^der Liegenschaftsverwalter den Jahresbericht (\d+) des Gebäudes "([^"]*)" als (CSV|PDF) herunterlädt$/,
	async ({ verwalter, seed }, year: string, building: string, kind: string) => {
		await verwalter.attemptsTo(downloadAnnualReport(seed.idOf(building)!, Number(year), kind === 'CSV' ? 'csv' : 'pdf'));
	}
);

const parts = { 'den Mietertrag': 'income', 'die Kosten': 'costs', 'zum Mietertrag': 'income', 'zu den Kosten': 'costs' } as const;
Then(/^zeigt der Jahresbericht (den Mietertrag|die Kosten):$/, async ({ verwalter }, part: keyof typeof parts, table: DataTable) => {
	await verwalter.sees(annualReportCellsOf(parts[part])).toEqual(table.raw().flat());
});

Then(
	/^erklärt der Jahresbericht (zum Mietertrag|zu den Kosten) "([^"]*)"$/,
	async ({ verwalter }, part: keyof typeof parts, text: string) => {
		await verwalter.sees(annualReportHelpOf(parts[part])).toBe(text);
	}
);

Then('nennt der Jahresbericht {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(annualReportNotesText).toContain(text);
});

Then(
	'ist die heruntergeladene Datei der Jahresbericht {int} von {string} als {string}',
	async ({ verwalter, names }, year: number, building: string, extension: string) => {
		await verwalter.sees(downloadedFileName).toBe(`Jahresbericht ${names.get(building)} ${year}.${extension}`);
	}
);

Then('enthält die CSV-Datei des Jahresberichts die Zeilen:', async ({ verwalter }, table: DataTable) => {
	const rows = table.rows();
	await verwalter.sees(csvAmountsOf(rows.map(([position]) => position))).toEqual(rows.map((row) => row.join(' ')));
});

Then('enthält das PDF des Jahresberichts {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(downloadedPdfText).toContain(text);
});
