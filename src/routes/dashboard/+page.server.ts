import { fetchRecord } from '$lib/server/save-form';
import { overviewDeadlines, overviewTasks, type Deadline, type Task } from '$lib/overview';

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
	}[];
}

/** What the overview page shows: the dashboard figures plus today's tasks and deadlines */
export type OverviewData = DashboardData & { tasks: Task[]; deadlines: Deadline[] };

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Row = Record<string, unknown>;

// A list the overview reads dates from; a list that fails to load only hides its tasks, the counts still show
async function list(fetch: typeof globalThis.fetch, path: string, key: string): Promise<Row[]> {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`);
	return response.ok ? ((await response.json())[key] ?? []) : [];
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
	const [figures, overdue, sent, letters, contracts] = await Promise.all([
		fetchRecord(fetch, `${BACKEND_URL}/api/v1/dashboard`, 'Übersicht') as Promise<DashboardData>,
		list(fetch, 'statements?status=overdue&limit=100', 'data'),
		list(fetch, 'statements?status=sent&limit=100', 'data'),
		list(fetch, 'documents?status=to_send', 'data'),
		list(fetch, 'contracts?status=active&limit=100', 'contracts')
	]);
	const input = {
		today: new Date().toLocaleDateString('sv-SE'), // local YYYY-MM-DD
		portfolio: figures.portfolio,
		statementCounts: figures.statements,
		dueStatements: [...overdue, ...sent].map((s) => ({
			id: String(s.id),
			tenantName: tenantOf(s),
			paymentDeadline: String(s.paymentDeadline)
		})),
		lettersToSend: letters.length,
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
