import { error } from '@sveltejs/kit';
import { deleteCategory, toCategory, type CategoryRow } from '$lib/server/category';
import { m } from '$lib/paraglide/messages';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${BACKEND_URL}/api/v1/categories?limit=1000`); // all of them (#585)
	if (!response.ok) throw error(response.status, m.categories_load_failed());
	const { categories } = await response.json();
	return { categories: (categories as CategoryRow[]).map(toCategory) };
};

export const actions: Actions = {
	delete: async ({ request, fetch }) =>
		deleteCategory(fetch, String((await request.formData()).get('id')))
};
