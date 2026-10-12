import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/statements/generate/+page.server';
import periodStatements from '../../tests/contracts/period-statements.json';

const run = {
	buildingIds: 'b1',
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	heatingProfileId: 'hp1',
	managementFeePercent: '3'
};

describe('Vorschau der Abrechnungen', () => {
	it('liefert neben der Vorschau die Rechnungen jedes Gebäudes in der Periode', async () => {
		// a building without contracts and invoices: every list answers empty
		const form = new FormData();
		for (const [name, value] of Object.entries(run)) form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const fetch = async (url: string) =>
			Response.json(url.includes('/for-statement/') ? [] : { contracts: [], data: [], total: 0 });
		const result = (actions.preview as (event: unknown) => Promise<unknown>)({ fetch, request });
		expect(await result).toEqual({
			preview: [],
			invoices: [
				{
					buildingId: 'b1',
					count: 0,
					first: null,
					last: null,
					statements: 0,
					check: expect.anything()
				}
			]
		});
	});
});

// A-10: ein Link vom Mietvertrag oder aus einer Ablehnung wählt Gebäude und Periode; Heizprofil und
// Verwaltungspauschale kommen von den übrigen Abrechnungen dieses Gebäudes in dieser Periode
// Review K-5: das Backend antwortet mit Klartext statt JSON; die Seite nennt den Fehler in der UI-Sprache
describe('Vorschau bei einem Fehler des Backends ohne JSON', () => {
	it('meldet den Fehler, nicht «is not valid JSON»', async () => {
		const form = new FormData();
		for (const [name, value] of Object.entries(run)) form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const fetch = async () => new Response('Failed query: select …', { status: 500 });
		const result = (await (actions.preview as (event: unknown) => Promise<unknown>)({
			fetch,
			request
		})) as { data: { error: string } };
		expect(result.data.error).not.toContain('JSON');
		expect(result.data.error).toContain('500');
	});
});

describe('Assistent mit gewähltem Gebäude und gewählter Periode', () => {
	const urls: string[] = [];
	const fetch = async (url: string) => {
		urls.push(url);
		if (url.includes('/config'))
			return Response.json({
				data: { management_fee_pct: '3', default_heating_profile_id: 'hp1' }
			});
		if (url.includes('/statements?'))
			return Response.json({
				data: [
					{ ...periodStatements.data[0], heatingProfileId: 'hp9', managementFeePercent: '2.50' }
				]
			});
		return Response.json({ buildings: [{ id: 'b1', name: 'Lindenhof' }], data: [] });
	};
	const open = (query: string) =>
		load({ fetch, url: new URL(`http://localhost/statements/generate${query}`) } as never);

	it('übernimmt Gebäude, Periode, Heizprofil und Verwaltungspauschale', async () => {
		expect(await open('?building=b1&start=2025-01-01&end=2025-12-31')).toMatchObject({
			defaultPeriod: { start: '2025-01-01', end: '2025-12-31' },
			defaultBuildingIds: ['b1'],
			defaultHeatingProfileId: 'hp9',
			defaultManagementFeePercent: 2.5,
			// personas K1: der Assistent sagt, was gewählt ist und woher Heizprofil und Pauschale kommen
			preset: {
				building: 'Lindenhof',
				start: '2025-01-01',
				end: '2025-12-31',
				fromStatements: true
			}
		});
		expect(urls).toContainEqual(
			expect.stringContaining(
				'/statements?buildingId=b1&periodStart=2025-01-01&periodEnd=2025-12-31'
			)
		);
	});

	// Review K-5: ein abgeschnittener Link oder ein gelöschtes Gebäude führt zum Anfang, nicht zu einem Fehler
	it.each([
		['?building=b9&start=2025-01-01&end=2025-12-31'],
		['?building=b1&start=2025-02-30&end=2025-12-31'],
		['?building=b1&start=2025-13-01&end=2025-12-31'],
		['?building=b1&start=2025-12-31&end=2025-01-01']
	])('übernimmt keinen ungültigen Link %s', async (query) => {
		expect(await open(query)).toMatchObject({ defaultBuildingIds: [], preset: null });
	});

	it('nimmt ohne Auswahl die Einstellungen', async () => {
		expect(await open('')).toMatchObject({
			defaultBuildingIds: [],
			defaultHeatingProfileId: 'hp1',
			defaultManagementFeePercent: 3
		});
	});
});
