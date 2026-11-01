import { describe, expect, it } from 'vitest';
import { unzipSync } from 'fflate';
import { GET } from '../routes/config/export/+server';
import sample from '../../tests/contracts/data-export.json';

const BACKEND = 'http://localhost:3001/api/v1';

// The backend's answer as the BFF gets it; it turns it into the ZIP of all data (#496)
async function exported(status = 200) {
	const calls: string[] = [];
	const fetch = async (url: string, init?: RequestInit) => (
		calls.push(`${init?.method ?? 'GET'} ${url}`),
		Response.json(status === 200 || init?.method ? sample : {}, {
			status: init?.method ? 201 : status
		})
	);
	const response = await (GET as (event: never) => Promise<Response>)({ fetch } as never);
	const zip = unzipSync(new Uint8Array(await response.arrayBuffer()));
	// keeps the byte order mark, which Excel reads UTF-8 by
	const text = (name: string) => new TextDecoder('utf-8', { ignoreBOM: true }).decode(zip[name]);
	return { calls, response, zip, text };
}

describe('GET /config/export', () => {
	it('lädt alle Daten als ZIP mit Datendatei, Tabellen und Belegen herunter und hält den Export danach im Protokoll fest', async () => {
		const { calls, response, zip } = await exported();

		expect(calls).toEqual([
			`GET ${BACKEND}/export?language=de`,
			`POST ${BACKEND}/audit-log/exports`
		]);
		expect(response.headers.get('Content-Type')).toBe('application/zip');
		expect(response.headers.get('Content-Disposition')).toBe(
			`attachment; filename="Dwello-Daten-2026-11-01.zip"; filename*=UTF-8''Dwello-Daten-2026-11-01.zip`
		);
		expect(Object.keys(zip).sort()).toEqual([
			'belege/2026-03-31 Hauswart Meier meier-q1.pdf',
			'daten.json',
			'tabellen/protokoll.csv',
			'tabellen/rechnungen.csv'
		]);
	});

	it('schreibt die Tabellen für Excel: UTF-8 mit Kennzeichen, Strichpunkte, Anführungszeichen um einen Strichpunkt', async () => {
		const { text } = await exported();

		expect(text('tabellen/rechnungen.csv').split('\r\n')).toEqual([
			'\ufeffID;Rechnungssteller;Beschreibung;Betrag',
			`i1;"Hauswart Meier; Winterthur";"'=HYPERLINK(""https://example.com"";""Details"")";-166.00`,
			''
		]);
	});

	it('nimmt einem Text, der mit einem Formelzeichen beginnt, die Formel, lässt aber einen negativen Betrag eine Zahl (Fachreview V-2)', async () => {
		const { text } = await exported();
		const [, row] = text('tabellen/rechnungen.csv').split('\r\n');

		expect(row).toContain(`"'=HYPERLINK(`);
		expect(row.endsWith(';-166.00')).toBe(true);
	});

	it('setzt den Eintrag des Protokolls in der Sprache der Oberfläche ein, wie die Seite «Protokoll» ihn zeigt', async () => {
		const { text } = await exported();

		expect(text('tabellen/protokoll.csv')).toContain(
			';Abrechnung NK-2025-0002 durch eine berichtigte Abrechnung ersetzt;'
		);
		expect(JSON.parse(text('daten.json')).auditLog[0].text).toBe(
			'Abrechnung NK-2025-0002 durch eine berichtigte Abrechnung ersetzt'
		);
	});

	it('hält keinen Export im Protokoll fest, wenn das Backend die Daten nicht liefert', async () => {
		const calls: string[] = [];
		const fetch = async (url: string, init?: RequestInit) => (
			calls.push(`${init?.method ?? 'GET'} ${url}`),
			Response.json({}, { status: 500 })
		);

		await expect(
			(GET as (event: never) => Promise<Response>)({ fetch } as never)
		).rejects.toMatchObject({ status: 500 });
		expect(calls).toEqual([`GET ${BACKEND}/export?language=de`]);
	});
});
