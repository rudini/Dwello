/**
 * Shared mock data store for development
 * This simulates a database during development
 */

import type { BuildingWithStats, Apartment } from '$lib/types';

// Mock buildings data
export const mockBuildings: BuildingWithStats[] = [
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

// Mock apartments data for all buildings
export const mockApartments: Apartment[] = [
	// Building 001 - Musterhaus Zentrum (8 apartments)
	{ id: 'apt-001', building_id: 'building-001', floor: 'EG', address_unit: '0.01', size_m2: 65, room_count: 2.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-002', building_id: 'building-001', floor: 'EG', address_unit: '0.02', size_m2: 75, room_count: 3, occupancy_status: 'Vermietet' },
	{ id: 'apt-003', building_id: 'building-001', floor: '1.OG', address_unit: '1.01', size_m2: 85, room_count: 3.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-004', building_id: 'building-001', floor: '1.OG', address_unit: '1.02', size_m2: 85, room_count: 3.5, occupancy_status: 'Leer' },
	{ id: 'apt-005', building_id: 'building-001', floor: '2.OG', address_unit: '2.01', size_m2: 95, room_count: 4, occupancy_status: 'Vermietet' },
	{ id: 'apt-006', building_id: 'building-001', floor: '2.OG', address_unit: '2.02', size_m2: 95, room_count: 4, occupancy_status: 'Vermietet' },
	{ id: 'apt-007', building_id: 'building-001', floor: '3.OG', address_unit: '3.01', size_m2: 110, room_count: 4.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-008', building_id: 'building-001', floor: '3.OG', address_unit: '3.02', size_m2: 110, room_count: 4.5, occupancy_status: 'Vermietet' },
	// Building 002 - Seepark Residenz (12 apartments)
	{ id: 'apt-009', building_id: 'building-002', floor: 'EG', address_unit: '0.01', size_m2: 55, room_count: 2, occupancy_status: 'Vermietet' },
	{ id: 'apt-010', building_id: 'building-002', floor: 'EG', address_unit: '0.02', size_m2: 55, room_count: 2, occupancy_status: 'Vermietet' },
	{ id: 'apt-011', building_id: 'building-002', floor: 'EG', address_unit: '0.03', size_m2: 70, room_count: 3, occupancy_status: 'Vermietet' },
	{ id: 'apt-012', building_id: 'building-002', floor: '1.OG', address_unit: '1.01', size_m2: 80, room_count: 3.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-013', building_id: 'building-002', floor: '1.OG', address_unit: '1.02', size_m2: 80, room_count: 3.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-014', building_id: 'building-002', floor: '1.OG', address_unit: '1.03', size_m2: 90, room_count: 4, occupancy_status: 'Vermietet' },
	{ id: 'apt-015', building_id: 'building-002', floor: '2.OG', address_unit: '2.01', size_m2: 80, room_count: 3.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-016', building_id: 'building-002', floor: '2.OG', address_unit: '2.02', size_m2: 80, room_count: 3.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-017', building_id: 'building-002', floor: '2.OG', address_unit: '2.03', size_m2: 90, room_count: 4, occupancy_status: 'Vermietet' },
	{ id: 'apt-018', building_id: 'building-002', floor: '3.OG', address_unit: '3.01', size_m2: 100, room_count: 4.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-019', building_id: 'building-002', floor: '3.OG', address_unit: '3.02', size_m2: 100, room_count: 4.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-020', building_id: 'building-002', floor: '3.OG', address_unit: '3.03', size_m2: 120, room_count: 5, occupancy_status: 'Vermietet' },
	// Building 003 - Alpenblick (6 apartments)
	{ id: 'apt-021', building_id: 'building-003', floor: 'EG', address_unit: '0.01', size_m2: 60, room_count: 2.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-022', building_id: 'building-003', floor: 'EG', address_unit: '0.02', size_m2: 60, room_count: 2.5, occupancy_status: 'Vermietet' },
	{ id: 'apt-023', building_id: 'building-003', floor: '1.OG', address_unit: '1.01', size_m2: 75, room_count: 3, occupancy_status: 'Vermietet' },
	{ id: 'apt-024', building_id: 'building-003', floor: '1.OG', address_unit: '1.02', size_m2: 75, room_count: 3, occupancy_status: 'Leer' },
	{ id: 'apt-025', building_id: 'building-003', floor: '2.OG', address_unit: '2.01', size_m2: 90, room_count: 4, occupancy_status: 'Vermietet' },
	{ id: 'apt-026', building_id: 'building-003', floor: '2.OG', address_unit: '2.02', size_m2: 90, room_count: 4, occupancy_status: 'Vermietet' },
	// Building 004 - Sonnenhof (4 apartments - Geschäftshaus)
	{ id: 'apt-027', building_id: 'building-004', floor: 'EG', address_unit: 'Laden 1', size_m2: 120, room_count: 1, occupancy_status: 'Vermietet' },
	{ id: 'apt-028', building_id: 'building-004', floor: '1.OG', address_unit: 'Büro 1.01', size_m2: 150, room_count: 4, occupancy_status: 'Vermietet' },
	{ id: 'apt-029', building_id: 'building-004', floor: '2.OG', address_unit: 'Büro 2.01', size_m2: 150, room_count: 4, occupancy_status: 'Leer' },
	{ id: 'apt-030', building_id: 'building-004', floor: '3.OG', address_unit: 'Büro 3.01', size_m2: 150, room_count: 4, occupancy_status: 'Vermietet' }
];

// Counter for generating unique IDs
let buildingIdCounter = 5;

/**
 * Add a new building to the mock data store
 */
export function addBuilding(building: Omit<BuildingWithStats, 'id' | 'apartmentCount' | 'occupiedCount' | 'vacantCount'>): BuildingWithStats {
	const newBuilding: BuildingWithStats = {
		...building,
		id: `building-${String(buildingIdCounter++).padStart(3, '0')}`,
		apartmentCount: 0,
		occupiedCount: 0,
		vacantCount: 0
	};
	mockBuildings.push(newBuilding);
	return newBuilding;
}

/**
 * Get a building by ID
 */
export function getBuilding(id: string): BuildingWithStats | undefined {
	return mockBuildings.find((b) => b.id === id);
}

/**
 * Get apartments for a building
 */
export function getApartmentsByBuilding(buildingId: string): Apartment[] {
	return mockApartments.filter((apt) => apt.building_id === buildingId);
}
