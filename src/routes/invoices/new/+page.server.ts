/**
 * Invoice New Page Server
 * Loads buildings, categories, and distribution keys for the form
 */

import type { PageServerLoad } from './$types';
import { toCategory } from '$lib/server/category';
import { toDistributionKey } from '$lib/server/distribution-key';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		// Fetch all required data in parallel
		const [buildingsRes, categoriesRes, distributionKeysRes, llmStatusRes, defaultKeyRes] =
			await Promise.all([
				fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`),
				fetch(`${BACKEND_URL}/api/v1/categories`),
				fetch(`${BACKEND_URL}/api/v1/distribution-keys`),
				fetch(`${BACKEND_URL}/api/v1/invoices/llm-status`),
				fetch(`${BACKEND_URL}/api/v1/config/default_distribution_key_id`)
			]);

		if (!buildingsRes.ok || !categoriesRes.ok || !distributionKeysRes.ok) {
			console.error('Failed to fetch invoice form data');
			return {
				buildings: [],
				categories: [],
				distributionKeys: [],
				llmAvailable: false
			};
		}

		const [buildingsData, categoriesData, distributionKeysData, llmStatusData] = await Promise.all([
			buildingsRes.json(),
			categoriesRes.json(),
			distributionKeysRes.json(),
			llmStatusRes.ok ? llmStatusRes.json() : { llmAvailable: false }
		]);

		return {
			buildings: buildingsData.buildings || buildingsData.data || [],
			categories: (categoriesData.categories || categoriesData.data || []).map(toCategory),
			distributionKeys: (distributionKeysData.data || []).map(toDistributionKey),
			llmAvailable: llmStatusData.llmAvailable || false,
			// Preselected as set in the settings
			defaultDistributionKeyId: (await defaultKeyRes.json()).value ?? ''
		};
	} catch (error) {
		console.error('Error loading invoice form data:', error);
		return {
			buildings: [],
			categories: [],
			distributionKeys: [],
			llmAvailable: false
		};
	}
};
