import type { Tenant, ContractHistory } from '$lib/types';

interface TenantDetailsData {
	tenant: Tenant;
	currentOccupancy: {
		apartment: string;
		building: string;
		rent: number;
		startDate: string;
	} | null;
	contractHistory: ContractHistory[];
}

export const load = async ({ params }: { params: { id: string } }): Promise<TenantDetailsData> => {
	const { id } = params;

	// Mock data - in production, fetch from API
	// const response = await fetch(`/api/tenants/${id}`);
	// const data = await response.json();

	// Mock tenants
	const mockTenants: Record<string, TenantDetailsData> = {
		'tenant-001': {
			tenant: {
				id: 'tenant-001',
				first_name: 'Hans',
				last_name: 'Müller',
				email: 'h.mueller@email.com',
				phone_number: '+41 79 123 45 67',
				address: 'Alte Adresse 15',
				postal_code: '8001',
				city: 'Zürich'
			},
			currentOccupancy: {
				apartment: 'Wohnung 2.04',
				building: 'Musterhaus Zentrum',
				rent: 2470,
				startDate: '01.03.2021'
			},
			contractHistory: [
				{
					id: 'contract-001',
					tenant_name: 'Hans Müller',
					tenant_first_name: 'Hans',
					tenant_last_name: 'Müller',
					period: '01.03.2021 - heute',
					rent_brutto: 2470,
					status: 'AKTIV',
					start_date: '2021-03-01'
				}
			]
		},
		'tenant-002': {
			tenant: {
				id: 'tenant-002',
				first_name: 'Maria',
				last_name: 'Schmidt',
				email: 'm.schmidt@email.com',
				phone_number: '+41 78 234 56 78',
				address: 'Seestrasse 45',
				postal_code: '6004',
				city: 'Luzern'
			},
			currentOccupancy: {
				apartment: 'Wohnung 1.02',
				building: 'Musterhaus Zentrum',
				rent: 1850,
				startDate: '15.06.2022'
			},
			contractHistory: [
				{
					id: 'contract-002',
					tenant_name: 'Maria Schmidt',
					tenant_first_name: 'Maria',
					tenant_last_name: 'Schmidt',
					period: '15.06.2022 - heute',
					rent_brutto: 1850,
					status: 'AKTIV',
					start_date: '2022-06-15'
				}
			]
		},
		'tenant-006': {
			tenant: {
				id: 'tenant-006',
				first_name: 'Sarah',
				last_name: 'Fischer',
				email: 's.fischer@email.com',
				phone_number: '+41 78 678 90 12',
				address: 'Musterweg 10',
				postal_code: '8050',
				city: 'Zürich'
			},
			currentOccupancy: null,
			contractHistory: [
				{
					id: 'contract-old-001',
					tenant_name: 'Sarah Fischer',
					tenant_first_name: 'Sarah',
					tenant_last_name: 'Fischer',
					period: '01.01.2019 - 31.12.2020',
					rent_brutto: 1950,
					status: 'Beendet',
					start_date: '2019-01-01',
					end_date: '2020-12-31'
				}
			]
		}
	};

	const data = mockTenants[id] || {
		tenant: {
			id,
			first_name: 'Unbekannt',
			last_name: 'Mieter',
			email: 'unbekannt@email.com'
		},
		currentOccupancy: null,
		contractHistory: []
	};

	return data;
};
