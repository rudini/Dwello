import { createDistributionKey, testFormula } from '$lib/server/distribution-key';
import type { Actions } from './$types';

export const actions: Actions = {
	save: ({ request, fetch }) => createDistributionKey(fetch, request),
	test: ({ request, fetch }) => testFormula(fetch, request)
};
