import { m } from '$lib/paraglide/messages';

/** The KI's category for an invoice, with its confidence (0 to 1) and reasoning */
export type Suggestion = {
	category: { id: string; name: string; isAllowedUtilityCost: boolean } | null;
	confidence: number;
	reasoning?: string;
	isAllowedUtilityCost: boolean;
};

/** What a new invoice records about the KI's suggestion, so the invoice shows whether its category came from the KI */
export function suggestionProvenance(suggestion: Suggestion | null) {
	if (!suggestion?.category) return {};
	return { llmCategoryId: suggestion.category.id, llmConfidence: String(suggestion.confidence) };
}

/** The Leistungszeitraum as the backend stores it: both dates, or null without one */
export const servicePeriodOf = (values: { servicePeriodStart: string; servicePeriodEnd: string }) => ({
	servicePeriodStart: values.servicePeriodStart || null,
	servicePeriodEnd: values.servicePeriodEnd || null
});

/** An amount as typed in Switzerland ("1'200.50", "1’200,50") in the form the backend reads */
export const plainAmount = (value: string) =>
	value.replace(/['’\s]/g, '').replace(',', '.').replace(/\.[-–—]+$/, ''); // «1'450.-»: whole francs

// The Leistungszeitraum is optional, but with both dates and the end not before the start (ISO dates compare as text)
function servicePeriodErrors(start = '', end = ''): Record<string, string> {
	if (start && !end) return { servicePeriodEnd: m.invoices_error_service_end() };
	if (end && !start) return { servicePeriodStart: m.invoices_error_service_start() };
	if (end < start) return { servicePeriodEnd: m.invoices_error_service_order() };
	return {};
}

/** What a new or changed invoice still lacks, by field */
export function validateInvoice(invoice: {
	buildingId: string;
	invoiceDate: string;
	billingEntity: string;
	description: string;
	amount: string;
	servicePeriodStart?: string;
	servicePeriodEnd?: string;
	distributionKeyId?: string;
}): Record<string, string> {
	const errors: Record<string, string> = {};
	if (!invoice.buildingId) errors.buildingId = m.invoices_error_building();
	if (!invoice.invoiceDate) errors.invoiceDate = m.invoices_error_date();
	if (!invoice.billingEntity.trim()) errors.billingEntity = m.invoices_error_billing_entity();
	if (!invoice.description.trim()) errors.description = m.invoices_error_description();
	if (!(parseFloat(plainAmount(invoice.amount)) > 0)) errors.amount = m.invoices_error_amount();
	// #379: every invoice says how its costs are shared
	if (!invoice.distributionKeyId) errors.distributionKeyId = m.invoices_error_key_required();
	return { ...errors, ...servicePeriodErrors(invoice.servicePeriodStart, invoice.servicePeriodEnd) };
}

/** Per building and category the Verteilschlüssel of the latest invoice with one (backend `/invoices/latest-keys`) */
export type LatestKey = { buildingId: string; categoryId: string; distributionKeyId: string };

/** What the proposal needs where the building is chosen elsewhere, as in «Rechnungen hochladen» */
export type KeyProposal = { buildingId: string; latestKeys: LatestKey[]; defaultKeyId: string };

/** The key the invoice form proposes (#379): that of the latest invoice of the category in the building, else the default */
export const proposedKey = (latest: LatestKey[], buildingId: string, categoryId: string, fallback: string) =>
	latest.find((row) => row.buildingId === buildingId && row.categoryId === categoryId)?.distributionKeyId ?? fallback;

/** A path within Dwello to return to (e.g. the statement wizard), never another site */
export function localPath(value: string | null): string | null {
	return value && /^\/(?![/\\])/.test(value) && !value.includes('\\') ? value : null;
}
