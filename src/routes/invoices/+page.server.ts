import type { InvoicesListData } from '$lib/types';
import { invoiceChoices, toInvoice } from '$lib/server/invoice';
import type { PageServerLoad } from './$types';

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
	if (/^\d{4}$/.test(get('year'))) {
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

export const load: PageServerLoad = async ({ url, fetch }): Promise<InvoicesListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);
	const years = filterYears();

	try {
		const params = invoiceQuery(url, page, pageSize);

		const [invoicesRes, buildingsRes, choices] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/invoices?${params}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
			invoiceChoices(fetch)
		]);

		const invoicesData = await invoicesRes.json();
		const buildingsData = await buildingsRes.json();

		const buildings = (buildingsData.buildings || buildingsData.data || []).map(
			(b: Record<string, unknown>) => ({
				id: b.id,
				name: b.name || '',
				address: `${b.address}, ${b.postalCode} ${b.city}`
			})
		);

		const { categories } = choices;
		const invoices = (invoicesData.invoices || invoicesData.data || []).map(
			(r: Record<string, unknown>) => toInvoice(r, categories)
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
			defaultDistributionKeyId: choices.defaultDistributionKeyId
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
			defaultDistributionKeyId: ''
		};
	}
};
