/**
 * The categorization prompt carries the invoice text unchanged
 */

import { describe, expect, it } from 'bun:test';
import { buildCategorizationPrompt } from '../config/llm';

describe('Prompt der Kategorisierung', () => {
	it('übernimmt Sonderzeichen der Rechnung unverändert', () => {
		const prompt = buildCategorizationPrompt(
			{
				billingEntityName: '{description} AG',
				description: "Service $& und $' pauschal",
				amount: 100
			},
			[]
		);
		expect(prompt).toContain('Rechnungssteller: {description} AG\n');
		expect(prompt).toContain("Beschreibung: Service $& und $' pauschal\n");
	});
});

const invoice = { billingEntityName: 'Muster AG', description: 'Wartung', amount: 100 };
const categories = [
	{
		name: 'Heating',
		nameDE: 'Heizung',
		description: 'Kosten für das Heizen',
		isAllowedUtilityCost: true
	},
	{
		name: 'Treppenhausreinigung',
		nameDE: 'Treppenhausreinigung',
		description: null,
		isAllowedUtilityCost: true
	},
	{ name: 'Repairs', nameDE: 'Reparaturen', description: null, isAllowedUtilityCost: false }
];

describe('Rechtsgrundlage und Kategorien im Prompt', () => {
	it('zitiert OR und VMWG wörtlich nach Fedlex', () => {
		const prompt = buildCategorizationPrompt(invoice, categories);
		expect(prompt).toContain(
			'Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.'
		);
		expect(prompt).toContain(
			'Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.'
		);
		expect(prompt).toContain('a. die Reparatur und Erneuerung der Anlagen;');
		expect(prompt).toContain('Art. 5 und 6 VMWG gelten nur für Heizungs- und Warmwasserkosten');
	});

	it('bietet die Kategorien der Stammdaten an, auch eigene', () => {
		const prompt = buildCategorizationPrompt(invoice, categories);
		expect(prompt).toContain('- Heating (Heizung): Kosten für das Heizen\n');
		expect(prompt).toContain('- Treppenhausreinigung\n');
		expect(prompt).toMatch(/NICHT ERLAUBTE KATEGORIEN[^\n]*\n- Repairs \(Reparaturen\)\n/);
	});
});
