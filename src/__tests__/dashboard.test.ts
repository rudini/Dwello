import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from '../routes/dashboard/+page.server';

const API = 'http://localhost:3001/api/v1';
const figures = {
	portfolio: { totalBuildings: 1, totalApartments: 2, occupiedApartments: 1, reletApartments: 0 },
	statements: { draft: 1, sent: 1, paid: 0, overdue: 1 },
	buildingOccupancy: [
		{ buildingId: 'b1', buildingName: 'Seeblick', occupiedApartments: 1 },
		{ buildingId: 'b2', buildingName: 'Lindenhof', occupiedApartments: 2 },
		{ buildingId: 'b3', buildingName: 'Leerbau', occupiedApartments: 0 }
	]
};
const both = [{ building: { id: 'b1' } }, { building: { id: 'b2' } }];

// The backend as the overview reads it: counts, plus the lists that carry dates
function backend(dashboardStatus = 200, statementsOfLastPeriod: unknown[] = both) {
	return (async (url: string) => {
		const path = url.replace(API, '');
		if (path === '/dashboard') return Response.json(figures, { status: dashboardStatus });
		if (path === '/config') return Response.json({ data: { accounting_period: 'july-june' } });
		if (path === '/statements?periodStart=2025-07-01&periodEnd=2026-06-30&limit=1000')
			return Response.json({ data: statementsOfLastPeriod, total: statementsOfLastPeriod.length });
		if (path.startsWith('/statements?status=overdue'))
			return Response.json({
				data: [
					{
						id: 's1',
						paymentDeadline: '2026-10-05',
						tenant: { firstName: 'Anna', lastName: 'Keller' }
					}
				]
			});
		if (path.startsWith('/statements?status=sent'))
			return Response.json({
				data: [
					{
						id: 's2',
						paymentDeadline: '2026-10-20',
						tenant: { firstName: 'Bruno', lastName: 'Meier' }
					}
				]
			});
		if (path === '/documents?status=to_send')
			return Response.json({ data: [{ id: 'd1' }, { id: 'd2' }] });
		if (path.startsWith('/contracts?status=active'))
			return Response.json({
				contracts: [
					{ id: 'c1', tenantName: 'Eva Frei', endDate: '2026-11-01' },
					{ id: 'c2', tenantName: 'Ueli Graf', endDate: null }
				]
			});
		if (path === '/apartments?limit=1000')
			return Response.json({
				apartments: [
					{ buildingId: 'b1', status: 'relet', nextContractStart: '2026-12-01' },
					{ buildingId: 'b1', status: 'relet', nextContractStart: '2026-11-01' },
					{ buildingId: 'b1', status: 'occupied', nextContractStart: null },
					{ buildingId: 'b2', status: 'vacant', nextContractStart: null }
				]
			});
		throw new Error(`unexpected ${url}`);
	}) as typeof globalThis.fetch;
}

describe('Übersicht laden', () => {
	afterEach(() => vi.useRealTimers());

	it('liefert die Kennzahlen und daraus die Aufgaben und Fristen von heute', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({ fetch: backend() } as never);

		expect(data.portfolio).toEqual(figures.portfolio);
		expect(data.tasks.map((task) => task.id)).toEqual(['overdue', 'letters', 'drafts']);
		expect(data.tasks[1].text).toContain('2 Briefe sind');
		expect(data.deadlines.map((d) => [d.kind, d.name, d.when])).toEqual([
			['Zahlungsfrist', 'Anna Keller', 'seit 5 Tagen abgelaufen'],
			['Zahlungsfrist', 'Bruno Meier', 'in 10 Tagen'],
			['Vertragsende', 'Eva Frei', 'in 22 Tagen']
		]);
	});

	it('erinnert an die abgelaufene Abrechnungsperiode, für die es noch keine Abrechnung gibt', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({ fetch: backend(200, []) } as never);

		expect(data.tasks.map((task) => task.id)).toEqual([
			'overdue',
			'letters',
			'missing-period',
			'drafts'
		]);
		expect(data.tasks[2].text).toContain('1.7.2025 – 30.6.2026');
		expect(data.tasks[2].text).toContain('Seeblick, Lindenhof');
	});

	// A building without rented apartments gets no statement
	it('nennt nur die vermieteten Gebäude, deren Abrechnungen noch fehlen', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({ fetch: backend(200, [{ building: { id: 'b1' } }]) } as never);
		const task = data.tasks.find((t) => t.id === 'missing-period')!;
		expect(task.text).toContain('Lindenhof');
		expect(task.text).not.toContain('Seeblick');
		expect(task.text).not.toContain('Leerbau');
	});

	// The building cards count them too; the overview names when they will be rented
	it('nennt pro Gebäude den Vertragsbeginn der wiedervermieteten Wohnungen', async () => {
		const data = await load({ fetch: backend() } as never);

		expect(data.buildingOccupancy.map((b) => b.reletStarts)).toEqual([
			['2026-11-01', '2026-12-01'],
			[],
			[]
		]);
	});

	it('zeigt die Kennzahlen auch, wenn eine Liste nicht erreichbar ist', async () => {
		const answer = backend();
		const fetch = (async (url: string) => {
			if (!url.endsWith('/dashboard')) throw new TypeError('fetch failed');
			return answer(url);
		}) as typeof globalThis.fetch;
		const data = await load({ fetch } as never);

		expect(data.portfolio).toEqual(figures.portfolio);
		expect(data.tasks.map((task) => task.id)).toEqual(['overdue', 'drafts']);
		expect(data.deadlines).toEqual([]);
	});

	// Zeros would look like an empty portfolio
	it('zeigt einen Fehler statt leerer Kennzahlen, wenn das Backend nicht antwortet', async () => {
		await expect(load({ fetch: backend(500) } as never)).rejects.toMatchObject({
			status: 500,
			body: { message: 'Übersicht konnte nicht geladen werden' }
		});
	});
});
