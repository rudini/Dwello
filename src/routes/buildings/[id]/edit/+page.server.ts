import { m } from '$lib/paraglide/messages';
import { backendMessage } from '$lib/backend-error';
import { error, redirect } from '@sveltejs/kit';
import type { BuildingWithStats } from '$lib/types';
import { formError, parseBuildingForm } from '$lib/server/building-form';
import type { Actions } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface BuildingEditData {
	building: BuildingWithStats;
}

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }): Promise<BuildingEditData> => {
	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`);

		if (!response.ok) {
			if (response.status === 404) {
				throw error(404, m.buildings_not_found());
			}
			throw error(response.status, m.buildings_load_failed());
		}

		const data = await response.json();

		const building: BuildingWithStats = {
			id: data.id,
			name: data.name || '',
			address: data.address,
			postalCode: data.postalCode,
			city: data.city,
			canton: data.canton,
			country: data.country || 'CH',
			latitude: data.latitude ? Number(data.latitude) : undefined,
			longitude: data.longitude ? Number(data.longitude) : undefined,
			yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : undefined,
			buildingType: data.buildingType,
			apartmentCount: Number(data.apartmentCount) || 0,
			occupiedCount: Number(data.occupiedCount) || 0,
			vacantCount: Number(data.vacantCount) || 0
		};

		return { building };
	} catch (err) {
		console.error('Failed to fetch building for edit:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, m.buildings_load_failed());
	}
};

export const actions: Actions = {
	default: async ({ request, params, fetch }) => {
		const { building, errors } = parseBuildingForm(await request.formData());
		if (Object.keys(errors).length > 0) {
			return { success: false, errors };
		}

		try {
			const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				// null clears a stored building type; an omitted field would keep it
				body: JSON.stringify({ ...building, buildingType: building.buildingType ?? null })
			});

			if (!response.ok) {
				const error = await response.json();
				return formError(backendMessage(error, m.buildings_save_failed()));
			}
		} catch (err) {
			console.error('Failed to update building:', err);
			return formError(m.buildings_save_failed());
		}

		throw redirect(303, `/buildings/${params.id}`);
	}
};
