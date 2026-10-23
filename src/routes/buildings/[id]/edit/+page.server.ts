import { m } from '$lib/paraglide/messages';
import { backendMessage, refusedFields } from '$lib/backend-error';
import { error, redirect } from '@sveltejs/kit';
import type { BuildingWithStats } from '$lib/types';
import { toBuilding } from '$lib/server/building';
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

		const building = toBuilding(data);

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
		const { building } = parseBuildingForm(await request.formData());

		try {
			const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				// null clears a stored building type; an omitted field would keep it
				body: JSON.stringify({ ...building, buildingType: building.buildingType ?? null })
			});

			if (!response.ok) {
				const error = await response.json();
				// the form's checks are the backend's (H-28, #717): each at its field
				if (error.causes) return { success: false, errors: refusedFields(error) };
				return formError(backendMessage(error, m.buildings_save_failed()));
			}
		} catch (err) {
			console.error('Failed to update building:', err);
			return formError(m.buildings_save_failed());
		}

		throw redirect(303, `/buildings/${params.id}`);
	}
};
