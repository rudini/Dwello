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
export const plainAmount = (value: string) => value.replace(/['’\s]/g, '').replace(',', '.');

// The Leistungszeitraum is optional, but with both dates and the end not before the start (ISO dates compare as text)
function servicePeriodErrors(start = '', end = ''): Record<string, string> {
	if (start && !end) return { servicePeriodEnd: 'Bitte geben Sie auch das Ende des Leistungszeitraums ein.' };
	if (end && !start) return { servicePeriodStart: 'Bitte geben Sie auch den Beginn des Leistungszeitraums ein.' };
	if (end < start) return { servicePeriodEnd: 'Das Ende darf nicht vor dem Beginn liegen.' };
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
}): Record<string, string> {
	const errors: Record<string, string> = {};
	if (!invoice.buildingId) errors.buildingId = 'Bitte wählen Sie ein Gebäude';
	if (!invoice.invoiceDate) errors.invoiceDate = 'Bitte geben Sie ein Datum ein';
	if (!invoice.billingEntity.trim())
		errors.billingEntity = 'Bitte geben Sie einen Rechnungssteller ein';
	if (!invoice.description.trim()) errors.description = 'Bitte geben Sie eine Beschreibung ein';
	if (!(parseFloat(plainAmount(invoice.amount)) > 0))
		errors.amount = 'Bitte geben Sie einen gültigen Betrag ein';
	return { ...errors, ...servicePeriodErrors(invoice.servicePeriodStart, invoice.servicePeriodEnd) };
}

/** A path within Dwello to return to (e.g. the statement wizard), never another site */
export function localPath(value: string | null): string | null {
	return value && /^\/(?![/\\])/.test(value) && !value.includes('\\') ? value : null;
}
