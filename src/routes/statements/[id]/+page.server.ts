import type { StatementWithDetails } from '$lib/types';

interface StatementDetailData {
	statement: StatementWithDetails;
}

export const load = async ({ params }): Promise<StatementDetailData> => {
	// Mock statement detail data
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
		totalCosts: 3864.00,
		totalAdvancePayments: 3600.00,
		managementFee: 115.92,
		balance: 379.92,
		status: 'sent',
		paymentDeadline: '2025-02-15',
		pdfGeneratedAt: '2025-01-15T14:30:00Z',
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
				totalAmount: 8500.00,
				tenantShare: 1785.00,
				percentage: 21
			},
			{
				id: 'li-002',
				categoryId: 'cat-002',
				categoryName: 'Warmwasser',
				distributionKeyId: 'dk-units',
				distributionKeyName: 'Nach Einheiten',
				totalAmount: 2400.00,
				tenantShare: 504.00,
				percentage: 21
			},
			{
				id: 'li-003',
				categoryId: 'cat-003',
				categoryName: 'Wasser/Abwasser',
				distributionKeyId: 'dk-units',
				distributionKeyName: 'Nach Einheiten',
				totalAmount: 1800.00,
				tenantShare: 378.00,
				percentage: 21
			},
			{
				id: 'li-004',
				categoryId: 'cat-004',
				categoryName: 'Allgemeinstrom',
				distributionKeyId: 'dk-units',
				distributionKeyName: 'Nach Einheiten',
				totalAmount: 1200.00,
				tenantShare: 252.00,
				percentage: 21
			},
			{
				id: 'li-005',
				categoryId: 'cat-005',
				categoryName: 'Hauswart',
				distributionKeyId: 'dk-area',
				distributionKeyName: 'Nach Fläche',
				totalAmount: 4500.00,
				tenantShare: 945.00,
				percentage: 21
			}
		]
	};

	return {
		statement: mockStatement
	};
};
