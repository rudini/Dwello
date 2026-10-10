import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from '../routes/dashboard/+page.server';

const API = 'http://localhost:3001/api/v1';
const figures = {
	portfolio: { totalBuildings: 1, totalApartments: 2, occupiedApartments: 1, reletApartments: 0 },
	statements: { draft: 1, sent: 1, paid: 0, overdue: 1 }
};

// The backend as the overview reads it: counts, plus the lists that carry dates
function backend(dashboardStatus = 200) {
	return (async (url: string) => {
		const path = url.replace(API, '');
		if (path === '/dashboard') return Response.json(figures, { status: dashboardStatus });
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

	// Zeros would look like an empty portfolio
	it('zeigt einen Fehler statt leerer Kennzahlen, wenn das Backend nicht antwortet', async () => {
		await expect(load({ fetch: backend(500) } as never)).rejects.toMatchObject({
			status: 500,
			body: { message: 'Übersicht konnte nicht geladen werden' }
		});
	});
});
