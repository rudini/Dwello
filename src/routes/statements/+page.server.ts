import { m } from '$lib/paraglide/messages';
import { formatDate } from '$lib/utils/format';
import { toStatement } from '$lib/server/statement';
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

/** A calendar day as YYYY-MM-DD that exists (not 2024-13-45 or 2024-02-30) */
const isDate = (value: string | null): value is string =>
	!!value &&
	/^\d{4}-\d{2}-\d{2}$/.test(value) &&
	!Number.isNaN(Date.parse(value)) &&
	new Date(value).toISOString().startsWith(value);

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
	const [periodStart, periodEnd] = [url.searchParams.get('periodStart'), url.searchParams.get('periodEnd')];
	// only a real date range is named; a hand-made address with another value gets no sentence
	const periodScope =
		isDate(periodStart) && isDate(periodEnd)
			? m.statements_scope_period({ start: formatDate(periodStart), end: formatDate(periodEnd) })
			: null;

	try {
		const params = backendQuery(url, page, pageSize);
		// the status tabs count over the same filters as the list, all but the status itself
		const counted = new URLSearchParams(params);
		for (const key of ['limit', 'offset', 'status']) counted.delete(key);
		const [statementsRes, countsRes, buildingsRes, scope] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/statements?${params}`),
			fetch(`${BACKEND_URL}/api/v1/statements/counts${counted.size ? `?${counted}` : ''}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=1000`),
			contractId ? contractScope(fetch, contractId) : periodScope
		]);

		const statementsData = await statementsRes.json();
		const countsData = await countsRes.json();
		const buildingsData = await buildingsRes.json();

		const statements = (statementsData.data || []).map(toStatement);

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
				settled: countsData.settled || 0,
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
				settled: 0,
				overdue: 0
			}
		};
	}
};
