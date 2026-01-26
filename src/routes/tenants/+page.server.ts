import type { TenantsListData, TenantWithOccupancy } from '$lib/types';

export const load = async ({ url }: { url: URL }): Promise<TenantsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const pageSize = parseInt(url.searchParams.get('pageSize') || '12', 10);
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';

	// Mock tenants for development
	const mockTenants: TenantWithOccupancy[] = [
		{
			id: 'tenant-001',
			first_name: 'Hans',
			last_name: 'Müller',
			email: 'h.mueller@email.com',
			phone_number: '+41 79 123 45 67',
			address: 'Musterstraße 12',
			postal_code: '8000',
			city: 'Zürich',
			current_apartment: 'Wohnung 2.04',
			current_building: 'Musterhaus Zentrum',
			contract_status: 'Aktiv'
		},
		{
			id: 'tenant-002',
			first_name: 'Maria',
			last_name: 'Schmidt',
			email: 'm.schmidt@email.com',
			phone_number: '+41 78 234 56 78',
			address: 'Seestrasse 45',
			postal_code: '6004',
			city: 'Luzern',
			current_apartment: 'Wohnung 1.02',
			current_building: 'Musterhaus Zentrum',
			contract_status: 'Aktiv'
		},
		{
			id: 'tenant-003',
			first_name: 'Peter',
			last_name: 'Weber',
			email: 'p.weber@email.com',
			phone_number: '+41 76 345 67 89',
			address: 'Bergweg 7',
			postal_code: '3012',
			city: 'Bern',
			current_apartment: 'Wohnung 3.01',
			current_building: 'Seepark Residenz',
			contract_status: 'Aktiv'
		},
		{
			id: 'tenant-004',
			first_name: 'Anna',
			last_name: 'Keller',
			email: 'a.keller@email.com',
			phone_number: '+41 77 456 78 90',
			current_apartment: 'Wohnung 2.02',
			current_building: 'Seepark Residenz',
			contract_status: 'Aktiv'
		},
		{
			id: 'tenant-005',
			first_name: 'Thomas',
			last_name: 'Brunner',
			email: 't.brunner@email.com',
			phone_number: '+41 79 567 89 01',
			current_apartment: 'Wohnung 2.01',
			current_building: 'Alpenblick',
			contract_status: 'Aktiv'
		},
		{
			id: 'tenant-006',
			first_name: 'Sarah',
			last_name: 'Fischer',
			email: 's.fischer@email.com',
			phone_number: '+41 78 678 90 12',
			contract_status: null
		},
		{
			id: 'tenant-007',
			first_name: 'Kevin',
			last_name: 'Meier',
			email: 'k.meier@email.com',
			phone_number: '+41 76 789 01 23',
			contract_status: null
		}
	];

	// Filter by search term
	let filteredTenants = mockTenants;
	if (search) {
		const searchLower = search.toLowerCase();
		filteredTenants = filteredTenants.filter(
			(t) =>
				t.first_name.toLowerCase().includes(searchLower) ||
				t.last_name.toLowerCase().includes(searchLower) ||
				t.email.toLowerCase().includes(searchLower) ||
				t.current_building?.toLowerCase().includes(searchLower)
		);
	}

	// Filter by status
	if (status === 'active') {
		filteredTenants = filteredTenants.filter((t) => t.contract_status === 'Aktiv');
	} else if (status === 'inactive') {
		filteredTenants = filteredTenants.filter((t) => !t.contract_status);
	}

	// Paginate
	const start = (page - 1) * pageSize;
	const paginatedTenants = filteredTenants.slice(start, start + pageSize);

	return {
		tenants: paginatedTenants,
		total: filteredTenants.length,
		page,
		pageSize
	};
};
