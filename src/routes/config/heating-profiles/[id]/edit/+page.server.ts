import { error } from '@sveltejs/kit';
import { m } from '$lib/paraglide/messages';
import { fetchHeatingProfile, saveHeatingProfile } from '$lib/server/heating-profile';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const profile = await fetchHeatingProfile(fetch, params.id);
	// The predefined profiles follow common Swiss practice and stay as they are
	if (profile.type === 'predefined') throw error(403, m.profiles_predefined_not_editable());
	return { profile };
};

export const actions: Actions = {
	default: ({ request, fetch, params }) => saveHeatingProfile(fetch, request, params.id)
};
