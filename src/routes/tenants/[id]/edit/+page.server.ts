import type { Actions, PageServerLoad } from './$types';
import { saveTenant } from '$lib/server/tenant-form';
import { loadTenant } from '$lib/server/tenant';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	tenant: await loadTenant(fetch, params.id)
});

export const actions: Actions = {
	default: ({ request, fetch, params }) => saveTenant(fetch, request, params.id)
};
