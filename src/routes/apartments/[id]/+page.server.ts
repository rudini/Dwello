import type { PageServerLoad } from './$types';
import { loadApartmentDetails } from '$lib/server/apartment';

export const load: PageServerLoad = ({ params, fetch }) => loadApartmentDetails(fetch, params.id);
