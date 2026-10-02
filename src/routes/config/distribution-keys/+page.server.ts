import { error } from '@sveltejs/kit';
import { deleteDistributionKey, toDistributionKey } from '$lib/server/distribution-key';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/api/v1/distribution-keys?limit=100`);
	if (!response.ok) throw error(response.status, 'Fehler beim Laden der Verteilschlüssel');
	const { data } = await response.json();
	return { keys: (data as Record<string, unknown>[]).map(toDistributionKey) };
};

export const actions: Actions = {
	delete: async ({ request, fetch }) => deleteDistributionKey(fetch, String((await request.formData()).get('id')))
};
