import type { BuildingWithStats, Json } from '$lib/types';
import type { BuildingWithStats as BuildingResponse } from '../../../backend/src/api/building';

/** A building of the backend (`GET /buildings/:id`, `tests/contracts/building.json`) with its apartment counts */
export const toBuilding = (data: Json<BuildingResponse>): BuildingWithStats => ({
	id: data.id,
	name: data.name || '',
	address: data.address,
	postalCode: data.postalCode,
	city: data.city,
	canton: data.canton,
	country: data.country || 'CH',
	yearBuilt: data.yearBuilt ? Number(data.yearBuilt) : undefined,
	buildingType: data.buildingType,
	noTank: !!data.noTank,
	apartmentCount: Number(data.apartmentCount) || 0,
	occupiedCount: Number(data.occupiedCount) || 0,
	vacantCount: Number(data.vacantCount) || 0
});
