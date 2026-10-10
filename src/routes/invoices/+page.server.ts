import type { InvoicesListData } from '$lib/types';
import { toCategory } from '$lib/server/category';
import { toInvoice } from '$lib/server/invoice';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ url, fetch }): Promise<InvoicesListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);
	const search = url.searchParams.get('search') || '';
	const building = url.searchParams.get('building') || '';
	const categoryId = url.searchParams.get('categoryId') || '';
	const validity = url.searchParams.get('validity') || '';

	try {
		const params = new URLSearchParams({
			limit: String(pageSize),
			offset: String((page - 1) * pageSize)
		});
		if (search) params.set('search', search);
		if (building) params.set('buildingId', building);
		if (categoryId) params.set('categoryId', categoryId);
		if (validity) params.set('isValidUtilityCost', String(validity === 'valid'));

		const [invoicesRes, buildingsRes, categoriesRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/invoices?${params}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/categories?limit=100`)
		]);

		const invoicesData = await invoicesRes.json();
		const buildingsData = await buildingsRes.json();
		const categoriesData = await categoriesRes.json();

		const invoices = (invoicesData.invoices || invoicesData.data || []).map(toInvoice);

		const buildings = (buildingsData.buildings || buildingsData.data || []).map(
			(b: Record<string, unknown>) => ({
				id: b.id,
				name: b.name || '',
				address: `${b.address}, ${b.postalCode} ${b.city}`
			})
		);

		const categories = (categoriesData.categories || categoriesData.data || []).map(toCategory);

		return {
			invoices,
			total: invoicesData.total || 0,
			page,
			pageSize,
			buildings,
			categories
		};
	} catch (err) {
		console.error('Failed to fetch invoices:', err);
		return {
			invoices: [],
			total: 0,
			page,
			pageSize,
			buildings: [],
			categories: []
		};
	}
};
