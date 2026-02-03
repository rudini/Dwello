/**
 * Invoice New Page Server
 * Loads buildings, categories, and distribution keys for the form
 */

import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getJwtFromCookie } from '$lib/server/auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ cookies }) => {
	const sessionToken = getJwtFromCookie(cookies);

	if (!sessionToken) {
		throw redirect(302, '/login');
	}

	const headers = {
		Authorization: `Bearer ${sessionToken}`,
		'Content-Type': 'application/json'
	};

	try {
		// Fetch all required data in parallel
		const [buildingsRes, categoriesRes, distributionKeysRes, llmStatusRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/buildings`, { headers }),
			fetch(`${BACKEND_URL}/api/v1/categories`, { headers }),
			fetch(`${BACKEND_URL}/api/v1/distribution-keys`, { headers }),
			fetch(`${BACKEND_URL}/api/v1/invoices/llm-status`, { headers })
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
			buildings: buildingsData.buildings || buildingsData.data || buildingsData || [],
			categories: categoriesData.categories || categoriesData.data || categoriesData || [],
			distributionKeys: distributionKeysData.distributionKeys || distributionKeysData.data || distributionKeysData || [],
			llmAvailable: llmStatusData.llmAvailable || false
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
