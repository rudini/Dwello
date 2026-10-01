import { describe, it, expect } from 'vitest';
import { generateStatements, previewStatements } from '../lib/server/statement-generation';

const API = 'http://localhost:3001/api/v1';
const period = {
	buildingIds: ['b1'],
	periodStart: '2024-01-01',
	periodEnd: '2024-12-31',
	heatingProfileId: 'hp1'
};

const contract = (id: string, startDate: string, endDate: string | null) => ({
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
			return Response.json({ totalCosts: body.contractId === 'auszug' ? 300 : 400, balance: -50 });
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
				balance: -50
			},
			{
				contractId: 'einzug',
				tenantName: 'Mieter einzug',
				apartmentNumber: '2.01',
				totalCosts: 400,
				balance: -50
			}
		]);
	});

	it('berechnet die Vorschau mit Periode und Heizprofil', async () => {
		const { fetch, posts } = backend();
		await previewStatements(fetch, period);

		expect(posts[0]).toEqual({
			url: `${API}/statements/preview`,
			body: {
				contractId: 'auszug',
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				heatingProfileId: 'hp1'
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
			heatingProfileId: 'hp1'
		});
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
