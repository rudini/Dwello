import type { Apartment } from '$lib/types';

interface ApartmentEditData {
	apartment: Apartment;
	buildings: { id: string; name: string; address: string }[];
}

export const load = async ({ params }: { params: { id: string } }): Promise<ApartmentEditData> => {
	const { id } = params;

	// Mock data - in production, fetch from API
	// const response = await fetch(`/api/apartments/${id}`);
	// const data = await response.json();

	// Mock apartments
	const mockApartments: Record<string, Apartment> = {
		'apt-001': {
			id: 'apt-001',
			building_id: 'building-001',
			floor: '2.OG',
			address_unit: '2.04',
			size_m2: 85,
			room_count: 3.5,
			occupancy_status: 'Vermietet'
		},
		'apt-002': {
			id: 'apt-002',
			building_id: 'building-001',
			floor: '1.OG',
			address_unit: '1.02',
			size_m2: 65,
			room_count: 2.5,
			occupancy_status: 'Vermietet'
		},
		'apt-003': {
			id: 'apt-003',
			building_id: 'building-001',
			floor: 'EG',
			address_unit: '0.01',
			size_m2: 95,
			room_count: 4.5,
			occupancy_status: 'Leer'
		}
	};

	const apartment = mockApartments[id] || {
		id,
		building_id: 'building-001',
		floor: '1.OG',
		address_unit: '1.01',
		size_m2: 70,
		room_count: 3,
		occupancy_status: 'Leer' as const
	};

	const buildings = [
		{ id: 'building-001', name: 'Musterhaus Zentrum', address: 'Musterstraße 12, 8000 Zürich' },
		{ id: 'building-002', name: 'Seepark Residenz', address: 'Seestrasse 45, 6004 Luzern' },
		{ id: 'building-003', name: 'Alpenblick', address: 'Bergweg 7, 3012 Bern' }
	];

	return {
		apartment,
		buildings
	};
};
