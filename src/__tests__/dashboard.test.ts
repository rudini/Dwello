import { describe, it, expect, vi, afterEach } from 'vitest';
import { load } from '../routes/dashboard/+page.server';
import dashboardResponse from '../../tests/contracts/dashboard.json';
import contractList from '../../tests/contracts/contracts.json';
import apartmentList from '../../tests/contracts/apartments.json';
import config from '../../tests/contracts/config.json';
import statementList from '../../tests/contracts/statements.json';
import outdatedStatements from '../../tests/contracts/statements-outdated.json';
import kiModelLoading from '../../tests/contracts/ki-model-loading.json';
import kiSettings from '../../tests/contracts/ki-settings.json';

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
const [occupancy] = dashboardResponse.buildingOccupancy;
// as the backend answers (tests/contracts/dashboard.json), the drafts to send counted there (H-28, #717)
const figures = {
	...dashboardResponse,
	portfolio: { totalBuildings: 1, totalApartments: 2, occupiedApartments: 1, reletApartments: 0 },
	buildingOccupancy: [
		{ ...occupancy, buildingId: 'b1', buildingName: 'Seeblick', occupiedApartments: 1 },
		{ ...occupancy, buildingId: 'b2', buildingName: 'Lindenhof', occupiedApartments: 2 },
		{ ...occupancy, buildingId: 'b3', buildingName: 'Leerbau', occupiedApartments: 0 }
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
// what the backend decides from these contracts (#788): the notices without a next tenant, the expired agreed end
const pick = (...ids: string[]) => contracts.filter((c) => ids.includes(String(c.id)));
const contractTasks = {
	noticedContracts: pick('n1', 'n2', 'n5').map(({ id, tenantName, apartmentId, apartmentNumber, endDate }) => ({
		...dashboardResponse.contractTasks.noticedContracts[0],
		id,
		tenantName,
		apartmentId,
		apartmentNumber,
		endDate
	})),
	expiredContracts: pick('f1').map(({ id, tenantName, endDate }) => ({ id, tenantName, endDate })),
	formerTenants: [] as typeof dashboardResponse.contractTasks.formerTenants,
	// A-5 (#114): drafts for a moved-out tenant still with the building's address, named once per tenant
	oldAddresses: [{ ...dashboardResponse.contractTasks.oldAddresses[0], tenantId: 't9' }]
};
type Missing = (typeof dashboardResponse.contractTasks.missingStatements)[number];
// each missing part as the backend answers (tests/contracts/dashboard.json)
const period = (start: string, end: string) => ({
	...dashboardResponse.contractTasks.missingStatements[0].periods[0],
	start,
	end
});
const missingIn = (building: string, ...periods: Missing['periods']) => ({
	...dashboardResponse.contractTasks.missingStatements[0],
	building,
	buildingId: `id-${building}`,
	periods
});
const lastPeriod = period('2025-07-01', '2026-06-30');

// The backend as the overview reads it: counts, plus the lists that carry dates
function backend(
	dashboardStatus = 200,
	// #211, #788: per building the ended periods without a statement, as the backend groups them
	missingStatements: Missing[] = [],
	overrides: Record<string, unknown> = {}
) {
	const answers: Record<string, unknown> = {
		// Zahlungsfrist 45 and Mahnfrist 10 days (#87)
		'/config': config,
		// overdue and sent in one read (#605)
		'/statements?status=open&limit=1000': {
			data: [
				{
					id: 's1',
					// 12 days ago: after the Mahnfrist of 10 days, a Mahnung is proposed (#64)
					paymentDeadline: '2026-09-28',
					tenant: { firstName: 'Anna', lastName: 'Keller' }
				},
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
		if (path === '/dashboard')
			return Response.json(
				{ ...figures, contractTasks: { ...contractTasks, missingStatements } },
				{ status: dashboardStatus }
			);
		if (path in answers) return Response.json(answers[path]);
		throw new Error(`unexpected ${url}`);
	}) as typeof globalThis.fetch;
}

describe('Übersicht laden', () => {
	afterEach(() => vi.useRealTimers());

	// #178, #788: the former tenants with uploads to check come from the backend; the overview names each
	it('nennt die ehemaligen Mieter, deren Dokumente das Backend zum Prüfen nennt', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const [former] = dashboardResponse.contractTasks.formerTenants;
		const base = backend();
		const fetch = (async (url: string) =>
			url === `${API}/dashboard`
				? Response.json({ ...figures, contractTasks: { ...contractTasks, formerTenants: [former] } })
				: base(url)) as typeof globalThis.fetch;

		const data = await load({ fetch } as never);

		expect(data.tasks).toContainEqual(
			expect.objectContaining({
				id: `former-documents-${former.tenantId}`,
				title: `Dokumente von ${former.tenantName} prüfen`,
				href: `/tenants/${former.tenantId}`
			})
		);
	});

	// #788: which contracts need a next tenant or a question whether the tenant stayed, the backend decides
	it('nennt keine Aufgabe zu einem Mietvertrag, die das Backend nicht nennt', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const base = backend();
		const none = {
			noticedContracts: [],
			expiredContracts: [],
			formerTenants: [],
			oldAddresses: [],
			missingStatements: []
		};
		const fetch = (async (url: string) =>
			url === `${API}/dashboard` ? Response.json({ ...figures, contractTasks: none }) : base(url)) as typeof globalThis.fetch;

		const ids = (await load({ fetch } as never)).tasks.map((task) => task.id);

		expect(ids).toContain('overdue');
		expect(
			ids.filter((id) => /^(successor|fixed-term|old-address)-|^missing-period$/.test(id))
		).toEqual([]);
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

	// #64, #107, #449, Fachreview V-1: whether an overdue statement needs a Mahnung now, the backend decides
	// (backend statement-reminder-due.pg.test.ts); the overview reads it from the list
	it('nennt eine überfällige Abrechnung erst, wenn das Backend ihre Mahnung fällig nennt', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const overdue = (reminderDue: boolean) =>
			backend(200, [], {
				'/statements?status=open&limit=1000': {
					data: [
						{
							...statementList.data[0],
							status: 'overdue',
							paymentDeadline: '2026-10-05',
							reminderDue
						}
					]
				}
			});

		const due = await load({ fetch: overdue(true) } as never);
		const waiting = await load({ fetch: overdue(false) } as never);

		expect(due.tasks.map((task) => task.id)).toContain('overdue');
		expect(waiting.tasks.map((task) => task.id)).not.toContain('overdue');
	});

	// #605: überfällig und versendet aus zwei Abfragen: änderte sich die Zahlungsfrist dazwischen, stand dieselbe
	// Abrechnung in beiden Listen (die Seite brach beim Laden ab) oder in keiner. Eine Abfrage liest beide zusammen
	it('liest überfällige und versendete Abrechnungen in einer Abfrage', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const bruno = { ...statementList.data[0], id: 's9', tenant: { firstName: 'Bruno', lastName: 'Meier' } };
		const data = await load({
			fetch: backend(
				200,
				[],
				{
					'/statements?status=overdue&limit=100': {
						data: [{ ...bruno, paymentDeadline: '2026-09-28' }]
					},
					'/statements?status=sent&limit=100': {
						data: [{ ...bruno, paymentDeadline: '2026-11-09' }]
					},
					'/statements?status=open&limit=1000': {
						data: [{ ...bruno, paymentDeadline: '2026-09-28' }]
					}
				}
			)
		} as never);

		expect(data.deadlines.filter((d) => d.id === 's9').map((d) => d.date)).toEqual(['2026-09-28']);
	});

	// #454 (#408 point 7): the statements no longer current, from the backend; a sent one to correct (Fachreview 454-1 E-3)
	it('nennt die versendeten Abrechnungen, die zu berichtigen sind', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({
			fetch: backend(200, [], { '/statements/outdated': outdatedStatements })
		} as never);
		const task = data.tasks.find((one) => one.id === 'correct-s7')!;
		expect(task.text).toContain('Seit dem Erstellen der Abrechnung NK-2025-0007 von Eva Frei wurde 1 Rechnung');
		expect(task.href).toBe('/statements/s7');
	});

	it('zeigt die Übersicht auch, wenn die nicht aktuellen Abrechnungen nicht zu laden sind', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const failing = backend(200, []);
		const fetch = (async (url: string) =>
			url.endsWith('/statements/outdated') ? new Response(null, { status: 500 }) : failing(url)) as typeof globalThis.fetch;
		const data = await load({ fetch } as never);
		expect(data.tasks.map((one) => one.id)).not.toContain('outdated-drafts');
		expect(data.tasks.map((one) => one.id)).toContain('drafts');
	});

	// #577: how far the local KI's model is; a model the backend cannot tell about shows nothing
	it('nennt, wie weit das KI-Modell geladen ist', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const answers = backend(200, []);
		const fetch = (async (url: string) =>
			url.endsWith('/ki/model') ? Response.json(kiModelLoading) : answers(url)) as typeof globalThis.fetch;

		expect((await load({ fetch } as never)).kiModel).toEqual({ state: 'loading', percent: 40 });
	});

	it('zeigt die Übersicht auch, wenn der Stand des KI-Modells nicht zu laden ist', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const answers = backend(200, []);
		const fetch = (async (url: string) =>
			url.endsWith('/ki/model') ? new Response(null, { status: 500 }) : answers(url)) as typeof globalThis.fetch;

		expect((await load({ fetch } as never)).kiModel).toEqual({ state: 'unknown' });
	});

	// #620: «Später entscheiden» bei der Einrichtung: keine KI gewählt, die Übersicht nennt die Seite «KI»
	it('meldet, wenn der Liegenschaftsverwalter noch keine KI gewählt hat', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const answers = backend(200, []);
		const fetch = (async (url: string) =>
			url.endsWith('/ki-settings')
				? Response.json({ ...kiSettings, mode: 'none' })
				: url.endsWith('/ki/model')
					? Response.json({ state: 'unknown' })
					: answers(url)) as typeof globalThis.fetch;

		expect((await load({ fetch } as never)).kiModel).toEqual({ state: 'none' });
	});

	it('meldet keine fehlende Wahl, wenn der Betreiber die KI abgeschaltet hat', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const answers = backend(200, []);
		const fetch = (async (url: string) =>
			url.endsWith('/ki-settings')
				? Response.json({ ...kiSettings, mode: 'none', byOperator: true })
				: url.endsWith('/ki/model')
					? Response.json({ state: 'unknown' })
					: answers(url)) as typeof globalThis.fetch;

		expect((await load({ fetch } as never)).kiModel).toEqual({ state: 'unknown' });
	});

	// Fachreview 454-1 V-10: the link of the missing statements names the building of the newest period
	it('führt von den fehlenden Abrechnungen zu den Rechnungen eines Gebäudes', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const data = await load({ fetch: backend(200, [missingIn('Seeblick', lastPeriod)]) } as never);
		expect(data.tasks.find((one) => one.id === 'missing-period')!.link!.href).toMatch(
			/^\/invoices\?building=id-Seeblick&periodStart=2025-07-01&periodEnd=2026-06-30$/
		);
	});

	// The backend names each building with its missing periods, the latest first (backend dashboard-tasks.pg.test.ts)
	it('erinnert an die abgelaufene Abrechnungsperiode, für die es noch keine Abrechnung gibt', async () => {
		vi.useFakeTimers({ now: new Date('2026-10-10T08:00:00') });
		const missing = [
			// #211: every ended period since the Vertragsbeginn, also of a contract that ended before the last one
			missingIn(
				'Ahornhof',
				lastPeriod,
				period('2024-07-01', '2025-06-30'),
				period('2023-07-01', '2024-06-30'),
				period('2022-07-01', '2023-06-30')
			),
			missingIn('Birkenhof', lastPeriod),
			missingIn('Erlenhof', lastPeriod),
			missingIn('Leerbau', period('2024-07-01', '2025-06-30')),
			missingIn('Lindenhof', lastPeriod),
			missingIn('Seeblick', lastPeriod)
		];
		const data = await load({ fetch: backend(200, missing) } as never);

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
		expect(data.tasks[2].text).toMatch(
			/Noch nicht abgerechnet: Ahornhof \(.*\), Birkenhof \(.*\), Erlenhof \(.*\), Leerbau \(.*\), Lindenhof \(.*\), Seeblick \(.*\)\./
		);
		expect(data.tasks[2].text).toContain(
			'Ahornhof (01.07.2025 – 30.06.2026, 01.07.2024 – 30.06.2025, 01.07.2023 – 30.06.2024, 01.07.2022 – 30.06.2023), Birkenhof (01.07.2025 – 30.06.2026),'
		);
	});

	it('erinnert an nichts, wenn das Backend keine fehlende Abrechnung nennt', async () => {
		const data = await load({ fetch: backend(200, []) } as never);
		expect(data.tasks.map((t) => t.id)).not.toContain('missing-period');
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
		// the contract tasks come with the figures (#788), so they stay when the other lists fail
		expect(data.tasks.map((task) => task.id)).toEqual([
			'overdue',
			'drafts',
			'old-address-t9',
			'successor-n2',
			'successor-n5',
			'successor-n1',
			'fixed-term-f1'
		]);
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
