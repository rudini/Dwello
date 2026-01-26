import type { ContractsListData, ContractWithDetails } from '$lib/types';

export const load = async ({ url }: { url: URL }): Promise<ContractsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '12', 10);
	const search = url.searchParams.get('search') || '';
	const buildingId = url.searchParams.get('building') || '';
	const status = url.searchParams.get('status') || '';

	// Mock buildings for filter dropdown
	const buildings = [
		{ id: 'building-001', name: 'Musterhaus Zentrum', address: 'Musterstraße 12' },
		{ id: 'building-002', name: 'Seepark Residenz', address: 'Seestrasse 45' },
		{ id: 'building-003', name: 'Alpenblick', address: 'Bergweg 7' }
	];

	// Mock apartments for filter dropdown
	const apartments = [
		{ id: 'apt-001', unit: '2.04', building_id: 'building-001' },
		{ id: 'apt-002', unit: '1.02', building_id: 'building-001' },
		{ id: 'apt-003', unit: '0.01', building_id: 'building-001' },
		{ id: 'apt-004', unit: '3.01', building_id: 'building-002' },
		{ id: 'apt-005', unit: '2.02', building_id: 'building-002' }
	];

	// Mock contracts for development
	const mockContracts: ContractWithDetails[] = [
		{
			id: 'contract-001',
			apartment_id: 'apt-001',
			tenant_id: 'tenant-001',
			start_date: '2021-03-01',
			base_rent_chf: 2100,
			additional_rent_chf: 250,
			advance_payment_chf: 120,
			status: 'Aktiv',
			tenant_name: 'Hans Müller',
			tenant_first_name: 'Hans',
			tenant_last_name: 'Müller',
			apartment_unit: '2.04',
			building_name: 'Musterhaus Zentrum',
			building_address: 'Musterstraße 12',
			total_rent: 2470
		},
		{
			id: 'contract-002',
			apartment_id: 'apt-002',
			tenant_id: 'tenant-002',
			start_date: '2022-06-15',
			base_rent_chf: 1650,
			additional_rent_chf: 200,
			status: 'Aktiv',
			tenant_name: 'Maria Schmidt',
			tenant_first_name: 'Maria',
			tenant_last_name: 'Schmidt',
			apartment_unit: '1.02',
			building_name: 'Musterhaus Zentrum',
			building_address: 'Musterstraße 12',
			total_rent: 1850
		},
		{
			id: 'contract-003',
			apartment_id: 'apt-004',
			tenant_id: 'tenant-003',
			start_date: '2020-01-01',
			base_rent_chf: 2800,
			additional_rent_chf: 300,
			advance_payment_chf: 100,
			status: 'Aktiv',
			tenant_name: 'Peter Weber',
			tenant_first_name: 'Peter',
			tenant_last_name: 'Weber',
			apartment_unit: '3.01',
			building_name: 'Seepark Residenz',
			building_address: 'Seestrasse 45',
			total_rent: 3200
		},
		{
			id: 'contract-004',
			apartment_id: 'apt-005',
			tenant_id: 'tenant-004',
			start_date: '2023-04-01',
			base_rent_chf: 1900,
			additional_rent_chf: 200,
			status: 'Aktiv',
			tenant_name: 'Anna Keller',
			tenant_first_name: 'Anna',
			tenant_last_name: 'Keller',
			apartment_unit: '2.02',
			building_name: 'Seepark Residenz',
			building_address: 'Seestrasse 45',
			total_rent: 2100
		},
		{
			id: 'contract-005',
			apartment_id: 'apt-001',
			tenant_id: 'tenant-006',
			start_date: '2018-05-01',
			end_date: '2021-02-28',
			base_rent_chf: 1900,
			additional_rent_chf: 200,
			status: 'Beendet',
			tenant_name: 'Sarah Fischer',
			tenant_first_name: 'Sarah',
			tenant_last_name: 'Fischer',
			apartment_unit: '2.04',
			building_name: 'Musterhaus Zentrum',
			building_address: 'Musterstraße 12',
			total_rent: 2100
		},
		{
			id: 'contract-006',
			apartment_id: 'apt-001',
			tenant_id: 'tenant-007',
			start_date: '2015-01-01',
			end_date: '2018-04-30',
			base_rent_chf: 1750,
			additional_rent_chf: 180,
			status: 'Beendet',
			tenant_name: 'Kevin Meier',
			tenant_first_name: 'Kevin',
			tenant_last_name: 'Meier',
			apartment_unit: '2.04',
			building_name: 'Musterhaus Zentrum',
			building_address: 'Musterstraße 12',
			total_rent: 1930
		}
	];

	// Filter by search term
	let filteredContracts = mockContracts;
	if (search) {
		const searchLower = search.toLowerCase();
		filteredContracts = filteredContracts.filter(
			(c) =>
				c.tenant_name.toLowerCase().includes(searchLower) ||
				c.apartment_unit.toLowerCase().includes(searchLower) ||
				c.building_name?.toLowerCase().includes(searchLower)
		);
	}

	// Filter by building
	if (buildingId) {
		const buildingApartments = apartments
			.filter((a) => a.building_id === buildingId)
			.map((a) => a.id);
		filteredContracts = filteredContracts.filter((c) =>
			buildingApartments.includes(c.apartment_id)
		);
	}

	// Filter by status
	if (status === 'active') {
		filteredContracts = filteredContracts.filter((c) => c.status === 'Aktiv');
	} else if (status === 'ended') {
		filteredContracts = filteredContracts.filter((c) => c.status === 'Beendet');
	}

	// Paginate
	const start = (page - 1) * pageSize;
	const paginatedContracts = filteredContracts.slice(start, start + pageSize);

	return {
		contracts: paginatedContracts,
		total: filteredContracts.length,
		page,
		pageSize,
		buildings,
		apartments
	};
};
