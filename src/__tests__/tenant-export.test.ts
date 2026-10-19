import { describe, expect, it } from 'vitest';
import { unzipSync } from 'fflate';
import { GET } from '../routes/tenants/[id]/export/+server';
import sample from '../../tests/contracts/tenant-export.json';

// The backend's answer as the BFF gets it; it turns it into the ZIP the landlord downloads (#435)
async function exported(status = 200) {
	const calls: string[] = [];
	const fetch = async (url: string) => (
		calls.push(url),
		Response.json(status === 200 ? sample : {}, { status })
	);
	const response = await (GET as (event: never) => Promise<Response>)({
		params: { id: 't1' },
		fetch
	} as never);
	return { calls, response };
}

describe('GET /tenants/[id]/export', () => {
	it('lädt die Daten des Mieters als ZIP mit der Datendatei und seinen Dateien herunter', async () => {
		const { calls, response } = await exported();

		expect(calls).toEqual(['http://localhost:3001/api/v1/tenants/t1/export']);
		expect(response.headers.get('Content-Type')).toBe('application/zip');
		const zip = unzipSync(new Uint8Array(await response.arrayBuffer()));
		expect(Object.keys(zip).sort()).toEqual([
			'daten.json',
			'dokumente/2026-10-19 Übergabeprotokoll.pdf'
		]);
		expect(JSON.parse(new TextDecoder().decode(zip['daten.json']))).toEqual(sample.data);
		expect(new TextDecoder().decode(zip['dokumente/2026-10-19 Übergabeprotokoll.pdf'])).toBe(
			'%PDF-1.4\n'
		);
	});

	it('nennt die Datei nach dem Mieter, mit Umlaut und einem Ersatz für alte Browser', async () => {
		const { response } = await exported();

		expect(response.headers.get('Content-Disposition')).toBe(
			`attachment; filename="Daten-Muller-Hans.zip"; filename*=UTF-8''Daten-M%C3%BCller-Hans.zip`
		);
	});

	it('führt bei einem unbekannten Mieter zur Seite «Nicht gefunden» statt zu einer leeren Datei', async () => {
		await expect(exported(404)).rejects.toMatchObject({ status: 404 });
	});
});
