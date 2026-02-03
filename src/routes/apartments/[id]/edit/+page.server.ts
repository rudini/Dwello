import type { Apartment, ApartmentStatus } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ApartmentEditData {
	apartment: Apartment;
	buildings: { id: string; name: string; address: string }[];
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<ApartmentEditData> => {
	try {
		const [apartmentRes, buildingsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/apartments/${params.id}`),
			fetch(`${BACKEND_URL}/api/v1/buildings?limit=100`)
		]);

		if (!apartmentRes.ok) {
			if (apartmentRes.status === 404) {
				throw error(404, 'Wohnung nicht gefunden');
			}
			throw error(apartmentRes.status, 'Fehler beim Laden der Wohnung');
		}

		const data = await apartmentRes.json();
		const buildingsData = await buildingsRes.json();

		const status: ApartmentStatus = data.status || (data.currentTenantId ? 'occupied' : 'vacant');
		const apartment: Apartment = {
			id: data.id,
			buildingId: data.buildingId,
			number: data.number || '',
			floor: data.floor || 0,
			area: data.area || '0',
			rooms: data.rooms || '0',
			status
		};

		const buildings = (buildingsData.buildings || buildingsData.data || []).map((b: Record<string, unknown>) => ({
			id: b.id,
			name: b.name || '',
			address: `${b.address}, ${b.postalCode} ${b.city}`
		}));

		return { apartment, buildings };
	} catch (err) {
		console.error('Failed to fetch apartment for edit:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden der Wohnung');
	}
};

export const actions: Actions = {
	default: async ({ request, params, fetch }) => {
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
			const response = await fetch(`${BACKEND_URL}/api/v1/apartments/${params.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					buildingId,
					number: number.trim(),
					floor: parseInt(floor, 10),
					area: area.trim(),
					rooms: rooms.trim()
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, {
					errors: { form: errorData.error || 'Fehler beim Speichern der Wohnung' },
					values: { buildingId, number, floor, area, rooms }
				});
			}

			throw redirect(303, `/apartments/${params.id}`);
		} catch (err) {
			if (err && typeof err === 'object' && 'status' in err && (err as { status: number }).status === 303) {
				throw err;
			}
			console.error('Failed to update apartment:', err);
			return fail(500, {
				errors: { form: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' },
				values: { buildingId, number, floor, area, rooms }
			});
		}
	}
};
