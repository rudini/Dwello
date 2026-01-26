import type { ApartmentsListData, ApartmentWithBuilding } from '$lib/types';

export const load = async ({ url }: { url: URL }): Promise<ApartmentsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '12', 10);
	const search = url.searchParams.get('search') || '';
	const buildingId = url.searchParams.get('building') || '';
	const status = url.searchParams.get('status') || '';

	// Mock data - in production, this would fetch from the backend API via the proxy
	// const response = await fetch(`/api/apartments?page=${page}&pageSize=${pageSize}&search=${search}&building=${buildingId}&status=${status}`);
	// const data = await response.json();

	// Mock buildings for filter dropdown
	const buildings = [
		{ id: 'building-001', name: 'Musterhaus Zentrum', address: 'Musterstraße 12' },
		{ id: 'building-002', name: 'Seepark Residenz', address: 'Seestrasse 45' },
		{ id: 'building-003', name: 'Alpenblick', address: 'Bergweg 7' }
	];

	// Mock apartments for development
	const mockApartments: ApartmentWithBuilding[] = [
		{
			id: 'apt-001',
			building_id: 'building-001',
			floor: '2.OG',
			address_unit: '2.04',
			size_m2: 85,
			room_count: 3.5,
			occupancy_status: 'Vermietet',
			building_name: 'Musterhaus Zentrum',
			building_address: 'Musterstraße 12',
			building_city: 'Zürich',
			current_tenant_name: 'Hans Müller',
			current_rent: 2470
		},
		{
			id: 'apt-002',
			building_id: 'building-001',
			floor: '1.OG',
			address_unit: '1.02',
			size_m2: 65,
			room_count: 2.5,
			occupancy_status: 'Vermietet',
			building_name: 'Musterhaus Zentrum',
			building_address: 'Musterstraße 12',
			building_city: 'Zürich',
			current_tenant_name: 'Maria Schmidt',
			current_rent: 1850
		},
		{
			id: 'apt-003',
			building_id: 'building-001',
			floor: 'EG',
			address_unit: '0.01',
			size_m2: 95,
			room_count: 4.5,
			occupancy_status: 'Leer',
			building_name: 'Musterhaus Zentrum',
			building_address: 'Musterstraße 12',
			building_city: 'Zürich'
		},
		{
			id: 'apt-004',
			building_id: 'building-002',
			floor: '3.OG',
			address_unit: '3.01',
			size_m2: 120,
			room_count: 5.5,
			occupancy_status: 'Vermietet',
			building_name: 'Seepark Residenz',
			building_address: 'Seestrasse 45',
			building_city: 'Luzern',
			current_tenant_name: 'Peter Weber',
			current_rent: 3200
		},
		{
			id: 'apt-005',
			building_id: 'building-002',
			floor: '2.OG',
			address_unit: '2.02',
			size_m2: 75,
			room_count: 3,
			occupancy_status: 'Vermietet',
			building_name: 'Seepark Residenz',
			building_address: 'Seestrasse 45',
			building_city: 'Luzern',
			current_tenant_name: 'Anna Keller',
			current_rent: 2100
		},
		{
			id: 'apt-006',
			building_id: 'building-002',
			floor: '1.OG',
			address_unit: '1.01',
			size_m2: 80,
			room_count: 3.5,
			occupancy_status: 'Gesperrt',
			building_name: 'Seepark Residenz',
			building_address: 'Seestrasse 45',
			building_city: 'Luzern'
		},
		{
			id: 'apt-007',
			building_id: 'building-003',
			floor: '2.OG',
			address_unit: '2.01',
			size_m2: 70,
			room_count: 3,
			occupancy_status: 'Vermietet',
			building_name: 'Alpenblick',
			building_address: 'Bergweg 7',
			building_city: 'Bern',
			current_tenant_name: 'Thomas Brunner',
			current_rent: 1950
		},
		{
			id: 'apt-008',
			building_id: 'building-003',
			floor: 'EG',
			address_unit: '0.02',
			size_m2: 55,
			room_count: 2,
			occupancy_status: 'Leer',
			building_name: 'Alpenblick',
			building_address: 'Bergweg 7',
			building_city: 'Bern'
		}
	];

	// Filter by search term
	let filteredApartments = mockApartments;
	if (search) {
		const searchLower = search.toLowerCase();
		filteredApartments = filteredApartments.filter(
			(a) =>
				a.address_unit.toLowerCase().includes(searchLower) ||
				a.building_name?.toLowerCase().includes(searchLower) ||
				a.building_address.toLowerCase().includes(searchLower) ||
				a.current_tenant_name?.toLowerCase().includes(searchLower)
		);
	}

	// Filter by building
	if (buildingId) {
		filteredApartments = filteredApartments.filter((a) => a.building_id === buildingId);
	}

	// Filter by status
	if (status) {
		filteredApartments = filteredApartments.filter((a) => a.occupancy_status === status);
	}

	// Paginate
	const start = (page - 1) * pageSize;
	const paginatedApartments = filteredApartments.slice(start, start + pageSize);

	return {
		apartments: paginatedApartments,
		total: filteredApartments.length,
		page,
		pageSize,
		buildings
	};
};
