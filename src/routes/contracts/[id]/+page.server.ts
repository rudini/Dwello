import type { RentalContract, Tenant, Apartment, Building } from '$lib/types';

interface ContractDetailsData {
	contract: RentalContract & {
		tenant: Tenant;
		apartment: Apartment;
		building: Building;
	};
	rentBreakdown: {
		baseRent: number;
		additionalRent: number;
		advancePayment: number;
		total: number;
	};
}

export const load = async ({ params }: { params: { id: string } }): Promise<ContractDetailsData> => {
	const { id } = params;

	// Mock data - in production, fetch from API
	// const response = await fetch(`/api/contracts/${id}`);
	// const data = await response.json();

	// Mock contract details
	const mockContracts: Record<string, ContractDetailsData> = {
		'contract-001': {
			contract: {
				id: 'contract-001',
				apartment_id: 'apt-001',
				tenant_id: 'tenant-001',
				start_date: '2021-03-01',
				base_rent_chf: 2100,
				additional_rent_chf: 250,
				advance_payment_chf: 120,
				status: 'Aktiv',
				tenant: {
					id: 'tenant-001',
					first_name: 'Hans',
					last_name: 'Müller',
					email: 'h.mueller@email.com',
					phone_number: '+41 79 123 45 67'
				},
				apartment: {
					id: 'apt-001',
					building_id: 'building-001',
					floor: '2.OG',
					address_unit: '2.04',
					size_m2: 85,
					room_count: 3.5,
					occupancy_status: 'Vermietet'
				},
				building: {
					id: 'building-001',
					name: 'Musterhaus Zentrum',
					address: 'Musterstraße 12',
					postalCode: '8000',
					city: 'Zürich'
				}
			},
			rentBreakdown: {
				baseRent: 2100,
				additionalRent: 250,
				advancePayment: 120,
				total: 2470
			}
		},
		'contract-002': {
			contract: {
				id: 'contract-002',
				apartment_id: 'apt-002',
				tenant_id: 'tenant-002',
				start_date: '2022-06-15',
				base_rent_chf: 1650,
				additional_rent_chf: 200,
				status: 'Aktiv',
				tenant: {
					id: 'tenant-002',
					first_name: 'Maria',
					last_name: 'Schmidt',
					email: 'm.schmidt@email.com',
					phone_number: '+41 78 234 56 78'
				},
				apartment: {
					id: 'apt-002',
					building_id: 'building-001',
					floor: '1.OG',
					address_unit: '1.02',
					size_m2: 65,
					room_count: 2.5,
					occupancy_status: 'Vermietet'
				},
				building: {
					id: 'building-001',
					name: 'Musterhaus Zentrum',
					address: 'Musterstraße 12',
					postalCode: '8000',
					city: 'Zürich'
				}
			},
			rentBreakdown: {
				baseRent: 1650,
				additionalRent: 200,
				advancePayment: 0,
				total: 1850
			}
		}
	};

	const data = mockContracts[id] || {
		contract: {
			id,
			apartment_id: 'apt-001',
			tenant_id: 'tenant-001',
			start_date: '2020-01-01',
			base_rent_chf: 1500,
			additional_rent_chf: 200,
			status: 'Aktiv' as const,
			tenant: {
				id: 'tenant-001',
				first_name: 'Unbekannt',
				last_name: 'Mieter',
				email: 'unbekannt@email.com'
			},
			apartment: {
				id: 'apt-001',
				building_id: 'building-001',
				floor: '1.OG',
				address_unit: '1.01',
				size_m2: 70,
				room_count: 3,
				occupancy_status: 'Vermietet' as const
			},
			building: {
				id: 'building-001',
				address: 'Unbekannte Strasse',
				postalCode: '0000',
				city: 'Unbekannt'
			}
		},
		rentBreakdown: {
			baseRent: 1500,
			additionalRent: 200,
			advancePayment: 0,
			total: 1700
		}
	};

	return data;
};
