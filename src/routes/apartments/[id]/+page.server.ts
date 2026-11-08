import type { Actions, PageServerLoad } from './$types';
import { deleteApartment, loadApartmentDetails, removeSizeChange } from '$lib/server/apartment';

export const load: PageServerLoad = ({ params, fetch }) => loadApartmentDetails(fetch, params.id);

export const actions: Actions = {
	delete: ({ params, fetch, request }) => deleteApartment(fetch, params.id, request),
	removeSizeChange: ({ params, fetch }) => removeSizeChange(fetch, params.id) // #1301
};
