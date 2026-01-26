import type { RentalContract } from '$lib/types';

interface ContractEditData {
	contract: RentalContract;
	tenants: { id: string; name: string }[];
	apartments: { id: string; unit: string; building: string; status: string }[];
}

export const load = async ({ params }: { params: { id: string } }): Promise<ContractEditData> => {
	const { id } = params;

	// Mock tenants for dropdown
	const tenants = [
		{ id: 'tenant-001', name: 'Hans Müller' },
		{ id: 'tenant-002', name: 'Maria Schmidt' },
		{ id: 'tenant-003', name: 'Peter Weber' },
		{ id: 'tenant-004', name: 'Anna Keller' },
		{ id: 'tenant-005', name: 'Thomas Brunner' },
		{ id: 'tenant-006', name: 'Sarah Fischer' },
		{ id: 'tenant-007', name: 'Kevin Meier' }
	];

	// Mock apartments for dropdown
	const apartments = [
		{ id: 'apt-001', unit: '2.04', building: 'Musterhaus Zentrum', status: 'Vermietet' },
		{ id: 'apt-002', unit: '1.02', building: 'Musterhaus Zentrum', status: 'Vermietet' },
		{ id: 'apt-003', unit: '0.01', building: 'Musterhaus Zentrum', status: 'Leer' },
		{ id: 'apt-004', unit: '3.01', building: 'Seepark Residenz', status: 'Vermietet' },
		{ id: 'apt-005', unit: '2.02', building: 'Seepark Residenz', status: 'Vermietet' },
		{ id: 'apt-006', unit: '1.01', building: 'Seepark Residenz', status: 'Leer' }
	];

	// Mock contracts
	const mockContracts: Record<string, RentalContract> = {
		'contract-001': {
			id: 'contract-001',
			apartment_id: 'apt-001',
			tenant_id: 'tenant-001',
			start_date: '2021-03-01',
			base_rent_chf: 2100,
			additional_rent_chf: 250,
			advance_payment_chf: 120,
			status: 'Aktiv'
		},
		'contract-002': {
			id: 'contract-002',
			apartment_id: 'apt-002',
			tenant_id: 'tenant-002',
			start_date: '2022-06-15',
			base_rent_chf: 1650,
			additional_rent_chf: 200,
			status: 'Aktiv'
		}
	};

	const contract = mockContracts[id] || {
		id,
		apartment_id: 'apt-001',
		tenant_id: 'tenant-001',
		start_date: '2020-01-01',
		base_rent_chf: 1500,
		additional_rent_chf: 200,
		status: 'Aktiv' as const
	};

	return {
		contract,
		tenants,
		apartments
	};
};
