import { fetchCategory, kiEnabled, updateCategory } from '$lib/server/category';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	category: await fetchCategory(fetch, params.id),
	kiEnabled: await kiEnabled(fetch)
});

export const actions: Actions = {
	default: ({ request, fetch, params }) => updateCategory(fetch, request, params.id)
};
