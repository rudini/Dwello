import { createBdd, type DataTable } from 'playwright-bdd';
import { inDays, swissDate } from '../fixtures/dates';
import { test } from '../fixtures/test';
import { auditEntryCountOn } from '../questions/audit-log';
import {
	downloadedFileName,
	exportedApartments,
	exportedColumn,
	exportedFileStart,
	exportedCell,
	exportedInvoiceSuppliers,
	exportedInvoices,
	filesInExportFolder,
	presentInDownloadedZip
} from '../questions/download';
import { exportHelp } from '../questions/settings';
import { AUDIT_COUNT, countAuditEntriesOf } from '../tasks/audit-log';
import { exportAllData } from '../tasks/settings';

const { Given, When, Then } = createBdd(test);

// #496: the export of all data. The ZIP holds the records of parallel scenarios too: the steps look for their own
// records by name and never count them

// The entry names the seeded records with their scenario names ("Gartenpflege Ost 3f2a…")
const named = (names: Map<string, string>, text: string) =>
	[...names].reduce((result, [title, name]) => result.replaceAll(title, name), text);

Given('die Rechnung von {string} ist inzwischen gelöscht', async ({ seed }, supplier: string) => {
	await seed.deleteInvoice(`Rechnung ${supplier}`);
});

Given(
	'der Liegenschaftsverwalter hat gezählt, wie oft das Protokoll heute {string} nennt',
	async ({ verwalter }, text: string) => {
		await verwalter.attemptsTo(countAuditEntriesOf(text, swissDate(inDays(0))));
	}
);

When('der Liegenschaftsverwalter alle Daten exportiert', async ({ verwalter }) => {
	await verwalter.attemptsTo(exportAllData);
});

Then('erklären die Einstellungen beim Export {string}', async ({ verwalter }, text: string) => {
	await verwalter.sees(exportHelp).toContain(text);
});

Then('heisst der Export {string} mit dem Datum von heute', async ({ verwalter }, name: string) => {
	await verwalter.sees(downloadedFileName).toBe(`${name}-${inDays(0)}.zip`);
});

Then('enthält der Export die Anleitung, die Datendatei und je eine Tabelle:', async ({ verwalter }, table: DataTable) => {
	const files = table.raw().map(([name]) => name);
	await verwalter.sees(presentInDownloadedZip(files)).toEqual(files);
});

Then(
	'nennt die Datendatei des Exports beim Gebäude {string} die Wohnung {string} mit dem Mietvertrag von {string}',
	async ({ verwalter, names }, building: string, apartment: string, tenant: string) => {
		await verwalter.sees(exportedApartments(names.get(building)!)).toContain(`${apartment} ${names.get(tenant)}`);
	}
);

// the invoice names its Beleg with the file name the landlord uploaded and the path of the file in the ZIP
Then(
	'nennt die Datendatei des Exports beim Gebäude {string} die Rechnung von {string} mit ihrem Beleg {string}',
	async ({ verwalter, names }, building: string, supplier: string, fileName: string) => {
		await verwalter
			.sees(exportedInvoices(names.get(building)!))
			.toContain(`${names.get(supplier)}: ${fileName}`);
	}
);

Then(
	'nennt die Datendatei des Exports beim Gebäude {string} keine Rechnung von {string}',
	async ({ verwalter, names }, building: string, supplier: string) => {
		await verwalter.sees(exportedInvoiceSuppliers(names.get(building)!)).not.toContain(names.get(supplier));
	}
);

Then(
	'enthält der Export den Beleg {string} der Rechnung von {string} im Ordner {string} als PDF',
	async ({ verwalter, names }, fileName: string, supplier: string, folder: string) => {
		await verwalter.sees(filesInExportFolder(folder, names.get(supplier)!, fileName)).toEqual([`${fileName} %PDF-`]);
	}
);

Then('ist die Tabelle {string} des Exports als UTF-8 für Excel gekennzeichnet', async ({ verwalter }, name: string) => {
	await verwalter.sees(exportedFileStart(name)).toBe('efbbbf');
});

Then(
	'führt die Tabelle {string} des Exports das Gebäude {string} mit {string} in der Spalte {string}, durch Strichpunkte getrennt',
	async ({ verwalter, names }, table: string, building: string, value: string, column: string) => {
		await verwalter.sees(exportedCell(table, names.get(building)!, column)).toBe(value);
	}
);

Then(
	'nennt die Tabelle {string} des Exports in der Spalte {string} {string}',
	async ({ verwalter, names }, table: string, column: string, text: string) => {
		await verwalter.sees(exportedColumn(table, column)).toContain(named(names, text));
	}
);

// positive anchor: the invoice of the scenario's other supplier, checked in the step before
Then('führt die Tabelle {string} des Exports keine Rechnung von {string}', async ({ verwalter, names }, table: string, supplier: string) => {
	await verwalter.sees(exportedColumn(table, 'Rechnungssteller')).toContain(names.get('Hauswart Meier'));
	await verwalter.sees(exportedColumn(table, 'Rechnungssteller')).not.toContain(names.get(supplier));
});

Then('nennt das Protokoll heute öfter {string} als vor dem Export', async ({ verwalter }, text: string) => {
	await verwalter.sees(auditEntryCountOn(text, swissDate(inDays(0)))).toBeGreaterThan(verwalter.recall<number>(AUDIT_COUNT));
});
