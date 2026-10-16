import { describe, it, expect } from 'vitest';
import {
	billedContracts,
	generateStatements,
	invoicesInPeriod,
	previewStatements
} from '../lib/server/statement-generation';
// Backend answers as checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
import buildingContracts from '../../tests/contracts/building-contracts.json';
import statementPreview from '../../tests/contracts/statement-preview.json';
import invoiceCompleteness from '../../tests/contracts/invoice-completeness.json';
import calculationRefused from '../../tests/contracts/statement-calculation-refused.json';

const API = 'http://localhost:3001/api/v1';
const period = {
	buildingIds: ['b1'],
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	heatingProfileId: 'hp1',
	managementFeePercent: 4.5
};

const contract = (id: string, startDate: string, endDate: string | null) => ({
	...buildingContracts.contracts[0],
	id,
	startDate,
	endDate,
	tenantName: `Mieter ${id}`,
	apartmentNumber: '2.01'
});

const contracts = [
	contract('vorher', '2020-01-01', '2023-12-31'),
	contract('auszug', '2020-01-01', '2024-03-31'),
	contract('einzug', '2024-05-01', null),
	contract('nachher', '2025-01-01', null)
];

function backend(statements: { contractId: string; periodStart: string; periodEnd: string }[] = [], inBuilding: object[] = contracts) {
	const posts: { url: string; body: Record<string, string> }[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		if (url === `${API}/statements?buildingId=b1&limit=1000`) return Response.json({ data: statements });
		if (url === `${API}/contracts?buildingId=b1&limit=1000`) {
			return Response.json({ contracts: inBuilding });
		}
		const body = JSON.parse(String(init?.body));
		posts.push({ url, body });
		if (url === `${API}/statements/preview`) {
			return Response.json({
				...statementPreview,
				totalCosts: body.contractId === 'auszug' ? 300 : 400,
				balance: -50
			});
		}
		return Response.json({ id: `s-${body.contractId}` }, { status: 201 });
	};
	return { posts, fetch: fetch as typeof globalThis.fetch };
}

describe('Schon abgerechnete Mietverträge je Gebäude', () => {
	it('zählt die Mietverträge der Periode und die mit einer Abrechnung darin, nach der Regel des Laufs', async () => {
		// two statements of one contract count once; a statement of an earlier period counts not
		const { fetch } = backend([
			{ contractId: 'einzug', periodStart: '2024-05-01', periodEnd: '2024-12-31' },
			{ contractId: 'einzug', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
			{ contractId: 'auszug', periodStart: '2023-01-01', periodEnd: '2023-12-31' }
		]);

		expect(await billedContracts(fetch, period)).toEqual([
			{ buildingId: 'b1', contracts: 2, billed: 1, withoutFee: [] }
		]);
	});

	it('zählt eine Abrechnung, die die Periode nur teilweise abdeckt, und keine, die vorher endet', async () => {
		// the period 01.10.2024–30.09.2025: a 2025 statement reaches into it, one ending 30.09.2024 not (#199)
		const { fetch } = backend([
			{ contractId: 'nachher', periodStart: '2025-01-01', periodEnd: '2025-12-31' },
			{ contractId: 'einzug', periodStart: '2023-10-01', periodEnd: '2024-09-30' }
		]);
		const shifted = { ...period, periodStart: '2024-10-01', periodEnd: '2025-09-30' };

		expect(await billedContracts(fetch, shifted)).toEqual([
			{ buildingId: 'b1', contracts: 2, billed: 1, withoutFee: [] }
		]);
	});
});

// #89: the run's rate applies only where the Verwaltungspauschale is agreed; step «Einstellungen» names the others
describe('Mietverträge ohne vereinbarte Verwaltungspauschale', () => {
	it('nennt die Mietverträge der Periode, die eine Abrechnung erhalten, ohne vereinbarte Pauschale', async () => {
		const { fetch } = backend(
			[{ contractId: 'einzug', periodStart: '2024-01-01', periodEnd: '2024-12-31' }],
			[
				{ ...contract('auszug', '2020-01-01', '2024-03-31'), managementFeeAgreed: false },
				// already billed: this run makes no statement for it
				{ ...contract('einzug', '2024-05-01', null), managementFeeAgreed: false },
				{ ...contract('vorher', '2020-01-01', '2023-12-31'), managementFeeAgreed: false },
				{ ...contract('eigen', '2024-01-01', null), managementFeePercent: '2.00' } as never
			]
		);

		expect((await billedContracts(fetch, period))[0].withoutFee).toEqual([
			{ id: 'auszug', tenantName: 'Mieter auszug', apartmentNumber: '2.01' }
		]);
	});
});

describe('Abrechnungen erstellen', () => {
	it('zeigt in der Vorschau jeden Mietvertrag, der in die Periode fällt', async () => {
		const { fetch } = backend();

		expect(await previewStatements(fetch, period)).toEqual([
			{
				contractId: 'auszug',
				tenantName: 'Mieter auszug',
				apartmentNumber: '2.01',
				totalCosts: 300,
				totalAdvancePayments: 1800,
				balance: -50,
				rentalDays: 366,
				totalPeriodDays: 366,
				movedOut: true
			},
			{
				contractId: 'einzug',
				tenantName: 'Mieter einzug',
				apartmentNumber: '2.01',
				totalCosts: 400,
				totalAdvancePayments: 1800,
				balance: -50,
				rentalDays: 366,
				totalPeriodDays: 366,
				movedOut: false
			}
		]);
	});

	// #133: bis «Abgerechnet bis» ausserhalb von Dwello abgerechnet; ohne Mietstage danach erhält er keine Abrechnung
	it('übergeht einen Mietvertrag, der in der Periode nach «Abgerechnet bis» keine Mietstage hat', async () => {
		const inBuilding = [
			{ ...contract('auszug', '2020-01-01', '2024-03-31'), billedUntil: '2024-03-31' },
			{ ...contract('einzug', '2024-05-01', null), billedUntil: '2023-12-31' }
		];
		const { fetch, posts } = backend([], inBuilding);

		expect(await generateStatements(fetch, period)).toBe(1);
		expect(posts.map((post) => post.body.contractId)).toEqual(['einzug']);
		expect(await billedContracts(fetch, period)).toEqual([
			{ buildingId: 'b1', contracts: 1, billed: 0, withoutFee: [] }
		]);
	});

	// Abrechnung 2024 im Jahr 2026 erstellt, Auszug im März 2025: der Mieter ist schon weg, eine Akonto-Erhöhung nützt nichts
	it('zählt einen Mieter, der bis heute ausgezogen ist, als ausgezogen', async () => {
		const { fetch } = backend([], [contract('spaeter', '2020-01-01', '2025-03-31'), contract('bleibt', '2020-01-01', '2099-12-31')]);

		expect((await previewStatements(fetch, period)).map((row) => [row.contractId, row.movedOut])).toEqual([
			['spaeter', true],
			['bleibt', false]
		]);
	});

	it('berechnet die Vorschau mit Periode, Heizprofil und Verwaltungspauschale', async () => {
		const { fetch, posts } = backend();
		await previewStatements(fetch, period);

		expect(posts[0]).toEqual({
			url: `${API}/statements/preview`,
			body: {
				contractId: 'auszug',
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId: 'hp1',
				managementFeePercent: 4.5
			}
		});
	});

	it('erstellt für jeden Mietvertrag der Periode eine Abrechnung', async () => {
		const { fetch, posts } = backend();

		expect(await generateStatements(fetch, period)).toBe(2);
		expect(posts.map((post) => post.url)).toEqual([
			`${API}/statements/generate`,
			`${API}/statements/generate`
		]);
		expect(posts[1].body).toEqual({
			contractId: 'einzug',
			buildingId: 'b1',
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			heatingProfileId: 'hp1',
			managementFeePercent: 4.5
		});
	});

	// Erneut erstellen ergänzt nur: die Abrechnung eines Mietvertrags wird nicht verdoppelt
	it('übergeht Mietverträge, die in der Periode schon eine Abrechnung haben', async () => {
		const { fetch, posts } = backend([
			{ contractId: 'auszug', periodStart: '2024-01-01', periodEnd: '2024-12-31' },
			{ contractId: 'einzug', periodStart: '2023-01-01', periodEnd: '2023-12-31' } // other period
		]);

		expect((await previewStatements(fetch, period)).map((row) => row.contractId)).toEqual([
			'einzug'
		]);
		expect(await generateStatements(fetch, period)).toBe(1);
		expect(posts.map((post) => post.body.contractId)).toEqual(['einzug', 'einzug']);
	});

	it('meldet in Worten, wenn das Backend die Berechnung ablehnt', async () => {
		const fetch = (async (url: string) =>
			url.includes('contracts')
				? Response.json({ contracts: [contract('auszug', '2020-01-01', null)] })
				: Response.json(calculationRefused, { status: 400 })) as typeof globalThis.fetch;

		await expect(previewStatements(fetch, period)).rejects.toThrow(
			'Die Abrechnung konnte nicht berechnet werden. Versuchen Sie es später erneut.'
		);
	});
});

describe('Rechnungen der Abrechnungsperiode', () => {
	// The statement counts the utility invoices of the building dated in the period
	it('zählt pro Gebäude die umlagefähigen Rechnungen und die schon erstellten Abrechnungen der Periode', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			if (url.includes('/statements?'))
				return Response.json({
					data: url.includes('b2')
						? [
								{ periodStart: '2024-01-01', periodEnd: '2024-12-31' },
								{ periodStart: '2023-07-01', periodEnd: '2024-06-30' }, // overlaps
								{ periodStart: '2023-01-01', periodEnd: '2023-12-31' } // before the period
							]
						: []
				});
			if (url.includes('/invoices/completeness/'))
				return Response.json({ ...invoiceCompleteness, buildingId: url.includes('b1') ? 'b1' : 'b2' });
			const invoices = url.includes('/for-statement/b1')
				? [{ invoiceDate: '2024-06-30' }, { invoiceDate: '2024-01-15' }]
				: [];
			return Response.json(invoices);
		}) as typeof globalThis.fetch;

		expect(await invoicesInPeriod(fetch, { ...period, buildingIds: ['b1', 'b2'] })).toEqual([
			{ buildingId: 'b1', count: 2, first: '2024-01-15', last: '2024-06-30', statements: 0, check: { ...invoiceCompleteness, buildingId: 'b1' } },
			{ buildingId: 'b2', count: 0, first: null, last: null, statements: 2, check: { ...invoiceCompleteness, buildingId: 'b2' } }
		]);
		// each category compared with the same dates one year earlier
		expect(urls).toContain(`${API}/invoices/completeness/b1?periodStart=2024-01-01&periodEnd=2024-12-31`);
		// statements of the building whose period overlaps the chosen one
		expect(urls).toContain(`${API}/statements?buildingId=b2&limit=1000`);
		// the invoices the statement takes: by Leistungszeitraum, otherwise by Rechnungsdatum
		expect(urls[0]).toBe(`${API}/invoices/for-statement/b1?periodStart=2024-01-01&periodEnd=2024-12-31`);
	});

	// Die Rechnung vom Januar 2025 für das 4. Quartal 2024 deckt das Ende der Periode ab, nicht den Januar
	it('nimmt für den Zeitraum der Rechnungen den Leistungszeitraum in der Periode', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('/for-statement/')
					? [
							{ invoiceDate: '2024-03-31', servicePeriodEnd: null, inPeriod: { start: '2024-01-01', end: '2024-12-31' } },
							{ invoiceDate: '2025-01-20', servicePeriodEnd: '2024-12-31', inPeriod: { start: '2024-10-01', end: '2024-12-31' } }
						]
					: url.includes('/statements?')
						? { data: [] }
						: invoiceCompleteness
			)) as typeof globalThis.fetch;

		expect(await invoicesInPeriod(fetch, period)).toMatchObject([{ count: 2, first: '2024-03-31', last: '2024-12-31' }]);
	});

	// Without the check per category the preview still shows; the look at start and end of the period stays
	it('zeigt die Rechnungen auch, wenn die Prüfung pro Kategorie scheitert', async () => {
		const fetch = (async (url: string) =>
			url.includes('/invoices/completeness/')
				? Response.json({ error: 'kaputt' }, { status: 500 })
				: url.includes('/for-statement/')
					? Response.json([])
					: Response.json({ data: [], total: 0 })) as typeof globalThis.fetch;

		expect(await invoicesInPeriod(fetch, period)).toEqual([
			{ buildingId: 'b1', count: 0, first: null, last: null, statements: 0, check: undefined }
		]);
	});
});
