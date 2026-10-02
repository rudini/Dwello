import { redirect } from '@sveltejs/kit';
import { formError, parseBuildingForm } from '$lib/server/building-form';
import type { Actions } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const { building, errors } = parseBuildingForm(await request.formData());
		if (Object.keys(errors).length > 0) {
			return { success: false, errors };
		}

		let response: Response;
		try {
			response = await fetch(`${BACKEND_URL}/api/v1/buildings`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...building, country: 'CH' })
			});
		} catch (err) {
			console.error('Failed to create building:', err);
			return formError('Fehler beim Erstellen');
		}

		if (!response.ok) {
			const error = await response.json();
			return formError(error.error || error.message || 'Fehler beim Erstellen');
		}

		const newBuilding = await response.json();
		throw redirect(303, `/buildings/${newBuilding.id}`);
	}
};
