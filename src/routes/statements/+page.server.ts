import type { StatementsListData, StatementWithDetails } from '$lib/types';

export const load = async ({ url }): Promise<StatementsListData> => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const pageSize = 10;

	// Mock statements data
	const mockStatements: StatementWithDetails[] = [
		{
			id: 'stmt-001',
			statementNumber: 'NK-2025-001',
			tenantId: 'tenant-001',
			apartmentId: 'apt-001',
			buildingId: 'building-001',
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			statementDate: '2025-01-15',
			rentalDays: 366,
			totalCosts: 3850.00,
			totalAdvancePayments: 3600.00,
			managementFee: 115.50,
			balance: 365.50,
			status: 'sent',
			paymentDeadline: '2025-02-15',
			tenantName: 'Hans Müller',
			tenantEmail: 'hans.mueller@example.com',
			apartmentUnit: '1.01',
			apartmentFloor: '1. OG',
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			lineItems: [
				{ id: 'li-001', categoryId: 'cat-001', categoryName: 'Heizung', totalAmount: 8500, tenantShare: 1785, percentage: 21 },
				{ id: 'li-002', categoryId: 'cat-002', categoryName: 'Warmwasser', totalAmount: 2400, tenantShare: 504, percentage: 21 },
				{ id: 'li-003', categoryId: 'cat-003', categoryName: 'Wasser/Abwasser', totalAmount: 1800, tenantShare: 378, percentage: 21 },
				{ id: 'li-004', categoryId: 'cat-004', categoryName: 'Allgemeinstrom', totalAmount: 1200, tenantShare: 252, percentage: 21 },
				{ id: 'li-005', categoryId: 'cat-005', categoryName: 'Hauswart', totalAmount: 4500, tenantShare: 945, percentage: 21 }
			]
		},
		{
			id: 'stmt-002',
			statementNumber: 'NK-2025-002',
			tenantId: 'tenant-002',
			apartmentId: 'apt-002',
			buildingId: 'building-001',
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			statementDate: '2025-01-15',
			rentalDays: 366,
			totalCosts: 4250.00,
			totalAdvancePayments: 4800.00,
			managementFee: 127.50,
			balance: -422.50,
			status: 'paid',
			paymentDeadline: '2025-02-15',
			paidDate: '2025-01-28',
			tenantName: 'Anna Schmidt',
			tenantEmail: 'anna.schmidt@example.com',
			apartmentUnit: '1.02',
			apartmentFloor: '1. OG',
			buildingName: 'Musterhaus Zentrum',
			buildingAddress: 'Musterstraße 12, 8000 Zürich',
			lineItems: [
				{ id: 'li-006', categoryId: 'cat-001', categoryName: 'Heizung', totalAmount: 8500, tenantShare: 2125, percentage: 25 },
				{ id: 'li-007', categoryId: 'cat-002', categoryName: 'Warmwasser', totalAmount: 2400, tenantShare: 600, percentage: 25 },
				{ id: 'li-008', categoryId: 'cat-003', categoryName: 'Wasser/Abwasser', totalAmount: 1800, tenantShare: 450, percentage: 25 },
				{ id: 'li-009', categoryId: 'cat-004', categoryName: 'Allgemeinstrom', totalAmount: 1200, tenantShare: 300, percentage: 25 },
				{ id: 'li-010', categoryId: 'cat-005', categoryName: 'Hauswart', totalAmount: 4500, tenantShare: 1125, percentage: 25 }
			]
		},
		{
			id: 'stmt-003',
			statementNumber: 'NK-2025-003',
			tenantId: 'tenant-003',
			apartmentId: 'apt-003',
			buildingId: 'building-002',
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			statementDate: '2025-01-15',
			rentalDays: 366,
			totalCosts: 2980.00,
			totalAdvancePayments: 2400.00,
			managementFee: 89.40,
			balance: 669.40,
			status: 'overdue',
			paymentDeadline: '2025-02-15',
			lastReminderDate: '2025-02-20',
			tenantName: 'Peter Weber',
			tenantEmail: 'peter.weber@example.com',
			apartmentUnit: '2.01',
			apartmentFloor: '2. OG',
			buildingName: 'Seepark Residenz',
			buildingAddress: 'Seestrasse 45, 6004 Luzern',
			lineItems: [
				{ id: 'li-011', categoryId: 'cat-001', categoryName: 'Heizung', totalAmount: 6200, tenantShare: 1550, percentage: 25 },
				{ id: 'li-012', categoryId: 'cat-002', categoryName: 'Warmwasser', totalAmount: 1800, tenantShare: 450, percentage: 25 },
				{ id: 'li-013', categoryId: 'cat-003', categoryName: 'Wasser/Abwasser', totalAmount: 1400, tenantShare: 350, percentage: 25 },
				{ id: 'li-014', categoryId: 'cat-005', categoryName: 'Hauswart', totalAmount: 3200, tenantShare: 800, percentage: 25 }
			]
		},
		{
			id: 'stmt-004',
			statementNumber: 'NK-2025-004',
			tenantId: 'tenant-004',
			apartmentId: 'apt-004',
			buildingId: 'building-002',
			periodStart: '2024-07-01',
			periodEnd: '2024-12-31',
			statementDate: '2025-01-15',
			rentalDays: 184,
			totalCosts: 1650.00,
			totalAdvancePayments: 1500.00,
			managementFee: 49.50,
			balance: 199.50,
			status: 'draft',
			paymentDeadline: '2025-02-15',
			tenantName: 'Maria Keller',
			tenantEmail: 'maria.keller@example.com',
			apartmentUnit: '2.02',
			apartmentFloor: '2. OG',
			buildingName: 'Seepark Residenz',
			buildingAddress: 'Seestrasse 45, 6004 Luzern',
			lineItems: [
				{ id: 'li-015', categoryId: 'cat-001', categoryName: 'Heizung', totalAmount: 3100, tenantShare: 775, percentage: 25 },
				{ id: 'li-016', categoryId: 'cat-002', categoryName: 'Warmwasser', totalAmount: 900, tenantShare: 225, percentage: 25 },
				{ id: 'li-017', categoryId: 'cat-003', categoryName: 'Wasser/Abwasser', totalAmount: 700, tenantShare: 175, percentage: 25 },
				{ id: 'li-018', categoryId: 'cat-005', categoryName: 'Hauswart', totalAmount: 1600, tenantShare: 400, percentage: 25 }
			]
		}
	];

	const buildings = [
		{ id: 'building-001', name: 'Musterhaus Zentrum' },
		{ id: 'building-002', name: 'Seepark Residenz' },
		{ id: 'building-003', name: 'Alpenblick' }
	];

	const statusCounts = {
		draft: mockStatements.filter(s => s.status === 'draft').length,
		sent: mockStatements.filter(s => s.status === 'sent').length,
		paid: mockStatements.filter(s => s.status === 'paid').length,
		overdue: mockStatements.filter(s => s.status === 'overdue').length
	};

	return {
		statements: mockStatements,
		total: mockStatements.length,
		page,
		pageSize,
		buildings,
		statusCounts
	};
};
