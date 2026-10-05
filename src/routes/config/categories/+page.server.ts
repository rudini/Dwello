import { error } from '@sveltejs/kit';
import { deleteCategory, toCategory } from '$lib/server/category';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/api/v1/categories?limit=100`);
	if (!response.ok) throw error(response.status, 'Fehler beim Laden der Kategorien');
	const { categories } = await response.json();
	return { categories: (categories as Record<string, unknown>[]).map(toCategory) };
};

export const actions: Actions = {
	delete: async ({ request, fetch }) =>
		deleteCategory(fetch, String((await request.formData()).get('id')))
};
