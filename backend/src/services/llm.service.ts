/**
 * LLM Service
 * Invoice categorization through an LLM with an OpenAI-compatible API (by default the local Ollama)
 */

import {
	llmConfig,
	buildAllocabilityPrompt,
	buildCategorizationPrompt,
	buildExtractionPrompt,
	parseAllocabilityResponse,
	parseExtractionResponse,
	type Extraction,
	parseLLMResponse,
	type LLMCategorizationResult
} from '../config/llm';
import { getCategoryByName, listCategories } from './category.service';
import { currentKi } from './ki-settings.service';
import { CodedError } from './coded-error';
import type { Category } from '../db/schema';
import type { AllocabilityProposal } from '../api/category';

// Simple in-memory cache for categorization results
const categorizationCache = new Map<string, { result: LLMCategorizationResult; timestamp: number }>();

/** The prompt for an invoice, also its cache key: a new or changed category asks the KI anew */
const promptFor = async (invoice: {
	billingEntityName: string;
	description: string;
	amount: string | number;
}) => buildCategorizationPrompt(invoice, (await listCategories({ limit: 1000 })).categories);

/**
 * Check if cached result is still valid
 */
function getCachedResult(key: string): LLMCategorizationResult | null {
	const cached = categorizationCache.get(key);
	if (!cached) return null;

	const now = Date.now();
	if (now - cached.timestamp > llmConfig.cacheTtl * 1000) {
		categorizationCache.delete(key);
		return null;
	}

	return cached.result;
}

/**
 * Store result in cache
 */
function cacheResult(key: string, result: LLMCategorizationResult): void {
	categorizationCache.set(key, { result, timestamp: Date.now() });

	// Cleanup old entries (keep cache size manageable)
	if (categorizationCache.size > 1000) {
		const oldest = Array.from(categorizationCache.entries())
			.sort((a, b) => a[1].timestamp - b[1].timestamp)
			.slice(0, 100);
		oldest.forEach(([key]) => categorizationCache.delete(key));
	}
}

/** Headers for the chosen provider; the key only when one is set */
function llmHeaders(apiKey: string): Record<string, string> {
	return {
		'Content-Type': 'application/json',
		...(apiKey && { Authorization: `Bearer ${apiKey}` })
	};
}

/** Whether «Keine KI» is chosen (#580), read anew for every request */
const kiOff = async () => (await currentKi()).mode === 'none';

// A prompt, or a prompt followed by images (data URLs) for a model that reads them
type Content = string | ({ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } })[];

/**
 * Call the OpenAI-compatible chat completions API
 */
async function callLlm(prompt: Content): Promise<string> {
	const ki = await currentKi();
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), llmConfig.timeout);

	try {
		const response = await fetch(`${ki.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: llmHeaders(ki.apiKey),
			body: JSON.stringify({
				model: ki.model,
				// No max_tokens or temperature: reasoning models reject both; the prompt asks for short JSON
				messages: [{ role: 'user', content: prompt }]
			}),
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`LLM API error: ${response.status} ${response.statusText}`);
		}

		const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
		return data.choices?.[0]?.message?.content || '';
	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('LLM request timed out');
		}

		throw error;
	}
}

/**
 * Check if the configured LLM provider answers
 */
export async function isLlmAvailable(): Promise<boolean> {
	const ki = await currentKi();
	if (ki.mode === 'none') return false;

	try {
		const response = await fetch(`${ki.baseUrl}/models`, {
			method: 'GET',
			headers: llmHeaders(ki.apiKey),
			signal: AbortSignal.timeout(5000)
		});
		return response.ok;
	} catch {
		return false;
	}
}

/**
 * Categorize an invoice using LLM
 */
export async function categorizeInvoice(invoice: {
	billingEntityName: string;
	description: string;
	amount: string | number;
}): Promise<{
	category: Category | null;
	confidence: number;
	isAllowedUtilityCost: boolean;
	reasoning?: string;
	source: 'llm' | 'cache' | 'fallback';
}> {
	// Check if LLM is enabled
	if (await kiOff()) {
		return {
			category: null,
			confidence: 0,
			isAllowedUtilityCost: true,
			source: 'fallback'
		};
	}

	// Check cache first
	const prompt = await promptFor(invoice);
	const cached = getCachedResult(prompt);

	if (cached) {
		const category = await getCategoryByName(cached.category);
		return {
			category,
			confidence: cached.confidence,
			isAllowedUtilityCost: category?.isAllowedUtilityCost ?? cached.isAllowedUtilityCost,
			reasoning: cached.reasoning,
			source: 'cache'
		};
	}

	try {
		const response = await callLlm(prompt);

		// Parse the response
		const result = parseLLMResponse(response);

		if (!result) {
			console.warn('Failed to parse LLM response for invoice:', invoice.description);
			return {
				category: null,
				confidence: 0,
				isAllowedUtilityCost: true,
				source: 'fallback'
			};
		}

		// Cache the result
		cacheResult(prompt, result);

		// Find the matching category in database
		const category = await getCategoryByName(result.category);

		return {
			category,
			confidence: result.confidence,
			// Whether costs may be passed on is the category's, not the KI's judgement
			isAllowedUtilityCost: category?.isAllowedUtilityCost ?? result.isAllowedUtilityCost,
			reasoning: result.reasoning,
			source: 'llm'
		};
	} catch (error) {
		console.error('LLM categorization failed:', error);

		// Return fallback response
		return {
			category: null,
			confidence: 0,
			isAllowedUtilityCost: true,
			source: 'fallback'
		};
	}
}

const unavailable = () => new CodedError('KI_PROPOSAL_UNAVAILABLE', 'Die KI ist nicht erreichbar.');

/**
 * Whether a new category's costs may be passed on, as the KI judges it with its reasoning. Without a sure answer
 * nothing is preset; the refusal says whether trying again can help (#186): KI_PROPOSAL_UNAVAILABLE (no KI, error)
 * or KI_PROPOSAL_UNSURE (unusable answer, confidence below 0.7)
 */
export async function proposeAllocability(
	category: Parameters<typeof buildAllocabilityPrompt>[0]
): Promise<AllocabilityProposal> {
	if (await kiOff()) throw unavailable();
	const { categories } = await listCategories({ limit: 1000 });
	const predefined = categories.filter((c) => c.type === 'predefined');
	const response = await callLlm(buildAllocabilityPrompt(category, predefined)).catch((error) => {
		console.warn('KI proposal for a category failed:', error);
		throw unavailable();
	});
	const answer = parseAllocabilityResponse(response);
	if (!answer || answer.confidence < 0.7) throw new CodedError('KI_PROPOSAL_UNSURE', 'Die KI ist sich nicht sicher.');
	return { isAllowedUtilityCost: answer.isAllowedUtilityCost, reasoning: answer.reasoning };
}

/**
 * What the KI reads from the pages of an uploaded file (images as data URLs); null when the KI does not run or does
 * not answer with the fields
 */
export async function extractInvoice(fileName: string, pages: string[]): Promise<Extraction | 'unreadable' | null> {
	if (await kiOff()) return null;
	let answer: string;
	try {
		const content: Content = [
			{ type: 'text', text: buildExtractionPrompt(fileName) },
			...pages.map((url) => ({ type: 'image_url' as const, image_url: { url } }))
		];
		answer = await callLlm(content);
	} catch (error) {
		console.warn('KI could not read the file:', error);
		return null;
	}
	// the KI runs but answered nothing Dwello can read: a second try often works (domain review V-14)
	return parseExtractionResponse(answer) ?? 'unreadable';
}

/**
 * Re-categorize an invoice (bypass cache)
 */
export async function recategorizeInvoice(invoice: {
	billingEntityName: string;
	description: string;
	amount: string | number;
}): Promise<{
	category: Category | null;
	confidence: number;
	isAllowedUtilityCost: boolean;
	reasoning?: string;
	source: 'llm' | 'fallback';
}> {
	// Clear cache for this invoice
	categorizationCache.delete(await promptFor(invoice));

	// Call categorize without cache
	const result = await categorizeInvoice(invoice);
	return {
		...result,
		source: result.source === 'cache' ? 'llm' : result.source
	};
}

/**
 * Clear the categorization cache
 */
export function clearCategorizationCache(): void {
	categorizationCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): { size: number; maxSize: number } {
	return {
		size: categorizationCache.size,
		maxSize: 1000
	};
}
