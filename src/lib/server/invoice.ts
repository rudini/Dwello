import type { InvoiceWithDetails } from '$lib/types';
import { toCategory } from './category';
import { toDistributionKey } from './distribution-key';

type Related = Record<string, unknown> | null | undefined;

// Who chose the category: nobody yet, the KI (its suggestion kept), or the Liegenschaftsverwalter
function categorizationStatus(
	r: Record<string, unknown>
): InvoiceWithDetails['categorizationStatus'] {
	if (!r.categoryId) return 'pending';
	return r.categoryId === r.llmCategoryId && !r.wasManuallyOverridden
		? 'auto-categorized'
		: 'manual';
}

/** Backend invoice as shown in the German interface */
export function toInvoice(r: Record<string, unknown>): InvoiceWithDetails {
	const building = r.building as Record<string, string> | null;
	const category = r.category as Related;
	const key = r.distributionKey as Related;
	const suggested = r.llmCategory as Related;
	return {
		id: r.id as string,
		buildingId: r.buildingId as string,
		invoiceDate: r.invoiceDate as string,
		servicePeriodStart: r.servicePeriodStart as string | undefined,
		servicePeriodEnd: r.servicePeriodEnd as string | undefined,
		billingEntity: (r.billingEntityName || r.billingEntity || '') as string,
		description: (r.description || '') as string,
		amount: Number(r.amount) || 0,
		categoryId: r.categoryId as string | undefined,
		distributionKeyId: r.distributionKeyId as string | undefined,
		isValidUtilityCost: (r.isValidUtilityCost ?? true) as boolean,
		llmConfidence: r.llmConfidence ? Number(r.llmConfidence) : undefined,
		manualOverrideReason: r.manualOverrideReason as string | undefined,
		createdAt: r.createdAt as string | undefined,
		updatedAt: r.updatedAt as string | undefined,
		buildingName: building?.name || '',
		buildingAddress: building?.address || '',
		category: category ? toCategory(category) : undefined,
		distributionKey: key ? { id: key.id as string, name: toDistributionKey(key).name } : undefined,
		llmCategory: suggested
			? { id: suggested.id as string, name: toCategory(suggested).name }
			: undefined,
		categorizationStatus: categorizationStatus(r)
	};
}

type StatementPeriod = { periodStart: string; periodEnd: string; createdAt: string };

/**
 * The periods whose statements took this invoice: it was allocable and recorded before they were created, and its
 * Leistungszeitraum (else its Rechnungsdatum) overlaps their period
 */
export async function billedIn(fetch: typeof globalThis.fetch, backendUrl: string, invoice: Record<string, unknown>) {
	if (invoice.isValidUtilityCost === false) return [];
	const response = await fetch(`${backendUrl}/api/v1/statements?buildingId=${invoice.buildingId}&limit=1000`).catch(() => null);
	const statements: StatementPeriod[] = response?.ok ? ((await response.json()).data ?? []) : [];
	const start = (invoice.servicePeriodStart ?? invoice.invoiceDate) as string;
	const end = (invoice.servicePeriodEnd ?? invoice.invoiceDate) as string;
	const periods = statements
		.filter((s) => s.periodStart <= end && s.periodEnd >= start && s.createdAt >= String(invoice.createdAt))
		.map((s) => `${s.periodStart}/${s.periodEnd}`);
	return [...new Set(periods)].map((period) => {
		const [periodStart, periodEnd] = period.split('/');
		return { start: periodStart, end: periodEnd };
	});
}
