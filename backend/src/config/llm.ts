import { isRealDate } from '../services/real-date';
import { roundToRappen } from '../services/pdf-format';

/**
 * LLM Configuration
 * Any provider with an OpenAI-compatible API (/chat/completions, /models); by default the local Ollama
 */

// Set by the operator: any of them, not empty, takes precedence over the KI set in the browser and locks it (#580)
const OPERATOR_VARIABLES = [
	'LLM_BASE_URL',
	'LLM_API_KEY',
	'LLM_MODEL',
	'LLM_PROVIDER',
	'LLM_PROVIDER_COUNTRY',
	'LLM_ENABLED'
];

// Where the local KI runs, e.g. the compose service ollama; it sets nothing for the landlord
const localUrl = (process.env.LLM_LOCAL_URL || 'http://localhost:11434/v1').replace(/\/$/, '');

export const llmConfig = {
	byOperator: OPERATOR_VARIABLES.some((name) => process.env[name]),


	// OpenAI-compatible API base URL, e.g. https://api.openai.com/v1 (a trailing slash is dropped)
	baseUrl: (process.env.LLM_BASE_URL || localUrl).replace(/\/$/, ''),

	// Sent as a Bearer token; the local Ollama needs none
	apiKey: process.env.LLM_API_KEY || '',

	// Who receives invoice data with an external provider, named in the privacy statement (e.g. OpenAI, USA)
	provider: process.env.LLM_PROVIDER || '',
	providerCountry: process.env.LLM_PROVIDER_COUNTRY || '',

	// Model for reading uploaded invoices and categorizing them: it must read images (#217)
	model: process.env.LLM_MODEL || 'qwen3-vl:8b-instruct',

	// Request timeout in milliseconds; without a GPU the default model needs about 40 s to categorize and 80 s to read an
	// invoice (#419)
	timeout: parseInt(process.env.LLM_TIMEOUT || '120000', 10),

	// Enable/disable LLM categorization
	enabled: process.env.LLM_ENABLED !== 'false',

	// Cache TTL in seconds (default: 1 hour)
	cacheTtl: parseInt(process.env.LLM_CACHE_TTL || '3600', 10)
};

// Hosts on the operator's server: the local Ollama, or its container in docker-compose
const OPERATOR_HOSTS = ['localhost', '127.0.0.1', '[::1]', 'ollama'];
export const onOperatorServer = (url: string) => OPERATOR_HOSTS.includes(new URL(url).hostname);

/** The local KI runs on this server, or the privacy statement's «verlassen den Server nicht» would be wrong
 * (domain review 580 F-23): checked on start while the landlord chooses the KI */
export function checkLocalKi(url: string) {
	if (!onOperatorServer(url))
		throw new Error(
			'LLM_LOCAL_URL is not on this server: point it to localhost or the compose service ollama, or remove it and choose a provider under «Einstellungen» › «KI» after the start'
		);
}

/** Who receives invoice data for categorization; null while the model runs on the operator's server */
export function llmRecipient(
	config: Pick<typeof llmConfig, 'baseUrl' | 'provider' | 'providerCountry' | 'enabled'> = llmConfig
): { provider: string; country: string } | null {
	if (!config.enabled || onOperatorServer(config.baseUrl)) return null;
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

// Prompt for a new category: whether its costs may be passed on; {name} and {description} come from the form,
// {categories_*} from the predefined categories only, so a landlord's own choice does not teach the KI (#202).
// The rules and the JSON without example values are for small models, which copy an example answer (#212)
const ALLOCABILITY_PROMPT = `Du bist ein Experte für Schweizer Nebenkostenabrechnungen. Ein Vermieter erfasst eine neue Kostenkategorie. Prüfe, ob ihre Kosten auf die Mieter umgelegt werden dürfen.

${LEGAL_BASIS}

Den Aufwand für die Erstellung der Nebenkostenabrechnung (Art. 4 Abs. 3 VMWG) rechnet Dwello über die Verwaltungspauschale ab; eine Kategorie dafür ist nicht umlagefähig, auch nicht ein Honorar der Verwaltung für die Heizkostenabrechnung. Umlagefähig sind dagegen die Verbrauchserfassung und der Abrechnungsservice eines Dritten für die verbrauchsabhängige Heizkostenabrechnung, z.B. Ablesung und Abrechnung der Wärmezähler durch einen Messdienst (Art. 5 Abs. 2 Bst. f VMWG).

VORDEFINIERTE UMLAGEFÄHIGE KATEGORIEN (dürfen auf Mieter umgelegt werden, wenn im Mietvertrag vereinbart, Art. 257a Abs. 2 OR):
{categories_allowed}

VORDEFINIERTE NICHT UMLAGEFÄHIGE KATEGORIEN (dürfen NICHT auf Mieter umgelegt werden):
{categories_not_allowed}

SO PRÜFST DU, der Reihe nach:
1. Reparatur, Renovation, Erneuerung, Ersatz und Anschaffung von Anlagen, Geräten und Bauteilen sowie wertvermehrende Investitionen trägt immer der Vermieter, auch wenn sie eine umlagefähige Kategorie betreffen, z.B. den Lift, die Heizung oder den Garten (Art. 256 Abs. 1 OR; sie sind keine Nebenkosten nach Art. 257b Abs. 1 OR; für Heizung und Warmwasser Art. 6 VMWG). Brennstoffe und Energie, die verbraucht werden, sind keine Anschaffung (Art. 5 Abs. 2 Bst. a VMWG). Der Vermieter trägt auch die mit der Sache verbundenen Lasten und öffentlichen Abgaben, z.B. die Liegenschaftssteuer (Art. 256b OR).
2. Die vordefinierten Kategorien sind nicht vollständig. Ist die neue Kategorie eine Leistung derselben Art wie eine vordefinierte Kategorie, gilt deren Einstufung; was deren Beschreibung mit «ohne» ausschliesst, gehört nicht dazu. Beispiel: Die Reinigung der Waschküche ist eine Reinigung wie beim «Hauswart» und damit umlagefähig; die Reparatur der Waschküchentür ist eine Reparatur und nicht umlagefähig. Wartung von Brandschutzeinrichtungen gilt wie «Feuerlöscher-Wartung», Bekämpfung von Ungeziefer wie «Schädlingsbekämpfung».
3. Art. 5 und 6 VMWG nur anwenden, wenn die Kategorie Heizung oder Warmwasser betrifft. Wartung und Service der Heizungs- oder Warmwasseranlage, z.B. der Brennerservice, sind umlagefähig (Art. 5 Abs. 2 Bst. e und g VMWG); ihre Reparatur nicht (Regel 1).
4. Passt keine vordefinierte Kategorie: Laufende Kosten für Leistungen, die mit dem Gebrauch zusammenhängen (Betrieb, Reinigung, Verbrauch), und öffentliche Abgaben, die sich aus dem Gebrauch ergeben (z.B. Gebühren nach Verbrauch), sind umlagefähig, wenn im Mietvertrag vereinbart (Art. 257b Abs. 1, Art. 257a Abs. 2 OR). Abgaben, die vom Wert der Liegenschaft abhängen, trägt der Vermieter (Art. 256b OR).

Kategorie: {name}
Beschreibung: {description}
Sprache der Begründung: {language}

Antworte NUR im folgenden JSON-Format:
{
  "isAllowedUtilityCost": <true oder false>,
  "confidence": <Zahl von 0 bis 1>,
  "reasoning": "Ein bis zwei Sätze in der Sprache der Begründung mit dem Artikel, der deine Antwort trägt"
}`;

// The interface languages, named as the German prompt names them
const LANGUAGES = { de: 'Deutsch', fr: 'Französisch', it: 'Italienisch', en: 'Englisch' };

export function buildAllocabilityPrompt(
	category: {
		name: string;
		description?: string | null;
		language?: keyof typeof LANGUAGES;
	},
	predefined: PromptCategory[]
): string {
	const values: Record<string, string> = {
		categories_allowed: categoryLines(predefined, true),
		categories_not_allowed: categoryLines(predefined, false),
		name: category.name,
		description: category.description || '-',
		language: LANGUAGES[category.language ?? 'de']
	};
	return ALLOCABILITY_PROMPT.replace(
		/\{(categories_allowed|categories_not_allowed|name|description|language)\}/g,
		(_, key: string) => values[key]
	);
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

// Prompt for reading an uploaded Beleg; the pages follow as images. The fields are proposals the property manager
// checks before anything is saved (#217); the amount rules follow the domain review (docs/reviews/upload-fachreview-1.md)
const EXTRACTION_PROMPT = `Du liest eine Rechnung an den Vermieter eines Gebäudes in der Schweiz, z.B. von einem Handwerker, einem Lieferanten, der Gemeinde oder den Werken. Die Bilder sind die Seiten der Datei «{file_name}».

Lies diese Angaben ab, so wie sie auf der Rechnung stehen; erfinde nichts. Fehlt eine Angabe, setze null.
- invoiceCount: wie viele verschiedene Rechnungen die Datei enthält
- documentType: "invoice" für eine Rechnung oder Schlussrechnung, "advance_invoice" für eine Akontorechnung (eine Teilrechnung über einen Vorschuss, die der Rechnungssteller später mit einer Schlussrechnung abrechnet; eine Rechnung, die nur in Raten bezahlt wird, ist keine Akontorechnung), "reminder" für eine Mahnung, "credit_note" für eine Gutschrift
- billingEntityName: Firma oder Person, die die Rechnung stellt
- invoiceNumber: Rechnungsnummer
- invoiceDate: Rechnungsdatum (JJJJ-MM-TT)
- totalAmount: Total der Leistungen in CHF inkl. MWST, ohne Mahngebühren und Verzugszinsen, vor dem Abzug bereits bezahlter Beträge, als Zahl mit Punkt (z.B. 1250.00; auf der Rechnung oft 1'250.00 oder 1'250.–); steht kein CHF-Betrag auf der Rechnung, null
- deductedAmount: Summe der abgezogenen, bereits bezahlten Beträge (Akontozahlungen, Anzahlungen, Teilrechnungen) als Zahl, sonst null
- servicePeriodStart, servicePeriodEnd: Leistungszeitraum, nur wenn die Rechnung ihn mit Beginn und Ende nennt (JJJJ-MM-TT)
- dueDate: Fälligkeitsdatum, nur wenn die Rechnung ein Datum nennt (JJJJ-MM-TT); bei «zahlbar innert 30 Tagen» null
- description: alle erbrachten Leistungen in wenigen Worten auf Deutsch, jede Position genannt
- nonAllocableItems: true, wenn die Rechnung auch Reparaturen, Erneuerungen oder Anschaffungen enthält, sonst false
Gib zu jeder Angabe an, wie sicher du bist (0 bis 1).

Antworte NUR im folgenden JSON-Format:
{
  "invoiceCount": <Zahl>,
  "documentType": "invoice",
  "billingEntityName": <Text oder null>,
  "invoiceNumber": <Text oder null>,
  "invoiceDate": <Datum oder null>,
  "totalAmount": <Zahl oder null>,
  "deductedAmount": <Zahl oder null>,
  "servicePeriodStart": <Datum oder null>,
  "servicePeriodEnd": <Datum oder null>,
  "dueDate": <Datum oder null>,
  "description": <Text oder null>,
  "nonAllocableItems": <true oder false>,
  "confidence": { "billingEntityName": <0 bis 1>, "invoiceNumber": <0 bis 1>, "invoiceDate": <0 bis 1>, "totalAmount": <0 bis 1>, "servicePeriodStart": <0 bis 1>, "dueDate": <0 bis 1>, "description": <0 bis 1> }
}`;

export const buildExtractionPrompt = (fileName: string) =>
	EXTRACTION_PROMPT.replace('{file_name}', () => fileName);

/** What the KI read from a Beleg: the fields as the invoice form takes them, and what the property manager must check */
export type Extraction = {
	invoiceCount: number;
	documentType: 'invoice' | 'advance_invoice' | 'reminder' | 'credit_note';
	fields: {
		billingEntityName: string | null;
		invoiceNumber: string | null;
		invoiceDate: string | null;
		amount: string | null;
		servicePeriodStart: string | null;
		servicePeriodEnd: string | null;
		dueDate: string | null;
		description: string | null;
	};
	deductedAmount: string | null;
	nonAllocableItems: boolean;
	unsure: string[]; // fields the KI read with a confidence below 0.7 or without one
};

const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value.trim() : null);
// An existing date in ISO form; anything else is no proposal
const date = (value: unknown) => {
	const iso = text(value);
	return iso && isRealDate(iso) ? iso : null;
};
const francs = (value: unknown) => (typeof value === 'number' && value > 0 ? roundToRappen(value).toFixed(2) : null);
const DOCUMENT_TYPES = ['invoice', 'advance_invoice', 'reminder', 'credit_note'] as const;
// How many invoices a file holds, also when the KI writes the number as text; anything else counts as one
const count = (value: unknown) => {
	const n = typeof value === 'string' || typeof value === 'number' ? Number(value) : NaN;
	return Number.isInteger(n) && n > 0 ? n : 1;
};
// The confidence of a field by its name in the answer
const ANSWERED_AS: Record<string, string> = { amount: 'totalAmount', servicePeriodEnd: 'servicePeriodStart' };

export function parseExtractionResponse(response: string): Extraction | null {
	let parsed: Record<string, unknown>;
	try {
		parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] ?? '');
	} catch {
		return null;
	}
	const start = date(parsed.servicePeriodStart);
	const end = date(parsed.servicePeriodEnd);
	const whole = start && end && end >= start; // a Leistungszeitraum has both dates, the end not before the start
	const fields = {
		billingEntityName: text(parsed.billingEntityName),
		invoiceNumber: text(parsed.invoiceNumber),
		invoiceDate: date(parsed.invoiceDate),
		amount: francs(parsed.totalAmount),
		servicePeriodStart: whole ? start : null,
		servicePeriodEnd: whole ? end : null,
		dueDate: date(parsed.dueDate),
		description: text(parsed.description)
	};
	const confidence = (parsed.confidence ?? {}) as Record<string, unknown>;
	const unsure = Object.entries(fields)
		.filter(([field, value]) => {
			const sure = confidence[ANSWERED_AS[field] ?? field];
			// a value without its confidence counts as unsure (domain review V-12)
			return value !== null && !(typeof sure === 'number' && sure >= 0.7);
		})
		.map(([field]) => field);
	return {
		invoiceCount: count(parsed.invoiceCount),
		documentType: DOCUMENT_TYPES.find((type) => type === parsed.documentType) ?? 'invoice',
		fields,
		deductedAmount: francs(parsed.deductedAmount),
		nonAllocableItems: parsed.nonAllocableItems === true,
		unsure
	};
}
