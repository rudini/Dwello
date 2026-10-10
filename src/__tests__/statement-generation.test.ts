import { describe, it, expect } from 'vitest';
import {
	generateStatements,
	invoicesInPeriod,
	previewStatements
} from '../lib/server/statement-generation';
// Backend answers as checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
import buildingContracts from '../../tests/contracts/building-contracts.json';
import statementPreview from '../../tests/contracts/statement-preview.json';
import invoiceCompleteness from '../../tests/contracts/invoice-completeness.json';

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

function backend() {
	const posts: { url: string; body: Record<string, string> }[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		if (url === `${API}/contracts?buildingId=b1&limit=1000`) {
			return Response.json({
				contracts: [
					contract('vorher', '2020-01-01', '2023-12-31'),
					contract('auszug', '2020-01-01', '2024-03-31'),
					contract('einzug', '2024-05-01', null),
					contract('nachher', '2025-01-01', null)
				]
			});
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
				balance: -50
			},
			{
				contractId: 'einzug',
				tenantName: 'Mieter einzug',
				apartmentNumber: '2.01',
				totalCosts: 400,
				totalAdvancePayments: 1800,
				balance: -50
			}
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

	it('verteilt die Verwaltungspauschale nach dem gewählten Verteilschlüssel', async () => {
		const { fetch, posts } = backend();
		const byArea = { ...period, managementFeeDistributionKeyId: 'k-area' };
		await previewStatements(fetch, byArea);
		await generateStatements(fetch, byArea);

		expect(posts.map((post) => post.body.managementFeeDistributionKeyId)).toEqual([
			'k-area',
			'k-area',
			'k-area',
			'k-area'
		]);
	});

	it('meldet einen Fehler, wenn das Backend die Berechnung ablehnt', async () => {
		const fetch = (async (url: string) =>
			url.includes('contracts')
				? Response.json({ contracts: [contract('auszug', '2020-01-01', null)] })
				: Response.json(
						{ error: 'Calculation failed' },
						{ status: 400 }
					)) as typeof globalThis.fetch;

		await expect(previewStatements(fetch, period)).rejects.toThrow('Calculation failed');
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
			const invoices = url.includes('buildingId=b1')
				? [{ invoiceDate: '2024-06-30' }, { invoiceDate: '2024-01-15' }]
				: [];
			return Response.json({ invoices, total: invoices.length });
		}) as typeof globalThis.fetch;

		expect(await invoicesInPeriod(fetch, { ...period, buildingIds: ['b1', 'b2'] })).toEqual([
			{ buildingId: 'b1', count: 2, first: '2024-01-15', last: '2024-06-30', statements: 0, check: { ...invoiceCompleteness, buildingId: 'b1' } },
			{ buildingId: 'b2', count: 0, first: null, last: null, statements: 2, check: { ...invoiceCompleteness, buildingId: 'b2' } }
		]);
		// each category compared with the same dates one year earlier
		expect(urls).toContain(`${API}/invoices/completeness/b1?periodStart=2024-01-01&periodEnd=2024-12-31`);
		// statements of the building whose period overlaps the chosen one
		expect(urls).toContain(`${API}/statements?buildingId=b2&limit=1000`);
		expect(urls[0]).toBe(
			`${API}/invoices?buildingId=b1&dateFrom=2024-01-01&dateTo=2024-12-31&isValidUtilityCost=true&limit=1000`
		);
	});
});
