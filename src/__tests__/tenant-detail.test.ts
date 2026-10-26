import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/tenants/[id]/+page.server';
import { toContractHistory } from '../lib/server/contract-history';
import { runAction } from './helpers/action';
import tenant from '../../tests/contracts/tenant.json';
import tenantList from '../../tests/contracts/tenants.json';
import documentList from '../../tests/contracts/documents.json';
import contractResponse from '../../tests/contracts/contract.json';
import formerDocuments from '../../tests/contracts/tenant-former-documents.json';

const API = 'http://localhost:3001/api/v1';
const day = (offset: number) =>
	new Date(Date.now() + offset * 86_400_000).toLocaleDateString('sv-SE', {
		timeZone: 'Europe/Zurich'
	});

// as the backend lists it, with the status it gives by the Swiss day (H-28, #717)
const contract = (
	id: string,
	startDate: string,
	endDate: string | null,
	apartmentNumber: string,
	status = endDate && endDate < day(0) ? 'ended' : startDate > day(0) ? 'future' : 'active'
) => ({
	id,
	status,
	apartmentId: `a-${id}`,
	apartmentNumber,
	buildingName: 'Ahornhof',
	startDate,
	endDate,
	baseRent: '900.00',
	additionalRent: '0.00',
	monthlyAdvancePayment: '150.00'
});

// the tenant as the backend answers, with the contract it pays rent with (H-28, #717)
function backend(contracts: unknown[], rental: Partial<typeof tenant> = {}) {
	const urls: string[] = [];
	const fetch = async (url: string) => {
		urls.push(url);
		if (url === `${API}/tenants/t1`) return Response.json({ ...tenant, ...rental });
		if (url.startsWith(`${API}/contracts`)) return Response.json({ contracts });
		return Response.json({ data: [] });
	};
	return { urls, fetch: fetch as typeof globalThis.fetch };
}

const loadTenant = async (contracts: unknown[], rental: Partial<typeof tenant> = {}) =>
	(await load({ params: { id: 't1' }, fetch: backend(contracts, rental).fetch } as never)) as Record<
		string,
		unknown
	>;

describe('Mieterdetail', () => {
	// #178, #788: the backend names a former tenant's documents from before the last Vertragsende; the page shows them
	it('nennt die Dokumente, die das Backend als die eines ehemaligen Mieters nennt', async () => {
		const [upload, other] = [documentList.data[0], { ...documentList.data[0], id: 'd-later' }];
		const fetch = (async (url: string) =>
			url === `${API}/tenants/t1`
				? Response.json(tenant)
				: url === `${API}/tenants/t1/former-documents`
					? Response.json({
							formerDocuments: { ...formerDocuments.formerDocuments, documentIds: [upload.id] }
						})
					: url.startsWith(`${API}/contracts`)
						? Response.json({ contracts: [contract('c1', '2020-01-01', day(-1), '2.01')] })
						: Response.json({ data: [upload, other] })) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 't1' }, fetch } as never)) as Record<string, unknown>;

		const { endDate, contractId, checkedOn } = formerDocuments.formerDocuments;
		expect(data.formerDocuments).toEqual({ endDate, contractId, checkedOn, documents: [upload] });
	});

	// the notice is extra: without it the page still loads, without a notice
	it('zeigt die Seite ohne Hinweis, wenn die Dokumente eines ehemaligen Mieters nicht laden', async () => {
		const fetch = (async (url: string) => {
			if (url === `${API}/tenants/t1`) return Response.json(tenant);
			if (url.includes('former-documents')) throw new TypeError('fetch failed');
			if (url.startsWith(`${API}/contracts`))
				return Response.json({ contracts: [contract('c1', '2020-01-01', day(-2), '2.01')] });
			return Response.json({ data: [] });
		}) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 't1' }, fetch } as never)) as Record<string, unknown>;

		expect(data.formerDocuments).toBeNull();
	});

	// review p2 C-2: without the documents the notice would name none
	it('zeigt keinen Hinweis, wenn die Dokumente des Mieters nicht laden', async () => {
		const fetch = (async (url: string) =>
			url === `${API}/tenants/t1`
				? Response.json(tenant)
				: url === `${API}/tenants/t1/former-documents`
					? Response.json(formerDocuments)
					: url.startsWith(`${API}/contracts`)
						? Response.json({ contracts: [] })
						: new Response(null, { status: 500 })) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 't1' }, fetch } as never)) as Record<string, unknown>;

		expect(data.formerDocuments).toBeNull();
	});

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
			monthlyTotal: 1050,
			startDate: day(-400),
			upcoming: false
		});
	});

	it('zeigt einen künftigen Vertrag als bevorstehenden Einzug', async () => {
		const data = await loadTenant([contract('c2', day(30), null, '3.01')], {
			rentalContractId: 'c2',
			isFuture: true
		});

		expect(data.rental).toMatchObject({ contractId: 'c2', startDate: day(30), upcoming: true });
	});

	it('nimmt den Mietvertrag und den Status, die das Backend nennt', async () => {
		const data = await loadTenant(
			[contract('c2', day(-10), null, '3.01'), contract('c1', day(-400), null, '2.01', 'future')],
			{ rentalContractId: 'c1', isFuture: true }
		);

		expect(data.rental).toMatchObject({ contractId: 'c1', upcoming: true });
		expect(data.contractHistory).toEqual([
			expect.objectContaining({ id: 'c2', status: 'active' }),
			expect.objectContaining({ id: 'c1', status: 'future' })
		]);
	});

	// #815 (review i815d C-3): whether «Mieter anonymisieren» is allowed, the backend says by the Swiss day
	it('übernimmt, ob das Backend das Anonymisieren erlaubt', async () => {
		const data = await loadTenant([], { anonymisableFrom: '2025-01-01', anonymisable: true } as never);

		expect(data.tenant).toMatchObject({ anonymisableFrom: '2025-01-01', anonymisable: true });
	});

	it('zeigt ohne laufenden oder künftigen Vertrag keine Miete', async () => {
		const data = await loadTenant([contract('c1', day(-400), day(-1), '2.01')], {
			rentalContractId: undefined
		});

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
				monthlyTotal: 1050
			}),
			expect.objectContaining({ id: 'c0', apartment: 'Wohnung 1.01', status: 'ended' })
		]);
	});
});

describe('Vertragsstatus in der Historie', () => {
	it.each(['active', 'ended', 'future'])('gibt den Status %s des Backends weiter', (status) => {
		expect(toContractHistory({ id: 'c', startDate: day(-10), endDate: null, status }, 'Anna').status).toBe(status);
	});
	// A-1: Wohnungs- und Mieterseite nennen eine Kündigung wie die Detailseite
	it('gibt weiter, ob der Mietvertrag gekündigt ist', () => {
		const contract = { id: 'c', startDate: day(-10), endDate: day(10) };
		expect(toContractHistory({ ...contract, terminated: true }, 'Anna').terminated).toBe(true);
		expect(toContractHistory(contract, 'Anna').terminated).toBe(false);
	});
	// #429: die Nebenkostenpauschale zählt im Monatlich total
	it('zählt die Nebenkostenpauschale im Monatlich total', () => {
		const withFlatRate = { ...contractResponse, flatRateUtilityCharge: '120.00' };
		expect(toContractHistory(withFlatRate, 'Anna').monthlyTotal).toBe(
			toContractHistory(contractResponse, 'Anna').monthlyTotal + 120
		);
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

// #459 (#331): «Als geprüft markieren» stores today on the last contract
describe('Dokumente als geprüft markieren', () => {
	it('speichert die Prüfung am letzten Mietvertrag', async () => {
		const { calls, result } = runAction(actions.checkDocuments, 't1', 200, { contractId: 'c1' }, contractResponse);

		expect(await result).toBeUndefined();
		expect(calls).toEqual([{ method: 'PUT', url: `${API}/contracts/c1`, body: { documentsChecked: true } }]);
	});

	it('sagt, wenn die Prüfung nicht gespeichert wurde', async () => {
		const { result } = runAction(actions.checkDocuments, 't1', 500, { contractId: 'c1' });

		expect(await result).toMatchObject({
			status: 500,
			data: { checkError: 'Beim Speichern ist ein Fehler aufgetreten. Versuchen Sie es später erneut.' }
		});
	});
});

// #459 (#332): the replacement name in the landlord's language; a refusal in its words
describe('Mieter anonymisieren', () => {
	it('ersetzt den Namen durch «Anonymisierter Mieter»', async () => {
		const { calls, result } = runAction(actions.anonymise, 't1', 200, {}, { success: true });

		expect(await result).toBeUndefined();
		expect(calls).toEqual([
			{ method: 'POST', url: `${API}/tenants/t1/anonymise`, body: { firstName: 'Anonymisierter', lastName: 'Mieter' } }
		]);
	});

	it('nennt den Tag, wenn das Backend zu früh ablehnt', async () => {
		const refused = { error: 'too early', code: 'TENANT_ANONYMISE_TOO_EARLY', params: { date: '2036-01-01' } };
		const { result } = runAction(actions.anonymise, 't1', 409, {}, refused);

		expect(await result).toMatchObject({
			status: 409,
			data: { anonymiseError: 'Diesen Mieter können Sie erst ab dem 01.01.2036 anonymisieren.' }
		});
	});

	it('sagt, wenn Dwello nicht geantwortet hat', async () => {
		const { result } = runAction(actions.anonymise, 't1', 500);

		expect(await result).toMatchObject({
			status: 500,
			data: {
				anonymiseError: 'Der Mieter wurde nicht anonymisiert, weil Dwello nicht geantwortet hat. Versuchen Sie es später erneut.'
			}
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
