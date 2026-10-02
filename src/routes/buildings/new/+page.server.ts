import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const address = formData.get('address') as string;
		const postalCode = formData.get('postalCode') as string;
		const city = formData.get('city') as string;
		const canton = formData.get('canton') as string;
		const buildingType = formData.get('buildingType') as string;
		const yearBuilt = formData.get('yearBuilt') as string;
		const latitude = formData.get('latitude') as string;
		const longitude = formData.get('longitude') as string;

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
			const response = await fetch(`${BACKEND_URL}/api/v1/buildings`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: name || null,
					address,
					postalCode,
					city,
					canton: canton || null,
					country: 'CH',
					buildingType: buildingType || undefined,
					yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
					latitude: latitude ? parseFloat(latitude) : null,
					longitude: longitude ? parseFloat(longitude) : null
				})
			});

			if (!response.ok) {
				const error = await response.json();
				return { success: false, errors: { form: error.error || error.message || 'Fehler beim Erstellen' } };
			}

			const newBuilding = await response.json();
			throw redirect(303, `/buildings/${newBuilding.id}`);
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err && err.status === 303) {
				throw err;
			}
			console.error('Failed to create building:', err);
			return { success: false, errors: { form: 'Fehler beim Erstellen' } };
		}
	}
};
