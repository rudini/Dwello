import type { ApartmentDetailsData } from '$lib/types';

export const load = (async ({ params }: { params: { id: string } }) => {
	// Mock data - in production, this would fetch from the backend API
	const apartmentId = params.id;

	// Mock building data
	const building = {
		id: 'building-001',
		address: 'Musterstraße 12',
		postalCode: '8000',
		city: 'Zürich',
		country: 'Switzerland'
	};

	// Mock apartment data
	const apartment = {
		id: apartmentId,
		building_id: 'building-001',
		floor: '2.OG',
		address_unit: '2.04',
		size_m2: 85,
		room_count: 3.5,
		occupancy_status: 'Vermietet' as const
	};

	// Mock current tenant
	const currentTenant = {
		id: 'tenant-001',
		first_name: 'Hans',
		last_name: 'Müller',
		email: 'h.mueller@email.com',
		phone_number: '+41 79 123 45 67'
	};

	// Mock current contract
	const currentContract = {
		id: 'contract-001',
		apartment_id: apartmentId,
		tenant_id: 'tenant-001',
		start_date: new Date('2021-03-01'),
		base_rent_chf: 2100,
		additional_rent_chf: 0,
		advance_payment_chf: 250,
		status: 'Aktiv' as const
	};

	// Mock monthly costs
	const monthlyCosts = {
		base_rent: 2100,
		advance_payment: 250,
		parking: 120,
		total_brutto: 2470
	};

	// Mock contract history
	const contractHistory = [
		{
			id: 'contract-001',
			tenant_name: 'Hans Müller',
			tenant_first_name: 'Hans',
			tenant_last_name: 'Müller',
			period: '01.03.2021 - Heute',
			rent_brutto: 2470,
			status: 'AKTIV' as const,
			start_date: new Date('2021-03-01')
		},
		{
			id: 'contract-002',
			tenant_name: 'Sarah Weber',
			tenant_first_name: 'Sarah',
			tenant_last_name: 'Weber',
			period: '01.01.2018 - 28.02.2021',
			rent_brutto: 2350,
			status: 'Beendet' as const,
			start_date: new Date('2018-01-01'),
			end_date: new Date('2021-02-28')
		},
		{
			id: 'contract-003',
			tenant_name: 'Kevin Fischer',
			tenant_first_name: 'Kevin',
			tenant_last_name: 'Fischer',
			period: '01.06.2015 - 31.12.2017',
			rent_brutto: 2200,
			status: 'Beendet' as const,
			start_date: new Date('2015-06-01'),
			end_date: new Date('2017-12-31')
		}
	];

	const data: ApartmentDetailsData = {
		apartment,
		building,
		currentTenant,
		currentContract,
		monthlyCosts,
		contractHistory
	};

	return data;
});
