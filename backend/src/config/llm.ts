/**
 * LLM Configuration
 * Any provider with an OpenAI-compatible API (/chat/completions, /models); by default the local Ollama
 */

export const llmConfig = {
	// OpenAI-compatible API base URL, e.g. https://api.openai.com/v1 (a trailing slash is dropped)
	baseUrl: (process.env.LLM_BASE_URL || 'http://localhost:11434/v1').replace(/\/$/, ''),

	// Sent as a Bearer token; the local Ollama needs none
	apiKey: process.env.LLM_API_KEY || '',

	// Who receives invoice data with an external provider, named in the privacy statement (e.g. OpenAI, USA)
	provider: process.env.LLM_PROVIDER || '',
	providerCountry: process.env.LLM_PROVIDER_COUNTRY || '',

	// Model to use for categorization (qwen2.5:3b is small but accurate for German)
	model: process.env.LLM_MODEL || 'qwen2.5:3b',

	// Request timeout in milliseconds
	timeout: parseInt(process.env.LLM_TIMEOUT || '30000', 10),

	// Enable/disable LLM categorization
	enabled: process.env.LLM_ENABLED !== 'false',

	// Cache TTL in seconds (default: 1 hour)
	cacheTtl: parseInt(process.env.LLM_CACHE_TTL || '3600', 10)
};

// Hosts on the operator's server: the local Ollama, or its container in docker-compose
const OPERATOR_HOSTS = ['localhost', '127.0.0.1', '[::1]', 'ollama'];

/** Who receives invoice data for categorization; null while the model runs on the operator's server */
export function llmRecipient(
	config: Pick<typeof llmConfig, 'baseUrl' | 'provider' | 'providerCountry' | 'enabled'> = llmConfig
): { provider: string; country: string } | null {
	if (!config.enabled || OPERATOR_HOSTS.includes(new URL(config.baseUrl).hostname)) return null;
	if (!config.provider || !config.providerCountry) {
		throw new Error(
			'LLM_BASE_URL is an external provider: set LLM_PROVIDER and LLM_PROVIDER_COUNTRY for the privacy statement'
		);
	}
	return { provider: config.provider, country: config.providerCountry };
}

// Swiss utility cost categories for the prompt (English names match database)
export const SWISS_UTILITY_CATEGORIES = {
	allowed: [
		{ en: 'Heating', de: 'Heizung' },
		{ en: 'Hot Water', de: 'Warmwasser' },
		{ en: 'Cold Water', de: 'Kaltwasser' },
		{ en: 'Wastewater', de: 'Abwasser' },
		{ en: 'Electricity Common Areas', de: 'Allgemeinstrom' },
		{ en: 'Elevator', de: 'Lift/Aufzug' },
		{ en: 'Caretaker', de: 'Hauswartung' },
		{ en: 'Garden Maintenance', de: 'Gartenpflege' },
		{ en: 'Snow Removal', de: 'Schneeräumung' },
		{ en: 'Waste Disposal', de: 'Kehricht/Entsorgung' },
		{ en: 'TV/Cable', de: 'TV/Kabelgebühren' },
		{ en: 'Pest Control', de: 'Schädlingsbekämpfung' },
		{ en: 'Fire Extinguisher Maintenance', de: 'Feuerlöscher-Wartung' },
		{ en: 'Chimney Sweep', de: 'Kaminfeger' }
	],
	notAllowed: [
		{ en: 'Repairs', de: 'Reparaturen' },
		{ en: 'Administration', de: 'Verwaltungskosten' },
		{ en: 'Renovation', de: 'Renovationen' },
		{ en: 'Property Tax', de: 'Grundsteuern' },
		{ en: 'Mortgage Interest', de: 'Hypothekarzinsen' },
		{ en: 'Building Insurance', de: 'Gebäudeversicherung' },
		{ en: 'Capital Improvements', de: 'Wertvermehrende Investitionen' }
	]
};

// Prompt template for invoice categorization
export const CATEGORIZATION_PROMPT = `Du bist ein Experte für Schweizer Nebenkostenabrechnungen. Analysiere die folgende Rechnung und kategorisiere sie.

ERLAUBTE KATEGORIEN (können auf Mieter umgelegt werden):
${SWISS_UTILITY_CATEGORIES.allowed.map((c) => `- ${c.en} (${c.de})`).join('\n')}

NICHT ERLAUBTE KATEGORIEN (dürfen NICHT auf Mieter umgelegt werden):
${SWISS_UTILITY_CATEGORIES.notAllowed.map((c) => `- ${c.en} (${c.de})`).join('\n')}

RECHNUNGSDATEN:
Rechnungssteller: {billing_entity}
Beschreibung: {description}
Betrag: CHF {amount}

WICHTIG: Der "category" Wert muss EXAKT einer der englischen Kategorienamen sein (z.B. "Heating", "Cold Water", "Repairs").

Antworte NUR im folgenden JSON-Format:
{
  "category": "English Category Name",
  "confidence": 0.95,
  "isAllowedUtilityCost": true,
  "reasoning": "Kurze Begründung auf Deutsch"
}`;

/**
 * Build the categorization prompt with invoice data
 */
export function buildCategorizationPrompt(invoice: {
	billingEntityName: string;
	description: string;
	amount: string | number;
}): string {
	const values: Record<string, string> = {
		billing_entity: invoice.billingEntityName,
		description: invoice.description,
		amount: String(invoice.amount)
	};
	// One pass with a function: invoice text is neither scanned for placeholders nor for $ patterns
	return CATEGORIZATION_PROMPT.replace(/\{(billing_entity|description|amount)\}/g, (_, key: string) => values[key]);
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

		// Clean category name: LLMs often append German translation in parentheses
		// e.g. "Garden Maintenance (Gartenpflege)" → "Garden Maintenance"
		const cleanedCategory = parsed.category.replace(/\s*\(.*\)\s*$/, '').trim();

		return {
			category: cleanedCategory,
			confidence: Math.max(0, Math.min(1, parsed.confidence)), // Clamp to 0-1
			isAllowedUtilityCost: parsed.isAllowedUtilityCost,
			reasoning: parsed.reasoning
		};
	} catch (error) {
		console.error('Failed to parse LLM response:', error);
		return null;
	}
}
