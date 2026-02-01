import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface NewApartmentPageData {
	buildings: Array<{ id: string; name: string; address: string }>;
	presetBuildingId: string | null;
}

export const load = async ({ url, fetch }: { url: URL; fetch: typeof globalThis.fetch }): Promise<NewApartmentPageData> => {
	const presetBuildingId = url.searchParams.get('building') || url.searchParams.get('buildingId');

	try {
		const response = await fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`);
		const data = await response.json();

		const buildings = (data.buildings || data.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: (b.name as string) || `${b.address}, ${b.city}`,
			address: `${b.address}, ${b.postalCode} ${b.city}`
		}));

		return {
			buildings,
			presetBuildingId
		};
	} catch (error) {
		console.error('Failed to fetch buildings:', error);
		return {
			buildings: [],
			presetBuildingId
		};
	}
};

export const actions: Actions = {
	default: async ({ request, fetch }) => {
		const formData = await request.formData();

		const buildingId = formData.get('buildingId') as string;
		const number = formData.get('number') as string;
		const floor = formData.get('floor') as string;
		const area = formData.get('area') as string;
		const rooms = formData.get('rooms') as string;

		// Validation
		const errors: Record<string, string> = {};
		if (!buildingId) errors.buildingId = 'Bitte wählen Sie ein Gebäude aus';
		if (!number?.trim()) errors.number = 'Wohnungsnummer ist erforderlich';
		if (!floor) errors.floor = 'Stockwerk ist erforderlich';
		if (!area?.trim()) errors.area = 'Fläche ist erforderlich';
		if (!rooms) errors.rooms = 'Zimmeranzahl ist erforderlich';

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values: { buildingId, number, floor, area, rooms } });
		}

		try {
			const response = await fetch(`${BACKEND_URL}/api/v1/apartments`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					buildingId,
					number: number.trim(),
					floor: parseInt(floor, 10),
					area: area.trim(),
					rooms: rooms.trim(),
					status: 'vacant'
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, {
					errors: { form: errorData.error || 'Fehler beim Erstellen der Wohnung' },
					values: { buildingId, number, floor, area, rooms }
				});
			}

			const result = await response.json();

			// Redirect to the new apartment or building page
			throw redirect(303, `/apartments/${result.id}`);
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 303) {
				throw err;
			}
			console.error('Failed to create apartment:', err);
			return fail(500, {
				errors: { form: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
				values: { buildingId, number, floor, area, rooms }
			});
		}
	}
};
