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
