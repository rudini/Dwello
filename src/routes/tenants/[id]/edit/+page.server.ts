import type { Actions, PageServerLoad } from './$types';
import { saveTenant } from '$lib/server/tenant-form';
import { fetchTenant, toTenant } from '$lib/server/tenant';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	tenant: toTenant(await fetchTenant(fetch, params.id))
});

export const actions: Actions = {
	default: ({ request, fetch, params }) => saveTenant(fetch, request, params.id)
};
