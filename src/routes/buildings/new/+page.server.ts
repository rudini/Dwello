import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { addBuilding } from '$lib/server/mockData';

export const actions: Actions = {
	default: async ({ request }) => {
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

		// Add the building
		const newBuilding = addBuilding({
			name: name || undefined,
			address,
			postalCode,
			city,
			canton: canton || undefined,
			country: 'Switzerland',
			buildingType: buildingType || undefined,
			yearBuilt: yearBuilt ? parseInt(yearBuilt) : undefined
		});

		throw redirect(303, `/buildings/${newBuilding.id}`);
	}
};
