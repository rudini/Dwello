import { m } from '$lib/paraglide/messages';
import { formatDate } from '$lib/utils/format';
import type { StatementsListData } from '$lib/types';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Whose statements a contract filter shows: tenant, Wohnung and Vertragsbeginn, so two contracts never read alike
async function contractScope(fetch: typeof globalThis.fetch, id: string): Promise<string | null> {
	const response = await fetch(`${BACKEND_URL}/api/v1/contracts/${encodeURIComponent(id)}`);
	if (!response.ok) return null;
	const { tenant, apartment, building, startDate } = await response.json();
	return m.statements_scope_contract({
		tenant: `${tenant.firstName} ${tenant.lastName}`,
		apartment: apartment.number,
		building: building.name,
		start: formatDate(startDate)
	});
}

// The list's filters from the page URL, as the backend names them
const FILTERS = {
	status: 'status',
	building: 'buildingId',
	search: 'search',
	contract: 'contractId',
	periodStart: 'periodStart',
	periodEnd: 'periodEnd'
};

function backendQuery(url: URL, page: number, pageSize: number) {
	const params = new URLSearchParams({
		limit: String(pageSize),
		offset: String((page - 1) * pageSize)
	});
	for (const [name, backendName] of Object.entries(FILTERS)) {
		const value = url.searchParams.get(name);
		if (value) params.set(backendName, value);
	}
	return params;
}

export const load: PageServerLoad = async ({ url, fetch }): Promise<StatementsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 10;
	const contractId = url.searchParams.get('contract');
	const [periodStart, periodEnd] = [
		url.searchParams.get('periodStart'),
		url.searchParams.get('periodEnd')
	];
	const periodScope =
		periodStart && periodEnd
			? m.statements_scope_period({ start: formatDate(periodStart), end: formatDate(periodEnd) })
			: null;

	try {
		const params = backendQuery(url, page, pageSize);
		const [statementsRes, countsRes, buildingsRes, scope] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/statements?${params}`),
			fetch(`${BACKEND_URL}/api/v1/statements/counts`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
			contractId ? contractScope(fetch, contractId) : periodScope
		]);

		const statementsData = await statementsRes.json();
		const countsData = await countsRes.json();
		const buildingsData = await buildingsRes.json();

		// Transform backend data to match frontend types
		const statements = (statementsData.data || []).map((s: Record<string, unknown>) => {
			const tenant = s.tenant as Record<string, unknown> | null;
			const apartment = s.apartment as Record<string, unknown> | null;
			const building = s.building as Record<string, unknown> | null;
			return {
				id: s.id,
				statementNumber: s.statementNumber,
				tenantId: s.tenantId,
				apartmentId: s.apartmentId,
				buildingId: building?.id || '',
				periodStart: s.periodStart,
				periodEnd: s.periodEnd,
				statementDate: s.statementDate,
				rentalDays: s.rentalDays,
				totalCosts: Number(s.totalCosts),
				totalAdvancePayments: Number(s.totalAdvancePayments),
				managementFee: Number(s.managementFee),
				balance: Number(s.balance),
				status: s.status,
				paymentDeadline: s.paymentDeadline,
				paidDate: s.paidDate,
				pdfGeneratedAt: s.pdfGeneratedAt,
				lastReminderDate: s.reminderSentDate,
				tenantName: tenant
					? `${tenant.firstName} ${tenant.lastName}`
					: m.common_unknown(),
				tenantEmail: (tenant?.email as string) || '',
				apartmentUnit: (apartment?.number as string) || '',
				apartmentFloor: apartment?.floor || '',
				buildingName: (building?.name as string) || '',
				buildingAddress: (building?.address as string) || '',
				lineItems: s.lineItems || []
			};
		});

		const buildings = (buildingsData.buildings || buildingsData.data || []).map(
			(b: Record<string, unknown>) => ({
				id: b.id,
				name: b.name
			})
		);

		return {
			statements,
			total: statementsData.total || 0,
			page,
			pageSize,
			buildings,
			scope,
			statusCounts: {
				draft: countsData.draft || 0,
				sent: countsData.sent || 0,
				paid: countsData.paid || 0,
				overdue: countsData.overdue || 0
			}
		};
	} catch (error) {
		console.error('Failed to fetch statements:', error);
		// Return empty data on error
		return {
			statements: [],
			total: 0,
			page,
			pageSize,
			buildings: [],
			scope: null,
			statusCounts: {
				draft: 0,
				sent: 0,
				paid: 0,
				overdue: 0
			}
		};
	}
};
