import { error } from '@sveltejs/kit';
import { strToU8 } from 'fflate';
import { getLocale } from '$lib/paraglide/runtime';
import { toAuditEntries } from '$lib/server/audit-log';
import { zipDownload } from '$lib/server/zip-download';
import type { RequestHandler } from './$types';

const API = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1`;

type Cell = string | null;
type DataExport = {
	fileName: string;
	dataFile: string;
	data: { auditLog: Parameters<typeof toAuditEntries>[0] };
	tables: { path: string; rows: Cell[][] }[];
	logTable: string;
	files: { path: string; content: string }[];
};

// Excel would run a text from a third party's file as a formula (Fachreview 496-1 V-2): such a text gets a leading «'»;
// a plain number such as a negative Saldo stays a number
const formula = /^[=+\-@\p{Cc}]/u;
const number = /^-?\d+(\.\d+)?$/;
const field = (value: Cell) => {
	if (value === null) return '';
	const text = formula.test(value) && !number.test(value) ? `'${value}` : value;
	return /[;"\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
// UTF-8 with the mark Excel reads it by, «;» as in Swiss Excel, CRLF
const csv = (rows: Cell[][]) =>
	strToU8(`\ufeff${rows.map((row) => row.map(field).join(';')).join('\r\n')}\r\n`);

/** Everything the landlord entered, as one ZIP (#496); the export goes into the Protokoll once the ZIP is made (F-4) */
export const GET: RequestHandler = async ({ fetch }) => {
	const response = await fetch(`${API}/export?language=${getLocale()}`);
	// a download: the page stays open, the browser names the failed download (as the export of a tenant, #435)
	if (!response.ok) error(500);
	const { fileName, dataFile, data, tables, logTable, files }: DataExport = await response.json();

	// the entries in the UI language, as the page «Protokoll» shows them
	const texts = new Map(toAuditEntries(data.auditLog).map(({ id, text }) => [id, text]));
	data.auditLog = data.auditLog.map((entry) => ({ ...entry, text: texts.get(entry.id) }));
	for (const row of tables.find((table) => table.path === logTable)?.rows.slice(1) ?? [])
		row[2] = texts.get(String(row[0])) ?? null;

	const download = zipDownload(fileName, {
		[dataFile]: strToU8(JSON.stringify(data, null, 2)),
		...Object.fromEntries(tables.map(({ path, rows }) => [path, csv(rows)])),
		// PDFs and photos are compressed already: stored as they are
		...Object.fromEntries(
			files.map(({ path, content }) => [path, [Buffer.from(content, 'base64'), { level: 0 }]])
		)
	});
	await fetch(`${API}/audit-log/exports`, { method: 'POST' });
	return download;
};
