import type { Actions, PageServerLoad } from './$types';
import { deleteApartment, loadApartmentDetails } from '$lib/server/apartment';

export const load: PageServerLoad = ({ params, fetch }) => loadApartmentDetails(fetch, params.id);

export const actions: Actions = {
	delete: ({ params, fetch, request }) => deleteApartment(fetch, params.id, request)
};
