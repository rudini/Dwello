import { unzipSync } from 'fflate';
import { question, type Actor } from '../screenplay/actor';
import { DownloadedFile } from '../screenplay/questions';
import { readPdf } from '../../../backend/src/__tests__/helpers/pdf-text';

// The file the actor downloaded last: its name and its first bytes
export const downloadedFileName = question(
	'the name of the downloaded file',
	async (actor) => (await actor.answer(DownloadedFile)).name
);
export const downloadedFileHeader = question('the first bytes of the downloaded file', async (actor) =>
	(await actor.answer(DownloadedFile)).content.subarray(0, 5).toString()
);

// The files in the downloaded ZIP: each name with its first bytes («NK-….pdf %PDF-»)
export const filesInDownloadedZip = question('the files in the downloaded ZIP', async (actor) =>
	Object.entries(unzipSync((await actor.answer(DownloadedFile)).content)).map(
		([name, content]) => `${name} ${Buffer.from(content.subarray(0, 5)).toString()}`
	)
);

// Title in the document information of the downloaded PDF (PDFKit keeps it in an object of its own)
export const downloadedPdfTitle = question('the title of the downloaded PDF', async (actor) => {
	const pdf = (await actor.answer(DownloadedFile)).content.toString('latin1');
	const [, ref] = pdf.match(/\/Title (\d+) 0 R/) ?? [];
	const [, raw = ''] = pdf.match(new RegExp(`\\n${ref} 0 obj\\n\\((.*?)\\)\\nendobj`, 's')) ?? [];
	// PDFKit writes non-ASCII text as UTF-16BE behind a byte order mark
	return raw.startsWith('\xfe\xff') ? Buffer.from(raw.slice(2), 'latin1').swap16().toString('utf16le') : raw;
});

// Text of the downloaded PDF, lines joined: what the tenant reads
export const downloadedPdfText = question(
	'the text of the downloaded PDF',
	async (actor) => readPdf((await actor.answer(DownloadedFile)).content).flowing
);

// The first three bytes of the downloaded file in hex: what tells a PDF (255044) from a JPEG (ffd8ff)
export const downloadedFileMagic = question('the kind of the downloaded file', async (actor) =>
	(await actor.answer(DownloadedFile)).content.subarray(0, 3).toString('hex')
);

// The data file of a tenant export (#435), as the tenant's other program reads it: its tenant, the apartments of its
// contracts and the numbers of its statements
const exportedData = question('the data in the downloaded export', async (actor) => {
	const [, data] = Object.entries(unzipSync((await actor.answer(DownloadedFile)).content)).find(([name]) => name === 'daten.json') ?? [];
	return JSON.parse(data ? Buffer.from(data).toString() : '{}');
});
export const exportedTenantName = question('the tenant in the downloaded export', async (actor) => {
	const { tenant } = await actor.answer(exportedData);
	return tenant ? `${tenant.firstName} ${tenant.lastName}` : null;
});
export const exportedContractApartments = question('the apartments of the contracts in the export', async (actor) =>
	((await actor.answer(exportedData)).contracts ?? []).map((contract: { apartment: { number: string } }) => contract.apartment.number)
);
export const exportedStatementNumbers = question('the statement numbers in the export', async (actor) =>
	((await actor.answer(exportedData)).statements ?? []).map((statement: { number: string }) => statement.number)
);
// the statements the reminders in the export belong to, and the files of the reminders
export const exportedReminderStatements = question('the statements of the reminders in the export', async (actor) =>
	((await actor.answer(exportedData)).reminders ?? []).map((reminder: { statement: string }) => reminder.statement)
);
export const exportedReminderFiles = question('the files of the reminders in the export', async (actor) =>
	((await actor.answer(exportedData)).reminders ?? []).map((reminder: { file: string }) => reminder.file)
);
// all the export says, its data and the names of its files: where another tenant's data must not appear
export const everythingExported = question('everything in the export', async (actor) =>
	JSON.stringify([await actor.answer(exportedData), await actor.answer(fileNamesInDownloadedZip)])
);

// The names of the files in the downloaded ZIP
export const fileNamesInDownloadedZip = question('the file names in the downloaded ZIP', async (actor) =>
	Object.keys(unzipSync((await actor.answer(DownloadedFile)).content)).sort()
);

// #496: the export of all data. Its ZIP holds the records of parallel scenarios too, so these questions look up the
// records by their names and never count. Shape of the data file: docs/reviews/496-entwurf.md
const exportedFiles = question('the files in the downloaded export', async (actor) =>
	unzipSync((await actor.answer(DownloadedFile)).content)
);
// the data file is the one JSON file at the top of the ZIP, named in the UI language
const allExportedData = question('the data file of the export', async (actor) => {
	const [, data] = Object.entries(await actor.answer(exportedFiles)).find(([name]) => /^[^/]+\.json$/.test(name)) ?? [];
	return JSON.parse(data ? Buffer.from(data).toString() : '{}');
});
type ExportedInvoice = { billingEntityName: string; documents?: { fileName: string; file: string }[] };
type ExportedBuilding = {
	name: string;
	apartments?: { number: string; contracts?: { tenantId: string }[] }[];
	invoices?: ExportedInvoice[];
};
const exportedBuilding = async (actor: Actor, name: string) =>
	((await actor.answer(allExportedData)).buildings ?? []).find((building: ExportedBuilding) => building.name === name) as
		| ExportedBuilding
		| undefined;

/** The apartments of the building in the data file, each with the names of its contracts' tenants: «1.01 Hans Müller …» */
export const exportedApartments = (building: string) =>
	question(`the apartments of ${building} in the export`, async (actor) => {
		const tenants = new Map(
			((await actor.answer(allExportedData)).tenants ?? []).map((tenant: { id: string; firstName: string; lastName: string }) => [
				tenant.id,
				`${tenant.firstName} ${tenant.lastName}`
			])
		);
		return ((await exportedBuilding(actor, building))?.apartments ?? []).map((apartment) =>
			[apartment.number, ...(apartment.contracts ?? []).map((contract) => tenants.get(contract.tenantId))].join(' ')
		);
	});

/** The invoices of the building in the data file, each «supplier: file name of its Beleg», the file name marked when
 * the path the invoice names is not in the ZIP */
export const exportedInvoices = (building: string) =>
	question(`the invoices of ${building} in the export`, async (actor) => {
		const files = await actor.answer(fileNamesInDownloadedZip);
		return ((await exportedBuilding(actor, building))?.invoices ?? []).map((invoice) =>
			[
				invoice.billingEntityName,
				...(invoice.documents ?? []).map(({ fileName, file }) => (files.includes(file) ? fileName : `${fileName} (not in the ZIP: ${file})`))
			].join(': ')
		);
	});
export const exportedInvoiceSuppliers = (building: string) =>
	question(`the suppliers of the invoices of ${building} in the export`, async (actor) =>
		((await exportedBuilding(actor, building))?.invoices ?? []).map((invoice) => invoice.billingEntityName)
	);

/** Those of the named files that the downloaded ZIP holds */
export const presentInDownloadedZip = (names: string[]) =>
	question('the named files in the downloaded ZIP', async (actor) => {
		const files = await actor.answer(fileNamesInDownloadedZip);
		return names.filter((name) => files.includes(name));
	});

/** The files in the folder whose name holds the text, each with its first bytes; a name that ends in the file name
 * answers as that file name («meier-q1.pdf %PDF-»), any other with its path */
export const filesInExportFolder = (folder: string, holding: string, fileName: string) =>
	question(`the files of ${holding} in ${folder}`, async (actor) =>
		Object.entries(await actor.answer(exportedFiles))
			.filter(([name]) => name.startsWith(`${folder}/`) && name.includes(holding))
			.map(([name, content]) => `${name.endsWith(fileName) ? fileName : name} ${Buffer.from(content.subarray(0, 5)).toString()}`)
	);

/** The first three bytes of a file in the ZIP in hex: «efbbbf» is the mark Excel reads UTF-8 by */
export const exportedFileStart = (name: string) =>
	question(`the first bytes of ${name}`, async (actor) => {
		const content = (await actor.answer(exportedFiles))[name];
		return content ? Buffer.from(content.subarray(0, 3)).toString('hex') : null;
	});

/** The rows of a table in the ZIP, each as its columns by the names of the first row; the cells split at «;» */
export const exportedTableRows = (name: string) =>
	question(`the rows of ${name}`, async (actor) => {
		const content = (await actor.answer(exportedFiles))[name];
		if (!content) return [];
		const [head = [], ...rows] = new TextDecoder()
			.decode(content)
			.split(/\r?\n/)
			.filter(Boolean)
			.map((line) => line.split(';').map((cell) => cell.replace(/^"(.*)"$/, '$1').replaceAll('""', '"')));
		return rows.map((row) => Object.fromEntries(head.map((column, index) => [column, row[index]])));
	});

/** The values of one column of a table in the ZIP */
export const exportedColumn = (name: string, column: string) =>
	question(`the column ${column} of ${name}`, async (actor) =>
		(await actor.answer(exportedTableRows(name))).map((row) => row[column])
	);

/** The cell of the column in the row whose «Name» is the name; null when no row has it */
export const exportedCell = (table: string, name: string, column: string) =>
	question(`the ${column} of ${name} in ${table}`, async (actor) =>
		(await actor.answer(exportedTableRows(table))).find((row) => row.Name === name)?.[column] ?? null
	);

/** The cell of the column in the row of the apartment of the building in a table of apartments; null without that row */
export const exportedApartmentCell = (table: string, building: string, apartment: string, column: string) =>
	question(`the ${column} of ${apartment} in ${building} in ${table}`, async (actor) =>
		(await actor.answer(exportedTableRows(table))).find((row) => row.Gebäude === building && row.Nummer === apartment)?.[column] ?? null
	);
