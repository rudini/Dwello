import type { Actions, PageServerLoad } from './$types';
import { saveApartment } from '$lib/server/apartment-form';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const response = await fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`);
	const data = await response.json();
	const buildings: { id: string; name: string; address: string }[] = data.buildings.map(
		(b: Record<string, string>) => ({
			id: b.id,
			name: b.name,
			address: `${b.address}, ${b.postalCode} ${b.city}`
		})
	);
	return { buildings, presetBuildingId: url.searchParams.get('building') };
};

export const actions: Actions = {
	default: ({ request, fetch }) => saveApartment(fetch, request)
};
