import { createCategory, proposeAllocability } from '$lib/server/category';
import type { Actions } from './$types';

export const actions: Actions = {
	save: ({ request, fetch }) => createCategory(fetch, request),
	propose: ({ request, fetch }) => proposeAllocability(fetch, request)
};
