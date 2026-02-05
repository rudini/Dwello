import type { InvoiceWithDetails } from '$lib/types';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface InvoiceDetailData {
	invoice: InvoiceWithDetails;
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<InvoiceDetailData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/invoices/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, 'Rechnung nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden der Rechnung');
		}

		const data = await response.json();

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
			manualOverrideBy: data.manualOverrideBy,
			manualOverrideReason: data.manualOverrideReason,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			buildingName: data.building?.name || '',
			buildingAddress: data.building?.address || '',
			category: data.category,
			distributionKey: data.distributionKey,
			categorizationStatus: data.categorizationStatus || 'pending'
		};

		return { invoice };
	} catch (err) {
		console.error('Failed to fetch invoice:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden der Rechnung');
	}
};
