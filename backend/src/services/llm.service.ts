/**
 * LLM Service
 * Invoice categorization using Ollama (local LLM)
 */

import {
	llmConfig,
	buildCategorizationPrompt,
	parseLLMResponse,
	type LLMCategorizationResult
} from '../config/llm';
import { getCategoryByName } from './category.service';
import type { Category } from '../db/schema';

// Simple in-memory cache for categorization results
const categorizationCache = new Map<string, { result: LLMCategorizationResult; timestamp: number }>();

/**
 * Generate a cache key for invoice data
 */
function getCacheKey(invoice: { billingEntityName: string; description: string }): string {
	return `${invoice.billingEntityName.toLowerCase().trim()}:${invoice.description.toLowerCase().trim()}`;
}

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

/**
 * Call Ollama API for text generation
 */
async function callOllama(prompt: string): Promise<string> {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), llmConfig.timeout);

	try {
		const response = await fetch(`${llmConfig.baseUrl}/api/generate`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: llmConfig.model,
				prompt,
				stream: false,
				options: {
					temperature: 0.3, // Lower temperature for more consistent categorization
					num_predict: 200 // Limit response length
				}
			}),
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
		}

		const data = (await response.json()) as { response?: string };
		return data.response || '';
	} catch (error) {
		clearTimeout(timeoutId);

		if (error instanceof Error && error.name === 'AbortError') {
			throw new Error('LLM request timed out');
		}

		throw error;
	}
}

/**
 * Check if Ollama is available
 */
export async function isOllamaAvailable(): Promise<boolean> {
	if (!llmConfig.enabled) return false;

	try {
		const response = await fetch(`${llmConfig.baseUrl}/api/tags`, {
			method: 'GET',
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
	if (!llmConfig.enabled) {
		return {
			category: null,
			confidence: 0,
			isAllowedUtilityCost: true,
			source: 'fallback'
		};
	}

	// Check cache first
	const cacheKey = getCacheKey(invoice);
	const cached = getCachedResult(cacheKey);

	if (cached) {
		const category = await getCategoryByName(cached.category);
		return {
			category,
			confidence: cached.confidence,
			isAllowedUtilityCost: cached.isAllowedUtilityCost,
			reasoning: cached.reasoning,
			source: 'cache'
		};
	}

	try {
		// Build prompt and call Ollama
		const prompt = buildCategorizationPrompt(invoice);
		const response = await callOllama(prompt);

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
		cacheResult(cacheKey, result);

		// Find the matching category in database
		const category = await getCategoryByName(result.category);

		return {
			category,
			confidence: result.confidence,
			isAllowedUtilityCost: result.isAllowedUtilityCost,
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
	const cacheKey = getCacheKey(invoice);
	categorizationCache.delete(cacheKey);

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
