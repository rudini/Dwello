/**
 * Invoice New Page Server
 * Loads buildings, categories, and distribution keys for the form
 */

import type { PageServerLoad } from './$types';
import { localPath } from '$lib/invoice';
import { invoiceChoices } from '$lib/server/invoice';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// One answer of the backend; a failing call leaves its part empty instead of the whole form
async function get(fetch: typeof globalThis.fetch, path: string) {
	const response = await fetch(`${BACKEND_URL}/api/v1/${path}`).catch(() => null);
	return response?.ok ? response.json().catch(() => ({})) : {};
}

const isoDate = (value: string | null) => (value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '');

export const load: PageServerLoad = async ({ fetch, url }) => {
	const [buildingsData, choices, llmStatus, defaultKey] = await Promise.all([
		get(fetch, 'buildings?limit=100'),
		invoiceChoices(fetch),
		get(fetch, 'invoices/llm-status'),
		get(fetch, 'config/default_distribution_key_id')
	]);
	const buildings: { id: string }[] = buildingsData.buildings || buildingsData.data || [];
	const building = url.searchParams.get('building');
	const start = isoDate(url.searchParams.get('periodStart'));
	const end = isoDate(url.searchParams.get('periodEnd'));

	return {
		buildings,
		...choices,
		llmAvailable: llmStatus.llmAvailable === true,
		// Preselected as set in the settings
		defaultDistributionKeyId: (defaultKey.value as string) ?? '',
		// Opened from a building or from the statement wizard
		buildingId: buildings.some((b) => b.id === building) ? building! : '',
		returnTo: localPath(url.searchParams.get('returnTo')),
		// The statement wizard's Abrechnungsperiode: the form warns about a date outside it
		period: start && end ? { start, end } : null
	};
};
