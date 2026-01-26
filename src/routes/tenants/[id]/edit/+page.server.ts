import type { Tenant } from '$lib/types';

interface TenantEditData {
	tenant: Tenant;
}

export const load = async ({ params }: { params: { id: string } }): Promise<TenantEditData> => {
	const { id } = params;

	// Mock data - in production, fetch from API
	// const response = await fetch(`/api/tenants/${id}`);
	// const data = await response.json();

	// Mock tenants
	const mockTenants: Record<string, Tenant> = {
		'tenant-001': {
			id: 'tenant-001',
			first_name: 'Hans',
			last_name: 'Müller',
			email: 'h.mueller@email.com',
			phone_number: '+41 79 123 45 67',
			address: 'Alte Adresse 15',
			postal_code: '8001',
			city: 'Zürich'
		},
		'tenant-002': {
			id: 'tenant-002',
			first_name: 'Maria',
			last_name: 'Schmidt',
			email: 'm.schmidt@email.com',
			phone_number: '+41 78 234 56 78',
			address: 'Seestrasse 45',
			postal_code: '6004',
			city: 'Luzern'
		},
		'tenant-006': {
			id: 'tenant-006',
			first_name: 'Sarah',
			last_name: 'Fischer',
			email: 's.fischer@email.com',
			phone_number: '+41 78 678 90 12',
			address: 'Musterweg 10',
			postal_code: '8050',
			city: 'Zürich'
		}
	};

	const tenant = mockTenants[id] || {
		id,
		first_name: 'Unbekannt',
		last_name: 'Mieter',
		email: 'unbekannt@email.com'
	};

	return { tenant };
};
