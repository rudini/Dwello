import { error, fail, redirect } from '@sveltejs/kit';
import { countStatus } from '$lib/apartment';
import type { BuildingWithStats, Apartment, ApartmentStatus } from '$lib/types';
import type { Actions, PageServerLoad } from './$types';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export interface BuildingDetailsData {
	building: BuildingWithStats;
	apartments: Apartment[];
}

export const load: PageServerLoad = async ({ params, fetch }): Promise<BuildingDetailsData> => {
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

		const apartments: Apartment[] = (apartmentsData.apartments || apartmentsData.data || []).map(
			(a: Record<string, unknown>) => {
				const status: ApartmentStatus = (a.status as ApartmentStatus) || 'vacant';
				return {
					id: a.id as string,
					buildingId: a.buildingId as string,
					number: (a.number as string) || '',
					floor: (a.floor as number) || 0,
					rooms: a.rooms || '0',
					area: a.area || '0',
					status,
					nextContractStart: (a.nextContractStart as string | null) ?? null
				};
			}
		);
		building.reletCount = countStatus(apartments, 'relet');
		building.reservedCount = countStatus(apartments, 'reserved');

		return { building, apartments };
	} catch (err) {
		console.error('Failed to fetch building:', err);
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		throw error(500, 'Fehler beim Laden des Gebäudes');
	}
};

export const actions: Actions = {
	delete: async ({ params, fetch }) => {
		const response = await fetch(`${BACKEND_URL}/api/v1/buildings/${params.id}`, {
			method: 'DELETE'
		});
		if (!response.ok) {
			return fail(response.status, { deleteError: 'Gebäude konnte nicht gelöscht werden.' });
		}
		throw redirect(303, '/buildings');
	}
};
