import { createCategory } from '$lib/server/category';
import type { Actions } from './$types';

export const actions: Actions = {
	default: ({ request, fetch }) => createCategory(fetch, request)
};
