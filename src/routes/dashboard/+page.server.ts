import { m } from '$lib/paraglide/messages';
import { fetchRecord } from '$lib/server/save-form';
import { lastCompletedPeriod, type AccountingPeriodType } from '$lib/accounting-period';
import { overviewDeadlines, overviewTasks, type Deadline, type Task } from '$lib/overview';
import { localToday } from '$lib/contract-status';

export interface DashboardData {
	portfolio: {
		totalBuildings: number;
		totalApartments: number;
		occupiedApartments: number;
		reletApartments: number;
		vacantApartments: number;
		reservedApartments: number;
		occupancyRate: number;
	};
	financial: {
		outstandingStatements: number; // sent, overdue included
		totalPending: number; // what tenants still owe, refunds excluded
		overdueAmount: number;
		paidThisMonth: number;
	};
	statements: { draft: number; sent: number; paid: number; overdue: number };
	recentActivity: {
		id: string;
		type: 'statement_created' | 'invoice_added' | 'payment_received';
		title: string;
		description: string;
		timestamp: string;
	}[];
	buildingOccupancy: {
		buildingId: string;
		buildingName: string;
		totalApartments: number;
		occupiedApartments: number;
		occupancyRate: number;
		reletStarts?: string[]; // Vertragsbeginn of each relet apartment, added here
	}[];
}

/** What the overview page shows: the dashboard figures plus today's tasks and deadlines */
export type OverviewData = DashboardData & { tasks: Task[]; deadlines: Deadline[] };

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Row = Record<string, unknown>;

// A list the overview reads dates from; a list that fails to load only hides its tasks, the counts still show
async function list(fetch: typeof globalThis.fetch, path: string, key: string): Promise<Row[]> {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`).catch(() => null);
	return response?.ok ? ((await response.json())[key] ?? []) : [];
}

// The last ended Abrechnungsperiode and the Mietverträge that already have a Nebenkostenabrechnung for it
async function lastPeriod(fetch: typeof globalThis.fetch) {
	const config = await fetch(`${BACKEND_URL}/api/v1/config`);
	if (!config.ok) return null;
	const type = ((await config.json()).data?.accounting_period ??
		'calendar') as AccountingPeriodType;
	const period = lastCompletedPeriod(type);
	const response = await fetch(
		`${BACKEND_URL}/api/v1/statements?periodStart=${period.start}&periodEnd=${period.end}&limit=1000`
	);
	if (!response.ok) return null; // unknown: better no task than every building
	const statements: Row[] = (await response.json()).data ?? [];
	return { ...period, done: new Set(statements.map((s) => s.contractId)) };
}

// Buildings with a Mietvertrag in the last period that has no statement yet, also one that has ended since
function missingPeriod(period: Awaited<ReturnType<typeof lastPeriod>>, contracts: Row[]) {
	if (!period) return null;
	const missing = contracts.filter(
		(c) =>
			String(c.startDate) <= period.end &&
			(!c.endDate || String(c.endDate) >= period.start) &&
			!period.done.has(c.id)
	);
	const buildings = [...new Set(missing.map((c) => String(c.buildingName)))].sort((a, b) =>
		a.localeCompare(b, 'de-CH')
	);
	return buildings.length ? { start: period.start, end: period.end, buildings } : null;
}

const tenantOf = (statement: Row) => {
	const tenant = statement.tenant as Row | null;
	return tenant ? `${tenant.firstName} ${tenant.lastName}` : '';
};

export const load = async ({
	fetch
}: {
	fetch: typeof globalThis.fetch;
}): Promise<OverviewData> => {
	const [figures, overdue, sent, letters, contracts, period, apartments, allContracts] =
		await Promise.all([
			fetchRecord(
				fetch,
				`${BACKEND_URL}/api/v1/dashboard`,
				m.nav_overview()
			) as Promise<DashboardData>,
			list(fetch, 'statements?status=overdue&limit=100', 'data'),
			list(fetch, 'statements?status=sent&limit=100', 'data'),
			list(fetch, 'documents?status=to_send', 'data'),
			list(fetch, 'contracts?status=active&limit=100', 'contracts'),
			lastPeriod(fetch).catch(() => null),
			list(fetch, 'apartments?limit=1000', 'apartments'),
			list(fetch, 'contracts?limit=1000', 'contracts')
		]);
	const reletStarts = (buildingId: string) =>
		apartments
			.filter((a) => a.buildingId === buildingId && a.status === 'relet')
			.map((a) => String(a.nextContractStart))
			.sort();
	figures.buildingOccupancy = figures.buildingOccupancy.map((b) => ({
		...b,
		reletStarts: reletStarts(b.buildingId)
	}));
	const input = {
		today: localToday(), // the day in Switzerland
		portfolio: figures.portfolio,
		statementCounts: figures.statements,
		dueStatements: [...overdue, ...sent].map((s) => ({
			id: String(s.id),
			tenantName: tenantOf(s),
			paymentDeadline: String(s.paymentDeadline)
		})),
		lettersToSend: letters.length,
		missingPeriod: missingPeriod(period, allContracts),
		endingContracts: contracts
			.filter((c) => c.endDate)
			.map((c) => ({
				id: String(c.id),
				tenantName: String(c.tenantName),
				endDate: String(c.endDate)
			}))
	};
	return { ...figures, tasks: overviewTasks(input), deadlines: overviewDeadlines(input) };
};
