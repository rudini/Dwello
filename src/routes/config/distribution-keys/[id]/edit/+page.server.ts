import { fetchCustomKey, testFormula, updateDistributionKey } from '$lib/server/distribution-key';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	key: await fetchCustomKey(fetch, params.id)
});

export const actions: Actions = {
	save: ({ request, fetch, params }) => updateDistributionKey(fetch, request, params.id),
	test: ({ request, fetch }) => testFormula(fetch, request)
};
