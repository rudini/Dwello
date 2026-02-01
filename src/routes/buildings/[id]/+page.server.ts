import { error } from '@sveltejs/kit';
import type { BuildingWithStats, Apartment } from '$lib/types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface BuildingDetailsData {
	building: BuildingWithStats;
	apartments: Apartment[];
}

export const load = async ({ params, fetch }): Promise<BuildingDetailsData> => {
	try {
		const [buildingRes, apartmentsRes] = await Promise.all([
			fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`),
			fetch(`${BACKEND_URL}/api/v1/apartments?buildingId=${params.id}&limit=100`)
		]);

		if (!buildingRes.ok) {
			if (buildingRes.status === 404) {
				throw error(404, 'Gebäude nicht gefunden');
			}
			throw error(buildingRes.status, 'Fehler beim Laden des Gebäudes');
		}

		const buildingData = await buildingRes.json();
		const apartmentsData = await apartmentsRes.json();

		const building: BuildingWithStats = {
			id: buildingData.id,
			name: buildingData.name || '',
			address: buildingData.address,
			postalCode: buildingData.postalCode,
			city: buildingData.city,
			canton: buildingData.canton,
			country: buildingData.country || 'CH',
			latitude: buildingData.latitude ? Number(buildingData.latitude) : undefined,
			longitude: buildingData.longitude ? Number(buildingData.longitude) : undefined,
			yearBuilt: buildingData.yearBuilt ? Number(buildingData.yearBuilt) : undefined,
			buildingType: buildingData.buildingType,
			apartmentCount: Number(buildingData.apartmentCount) || 0,
			occupiedCount: Number(buildingData.occupiedCount) || 0,
			vacantCount: Number(buildingData.vacantCount) || 0
		};

		const apartments: Apartment[] = (apartmentsData.apartments || apartmentsData.data || []).map((a: Record<string, unknown>) => ({
			id: a.id,
			building_id: a.buildingId,
			address_unit: a.number || '',
			floor: a.floor,
			room_count: a.rooms ? Number(a.rooms) : undefined,
			size_m2: a.area ? Number(a.area) : undefined,
			occupancy_status: a.status === 'occupied' ? 'Vermietet' : 'Leer',
			current_tenant_name: a.currentTenant
				? `${(a.currentTenant as Record<string, string>).firstName} ${(a.currentTenant as Record<string, string>).lastName}`
				: undefined
		}));

		return { building, apartments };
	} catch (err) {
		console.error('Failed to fetch building:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Gebäudes');
	}
};
