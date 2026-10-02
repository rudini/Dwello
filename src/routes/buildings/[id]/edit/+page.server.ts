import { error, redirect } from '@sveltejs/kit';
import type { BuildingWithStats } from '$lib/types';
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
				throw error(404, 'Gebäude nicht gefunden');
			}
			throw error(response.status, 'Fehler beim Laden des Gebäudes');
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
		throw error(500, 'Fehler beim Laden des Gebäudes');
	}
};

export const actions: Actions = {
	default: async ({ request, params, fetch }) => {
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const address = formData.get('address') as string;
		const postalCode = formData.get('postalCode') as string;
		const city = formData.get('city') as string;
		const canton = formData.get('canton') as string;
		const buildingType = formData.get('buildingType') as string;
		const yearBuilt = formData.get('yearBuilt') as string;

		// Validate required fields
		const errors: Record<string, string> = {};
		if (!address?.trim()) {
			errors.address = 'Adresse ist erforderlich';
		}
		if (!postalCode?.trim()) {
			errors.postalCode = 'PLZ ist erforderlich';
		} else if (!/^\d{4}$/.test(postalCode)) {
			errors.postalCode = 'PLZ muss 4 Ziffern haben';
		}
		if (!city?.trim()) {
			errors.city = 'Stadt ist erforderlich';
		}
		if (yearBuilt && (isNaN(parseInt(yearBuilt)) || parseInt(yearBuilt) < 1800 || parseInt(yearBuilt) > new Date().getFullYear())) {
			errors.yearBuilt = 'Baujahr muss zwischen 1800 und heute liegen';
		}

		if (Object.keys(errors).length > 0) {
			return { success: false, errors };
		}

		try {
			const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: name || null,
					address,
					postalCode,
					city,
					canton: canton || null,
					buildingType: buildingType || null,
					yearBuilt: yearBuilt ? parseInt(yearBuilt) : null
				})
			});

			if (!response.ok) {
				const error = await response.json();
				return { success: false, errors: { form: error.error || error.message || 'Fehler beim Speichern' } };
			}
		} catch (err) {
			console.error('Failed to update building:', err);
			return { success: false, errors: { form: 'Fehler beim Speichern' } };
		}

		throw redirect(303, `/buildings/${params.id}`);
	}
};
