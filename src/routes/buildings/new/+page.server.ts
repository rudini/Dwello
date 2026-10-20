import { m } from '$lib/paraglide/messages';
import { backendMessage } from '$lib/backend-error';
import { redirect } from '@sveltejs/kit';
import { formError, parseBuildingForm, parseRegisterApartments } from '$lib/server/building-form';
import type { Actions } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();
		const { building, errors } = parseBuildingForm(formData);
		const apartments = parseRegisterApartments(formData, errors);
		if (Object.keys(errors).length > 0) {
			return { success: false, errors };
		}

		let response: Response;
		try {
			response = await fetch(`${BACKEND_URL}/api/v1/buildings`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...building,
					country: 'CH',
					...(apartments.length && { apartments })
				})
			});
		} catch (err) {
			console.error('Failed to create building:', err);
			return formError(m.buildings_create_failed());
		}

		if (!response.ok) {
			const error = await response.json();
			return formError(backendMessage(error, m.buildings_create_failed()));
		}

		const newBuilding = await response.json();
		throw redirect(303, `/buildings/${newBuilding.id}`);
	}
};
