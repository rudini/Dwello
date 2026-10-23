import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/statements/generate/+page.server';
import periodStatements from '../../tests/contracts/period-statements.json';
import buildingContracts from '../../tests/contracts/building-contracts.json';
import statementRun from '../../tests/contracts/statement-run.json';
import runDefaults from '../../tests/contracts/statement-run-defaults.json';

// The backend's plan of the run (H-28): these contracts with Mietstage in the period, billed or not
const plan = (contracts: object[], more: object = {}) =>
	Response.json({
		contracts: contracts.map((c) => ({ billed: false, ...c })),
		overlap: null,
		skipped: [],
		...more
	});

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
			url.includes('/statements/run?')
				? plan([])
				: Response.json(
						url.includes('/for-statement/') ? [] : { contracts: [], data: [], total: 0 }
					);
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
					fixedTerm: false,
					uncategorized: []
				}
			]
		});
	});

	// #199, #408 point 2: a period that overlaps a statement period of the building without being equal is refused; the
	// backend finds the overlap (statement-run.test.ts)
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
			url.includes('/statements/run?')
				? plan([{ ...contract, billed: true }], { overlap: statementRun.overlap })
				: Response.json(
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

	// #453 (#327): a contract «Abgerechnet bis» covers in full is named; its building has its own text when all are
	it('nennt pro Gebäude die Mietverträge, die «Abgerechnet bis» in der Periode ganz abdeckt', async () => {
		const form = new FormData();
		for (const [name, value] of Object.entries(run)) form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const covered = { ...buildingContracts.contracts[0], startDate: '2020-01-01', endDate: null, billedUntil: '2024-12-31' };
		const skipped = [{ id: covered.id, tenantName: covered.tenantName, billedUntil: '2024-12-31' }];
		const fetch = async (url: string) =>
			url.includes('/statements/run?')
				? plan([], { skipped })
				: Response.json(
						url.includes('/for-statement/') ? [] : { contracts: [covered], data: [], total: 0 }
					);
		const result = (await (actions.preview as (event: unknown) => Promise<unknown>)({
			fetch,
			request
		})) as {
			invoices: { skipped?: unknown[]; allSkipped?: boolean }[];
		};
		expect(result.invoices[0]).toMatchObject({
			skipped,
			allSkipped: true
		});
	});

	// fach review 453-1 V-1: one contract has a Dwello statement of the period, the other is billed outside Dwello
	it('sagt nicht, alle seien ausserhalb von Dwello abgerechnet, wenn einer eine Abrechnung in Dwello hat', async () => {
		const form = new FormData();
		for (const [name, value] of Object.entries(run)) form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const covered = { ...buildingContracts.contracts[0], id: 'eva', startDate: '2020-01-01', endDate: '2024-03-31', billedUntil: '2024-12-31' };
		const billed = { ...buildingContracts.contracts[0], id: 'marc', startDate: '2024-05-01', endDate: null };
		const statement = { ...periodStatements.data[0], contractId: 'marc', periodStart: '2024-01-01', periodEnd: '2024-12-31' };
		const fetch = async (url: string) =>
			url.includes('/statements/run?')
				? plan([{ ...billed, billed: true }], {
						skipped: [{ id: 'eva', tenantName: covered.tenantName, billedUntil: '2024-12-31' }]
					})
				: Response.json(
						url.includes('/for-statement/')
							? []
							: { contracts: [covered, billed], data: [statement], total: 1 }
					);
		const result = (await (actions.preview as (event: unknown) => Promise<unknown>)({
			fetch,
			request
		})) as {
			invoices: { skipped?: { id: string }[]; allSkipped?: boolean }[];
		};
		expect(result.invoices[0].skipped!.map((c) => c.id)).toEqual(['eva']);
		expect(result.invoices[0].allSkipped).toBe(false);
	});

	// #76: neue Nebenkosten gelten für das ganze Gebäude; ein laufender befristeter Mietvertrag darin ändert den Hinweis
	it('sagt pro Gebäude, ob ein laufender befristeter Mietvertrag abgerechnet wird', async () => {
		const form = new FormData();
		for (const [name, value] of Object.entries(run)) form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const befristet = { ...buildingContracts.contracts[0], startDate: '2020-01-01', endDate: '2099-12-31' };
		const fetch = async (url: string) =>
			url.includes('/statements/run?')
				? plan([befristet])
				: Response.json(
						url.includes('/for-statement/') ? [] : { contracts: [befristet], data: [], total: 0 }
					);
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

// H-28: the backend decides the defaults (backend/src/__tests__/statement-run.test.ts); without them the page is not
// shown with invented ones
describe('Vorgaben des Assistenten aus dem Backend', () => {
	const opened = (defaults: Response, query = '') =>
		load({
			fetch: async (url: string) =>
				url.includes('/statements/run-defaults')
					? defaults
					: Response.json({ buildings: [{ id: 'b1', name: 'Lindenhof' }], data: [] }),
			url: new URL(`http://localhost/statements/generate${query}`)
		} as never);

	it('meldet einen Fehler, wenn das Backend die Vorgaben nicht liefert', async () => {
		await expect(opened(new Response(null, { status: 503 }))).rejects.toMatchObject({
			status: 503
		});
	});

	// A-10, personas K1: the wizard says what the link chose and where Heizprofil and Pauschale come from
	it('übernimmt Gebäude, Periode, Heizprofil und Verwaltungspauschale eines Links vom Backend', async () => {
		const urls: string[] = [];
		const data = await load({
			fetch: async (url: string) => {
				urls.push(url);
				return url.includes('/statements/run-defaults')
					? Response.json(runDefaults)
					: Response.json({ buildings: [{ id: 'b1', name: 'Lindenhof' }], data: [] });
			},
			url: new URL(
				'http://localhost/statements/generate?building=b1&start=2024-01-01&end=2024-12-31'
			)
		} as never);

		expect(urls).toContain(
			'http://localhost:3001/api/v1/statements/run-defaults?buildingId=b1&periodStart=2024-01-01&periodEnd=2024-12-31'
		);
		expect(data).toMatchObject({
			defaultPeriod: runDefaults.period,
			defaultBuildingIds: ['b1'],
			defaultHeatingProfileId: runDefaults.heatingProfileId,
			defaultManagementFeePercent: runDefaults.managementFeePercent,
			preset: { building: 'Lindenhof', ...runDefaults.period, ...runDefaults.preset }
		});
	});

	// Review K-5: a cut link or a deleted building leads to the beginning, not to an error
	it('fragt ohne Link nach den Vorgaben, wenn das Gebäude des Links unbekannt ist', async () => {
		const urls: string[] = [];
		const data = await load({
			fetch: async (url: string) => {
				urls.push(url);
				return url.includes('/statements/run-defaults')
					? Response.json({
							...runDefaults,
							buildingId: null,
							heatingProfileId: null,
							preset: null
						})
					: Response.json({ buildings: [{ id: 'b1', name: 'Lindenhof' }], data: [] });
			},
			url: new URL(
				'http://localhost/statements/generate?building=b9&start=2024-01-01&end=2024-12-31'
			)
		} as never);

		expect(urls).toContain('http://localhost:3001/api/v1/statements/run-defaults');
		expect(data).toMatchObject({
			defaultBuildingIds: [],
			defaultHeatingProfileId: '',
			preset: null
		});
	});
});

