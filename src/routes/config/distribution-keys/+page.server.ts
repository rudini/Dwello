import { deleteDistributionKey, listDistributionKeys } from '$lib/server/distribution-key';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => ({
	keys: await listDistributionKeys(fetch)
});

export const actions: Actions = {
	delete: async ({ request, fetch }) =>
		deleteDistributionKey(fetch, String((await request.formData()).get('id')))
};
