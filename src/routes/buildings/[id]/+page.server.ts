import { error } from '@sveltejs/kit';
import type { BuildingWithStats, Apartment } from '$lib/types';

export interface BuildingDetailsData {
	building: BuildingWithStats;
	apartments: Apartment[];
}

// Mock buildings data - same as list page
const mockBuildings: BuildingWithStats[] = [
	{
		id: 'building-001',
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
	},
	{
		id: 'building-002',
		name: 'Seepark Residenz',
		address: 'Seestrasse 45',
		postalCode: '6004',
		city: 'Luzern',
		canton: 'LU',
		country: 'Switzerland',
		latitude: 47.0502,
		longitude: 8.3093,
		buildingType: 'Mehrfamilienhaus',
		yearBuilt: 2010,
		apartmentCount: 12,
		occupiedCount: 12,
		vacantCount: 0
	},
	{
		id: 'building-003',
		name: 'Alpenblick',
		address: 'Bergweg 7',
		postalCode: '3012',
		city: 'Bern',
		canton: 'BE',
		country: 'Switzerland',
		latitude: 46.9480,
		longitude: 7.4474,
		buildingType: 'Mehrfamilienhaus',
		yearBuilt: 1972,
		apartmentCount: 6,
		occupiedCount: 5,
		vacantCount: 1
	},
	{
		id: 'building-004',
		name: 'Sonnenhof',
		address: 'Bahnhofstrasse 88',
		postalCode: '4051',
		city: 'Basel',
		canton: 'BS',
		country: 'Switzerland',
		latitude: 47.5596,
		longitude: 7.5886,
		buildingType: 'Geschäftshaus',
		yearBuilt: 1995,
		apartmentCount: 4,
		occupiedCount: 3,
		vacantCount: 1
	}
];

export const load = async ({ params }: { params: { id: string } }): Promise<BuildingDetailsData> => {
	const buildingId = params.id;

	// Mock data - in production, fetch from backend API via proxy
	// const response = await fetch(`/api/buildings/${buildingId}`);
	// const data = await response.json();

	// Find building by ID
	const building = mockBuildings.find((b) => b.id === buildingId);

	if (!building) {
		throw error(404, 'Building not found');
	}

	// Mock apartments data
	const apartments: Apartment[] = [
		{
			id: 'apt-001',
			building_id: buildingId,
			floor: 'EG',
			address_unit: '0.01',
			size_m2: 65,
			room_count: 2.5,
			occupancy_status: 'Vermietet'
		},
		{
			id: 'apt-002',
			building_id: buildingId,
			floor: 'EG',
			address_unit: '0.02',
			size_m2: 75,
			room_count: 3,
			occupancy_status: 'Vermietet'
		},
		{
			id: 'apt-003',
			building_id: buildingId,
			floor: '1.OG',
			address_unit: '1.01',
			size_m2: 85,
			room_count: 3.5,
			occupancy_status: 'Vermietet'
		},
		{
			id: 'apt-004',
			building_id: buildingId,
			floor: '1.OG',
			address_unit: '1.02',
			size_m2: 85,
			room_count: 3.5,
			occupancy_status: 'Leer'
		},
		{
			id: 'apt-005',
			building_id: buildingId,
			floor: '2.OG',
			address_unit: '2.01',
			size_m2: 95,
			room_count: 4,
			occupancy_status: 'Vermietet'
		},
		{
			id: 'apt-006',
			building_id: buildingId,
			floor: '2.OG',
			address_unit: '2.02',
			size_m2: 95,
			room_count: 4,
			occupancy_status: 'Vermietet'
		},
		{
			id: 'apt-007',
			building_id: buildingId,
			floor: '3.OG',
			address_unit: '3.01',
			size_m2: 110,
			room_count: 4.5,
			occupancy_status: 'Vermietet'
		},
		{
			id: 'apt-008',
			building_id: buildingId,
			floor: '3.OG',
			address_unit: '3.02',
			size_m2: 110,
			room_count: 4.5,
			occupancy_status: 'Vermietet'
		}
	];

	return {
		building,
		apartments
	};
};
