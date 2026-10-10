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

/** An amount as typed in Switzerland ("1'200.50", "1’200,50") in the form the backend reads */
export const plainAmount = (value: string) => value.replace(/['’\s]/g, '').replace(',', '.');

/** What a new or changed invoice still lacks, by field */
export function validateInvoice(invoice: {
	buildingId: string;
	invoiceDate: string;
	billingEntity: string;
	description: string;
	amount: string;
}): Record<string, string> {
	const errors: Record<string, string> = {};
	if (!invoice.buildingId) errors.buildingId = 'Bitte wählen Sie ein Gebäude';
	if (!invoice.invoiceDate) errors.invoiceDate = 'Bitte geben Sie ein Datum ein';
	if (!invoice.billingEntity.trim()) errors.billingEntity = 'Bitte geben Sie einen Lieferanten ein';
	if (!invoice.description.trim()) errors.description = 'Bitte geben Sie eine Beschreibung ein';
	if (!(parseFloat(plainAmount(invoice.amount)) > 0))
		errors.amount = 'Bitte geben Sie einen gültigen Betrag ein';
	return errors;
}

/** A path within Dwello to return to (e.g. the statement wizard), never another site */
export function localPath(value: string | null): string | null {
	return value && /^\/(?![/\\])/.test(value) && !value.includes('\\') ? value : null;
}
