import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/statements/generate/+page.server';
import periodStatements from '../../tests/contracts/period-statements.json';
import buildingContracts from '../../tests/contracts/building-contracts.json';

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
					check: expect.anything(),
					changed: [],
					fixedTerm: false
				}
			]
		});
	});

	// #199, #408 point 2: a period that overlaps a statement period of the building without being equal is refused
	it('lehnt die Vorschau ab, wenn die Periode eine bestehende des Gebäudes schneidet', async () => {
		const form = new FormData();
		for (const [name, value] of Object.entries({
			...run,
			periodStart: '2024-07-01',
			periodEnd: '2025-06-30'
		}))
			form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		// moved in on 01.05.2024, billed for 2024: 01.07.2024–30.06.2025 overlaps that period
		const contract = {
			...buildingContracts.contracts[0],
			startDate: '2024-05-01',
			endDate: null
		};
		const statement = periodStatements.data[0];
		const fetch = async (url: string) =>
			Response.json(
				url.includes('/for-statement/')
					? []
					: { ...periodStatements, contracts: [contract], data: [statement] }
			);
		const result = (await (actions.preview as (event: unknown) => Promise<unknown>)({
			fetch,
			request
		})) as { status: number; data: { error: string } };
		expect(result.status).toBe(400);
		expect(result.data.error).toContain('Die gewählte Abrechnungsperiode überschneidet sich');
	});

	// #76: neue Nebenkosten gelten für das ganze Gebäude; ein laufender befristeter Mietvertrag darin ändert den Hinweis
	it('sagt pro Gebäude, ob ein laufender befristeter Mietvertrag abgerechnet wird', async () => {
		const form = new FormData();
		for (const [name, value] of Object.entries(run)) form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const befristet = { ...buildingContracts.contracts[0], startDate: '2020-01-01', endDate: '2099-12-31' };
		const fetch = async (url: string) =>
			Response.json(url.includes('/for-statement/') ? [] : { contracts: [befristet], data: [], total: 0 });
		const result = (await (actions.preview as (event: unknown) => Promise<unknown>)({
			fetch,
			request
		})) as { invoices: { fixedTerm: boolean }[] };
		expect(result.invoices.map((row) => row.fixedTerm)).toEqual([true]);
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
		// the statement's contract has the fee agreed at the run's rate (#89)
		if (url.includes('/contracts?'))
			return Response.json({ contracts: [{ ...buildingContracts.contracts[0], id: 'c1' }] });
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

	const contract = (id: string, managementFeeAgreed: boolean, managementFeePercent: string | null) => ({
		...buildingContracts.contracts[0],
		id,
		managementFeeAgreed,
		managementFeePercent
	});
	const statement = (
		contractId: string,
		managementFeePercent: string,
		heatingProfileId: string | null = 'hp9'
	) => ({
		...periodStatements.data[0],
		contractId,
		heatingProfileId,
		managementFeePercent
	});
	const openWith = (statements: unknown[]) =>
		load({
			fetch: async (url: string) => {
				if (url.includes('/config'))
					return Response.json({
						data: { management_fee_pct: '3', default_heating_profile_id: 'hp1' }
					});
				if (url.includes('/contracts?'))
					return Response.json({
						contracts: [
							contract('nein', false, null),
							contract('eigen', true, '2.00'),
							contract('lauf', true, null),
							contract('lauf2', true, null)
						]
					});
				if (url.includes('/statements?')) return Response.json({ data: statements });
				return Response.json({ buildings: [{ id: 'b1', name: 'Lindenhof' }], data: [] });
			},
			url: new URL('http://localhost/statements/generate?building=b1&start=2025-01-01&end=2025-12-31')
		} as never);

	// #119: verschieden eingestellte übrige Abrechnungen geben keine Vorlage; beides kommt aus den Einstellungen
	it('nimmt die Einstellungen, wenn die übrigen Abrechnungen verschiedene Heizprofile haben', async () => {
		expect(
			await openWith([statement('lauf', '4.50', 'hp8'), statement('lauf2', '4.50', 'hp9')])
		).toMatchObject({
			defaultHeatingProfileId: 'hp1',
			defaultManagementFeePercent: 3,
			preset: { differing: true }
		});
	});

	it('nimmt die Einstellungen, wenn die übrigen Abrechnungen zum Satz des Laufs verschiedene Sätze haben', async () => {
		expect(await openWith([statement('lauf', '4.50'), statement('lauf2', '2.50')])).toMatchObject({
			defaultHeatingProfileId: 'hp1',
			defaultManagementFeePercent: 3,
			preset: { differing: true }
		});
	});

	// fach-review V-5: a statement whose Heizprofil was deleted has none; it differs from no other
	it('übergeht eine übrige Abrechnung ohne Heizprofil', async () => {
		expect(
			await openWith([statement('lauf', '4.50', null), statement('lauf2', '4.50')])
		).toMatchObject({ defaultHeatingProfileId: 'hp9', preset: { differing: false } });
	});

	it('übernimmt gleich eingestellte übrige Abrechnungen', async () => {
		expect(await openWith([statement('lauf', '4.50'), statement('lauf2', '4.50')])).toMatchObject({
			defaultHeatingProfileId: 'hp9',
			defaultManagementFeePercent: 4.5,
			preset: { differing: false, fromStatements: true, feeFromSettings: false }
		});
	});

	// #89, fach-review V-1: a statement stores its contract's rate; only one at the run's rate tells the run's rate
	it('übernimmt den Satz nur von einer Abrechnung zum Satz des Abrechnungslaufs', async () => {
		const mixed = [
			statement('nein', '0.00'),
			statement('eigen', '2.00'),
			statement('lauf', '4.50')
		];
		expect(await openWith(mixed)).toMatchObject({
			defaultManagementFeePercent: 4.5,
			preset: { fromStatements: true, feeFromSettings: false }
		});
		// none at the run's rate: the settings' rate; the heating profile still comes from the other statements, so
		// a recreated statement shares it (A-10, closing review C-1), and the notice says where each comes from
		expect(await openWith(mixed.slice(0, 2))).toMatchObject({
			defaultManagementFeePercent: 3,
			defaultHeatingProfileId: 'hp9',
			preset: { fromStatements: true, feeFromSettings: true }
		});
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
