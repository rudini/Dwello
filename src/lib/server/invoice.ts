import type { InvoiceWithDetails } from '$lib/types';
import { toCategory } from './category';
import { toDistributionKey } from './distribution-key';

type Related = Record<string, unknown> | null | undefined;

// Who chose the category: nobody yet, the KI (its suggestion kept), or the Liegenschaftsverwalter
function categorizationStatus(r: Record<string, unknown>): InvoiceWithDetails['categorizationStatus'] {
	if (!r.categoryId) return 'pending';
	return r.categoryId === r.llmCategoryId && !r.wasManuallyOverridden ? 'auto-categorized' : 'manual';
}

/** Backend invoice as shown in the German interface */
export function toInvoice(r: Record<string, unknown>): InvoiceWithDetails {
	const building = r.building as Record<string, string> | null;
	const category = r.category as Related;
	const key = r.distributionKey as Related;
	return {
		id: r.id as string,
		buildingId: r.buildingId as string,
		invoiceDate: r.invoiceDate as string,
		billingEntity: (r.billingEntityName || r.billingEntity || '') as string,
		description: (r.description || '') as string,
		amount: Number(r.amount) || 0,
		categoryId: r.categoryId as string | undefined,
		distributionKeyId: r.distributionKeyId as string | undefined,
		isValidUtilityCost: (r.isValidUtilityCost ?? true) as boolean,
		llmConfidence: r.llmConfidence ? Number(r.llmConfidence) : undefined,
		llmReasoning: r.llmReasoning as string | undefined,
		manualOverrideBy: r.manualOverrideBy as string | undefined,
		manualOverrideReason: r.manualOverrideReason as string | undefined,
		createdAt: r.createdAt as string | undefined,
		updatedAt: r.updatedAt as string | undefined,
		buildingName: building?.name || '',
		buildingAddress: building?.address || '',
		category: category ? toCategory(category) : undefined,
		distributionKey: key ? { id: key.id as string, name: toDistributionKey(key).name } : undefined,
		categorizationStatus: categorizationStatus(r)
	};
}
