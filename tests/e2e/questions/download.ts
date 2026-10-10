import type { Download } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { Actor } from '../fixtures/actor';
import { readPdf } from '../../../backend/src/__tests__/helpers/pdf-text';

// The file the actor downloaded last: its name and its first bytes
export const downloadedFile = async (actor: Actor) => {
	const download = actor.recall<Download>('download');
	const content = await readFile(await download.path());
	return { name: download.suggestedFilename(), header: content.subarray(0, 5).toString() };
};

// Title in the document information of the downloaded PDF (PDFKit keeps it in an object of its own)
export const downloadedPdfTitle = async (actor: Actor) => {
	const pdf = (await readFile(await actor.recall<Download>('download').path())).toString('latin1');
	const [, ref] = pdf.match(/\/Title (\d+) 0 R/) ?? [];
	const [, raw = ''] = pdf.match(new RegExp(`\\n${ref} 0 obj\\n\\((.*?)\\)\\nendobj`, 's')) ?? [];
	// PDFKit writes non-ASCII text as UTF-16BE behind a byte order mark
	return raw.startsWith('\xfe\xff') ? Buffer.from(raw.slice(2), 'latin1').swap16().toString('utf16le') : raw;
};

// Text of the downloaded PDF, lines joined: what the tenant reads
export const downloadedPdfText = async (actor: Actor) =>
	readPdf(await readFile(await actor.recall<Download>('download').path())).flowing;
