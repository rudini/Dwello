import { saveHeatingProfile } from '$lib/server/heating-profile';
import type { Actions } from './$types';

export const actions: Actions = {
	default: ({ request, fetch }) => saveHeatingProfile(fetch, request)
};
