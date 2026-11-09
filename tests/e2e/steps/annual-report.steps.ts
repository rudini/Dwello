import type { DataTable } from 'playwright-bdd';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/test';
import { annualReportCellsOf, annualReportDownloadCount, annualReportHelpOf, annualReportNotesText, annualReportTitle, buildingsInOrder, csvAmountsOf } from '../questions/annual-report';
import { downloadedFileName, downloadedPdfText } from '../questions/download';
import { chooseReportBuilding, downloadAnnualReport, openAnnualReport } from '../tasks/annual-report';

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

When('der Liegenschaftsverwalter für den Jahresbericht das Gebäude {string} wählt', async ({ verwalter, seed }, building: string) => {
	await verwalter.attemptsTo(chooseReportBuilding(seed.idOf(building)!));
});

Then('heisst der angezeigte Jahresbericht {string}', async ({ verwalter, names }, title: string) => {
	await verwalter.sees(annualReportTitle).toBe(title.replace('Seeblick', names.get('Seeblick')!));
});

Then('bietet der Jahresbericht keine Datei zum Herunterladen an', async ({ verwalter }) => {
	await verwalter.sees(annualReportDownloadCount).toBe(0);
});

Then('nennt der Jahresbericht die Gebäude {string} und {string} in dieser Reihenfolge', async ({ verwalter, names }, first: string, second: string) => {
	const named = [first, second].map((building) => names.get(building)!);
	await verwalter.sees(buildingsInOrder(named)).toEqual(named);
});

// fallback review of #1421: a name a spreadsheet would run as a formula begins with «'»
Then(
	'steht in der CSV-Datei des Jahresberichts vor der Position {string} ein Apostroph, mit {string}',
	async ({ verwalter, names }, category: string, amount: string) => {
		const position = `'${names.get(category) ?? category}`;
		await verwalter.sees(csvAmountsOf([position])).toEqual([`${position} ${amount}`]);
	}
);
