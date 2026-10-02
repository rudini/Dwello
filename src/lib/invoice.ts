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
