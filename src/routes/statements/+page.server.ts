import { error, redirect } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { formatDate } from '$lib/utils/format';
import { toStatement } from '$lib/server/statement';
import { statusLabels } from '$lib/statement';
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

// The sentence above the list: whose or which period's statements it shows (#673: with the building), then the status
function scopeSentence(
	url: URL,
	buildings: { id: string; name: string }[],
	contract: string | null
) {
	const [start, end] = [url.searchParams.get('periodStart'), url.searchParams.get('periodEnd')];
	const building = buildings.find((b) => b.id === url.searchParams.get('building'));
	// only a real date range is named; a hand-made address with another value gets no sentence
	const dates =
		isDate(start) && isDate(end) ? { start: formatDate(start), end: formatDate(end) } : null;
	const period =
		dates &&
		(building
			? m.statements_scope_period_building({ ...dates, building: building.name })
			: m.statements_scope_period(dates));
	const named = contract ?? period;
	// a second sentence names the chosen status, one the list knows (fach-review 673-1 V-3)
	const status = url.searchParams.get('status') ?? '';
	if (!named || !Object.hasOwn(statusLabels, status)) return named;
	return `${named} ${m.statements_scope_status({ status: statusLabels[status as keyof typeof statusLabels] })}`;
}

// #1236: a list that did not load says so, never an empty list with every count 0
async function backendJson(fetch: typeof globalThis.fetch, url: string) {
	const response = await fetch(url).catch((failure) => console.error(failure));
	if (!response?.ok) error(502, m.statements_list_load_failed());
	return response.json();
}

export const load: PageServerLoad = async ({ url, fetch }): Promise<StatementsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 10;
	const contractId = url.searchParams.get('contract');

	const params = backendQuery(url, page, pageSize);
	// the status tabs count over the same filters as the list, all but the status itself
	const counted = new URLSearchParams(params);
	for (const key of ['limit', 'offset', 'status']) counted.delete(key);
	const [statementsData, countsData, buildingsData, scope] = await Promise.all([
		backendJson(fetch, `${BACKEND_URL}/api/v1/statements?${params}`),
		backendJson(
			fetch,
			`${BACKEND_URL}/api/v1/statements/counts${counted.size ? `?${counted}` : ''}`
		),
		backendJson(fetch, `${BACKEND_URL}/api/v1/buildings?limit=1000`),
		// without the sentence the list still shows, as when the contract is gone
		contractId ? contractScope(fetch, contractId).catch(() => null) : null
	]);

	// #1237: a page past the last one (an old address) shows the last one, so the list agrees with the count
	const last = Math.max(1, Math.ceil((statementsData.total || 0) / pageSize));
	if (page > last) {
		const next = new URL(url);
		next.searchParams.set('page', String(last));
		redirect(307, `${next.pathname}${next.search}`);
	}

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
		scope: scopeSentence(url, buildings, scope),
		statusCounts: {
			draft: countsData.draft || 0,
			sent: countsData.sent || 0,
			paid: countsData.paid || 0,
			settled: countsData.settled || 0,
			overdue: countsData.overdue || 0
		}
	};
};
