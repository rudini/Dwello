import type { InvoicesListData } from '$lib/types';
import { invoiceChoices, tankCategories, toInvoice, type InvoiceRow } from '$lib/server/invoice';
import { kiOff } from '$lib/server/ki-settings';
import { fail } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { periodName } from '$lib/accounting-period';
import type { ExpiredInvoicePeriod } from '../../../backend/src/api/invoice';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

/** The backend query of the list: page, search and filters from the address */
function invoiceQuery(url: URL, page: number, pageSize: number) {
	const get = (key: string) => url.searchParams.get(key) || '';
	const params = new URLSearchParams({
		limit: String(pageSize),
		offset: String((page - 1) * pageSize)
	});
	if (get('search')) params.set('search', get('search'));
	if (get('building')) params.set('buildingId', get('building'));
	if (get('categoryId')) params.set('categoryId', get('categoryId'));
	if (get('validity')) params.set('isValidUtilityCost', String(get('validity') === 'valid'));
	// #454: the invoices that fall into an Abrechnungsperiode, as its warnings link to them
	const day = /^\d{4}-\d{2}-\d{2}$/;
	if (day.test(get('periodStart')) && day.test(get('periodEnd'))) {
		params.set('periodStart', get('periodStart'));
		params.set('periodEnd', get('periodEnd'));
	}
	// with a period no year by Rechnungsdatum: it would drop invoices the period takes by Leistungszeitraum (D-1)
	else if (/^\d{4}$/.test(get('year'))) {
		params.set('dateFrom', `${get('year')}-01-01`);
		params.set('dateTo', `${get('year')}-12-31`);
	}
	return params;
}

// The Rechnungsdatum's year: this one and the five before (statements look back one period)
const filterYears = () => {
	const thisYear = new Date().getFullYear();
	return Array.from({ length: 6 }, (_, i) => String(thisYear - i));
};

/** #1410: the list's building and period when their Aufbewahrungsfrist has passed and they are not kept, else null */
async function expiredPeriod(fetch: typeof globalThis.fetch, url: URL) {
	const [building, start] = [url.searchParams.get('building'), url.searchParams.get('periodStart')];
	if (!building || !start) return null;
	const { periods = [] } = (await (
		await fetch(`${BACKEND_URL}/api/v1/invoices/retention`)
	).json()) as { periods?: ExpiredInvoicePeriod[] };
	const found = periods.find((p) => p.buildingId === building && p.start === start);
	return found ? { ...found, period: periodName(found) } : null;
}

export const load: PageServerLoad = async ({
	url,
	fetch
}): Promise<InvoicesListData & { retention: Awaited<ReturnType<typeof expiredPeriod>> }> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);
	const years = filterYears();

	try {
		const params = invoiceQuery(url, page, pageSize);

		const [invoicesRes, buildingsRes, choices, noKi, retention] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/invoices?${params}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=all`),
			invoiceChoices(fetch),
			kiOff(fetch),
			expiredPeriod(fetch, url)
		]);

		const invoicesData = await invoicesRes.json();
		const buildingsData = await buildingsRes.json();

		const listed = (buildingsData.buildings || buildingsData.data || []).map(
			(b: Record<string, unknown>) => ({
				id: b.id,
				name: b.name || '',
				address: `${b.address}, ${b.postalCode} ${b.city}`
			})
		);
		// each with the category of its tank: «Rechnungen hochladen» explains a delivery there (#451, M-1)
		const tanks = await tankCategories(fetch, listed.map((b: { id: unknown }) => String(b.id)));
		const buildings = listed.map((b: { id: unknown }) => ({ ...b, tank: tanks[String(b.id)] }));

		const { categories } = choices;
		const invoices = (invoicesData.invoices || invoicesData.data || []).map((r: InvoiceRow) =>
			toInvoice(r, categories)
		);

		return {
			invoices,
			total: invoicesData.total || 0,
			page,
			pageSize,
			buildings,
			categories,
			years,
			distributionKeys: choices.distributionKeys,
			defaultDistributionKeyId: choices.defaultDistributionKeyId,
			latestKeys: choices.latestKeys,
			kiOff: noKi,
			retention
		};
	} catch (err) {
		console.error('Failed to fetch invoices:', err);
		return {
			invoices: [],
			total: 0,
			page,
			pageSize,
			buildings: [],
			categories: [],
			years,
			distributionKeys: [],
			defaultDistributionKeyId: '',
			latestKeys: [],
			kiOff: false,
			retention: null
		};
	}
};

export const actions: Actions = {
	// #1410: «Behalten» of the building's invoices of the period; the overview no longer names them
	keep: async ({ fetch, request }) => {
		const form = await request.formData();
		const response = await fetch(`${BACKEND_URL}/api/v1/invoices/retention/kept`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				buildingId: form.get('buildingId'),
				periodStart: form.get('periodStart')
			})
		});
		if (!response.ok) return fail(response.status, { keepError: m.contracts_save_failed() });
	}
};
