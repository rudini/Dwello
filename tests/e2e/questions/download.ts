import { unzipSync } from 'fflate';
import { question } from '../screenplay/actor';
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

// The names of the files in the downloaded ZIP
export const fileNamesInDownloadedZip = question('the file names in the downloaded ZIP', async (actor) =>
	Object.keys(unzipSync((await actor.answer(DownloadedFile)).content)).sort()
);
