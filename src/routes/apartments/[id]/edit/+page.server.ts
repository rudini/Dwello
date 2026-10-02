import type { Actions, PageServerLoad } from './$types';
import { saveApartment } from '$lib/server/apartment-form';
import { fetchApartment } from '$lib/server/apartment';

export const load: PageServerLoad = async ({ params, fetch }) => ({
	apartment: await fetchApartment(fetch, params.id)
});

export const actions: Actions = {
	default: ({ request, fetch, params }) => saveApartment(fetch, request, params.id)
};
