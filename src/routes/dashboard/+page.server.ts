import { m } from '$lib/paraglide/messages';
import { fetchRecord } from '$lib/server/save-form';
import {
	overviewDeadlines,
	overviewTasks,
	type BackendDeadline,
	type Deadline,
	type OverviewInput,
	type Task
} from '$lib/overview';
import { reletStarts } from '$lib/apartment';
import type { BackupState, KiModel } from '$lib/types';
import { backupState } from '$lib/server/backup';

interface DashboardData {
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
	statements: { draft: number; toSend: number; sent: number; paid: number; settled: number; overdue: number };
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
		reletStarts?: string[]; // Vertragsbeginn of each relet apartment, added here
		vacant?: { number: string; lastContractEnd: string | null }[]; // empty apartments, with their last Vertragsende (#145)
	}[];
	// the overview's tasks about contracts, decided by the backend (#788)
	contractTasks: Required<
		Pick<
			OverviewInput,
			| 'noticedContracts'
			| 'expiredContracts'
			| 'formerTenants'
			| 'oldAddresses'
			| 'missingStatements'
			| 'openCarryOvers'
		>
	>;
	deadlines: BackendDeadline[]; // which and how far away, decided by the backend by the Swiss day (#815)
}

/** What the overview page shows: the dashboard figures plus today's tasks and deadlines */
type OverviewData = Omit<DashboardData, 'deadlines'> & {
	tasks: Task[];
	deadlines: Deadline[];
	kiModel: KiModel;
	backup: BackupState;
	backupConfirmed: boolean; // just after «Sicherung einrichten» (#718)
};

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

type Row = Record<string, unknown>;

// A list the overview reads dates from; a list that fails to load only hides its tasks, the counts still show
async function list(fetch: typeof globalThis.fetch, path: string, key: string): Promise<Row[]> {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`).catch(() => null);
	return response?.ok ? ((await response.json())[key] ?? []) : [];
}

const tenantOf = (statement: Row) => {
	const tenant = statement.tenant as Row | null;
	return tenant ? `${tenant.firstName} ${tenant.lastName}` : '';
};

export const load = async ({
	fetch,
	url
}: {
	fetch: typeof globalThis.fetch;
	url?: URL;
}): Promise<OverviewData> => {
	const answer = (path: string) =>
		fetch(`${BACKEND_URL}/api/v1/${path}`)
			.then((response) => (response.ok ? response.json() : null))
			.catch(() => null);
	const backup = backupState(fetch);
	const kiModel: Promise<KiModel> = Promise.all([answer('ki-settings'), answer('ki/model')]).then(([ki, model]) =>
		ki?.mode === 'none' && !ki.byOperator ? { state: 'none' } : (model ?? { state: 'unknown' })
	);
	const [figures, open, letters, apartments, outdated] = await Promise.all([
		fetchRecord(
			fetch,
			`${BACKEND_URL}/api/v1/dashboard`,
			m.nav_overview()
		) as Promise<DashboardData>,
		// overdue and sent in one read: read apart, a Zahlungsfrist changed in between listed one statement twice (its
		// duplicate key stopped the page) or not at all (#605)
		list(fetch, 'statements?status=open&limit=1000', 'data'),
		list(fetch, 'documents?status=to_send', 'data'),
		list(fetch, 'apartments?limit=1000', 'apartments'),
		list(fetch, 'statements/outdated', 'statements') // #454
	]);
	const inBuilding = (buildingId: string) => apartments.filter((a) => a.buildingId === buildingId);
	figures.buildingOccupancy = figures.buildingOccupancy.map((b) => ({
		...b,
		reletStarts: reletStarts(inBuilding(b.buildingId)),
		vacant: inBuilding(b.buildingId)
			.filter((a) => a.status === 'vacant')
			.map((a) => ({
				number: String(a.number),
				lastContractEnd: (a.lastContractEnd as string | null) ?? null
			}))
	}));
	// which contracts need a next tenant, a question whether the tenant stayed, their former tenant's documents checked,
	// a new address or a statement, the backend decides (#788)
	const {
		noticedContracts,
		expiredContracts,
		formerTenants,
		oldAddresses,
		missingStatements,
		openCarryOvers
	} = figures.contractTasks;
	const input = {
		portfolio: figures.portfolio,
		statementCounts: figures.statements,
		dueStatements: open.map((s) => ({
			id: String(s.id),
			tenantName: tenantOf(s),
			paymentDeadline: String(s.paymentDeadline),
			reminderDue: s.reminderDue as boolean | null // #788: whether a Mahnung is due now, the backend decides
		})),
		lettersToSend: letters.length,
		missingStatements,
		outdatedStatements: outdated as OverviewInput['outdatedStatements'],
		noticedContracts,
		oldAddresses,
		expiredContracts,
		formerTenants,
		openCarryOvers
	};
	return {
		...figures,
		tasks: overviewTasks(input),
		deadlines: overviewDeadlines(figures.deadlines ?? []),
		kiModel: await kiModel,
		backup: await backup,
		backupConfirmed: url?.searchParams.get('backup') === 'confirmed'
	};
};
