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

// Verbatim from Fedlex: OR (SR 220, as of 1 Oct 2026) and VMWG (SR 221.213.11, as of 1 Oct 2025), see #176
const LEGAL_BASIS = `RECHTSGRUNDLAGE (Fedlex, wörtlich):
OR Art. 256 Abs. 1: Der Vermieter ist verpflichtet, die Sache zum vereinbarten Zeitpunkt in einem zum vorausgesetzten Gebrauch tauglichen Zustand zu übergeben und in demselben zu erhalten.
OR Art. 256b: Der Vermieter trägt die mit der Sache verbundenen Lasten und öffentlichen Abgaben.
OR Art. 257a Abs. 1: Die Nebenkosten sind das Entgelt für die Leistungen des Vermieters oder eines Dritten, die mit dem Gebrauch der Sache zusammenhängen.
OR Art. 257a Abs. 2: Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.
OR Art. 257b Abs. 1: Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.
VMWG Art. 4 Abs. 3: Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.
VMWG Art. 5 Abs. 1: Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.
VMWG Art. 5 Abs. 2: Darunter fallen insbesondere die Aufwendungen für:
a. die Brennstoffe und die Energie, die verbraucht wurden;
b. die Elektrizität zum Betrieb von Brennern und Pumpen;
c. die Betriebskosten für Alternativenergien;
d. die Reinigung der Heizungsanlage und des Kamins, das Auskratzen, Ausbrennen und Einölen der Heizkessel sowie die Abfall- und Schlackenbeseitigung;
e. die periodische Revision der Heizungsanlage einschliesslich des Öltanks sowie das Entkalken der Warmwasseranlage, der Boiler und des Leitungsnetzes;
f. die Verbrauchserfassung und den Abrechnungsservice für die verbrauchsabhängige Heizkostenabrechnung sowie den Unterhalt der nötigen Apparate;
g. die Wartung;
h. die Versicherungsprämien, soweit sie sich ausschliesslich auf die Heizungsanlage beziehen;
i. die Verwaltungsarbeit, die mit dem Betrieb der Heizungsanlage zusammenhängt.
VMWG Art. 6: Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für:
a. die Reparatur und Erneuerung der Anlagen;
b. die Verzinsung und Abschreibung der Anlagen.
VMWG Art. 6a: Bezieht der Vermieter Heizenergie oder Warmwasser aus einer nicht zur Liegenschaft gehörenden Zentrale, die nicht Teil der Anlagekosten ist, kann er die tatsächlich anfallenden Kosten in Rechnung stellen.
VMWG Art. 6b: Der Vermieter kann im Rahmen eines Zusammenschlusses gemäss Artikel 17 des Energiegesetzes vom 30. September 2016 die Kosten nach Artikel 16a und 16b der Energieverordnung vom 1. November 2017 als Nebenkosten in Rechnung stellen.
VMWG Art. 6c Abs. 3: Der Vermieter kann die im Rahmen eines Energiespar-Contractings anfallenden Kosten während höchstens 10 Jahren als Nebenkosten in Rechnung stellen.

Art. 5 und 6 VMWG gelten nur für Heizungs- und Warmwasserkosten. Zitiere den Artikel aus der Rechtsgrundlage, der deine Antwort trägt, mit Absatz.`;

/** A category as the prompt offers it: the English key the KI answers with, the German name, what it covers */
type PromptCategory = {
	name: string;
	nameDE: string | null;
	description: string | null;
	isAllowedUtilityCost: boolean;
};

const categoryLines = (categories: PromptCategory[], allowed: boolean) =>
	categories
		.filter((c) => c.isAllowedUtilityCost === allowed)
		.map(
			(c) =>
				`- ${c.name}${c.nameDE && c.nameDE !== c.name ? ` (${c.nameDE})` : ''}${c.description ? `: ${c.description}` : ''}`
		)
		.join('\n');

// Prompt template for invoice categorization; {categories_*} come from the master data
const CATEGORIZATION_PROMPT = `Du bist ein Experte für Schweizer Nebenkostenabrechnungen. Analysiere die folgende Rechnung und kategorisiere sie.

${LEGAL_BASIS}

ERLAUBTE KATEGORIEN (können auf Mieter umgelegt werden):
{categories_allowed}

NICHT ERLAUBTE KATEGORIEN (dürfen NICHT auf Mieter umgelegt werden):
{categories_not_allowed}

RECHNUNGSDATEN:
Rechnungssteller: {billing_entity}
Beschreibung: {description}
Betrag: CHF {amount}

WICHTIG: Der "category" Wert muss EXAKT einer der Kategorienamen sein, so wie er nach «- » am Zeilenanfang steht, ohne den deutschen Namen in Klammern und ohne Beschreibung (z.B. "Heating", "Cold Water", "Repairs").

Antworte NUR im folgenden JSON-Format:
{
  "category": "Category Name",
  "confidence": 0.95,
  "isAllowedUtilityCost": true,
  "reasoning": "Kurze Begründung auf Deutsch"
}`;

/**
 * Build the categorization prompt with invoice data
 */
export function buildCategorizationPrompt(
	invoice: { billingEntityName: string; description: string; amount: string | number },
	categories: PromptCategory[]
): string {
	const values: Record<string, string> = {
		categories_allowed: categoryLines(categories, true),
		categories_not_allowed: categoryLines(categories, false),
		billing_entity: invoice.billingEntityName,
		description: invoice.description,
		amount: String(invoice.amount)
	};
	// One pass with a function: invoice text is neither scanned for placeholders nor for $ patterns
	return CATEGORIZATION_PROMPT.replace(
		/\{(categories_allowed|categories_not_allowed|billing_entity|description|amount)\}/g,
		(_, key: string) => values[key]
	);
}

// Prompt for a new category: whether its costs may be passed on; {name} and {description} come from the form
const ALLOCABILITY_PROMPT = `Du bist ein Experte für Schweizer Nebenkostenabrechnungen. Ein Vermieter erfasst eine neue Kostenkategorie. Prüfe, ob ihre Kosten auf die Mieter umgelegt werden dürfen.

${LEGAL_BASIS}

Den Aufwand für die Erstellung der Nebenkostenabrechnung (Art. 4 Abs. 3 VMWG) rechnet Dwello über die Verwaltungspauschale ab; eine Kategorie dafür ist nicht umlagefähig.

Kategorie: {name}
Beschreibung: {description}
Sprache der Begründung: {language}

Antworte NUR im folgenden JSON-Format:
{
  "isAllowedUtilityCost": false,
  "confidence": 0.9,
  "reasoning": "Ein bis zwei Sätze in der Sprache der Begründung mit dem Artikel, z.B. (Art. 257a Abs. 1 OR)"
}`;

// The interface languages, named as the German prompt names them
const LANGUAGES = { de: 'Deutsch', fr: 'Französisch', it: 'Italienisch', en: 'Englisch' };

export function buildAllocabilityPrompt(category: {
	name: string;
	description?: string | null;
	language?: keyof typeof LANGUAGES;
}): string {
	const values: Record<string, string> = {
		name: category.name,
		description: category.description || '-',
		language: LANGUAGES[category.language ?? 'de']
	};
	return ALLOCABILITY_PROMPT.replace(/\{(name|description|language)\}/g, (_, key: string) => values[key]);
}

/** The KI's answer for a new category, or null when it is not JSON of that shape */
export function parseAllocabilityResponse(
	response: string
): { isAllowedUtilityCost: boolean; confidence: number; reasoning: string } | null {
	try {
		const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] ?? '');
		if (typeof parsed.isAllowedUtilityCost !== 'boolean' || typeof parsed.confidence !== 'number') return null;
		return {
			isAllowedUtilityCost: parsed.isAllowedUtilityCost,
			confidence: parsed.confidence,
			reasoning: typeof parsed.reasoning === 'string' ? parsed.reasoning : ''
		};
	} catch {
		return null;
	}
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
