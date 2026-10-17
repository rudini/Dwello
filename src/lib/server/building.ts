import type { BuildingWithStats } from '$lib/types';

/** A building of the backend (`GET /buildings/:id`, `tests/contracts/building.json`) with its apartment counts */
export const toBuilding = (data: Record<string, unknown>): BuildingWithStats => ({
	id: data.id as string,
	name: (data.name as string) || '',
	address: data.address as string,
	postalCode: data.postalCode as string,
	city: data.city as string,
	canton: data.canton as string,
	country: (data.country as string) || 'CH',
	yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : undefined,
	buildingType: data.buildingType as string | null | undefined,
	noTank: !!data.noTank,
	apartmentCount: Number(data.apartmentCount) || 0,
	occupiedCount: Number(data.occupiedCount) || 0,
	vacantCount: Number(data.vacantCount) || 0
});
