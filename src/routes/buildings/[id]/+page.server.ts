import { error } from '@sveltejs/kit';
import type { BuildingWithStats, Apartment } from '$lib/types';
import { getBuilding, getApartmentsByBuilding } from '$lib/server/mockData';

export interface BuildingDetailsData {
	building: BuildingWithStats;
	apartments: Apartment[];
}

export const load = async ({ params }: { params: { id: string } }): Promise<BuildingDetailsData> => {
	const buildingId = params.id;

	// In production, fetch from backend API via proxy
	// const response = await fetch(`/api/buildings/${buildingId}`);
	// const data = await response.json();

	// Find building by ID
	const building = getBuilding(buildingId);

	if (!building) {
		throw error(404, 'Building not found');
	}

	// Get apartments for this building
	const apartments = getApartmentsByBuilding(buildingId);

	return {
		building,
		apartments
	};
};
