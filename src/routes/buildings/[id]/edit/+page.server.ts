import type { BuildingWithStats } from '$lib/types';

export interface BuildingEditData {
	building: BuildingWithStats;
}

export const load = async ({ params }: { params: { id: string } }): Promise<BuildingEditData> => {
	const buildingId = params.id;

	// Mock data - in production, fetch from backend API
	const building: BuildingWithStats = {
		id: buildingId,
		name: 'Musterhaus Zentrum',
		address: 'Musterstraße 12',
		postalCode: '8000',
		city: 'Zürich',
		canton: 'ZH',
		country: 'Switzerland',
		latitude: 47.3769,
		longitude: 8.5417,
		buildingType: 'Mehrfamilienhaus',
		yearBuilt: 1985,
		apartmentCount: 8,
		occupiedCount: 7,
		vacantCount: 1
	};

	return { building };
};
