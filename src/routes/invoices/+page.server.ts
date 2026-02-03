import type { InvoicesListData, InvoiceWithDetails, Category } from '$lib/types';
import type { PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ url, fetch }): Promise<InvoicesListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '20', 10);
	const search = url.searchParams.get('search') || '';
	const buildingId = url.searchParams.get('buildingId') || '';
	const categoryId = url.searchParams.get('categoryId') || '';
	const validity = url.searchParams.get('validity') || '';

	try {
		const params = new URLSearchParams();
		params.set('limit', String(pageSize));
		params.set('offset', String((page - 1) * pageSize));
		if (search) params.set('search', search);
		if (buildingId) params.set('buildingId', buildingId);
		if (categoryId) params.set('categoryId', categoryId);
		if (validity) params.set('validity', validity);

		const [invoicesRes, buildingsRes, categoriesRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/invoices?${params}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/categories?limit=100`)
		]);

		const invoicesData = await invoicesRes.json();
		const buildingsData = await buildingsRes.json();
		const categoriesData = await categoriesRes.json();

		const invoices: InvoiceWithDetails[] = (invoicesData.invoices || invoicesData.data || []).map((inv: Record<string, unknown>) => ({
			id: inv.id,
			buildingId: inv.buildingId,
			invoiceDate: inv.invoiceDate,
			billingEntity: inv.billingEntityName || inv.billingEntity || '',
			description: inv.description || '',
			amount: Number(inv.amount) || 0,
			categoryId: inv.categoryId,
			distributionKeyId: inv.distributionKeyId,
			isValidUtilityCost: inv.isValidUtilityCost ?? true,
			llmConfidence: inv.llmConfidence ? Number(inv.llmConfidence) : undefined,
			llmReasoning: inv.llmReasoning,
			manualOverrideBy: inv.manualOverrideBy,
			manualOverrideReason: inv.manualOverrideReason,
			buildingName: (inv.building as Record<string, string>)?.name || '',
			buildingAddress: (inv.building as Record<string, string>)?.address || '',
			category: inv.category as Category | undefined,
			distributionKey: inv.distributionKey,
			categorizationStatus: inv.categorizationStatus || 'pending'
		}));

		const buildings = (buildingsData.buildings || buildingsData.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: b.name || '',
			address: `${b.address}, ${b.postalCode} ${b.city}`
		}));

		const categories: Category[] = (categoriesData.data || []).map((c: Record<string, unknown>) => ({
			id: c.id,
			name: c.name,
			isAllowedUtilityCost: c.isAllowedUtilityCost,
			description: c.description
		}));

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
