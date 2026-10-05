import type { StatementWithDetails } from '$lib/types';

/** A statement as the pages receive it; override what a test is about */
export const statement = (overrides: Partial<StatementWithDetails> = {}): StatementWithDetails =>
	({
		id: 's1',
		statementNumber: 'NK-2024-0001',
		tenantId: 't1',
		apartmentId: 'a1',
		buildingId: 'b1',
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31',
		statementDate: '2025-01-15',
		rentalDays: 366,
		totalCosts: 2100,
		totalAdvancePayments: 1800,
		managementFee: 63,
		managementFeePercent: 3,
		balance: 363,
		status: 'draft',
		paymentDeadline: '2025-02-28',
		tenantName: 'Anna Keller',
		tenantEmail: 'anna@example.ch',
		tenantCorrespondenceChannel: 'email',
		apartmentUnit: '2.01',
		apartmentFloor: '2',
		buildingName: 'Ahornhof',
		buildingAddress: 'Ahornweg 3',
		lineItems: [
			{
				id: 'l1',
				categoryId: 'c1',
				categoryName: 'Heizung',
				distributionKeyName: 'Nach Fläche',
				totalAmount: 6000,
				tenantShare: 1500,
				percentage: 25
			},
			{
				id: 'l2',
				categoryId: 'c2',
				categoryName: 'Hauswartung',
				distributionKeyName: 'Pro Wohnung',
				totalAmount: 2400,
				tenantShare: 600,
				percentage: 25
			}
		],
		createdAt: '2025-01-15T09:00:00Z',
		...overrides
	}) as StatementWithDetails;
