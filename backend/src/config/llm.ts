/**
 * LLM Configuration
 * Configuration for Ollama-based invoice categorization
 */

// Ollama configuration
export const llmConfig = {
	// Ollama API endpoint
	baseUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',

	// Model to use for categorization (qwen2.5:3b is small but accurate for German)
	model: process.env.OLLAMA_MODEL || 'qwen2.5:3b',

	// Request timeout in milliseconds
	timeout: parseInt(process.env.OLLAMA_TIMEOUT || '30000', 10),

	// Enable/disable LLM categorization
	enabled: process.env.OLLAMA_ENABLED !== 'false',

	// Minimum confidence threshold for automatic categorization
	minConfidence: parseFloat(process.env.OLLAMA_MIN_CONFIDENCE || '0.7'),

	// Cache TTL in seconds (default: 1 hour)
	cacheTtl: parseInt(process.env.OLLAMA_CACHE_TTL || '3600', 10)
};

// Swiss utility cost categories for the prompt
export const SWISS_UTILITY_CATEGORIES = {
	allowed: [
		'Heizung',
		'Warmwasser',
		'Wasser/Abwasser',
		'Allgemeinstrom',
		'Hauswartung',
		'Gartenpflege',
		'Schneeräumung',
		'Lift/Aufzug',
		'Gebäudereinigung',
		'Kehricht/Entsorgung',
		'TV/Kabelgebühren',
		'Verwaltungskosten',
		'Versicherungsprämien (Gebäudeversicherung)',
		'Schädlingsbekämpfung'
	],
	notAllowed: [
		'Reparaturen',
		'Renovationen',
		'Grundsteuern',
		'Hypothekarzinsen',
		'Anschlussgebühren',
		'Wertvermehrende Investitionen',
		'Rechtskosten'
	]
};

// Prompt template for invoice categorization
export const CATEGORIZATION_PROMPT = `Du bist ein Experte für Schweizer Nebenkostenabrechnungen. Analysiere die folgende Rechnung und kategorisiere sie.

ERLAUBTE KATEGORIEN (können auf Mieter umgelegt werden):
${SWISS_UTILITY_CATEGORIES.allowed.map((c) => `- ${c}`).join('\n')}

NICHT ERLAUBTE KATEGORIEN (dürfen NICHT auf Mieter umgelegt werden):
${SWISS_UTILITY_CATEGORIES.notAllowed.map((c) => `- ${c}`).join('\n')}

RECHNUNGSDATEN:
Rechnungssteller: {billing_entity}
Beschreibung: {description}
Betrag: CHF {amount}

Antworte NUR im folgenden JSON-Format:
{
  "category": "Kategoriename",
  "confidence": 0.95,
  "isAllowedUtilityCost": true,
  "reasoning": "Kurze Begründung"
}`;

/**
 * Build the categorization prompt with invoice data
 */
export function buildCategorizationPrompt(invoice: {
	billingEntityName: string;
	description: string;
	amount: string | number;
}): string {
	return CATEGORIZATION_PROMPT.replace('{billing_entity}', invoice.billingEntityName)
		.replace('{description}', invoice.description)
		.replace('{amount}', String(invoice.amount));
}

/**
 * Parse LLM response to extract categorization
 */
export interface LLMCategorizationResult {
	category: string;
	confidence: number;
	isAllowedUtilityCost: boolean;
	reasoning?: string;
}

export function parseLLMResponse(response: string): LLMCategorizationResult | null {
	try {
		// Try to extract JSON from the response
		const jsonMatch = response.match(/\{[\s\S]*\}/);
		if (!jsonMatch) {
			console.error('No JSON found in LLM response');
			return null;
		}

		const parsed = JSON.parse(jsonMatch[0]);

		// Validate required fields
		if (
			typeof parsed.category !== 'string' ||
			typeof parsed.confidence !== 'number' ||
			typeof parsed.isAllowedUtilityCost !== 'boolean'
		) {
			console.error('Invalid LLM response structure');
			return null;
		}

		return {
			category: parsed.category,
			confidence: Math.max(0, Math.min(1, parsed.confidence)), // Clamp to 0-1
			isAllowedUtilityCost: parsed.isAllowedUtilityCost,
			reasoning: parsed.reasoning
		};
	} catch (error) {
		console.error('Failed to parse LLM response:', error);
		return null;
	}
}
