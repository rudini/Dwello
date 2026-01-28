import type { StatementWithDetails, Category, DistributionKey } from '$lib/types';

interface StatementEditData {
	statement: StatementWithDetails;
	categories: Category[];
	distributionKeys: DistributionKey[];
}

export const load = async ({ params }): Promise<StatementEditData> => {
	// Mock statement data for editing
	const mockStatement: StatementWithDetails = {
		id: params.id,
		statementNumber: 'NK-2025-001',
		tenantId: 'tenant-001',
		apartmentId: 'apt-001',
		buildingId: 'building-001',
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31',
		statementDate: '2025-01-15',
		rentalDays: 366,
		totalCosts: 3864.0,
		totalAdvancePayments: 3600.0,
		managementFee: 115.92,
		balance: 379.92,
		status: 'draft',
		paymentDeadline: '2025-02-15',
		createdAt: '2025-01-15T14:00:00Z',
		tenantName: 'Hans Müller',
		tenantEmail: 'hans.mueller@example.com',
		apartmentUnit: '1.01',
		apartmentFloor: '1. OG',
		buildingName: 'Musterhaus Zentrum',
		buildingAddress: 'Musterstraße 12, 8000 Zürich',
		lineItems: [
			{
				id: 'li-001',
				categoryId: 'cat-001',
				categoryName: 'Heizung',
				distributionKeyId: 'dk-heating',
				distributionKeyName: 'Heizkosten',
				totalAmount: 8500.0,
				tenantShare: 1785.0,
				percentage: 21
			},
			{
				id: 'li-002',
				categoryId: 'cat-002',
				categoryName: 'Warmwasser',
				distributionKeyId: 'dk-units',
				distributionKeyName: 'Nach Einheiten',
				totalAmount: 2400.0,
				tenantShare: 504.0,
				percentage: 21
			},
			{
				id: 'li-003',
				categoryId: 'cat-003',
				categoryName: 'Wasser/Abwasser',
				distributionKeyId: 'dk-units',
				distributionKeyName: 'Nach Einheiten',
				totalAmount: 1800.0,
				tenantShare: 378.0,
				percentage: 21
			},
			{
				id: 'li-004',
				categoryId: 'cat-004',
				categoryName: 'Allgemeinstrom',
				distributionKeyId: 'dk-units',
				distributionKeyName: 'Nach Einheiten',
				totalAmount: 1200.0,
				tenantShare: 252.0,
				percentage: 21
			},
			{
				id: 'li-005',
				categoryId: 'cat-005',
				categoryName: 'Hauswart',
				distributionKeyId: 'dk-area',
				distributionKeyName: 'Nach Fläche',
				totalAmount: 4500.0,
				tenantShare: 945.0,
				percentage: 21
			}
		]
	};

	const categories: Category[] = [
		{ id: 'cat-001', name: 'Heizung', isAllowedUtilityCost: true },
		{ id: 'cat-002', name: 'Warmwasser', isAllowedUtilityCost: true },
		{ id: 'cat-003', name: 'Wasser/Abwasser', isAllowedUtilityCost: true },
		{ id: 'cat-004', name: 'Allgemeinstrom', isAllowedUtilityCost: true },
		{ id: 'cat-005', name: 'Hauswart', isAllowedUtilityCost: true },
		{ id: 'cat-006', name: 'Gartenpflege', isAllowedUtilityCost: true },
		{ id: 'cat-007', name: 'Kehricht', isAllowedUtilityCost: true }
	];

	const distributionKeys: DistributionKey[] = [
		{ id: 'dk-heating', name: 'Heizkosten', type: 'predefined', isActive: true },
		{ id: 'dk-units', name: 'Nach Einheiten', type: 'predefined', isActive: true },
		{ id: 'dk-area', name: 'Nach Fläche', type: 'predefined', isActive: true },
		{ id: 'dk-persons', name: 'Nach Personen', type: 'predefined', isActive: true }
	];

	return {
		statement: mockStatement,
		categories,
		distributionKeys
	};
};
