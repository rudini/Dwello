import { createCategory, kiEnabled, proposeAllocability } from '$lib/server/category';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => ({ kiEnabled: await kiEnabled(fetch) });

export const actions: Actions = {
	save: ({ request, fetch }) => createCategory(fetch, request),
	propose: ({ request, fetch }) => proposeAllocability(fetch, request)
};
