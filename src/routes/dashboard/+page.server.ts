import { m } from '$lib/paraglide/messages';
import { fetchRecord } from '$lib/server/save-form';
import { missingByContract } from '$lib/server/missing-statements';
import { overviewDeadlines, overviewTasks, type Deadline, type Task } from '$lib/overview';
import { localToday } from '$lib/contract-status';
import { reletStarts } from '$lib/apartment';
import { formerTenantDocuments } from '$lib/former-tenant-documents';

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
	statements: { draft: number; sent: number; paid: number; settled: number; overdue: number };
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

// The settings the overview reads; a failed load leaves the defaults of the backend
async function settings(fetch: typeof globalThis.fetch): Promise<Record<string, string>> {
	const response = await fetch(`${BACKEND_URL}/api/v1/config`).catch(() => null);
	return response?.ok ? ((await response.json()).data ?? {}) : {};
}

// Per building the parts of ended Abrechnungsperioden since a Vertragsbeginn without a statement, as on the contract
// page (#211); each once, the latest first, also of a contract that has ended since
async function missingStatements(fetch: typeof globalThis.fetch, contracts: Row[]) {
	const missing = await missingByContract(fetch, contracts);
	if (!missing) return []; // unknown: better no task than every building
	const byBuilding = new Map<string, Map<string, { start: string; end: string }>>();
	for (const c of contracts)
		for (const range of missing.get(String(c.id)) ?? []) {
			const building = String(c.buildingName);
			if (!byBuilding.has(building)) byBuilding.set(building, new Map());
			byBuilding.get(building)!.set(`${range.start}/${range.end}`, range);
		}
	return [...byBuilding]
		.sort(([a], [b]) => a.localeCompare(b, 'de-CH'))
		.map(([building, ranges]) => ({
			building,
			periods: [...ranges.values()].sort(
				(a, b) => b.start.localeCompare(a.start) || b.end.localeCompare(a.end)
			)
		}));
}

// A later contract for the same apartment
const later = (contracts: Row[], c: Row) =>
	contracts.some((o) => o.apartmentId === c.apartmentId && String(o.startDate) > String(c.endDate));

// Given notice and no later contract for the apartment yet: a next tenant is still to find, also after the end
// (A-4.1, review K-6)
function noticed(contracts: Row[]) {
	return contracts
		.filter((c) => c.terminated && c.endDate && !later(contracts, c))
		.map((c) => ({
			id: String(c.id),
			tenantName: String(c.tenantName),
			apartmentId: String(c.apartmentId),
			apartmentNumber: String(c.apartmentNumber),
			endDate: String(c.endDate)
		}));
}

// Drafts that would go to the apartment a moved-out tenant left, once per tenant (A-5, #114)
const oldAddresses = (drafts: Row[]) => [
	...new Map(
		drafts
			.filter((s) => s.oldAddress)
			.map((s) => [String(s.tenantId), { tenantId: String(s.tenantId), tenantName: tenantOf(s) }])
	).values()
];
// An agreed end passed, no later contract and no «Mieter ist ausgezogen»: the tenant may have stayed (A-6)
const expired = (contracts: Row[], today: string) =>
	contracts
		.filter(
			(c) =>
				c.endDate &&
				String(c.endDate) < today &&
				!c.terminated &&
				!c.movedOut &&
				!later(contracts, c)
		)
		.map((c) => ({
			id: String(c.id),
			tenantName: String(c.tenantName),
			endDate: String(c.endDate)
		}));

// Ehemalige Mieter with uploads from before their last Vertragsende (#178)
type Contracts = Parameters<typeof formerTenantDocuments>[0];
function formerTenants(contracts: Row[], documents: Row[], today: string) {
	const of = (rows: Row[], tenantId: unknown) => rows.filter((r) => r.tenantId === tenantId);
	return [...new Set(contracts.map((c) => c.tenantId))].flatMap((tenantId) => {
		const former = formerTenantDocuments(
			of(contracts, tenantId) as Contracts,
			of(documents, tenantId) as { type: string; createdAt: string }[],
			today,
			contracts as Contracts
		);
		const tenantName = String(contracts.find((c) => c.tenantId === tenantId)?.tenantName);
		return former
			? [{ tenantId: String(tenantId), tenantName, endDate: former.endDate, count: former.documents.length }]
			: [];
	});
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
	const config = settings(fetch).catch(() => ({}) as Record<string, string>);
	const [
		figures,
		overdue,
		sent,
		letters,
		contracts,
		apartments,
		allContracts,
		stored,
		drafts,
		documents
	] = await Promise.all([
		fetchRecord(
			fetch,
			`${BACKEND_URL}/api/v1/dashboard`,
			m.nav_overview()
		) as Promise<DashboardData>,
		list(fetch, 'statements?status=overdue&limit=100', 'data'),
		list(fetch, 'statements?status=sent&limit=100', 'data'),
		list(fetch, 'documents?status=to_send', 'data'),
		list(fetch, 'contracts?status=active&limit=100', 'contracts'),
		list(fetch, 'apartments?limit=1000', 'apartments'),
		list(fetch, 'contracts?limit=1000', 'contracts'),
		config,
		list(fetch, 'statements?status=draft&limit=100', 'data'),
		list(fetch, 'documents', 'data')
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
	const noticedContracts = noticed(allContracts);
	const today = localToday(); // the day in Switzerland
	const input = {
		today,
		portfolio: figures.portfolio,
		statementCounts: figures.statements,
		dueStatements: [...overdue, ...sent].map((s) => ({
			id: String(s.id),
			tenantName: tenantOf(s),
			paymentDeadline: String(s.paymentDeadline),
			nextReminderFrom: s.nextReminderFrom as string | null,
			refund: Number(s.balance) < 0
		})),
		paymentDeadlineDays: Number(stored.payment_deadline_days ?? 30),
		reminderAfterDays: Number(stored.reminder_after_days ?? 14),
		lettersToSend: letters.length,
		missingStatements: await missingStatements(fetch, allContracts).catch(() => []),
		noticedContracts,
		oldAddresses: oldAddresses(drafts),
		expiredContracts: expired(allContracts, today),
		formerTenants: formerTenants(allContracts, documents, today),
		// a contract with a task is named by it, not twice (A-4.4); one given notice with a next tenant keeps its
		// deadline (review K-6)
		endingContracts: contracts
			.filter((c) => c.endDate && !noticedContracts.some((n) => n.id === c.id))
			.map((c) => ({
				id: String(c.id),
				tenantName: String(c.tenantName),
				endDate: String(c.endDate)
			}))
	};
	return { ...figures, tasks: overviewTasks(input), deadlines: overviewDeadlines(input) };
};
