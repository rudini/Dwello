import { deleteHeatingProfile, fetchHeatingProfile } from '$lib/server/heating-profile';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	profile: await fetchHeatingProfile(fetch, params.id)
});

export const actions: Actions = {
	delete: ({ params, fetch }) => deleteHeatingProfile(fetch, params.id)
};
