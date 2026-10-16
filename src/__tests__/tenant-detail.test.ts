import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/tenants/[id]/+page.server';
import { toContractHistory } from '../lib/server/contract-history';
import { runAction } from './helpers/action';
import tenant from '../../tests/contracts/tenant.json';
import tenantList from '../../tests/contracts/tenants.json';

const API = 'http://localhost:3001/api/v1';
const day = (offset: number) =>
	new Date(Date.now() + offset * 86_400_000).toLocaleDateString('sv-SE', {
		timeZone: 'Europe/Zurich'
	});

const contract = (
	id: string,
	startDate: string,
	endDate: string | null,
	apartmentNumber: string
) => ({
	id,
	apartmentId: `a-${id}`,
	apartmentNumber,
	buildingName: 'Ahornhof',
	startDate,
	endDate,
	baseRent: '900.00',
	additionalRent: '0.00',
	monthlyAdvancePayment: '150.00'
});

function backend(contracts: unknown[]) {
	const urls: string[] = [];
	const fetch = async (url: string) => {
		urls.push(url);
		if (url === `${API}/tenants/t1`) return Response.json(tenant);
		if (url.startsWith(`${API}/contracts`)) return Response.json({ contracts });
		return Response.json({ data: [] });
	};
	return { urls, fetch: fetch as typeof globalThis.fetch };
}

const loadTenant = async (contracts: unknown[]) =>
	(await load({ params: { id: 't1' }, fetch: backend(contracts).fetch } as never)) as Record<
		string,
		unknown
	>;

describe('Mieterdetail', () => {
	it('lädt die Mietverträge des Mieters', async () => {
		const { urls, fetch } = backend([]);

		await load({ params: { id: 't1' }, fetch } as never);

		expect(urls).toContain(`${API}/contracts?tenantId=t1&limit=100`);
	});

	it('zeigt die aktuelle Miete aus dem laufenden Vertrag', async () => {
		const data = await loadTenant([contract('c1', day(-400), null, '2.01')]);

		expect(data.rental).toEqual({
			contractId: 'c1',
			apartmentId: 'a-c1',
			apartment: 'Wohnung 2.01',
			building: 'Ahornhof',
			rent: 1050,
			startDate: day(-400),
			upcoming: false
		});
	});

	it('zeigt einen künftigen Vertrag als bevorstehenden Einzug', async () => {
		const data = await loadTenant([contract('c2', day(30), null, '3.01')]);

		expect(data.rental).toMatchObject({ contractId: 'c2', startDate: day(30), upcoming: true });
	});

	it('zeigt ohne laufenden oder künftigen Vertrag keine Miete', async () => {
		const data = await loadTenant([contract('c1', day(-400), day(-1), '2.01')]);

		expect(data.rental).toBeNull();
	});

	it('führt alle Verträge mit Wohnung und Status in der Historie', async () => {
		const data = await loadTenant([
			contract('c2', day(30), null, '3.01'),
			contract('c1', day(-400), day(29), '2.01'),
			contract('c0', day(-900), day(-401), '1.01')
		]);

		expect(data.contractHistory).toEqual([
			expect.objectContaining({ id: 'c2', apartment: 'Wohnung 3.01', status: 'future' }),
			expect.objectContaining({
				id: 'c1',
				apartment: 'Wohnung 2.01',
				status: 'active',
				rentBrutto: 1050
			}),
			expect.objectContaining({ id: 'c0', apartment: 'Wohnung 1.01', status: 'ended' })
		]);
	});
});

describe('Vertragsstatus in der Historie', () => {
	it.each([
		[day(-10), null, 'active'],
		[day(-10), day(10), 'active'],
		[day(-10), day(-1), 'ended'],
		[day(1), null, 'future']
	])('Vertrag von %s bis %s ist %s', (startDate, endDate, status) => {
		expect(toContractHistory({ id: 'c', startDate, endDate }, 'Anna').status).toBe(status);
	});
	// A-1: Wohnungs- und Mieterseite nennen eine Kündigung wie die Detailseite
	it('gibt weiter, ob der Mietvertrag gekündigt ist', () => {
		const contract = { id: 'c', startDate: day(-10), endDate: day(10) };
		expect(toContractHistory({ ...contract, terminated: true }, 'Anna').terminated).toBe(true);
		expect(toContractHistory(contract, 'Anna').terminated).toBe(false);
	});
});

describe('Mieter löschen', () => {
	it('löscht den Mieter und zeigt die Mieterliste', async () => {
		const { calls, result } = runAction(actions.delete, 't1', 204);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/tenants' });
		expect(calls).toEqual([{ method: 'DELETE', url: `${API}/tenants/t1`, body: undefined }]);
	});

	it('erklärt, warum ein Mieter mit Mietverträgen bleibt', async () => {
		const { result } = runAction(actions.delete, 't1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { error: 'Mieter mit Mietverträgen können nicht gelöscht werden.' }
		});
	});
});

describe('Mieterliste', () => {
	// F-4 (#58): aktiv mit laufendem, künftig nur mit künftigem Mietvertrag
	it('kennzeichnet Mieter als aktiv oder künftig, wie das Backend sie einordnet', async () => {
		const { load: loadList } = await import('../routes/tenants/+page.server');
		const fetch = (async () =>
			Response.json({
				tenants: [
					tenantList.tenants[0],
					{ ...tenantList.tenants[0], id: 't2', isActive: false, isFuture: true }
				],
				total: 2
			})) as unknown as typeof globalThis.fetch;

		const data = (await loadList({ url: new URL('http://localhost/tenants'), fetch } as never)) as {
			tenants: { isActive: boolean; isFuture: boolean }[];
		};

		expect(data.tenants.map((t) => [t.isActive, t.isFuture])).toEqual([
			[true, false],
			[false, true]
		]);
	});

	it('nennt bei einem künftigen Mieter den Vertragsbeginn', async () => {
		const { load: loadList } = await import('../routes/tenants/+page.server');
		const urls: string[] = [];
		const future = { ...tenantList.tenants[0], currentApartment: null, currentBuilding: null };
		const fetch = (async (url: string) => {
			urls.push(url);
			return Response.json(
				url.includes('/contracts')
					? {
							contracts: [
								{ tenantId: 't1', startDate: '2099-12-01' },
								{ tenantId: 't1', startDate: '2099-11-01' }
							]
						}
					: { tenants: [future], total: 1 }
			);
		}) as unknown as typeof globalThis.fetch;

		const data = (await loadList({ url: new URL('http://localhost/tenants'), fetch } as never)) as {
			tenants: { nextContractStart: string | null }[];
		};

		expect(urls).toContain('http://localhost:3001/api/v1/contracts?status=future&limit=100');
		expect(data.tenants[0].nextContractStart).toBe('2099-11-01');
	});

	// The contract start is an addition: without it the tenants still show
	it('zeigt die Mieter auch, wenn die künftigen Verträge nicht geladen werden können', async () => {
		const { load: loadList } = await import('../routes/tenants/+page.server');
		const fetch = (async (url: string) =>
			url.includes('/contracts')
				? new Response('Internal Server Error', { status: 500 })
				: Response.json({
						tenants: [tenantList.tenants[0]],
						total: 1
					})) as unknown as typeof globalThis.fetch;

		const data = (await loadList({ url: new URL('http://localhost/tenants'), fetch } as never)) as {
			tenants: { nextContractStart: string | null }[];
		};

		expect(data.tenants).toMatchObject([{ nextContractStart: null }]);
	});
});
