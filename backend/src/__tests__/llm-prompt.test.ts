/**
 * The categorization prompt carries the invoice text unchanged
 */

import { describe, expect, it } from 'bun:test';
import { buildCategorizationPrompt } from '../config/llm';

describe('Prompt der Kategorisierung', () => {
	it('übernimmt Sonderzeichen der Rechnung unverändert', () => {
		const prompt = buildCategorizationPrompt({
			billingEntityName: '{description} AG',
			description: "Service $& und $' pauschal",
			amount: 100
		});
		expect(prompt).toContain('Rechnungssteller: {description} AG\n');
		expect(prompt).toContain("Beschreibung: Service $& und $' pauschal\n");
	});
});
