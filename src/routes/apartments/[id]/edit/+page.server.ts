import type { Apartment } from '$lib/types';
import { error } from '@sveltejs/kit';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

interface ApartmentEditData {
	apartment: Apartment;
	buildings: { id: string; name: string; address: string }[];
}

export const load = async ({ params, fetch }): Promise<ApartmentEditData> => {
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

		const apartment: Apartment = {
			id: data.id,
			building_id: data.buildingId,
			floor: data.floor || '',
			address_unit: data.number || '',
			size_m2: data.area ? Number(data.area) : undefined,
			room_count: data.rooms ? Number(data.rooms) : undefined,
			occupancy_status: data.currentTenantId ? 'Vermietet' : 'Leer'
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
