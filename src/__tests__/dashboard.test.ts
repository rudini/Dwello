import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from '../routes/dashboard/+page.server';
import contractList from '../../tests/contracts/contracts.json';
import periodStatements from '../../tests/contracts/period-statements.json';
import apartmentList from '../../tests/contracts/apartments.json';
import config from '../../tests/contracts/config.json';
import statementList from '../../tests/contracts/statements.json';
import documentList from '../../tests/contracts/documents.json';
import outdatedStatements from '../../tests/contracts/statements-outdated.json';

const API = 'http://localhost:3001/api/v1';
// an apartment of the API contract, without the dates it does not have
const apartment = (buildingId: string, status: string, fields: Record<string, string> = {}) => ({
	...apartmentList.apartments[0],
	nextContractStart: null,
	currentContractEnd: null,
	lastContractEnd: null,
	buildingId,
	status,
	...fields
});
const figures = {
	portfolio: { totalBuildings: 1, totalApartments: 2, occupiedApartments: 1, reletApartments: 0 },
	statements: { draft: 1, sent: 1, paid: 0, settled: 0, overdue: 1 },
	buildingOccupancy: [
		{ buildingId: 'b1', buildingName: 'Seeblick', occupiedApartments: 1 },
		{ buildingId: 'b2', buildingName: 'Lindenhof', occupiedApartments: 2 },
		{ buildingId: 'b3', buildingName: 'Leerbau', occupiedApartments: 0 }
	]
};
// Contracts of all times, shaped as the backend answers; the period is 01.07.2025 – 30.06.2026
const contract = (fields: Record<string, unknown>) => ({
	...contractList.contracts[0],
	terminated: false,
	...fields
});
const contracts = [
	contract({ id: 'k1', buildingName: 'Seeblick', startDate: '2020-01-01', endDate: null }),
	contract({ id: 'k2', buildingName: 'Lindenhof', startDate: '2024-01-01', endDate: null }),
	contract({ id: 'k3', buildingName: 'Lindenhof', startDate: '2025-08-01', endDate: null }),
	contract({ id: 'k4', buildingName: 'Ahornhof', startDate: '2023-01-01', endDate: '2025-09-30' }),
	contract({ id: 'k5', buildingName: 'Leerbau', startDate: '2020-01-01', endDate: '2025-06-30' }),
	contract({ id: 'k6', buildingName: 'Neubau', startDate: '2026-07-01', endDate: null }),
	// one day in the period each: its first and its last
	contract({ id: 'k7', buildingName: 'Erlenhof', startDate: '2024-01-01', endDate: '2025-07-01' }),
	contract({ id: 'k8', buildingName: 'Birkenhof', startDate: '2026-06-30', endDate: null }),
	// A-4, after the period: given notice, running; given notice and ended; given notice with a next tenant
	...[
		{ id: 'n1', apartmentId: 'a7', apartmentNumber: '3.01', endDate: '2027-03-31' },
		{ id: 'n2', apartmentId: 'a8', apartmentNumber: '3.02', endDate: '2026-09-30' },
		{ id: 'n3', apartmentId: 'a9', apartmentNumber: '3.03', endDate: '2027-01-31' },
		// review K-6: ends today, the boundary of a running notice
		{ id: 'n5', apartmentId: 'a5', apartmentNumber: '3.05', endDate: '2026-10-10' },
		// review K-6: given notice with a next tenant soon: no task, but the deadline
		{ id: 'n6', apartmentId: 'a6', apartmentNumber: '3.06', endDate: '2026-11-20' }
	].map((c) =>
		contract({ ...c, tenantName: `Mieter ${c.id}`, startDate: '2026-07-01', terminated: true })
	),
	contract({ id: 'n4', apartmentId: 'a9', startDate: '2027-02-01', endDate: null }),
	contract({ id: 'n7', apartmentId: 'a6', startDate: '2026-11-21', endDate: null }),
	// A-6 (#115), all agreed ends: expired; expired and moved out; expired with a next contract; still running
	...[
		{ id: 'f1', apartmentId: 'f1', endDate: '2026-10-09' },
		{ id: 'f2', apartmentId: 'f2', endDate: '2026-09-30', movedOut: true },
		{ id: 'f3', apartmentId: 'f3', endDate: '2026-07-31' },
		{ id: 'f5', apartmentId: 'f5', endDate: '2026-10-10' }
	].map((c) => contract({ ...c, tenantName: `Mieter ${c.id}`, startDate: '2026-07-01' })),
	contract({ id: 'f4', apartmentId: 'f3', startDate: '2026-08-01', endDate: null })
];
// #211: statements of all periods; one per contract covers every ended period since its Vertragsbeginn
const billed = (...ids: string[]) =>
	ids.map((contractId) => ({
		...periodStatements.data[0],
		contractId,
		periodStart: '2019-07-01',
		periodEnd: '2026-06-30'
	}));
const both = billed('k1', 'k2', 'k3', 'k4', 'k5', 'k7', 'k8');

// The backend as the overview reads it: counts, plus the lists that carry dates
function backend(
	dashboardStatus = 200,
	statementsOfAllPeriods: unknown[] = both,
	overrides: Record<string, unknown> = {}
) {
	const answers: Record<string, unknown> = {
		// Zahlungsfrist 45 and Mahnfrist 10 days (#87)
		'/config': config,
		'/statements?limit=1000': {
			data: statementsOfAllPeriods,
			total: statementsOfAllPeriods.length
		},
		'/statements?status=overdue&limit=100': {
			data: [
				{
					id: 's1',
					// 12 days ago: after the Mahnfrist of 10 days, a Mahnung is proposed (#64)
					paymentDeadline: '2026-09-28',
					tenant: { firstName: 'Anna', lastName: 'Keller' }
				}
			]
		},
		'/statements?status=sent&limit=100': {
			data: [
				{
					id: 's2',
					paymentDeadline: '2026-10-20',
					tenant: { firstName: 'Bruno', lastName: 'Meier' }
				},
				// within the Zahlungsfrist of 45 days, so still shown (#87)
				{
					id: 's3',
					paymentDeadline: '2026-11-20',
					tenant: { firstName: 'Hans', lastName: 'Müller' }
				}
			]
		},
		'/contracts?limit=1000': { contracts, total: contracts.length },
		// A-5 (#114): drafts for moved-out tenants, one still with the building's address (twice: two periods)
		'/statements?status=draft&limit=100': {
			data: [
				{ ...statementList.data[0], id: 's3', tenantId: 't9', oldAddress: true },
				{ ...statementList.data[0], id: 's4', tenantId: 't9', oldAddress: true },
				{ ...statementList.data[0], id: 's5', tenantId: 't8', oldAddress: false }
			]
		},
		'/documents?status=to_send': { data: [{ id: 'd1' }, { id: 'd2' }] },
		'/statements/outdated': { statements: [] },
		'/contracts?status=active&limit=100': {
			contracts: [
				{ id: 'c1', tenantName: 'Eva Frei', endDate: '2026-11-01' },
				// given notice: a task names it, not the deadline (A-4)
				{ id: 'n5', tenantName: 'Mieter n5', endDate: '2026-10-10', terminated: true },
				// given notice with a next tenant: no task, so the deadline (review K-6)
				{ id: 'n6', tenantName: 'Mieter n6', endDate: '2026-11-20', terminated: true },
				{ id: 'c2', tenantName: 'Ueli Graf', endDate: null }
			]
		},
		'/apartments?limit=1000': {
			apartments: [
				apartment('b1', 'relet', { nextContractStart: '2026-12-01' }),
				apartment('b1', 'relet', { nextContractStart: '2026-11-01' }),
				apartment('b1', 'occupied'),
				apartment('b2', 'vacant', { number: '1.01' }),
				apartment('b2', 'vacant', { number: '1.02', lastContractEnd: '2024-03-31' }),
				// reserved by hand: not empty to rent, so no «leer seit»
				apartment('b3', 'reserved', { lastContractEnd: '2024-03-31' })
			]
		},
		...overrides
	};
	return (async (url: string) => {
		const path = url.replace(API, '');
		if (path === '/dashboard') return Response.json(figures, { status: dashboardStatus });
		if (path in answers) return Response.json(answers[path]);
		throw new Error(`unexpected ${url}`);
	}) as typeof globalThis.fetch;
}

describe('Übersicht laden', () => {
	afterEach(() => vi.useRealTimers());

	// #178: an ehemaliger Mieter whose uploads date from before the last Vertragsende
	it('nennt ehemalige Mieter mit Dokumenten von vor dem Ende ihres letzten Mietvertrags', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const [upload] = documentList.data;
		// a fixed term without notice, then the next tenant: she has left, no question whether she stayed (A-6)
		const former = { ...contracts[0], id: 'k9', tenantId: 't9', tenantName: 'Ida Alt', apartmentId: 'a9', startDate: '2020-01-01', endDate: '2026-03-31', terminated: false, movedOut: false };
		const next = { ...former, id: 'k10', tenantId: 't10', tenantName: 'Ugo Nuovo', startDate: '2026-04-01', endDate: null };
		const base = backend();
		const fetch = (async (url: string) => {
			const path = url.replace(API, '');
			if (path === '/documents')
				return Response.json({ data: [{ ...upload, tenantId: 't9', createdAt: '2024-05-01T09:00:00.000Z' }] });
			if (path === '/contracts?limit=1000') return Response.json({ contracts: [...contracts, former, next] });
			return base(url);
		}) as typeof globalThis.fetch;

		const data = await load({ fetch } as never);

		expect(data.tasks).toContainEqual(
			expect.objectContaining({ id: 'former-documents-t9', title: 'Dokumente von Ida Alt prüfen', href: '/tenants/t9' })
		);
		expect(data.tasks.map((task) => task.id)).not.toContain('fixed-term-k9');
	});

	it('liefert die Kennzahlen und daraus die Aufgaben und Fristen von heute', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({ fetch: backend() } as never);

		expect(data.portfolio).toEqual(figures.portfolio);
		expect(data.tasks.map((task) => task.id)).toEqual([
			'overdue',
			'letters',
			'drafts',
			'old-address-t9',
			// review K-6: also after the end, until a next tenant is recorded; the earliest end first
			'successor-n2',
			'successor-n5',
			'successor-n1',
			// A-6 (#115): only the expired agreed end without a next contract and without a move-out
			'fixed-term-f1'
		]);
		expect(data.tasks[1].text).toContain('2 Briefe sind');
		expect(data.deadlines.map((d) => [d.kind, d.name, d.when])).toEqual([
			['Zahlungsfrist', 'Anna Keller', 'seit 12 Tagen abgelaufen'],
			['Zahlungsfrist', 'Bruno Meier', 'in 10 Tagen'],
			['Vertragsende', 'Eva Frei', 'in 22 Tagen'],
			['Zahlungsfrist', 'Hans Müller', 'in 41 Tagen'],
			['Vertragsende', 'Mieter n6', 'in 41 Tagen']
		]);
	});

	// #64, Fachreview V-1: die Mahnfrist gilt nur, wo gemahnt wird; eine Rückerstattung ist ab dem Tag danach zu überweisen
	it('nennt eine überfällige Rückerstattung gleich nach der Zahlungsfrist, eine Nachzahlung erst nach der Mahnfrist', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const overdue = (balance: string) =>
			backend(200, both, {
				'/statements?status=overdue&limit=100': {
					data: [{ ...statementList.data[0], paymentDeadline: '2026-10-05', balance }]
				}
			});

		const refund = await load({ fetch: overdue('-40.00') } as never);
		const payment = await load({ fetch: overdue('40.00') } as never);

		expect(refund.tasks.map((task) => task.id)).toContain('overdue');
		expect(payment.tasks.map((task) => task.id)).not.toContain('overdue');
	});

	// #454 (#408 point 7): the statements no longer current, from the backend; a sent one to correct (Fachreview 454-1 E-3)
	it('nennt die versendeten Abrechnungen, die zu berichtigen sind', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({ fetch: backend(200, both, { '/statements/outdated': outdatedStatements }) } as never);
		const task = data.tasks.find((one) => one.id === 'correct-s7')!;
		expect(task.text).toContain('Seit dem Erstellen der Abrechnung NK-2025-0007 von Eva Frei wurde 1 Rechnung');
		expect(task.href).toBe('/statements/s7');
	});

	it('zeigt die Übersicht auch, wenn die nicht aktuellen Abrechnungen nicht zu laden sind', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const failing = backend(200, both);
		const fetch = (async (url: string) =>
			url.endsWith('/statements/outdated') ? new Response(null, { status: 500 }) : failing(url)) as typeof globalThis.fetch;
		const data = await load({ fetch } as never);
		expect(data.tasks.map((one) => one.id)).not.toContain('outdated-drafts');
		expect(data.tasks.map((one) => one.id)).toContain('drafts');
	});

	// Fachreview 454-1 V-10: the link of the missing statements names the building of the newest period
	it('führt von den fehlenden Abrechnungen zu den Rechnungen eines Gebäudes', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({ fetch: backend(200, []) } as never);
		expect(data.tasks.find((one) => one.id === 'missing-period')!.link!.href).toMatch(
			/^\/invoices\?building=[^&]+&periodStart=\d{4}-\d{2}-\d{2}&periodEnd=\d{4}-\d{2}-\d{2}$/
		);
	});

	it('erinnert an die abgelaufene Abrechnungsperiode, für die es noch keine Abrechnung gibt', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({ fetch: backend(200, []) } as never);

		expect(data.tasks.map((task) => task.id)).toEqual([
			'overdue',
			'letters',
			'missing-period',
			'drafts',
			'old-address-t9',
			// review K-6: also after the end, until a next tenant is recorded; the earliest end first
			'successor-n2',
			'successor-n5',
			'successor-n1',
			// A-6 (#115): only the expired agreed end without a next contract and without a move-out
			'fixed-term-f1'
		]);
		// #211: every ended period since the Vertragsbeginn, also of a contract that ended before the last one
		expect(data.tasks[2].text).toMatch(
			/Noch nicht abgerechnet: Ahornhof \(.*\), Birkenhof \(.*\), Erlenhof \(.*\), Leerbau \(.*\), Lindenhof \(.*\), Seeblick \(.*\)\./
		);
		expect(data.tasks[2].text).toContain(
			'Ahornhof (01.07.2025 – 30.06.2026, 01.07.2024 – 30.06.2025, 01.07.2023 – 30.06.2024, 01.07.2022 – 30.06.2023), Birkenhof (01.07.2025 – 30.06.2026),'
		);
	});

	// The tenant who moved out still gets a statement for the days of the period (A-9)
	it('nennt jedes Gebäude, das in der Periode einen Mietvertrag ohne Abrechnung hatte', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({
			fetch: backend(200, billed('k1', 'k2', 'k5', 'k7', 'k8'))
		} as never);
		const task = data.tasks.find((t) => t.id === 'missing-period')!;
		expect(task.text).toContain(
			'Noch nicht abgerechnet: Ahornhof (01.07.2025 – 30.06.2026, 01.07.2024 – 30.06.2025, 01.07.2023 – 30.06.2024, 01.07.2022 – 30.06.2023), Lindenhof (01.07.2025 – 30.06.2026).'
		);
	});

	// #120: eine ersetzte Abrechnung zählt nicht als Abrechnung der Periode, bis es die berichtigte gibt
	it('nennt das Gebäude einer ersetzten Abrechnung ohne berichtigte', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const [seeblick, ...others] = both;
		const data = await load({ fetch: backend(200, [{ ...seeblick, status: 'replaced' }, ...others]) } as never);
		const task = data.tasks.find((t) => t.id === 'missing-period')!;
		expect(task.text).toMatch(
			/Noch nicht abgerechnet: Seeblick \(01\.07\.2025 – 30\.06\.2026, [^)]*\)\./
		);
	});

	// #199: an overlapping statement counts, only the days it leaves are missing
	it('nennt nur die Tage, die keine Abrechnung abdeckt', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const [seeblick, ...others] = both;
		const data = await load({
			fetch: backend(200, [{ ...seeblick, periodEnd: '2026-03-31' }, ...others])
		} as never);
		const task = data.tasks.find((t) => t.id === 'missing-period')!;
		expect(task.text).toContain('Noch nicht abgerechnet: Seeblick (01.04.2026 – 30.06.2026).');
	});

	// #133: the days up to «Abgerechnet bis» were billed outside Dwello
	it('übergeht die Tage bis «Abgerechnet bis»', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const outside = contracts.map((c) => (c.id === 'k4' ? { ...c, billedUntil: '2025-06-30' } : c));
		const data = await load({
			fetch: backend(
				200,
				both.filter((s) => s.contractId !== 'k4'),
				{
					'/contracts?limit=1000': { contracts: outside, total: outside.length }
				}
			)
		} as never);
		const task = data.tasks.find((t) => t.id === 'missing-period')!;
		expect(task.text).toContain('Noch nicht abgerechnet: Ahornhof (01.07.2025 – 30.06.2026).');
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

	// P-18 (#145): jede leere Wohnung, seit wann nur, wenn sie einen Mietvertrag hatte (Persona Anna P-1)
	it('nennt pro Gebäude die leeren Wohnungen mit dem Ende ihres letzten Mietvertrags', async () => {
		const data = await load({ fetch: backend() } as never);

		expect(data.buildingOccupancy.map((b) => b.vacant)).toEqual([
			[],
			[
				{ number: '1.01', lastContractEnd: null },
				{ number: '1.02', lastContractEnd: '2024-03-31' }
			],
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

	// code review C-6: a broken answer of the settings leaves their defaults, not an error page
	it('zeigt die Übersicht auch, wenn die Einstellungen kein JSON liefern', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const answer = backend();
		const fetch = (async (url: string) =>
			url.endsWith('/config') ? new Response('<html>') : answer(url)) as typeof globalThis.fetch;
		const data = await load({ fetch } as never);

		expect(data.deadlines.map((d) => d.name)).toContain('Bruno Meier');
	});

	// Zeros would look like an empty portfolio
	it('zeigt einen Fehler statt leerer Kennzahlen, wenn das Backend nicht antwortet', async () => {
		await expect(load({ fetch: backend(500) } as never)).rejects.toMatchObject({
			status: 500,
			body: { message: 'Übersicht konnte nicht geladen werden' }
		});
	});
});
