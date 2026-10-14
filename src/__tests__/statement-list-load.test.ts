import { describe, it, expect } from 'vitest';
import { load } from '../routes/statements/+page.server';
import type { StatementsListData } from '$lib/types';
import { GET as downloadPdf } from '../routes/statements/[id]/pdf/+server';
import backendContract from '../../tests/contracts/contract.json';
import periodStatements from '../../tests/contracts/period-statements.json';

const API = 'http://localhost:3001/api/v1';

describe('Abrechnungsliste laden', () => {
	it('fragt das Backend mit Filtern und Seite ab und bereitet die Abrechnungen auf', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			if (url.includes('/statements/counts')) return Response.json({ draft: 2, overdue: 1 });
			if (url.includes('/buildings'))
				return Response.json({ data: [{ id: 'b1', name: 'Ahornhof' }] });
			return Response.json({
				total: 12,
				data: [
					{
						id: 's1',
						statementNumber: 'NK-2024-0001',
						totalCosts: '2100.50',
						balance: '-40',
						reminderSentDate: '2025-03-01',
						tenant: { firstName: 'Anna', lastName: 'Keller', email: 'anna@example.ch' },
						apartment: { number: '2.01', floor: '2' },
						building: { id: 'b1', name: 'Ahornhof', address: 'Ahornweg 3' }
					},
					{ id: 's2', tenant: null, apartment: null, building: null }
				]
			});
		}) as typeof globalThis.fetch;

		const data = (await load({
			url: new URL('http://localhost/statements?page=2&status=sent&building=b1&search=Keller'),
			fetch
		} as never)) as StatementsListData;

		expect(urls[0]).toBe(
			`${API}/statements?limit=10&offset=10&status=sent&buildingId=b1&search=Keller`
		);
		expect(data).toMatchObject({
			total: 12,
			page: 2,
			pageSize: 10,
			buildings: [{ id: 'b1', name: 'Ahornhof' }]
		});
		expect(data.statusCounts).toEqual({ draft: 2, sent: 0, paid: 0, overdue: 1 });
		expect(data.statements[0]).toMatchObject({
			tenantName: 'Anna Keller',
			apartmentUnit: '2.01',
			buildingName: 'Ahornhof',
			totalCosts: 2100.5,
			balance: -40,
			lastReminderDate: '2025-03-01'
		});
		expect(data.statements[1]).toMatchObject({ tenantName: 'Unbekannt', buildingId: '' });
	});

	it('zeigt eine leere Liste, wenn das Backend nicht erreichbar ist', async () => {
		const fetch = (async () => {
			throw new Error('ECONNREFUSED');
		}) as typeof globalThis.fetch;

		const data = (await load({
			url: new URL('http://localhost/statements'),
			fetch
		} as never)) as StatementsListData;

		expect(data).toMatchObject({ statements: [], total: 0, page: 1 });
	});
});

describe('PDF einer Abrechnung herunterladen', () => {
	const call = (response: () => Response) =>
		downloadPdf({
			params: { id: 's1' },
			url: new URL('http://localhost/statements/s1/pdf'),
			fetch: (async () => response()) as typeof globalThis.fetch
		} as never);

	it('liefert das gespeicherte PDF als Download', async () => {
		const response = await call(
			() => new Response(new Uint8Array([37, 80, 68, 70]), { status: 200 })
		);

		expect(response.headers.get('Content-Type')).toBe('application/pdf');
		expect(response.headers.get('Content-Disposition')).toBe(
			'attachment; filename="abrechnung-s1.pdf"'
		);
		expect(new TextDecoder().decode(await response.arrayBuffer())).toBe('%PDF');
	});

	it('gibt den Fehler des Backends weiter, z.B. wenn noch kein PDF erstellt wurde', async () => {
		const response = await call(() =>
			Response.json({ error: 'PDF not generated yet' }, { status: 404 })
		);

		expect(response.status).toBe(404);
		expect(await response.json()).toEqual({ error: 'PDF not generated yet' });
	});

	it('meldet einen Fehler, wenn das Backend nicht erreichbar ist', async () => {
		const response = await call(() => {
			throw new Error('ECONNREFUSED');
		});

		expect(response.status).toBe(500);
	});
});

describe('Abrechnungsliste eines Mietvertrags', () => {
	it('fragt nur die Abrechnungen des Mietvertrags ab und sagt, wessen Abrechnungen sie zeigt', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			if (url.endsWith('/contracts/c1')) return Response.json(backendContract);
			return Response.json(periodStatements);
		}) as typeof globalThis.fetch;

		const data = (await load({
			url: new URL('http://localhost/statements?contract=c1'),
			fetch
		} as never)) as StatementsListData;

		expect(urls[0]).toBe(`${API}/statements?limit=10&offset=0&contractId=c1`);
		expect(data.scope).toBe(
			'Sie sehen die Abrechnungen des Mietvertrags von Anna Keller, Wohnung 2.01 (Ahornhof), Vertragsbeginn 01.04.2024.'
		);
	});

	it('zeigt die Liste ohne Satz, wenn der Mietvertrag nicht geladen werden kann', async () => {
		const fetch = (async (url: string) =>
			url.endsWith('/contracts/c1')
				? new Response(null, { status: 404 })
				: Response.json(periodStatements)) as typeof globalThis.fetch;

		const data = (await load({
			url: new URL('http://localhost/statements?contract=c1'),
			fetch
		} as never)) as {
			scope: string | null;
		};

		expect(data.scope).toBeNull();
	});

	it('fragt den Mietvertrag unter seiner kodierten Kennung ab', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			return Response.json(periodStatements);
		}) as typeof globalThis.fetch;

		await load({
			url: new URL('http://localhost/statements?contract=..%2Fbuildings'),
			fetch
		} as never);

		expect(urls).toContain(`${API}/contracts/..%2Fbuildings`);
	});

	it('sagt nichts über die Auswahl, solange kein Mietvertrag gewählt ist', async () => {
		const fetch = (async () => Response.json(periodStatements)) as typeof globalThis.fetch;

		const data = (await load({ url: new URL('http://localhost/statements'), fetch } as never)) as {
			scope: string | null;
		};

		expect(data.scope).toBeNull();
	});
});

describe('Abrechnungsliste einer Abrechnungsperiode', () => {
	it('fragt nur die Abrechnungen der Periode ab und nennt die Periode', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			return Response.json(periodStatements);
		}) as typeof globalThis.fetch;

		const data = (await load({
			url: new URL(
				'http://localhost/statements?status=draft&periodStart=2024-07-01&periodEnd=2025-06-30'
			),
			fetch
		} as never)) as { scope: string | null };

		expect(urls[0]).toBe(
			`${API}/statements?limit=10&offset=0&status=draft&periodStart=2024-07-01&periodEnd=2025-06-30`
		);
		expect(data.scope).toBe(
			'Sie sehen die Abrechnungen der Abrechnungsperiode 01.07.2024 – 30.06.2025.'
		);
	});
});
