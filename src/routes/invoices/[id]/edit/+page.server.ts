import type { InvoiceWithDetails, Category, DistributionKey } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface InvoiceEditData {
	invoice: InvoiceWithDetails;
	buildings: { id: string; name: string; address: string }[];
	categories: Category[];
	distributionKeys: DistributionKey[];
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<InvoiceEditData> => {
	try {
		const [invoiceRes, buildingsRes, categoriesRes, distributionKeysRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/invoices/${params.id}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/categories?limit=100`),
			fetch(`${BACKEND_URL}/api/v1/distribution-keys?limit=100`)
		]);

		if (!invoiceRes.ok) {
			if (invoiceRes.status === 404) {
				throw error(404, 'Rechnung nicht gefunden');
			}
			throw error(invoiceRes.status, 'Fehler beim Laden der Rechnung');
		}

		const data = await invoiceRes.json();
		const buildingsData = await buildingsRes.json();
		const categoriesData = await categoriesRes.json();
		const distributionKeysData = await distributionKeysRes.json();

		const invoice: InvoiceWithDetails = {
			id: data.id,
			buildingId: data.buildingId,
			invoiceDate: data.invoiceDate,
			billingEntity: data.billingEntityName || data.billingEntity || '',
			description: data.description || '',
			amount: Number(data.amount) || 0,
			categoryId: data.categoryId,
			distributionKeyId: data.distributionKeyId,
			isValidUtilityCost: data.isValidUtilityCost ?? true,
			llmConfidence: data.llmConfidence ? Number(data.llmConfidence) : undefined,
			llmReasoning: data.llmReasoning,
			buildingName: data.building?.name || '',
			buildingAddress: data.building?.address || '',
			category: data.category,
			distributionKey: data.distributionKey,
			categorizationStatus: data.categorizationStatus || 'pending'
		};

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

		const distributionKeys: DistributionKey[] = (distributionKeysData.data || []).map((d: Record<string, unknown>) => ({
			id: d.id,
			name: d.name,
			type: d.type,
			isActive: d.isActive
		}));

		return { invoice, buildings, categories, distributionKeys };
	} catch (err) {
		console.error('Failed to fetch invoice for edit:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden der Rechnung');
	}
};
