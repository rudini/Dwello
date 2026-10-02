import { describe, it, expect } from 'vitest';
import { toStatement } from '../lib/server/statement';

const backendStatement = {
	id: 's1',
	statementNumber: 'NK-2024-1',
	tenantId: 't1',
	apartmentId: 'a1',
	totalCosts: '1045.00',
	managementFee: '45.00',
	totalAdvancePayments: '0.00',
	balance: '1045.00',
	tenant: { firstName: 'Eva', lastName: 'Frei', email: 'eva@example.com' },
	apartment: { number: '3.01', floor: 3 },
	building: { name: 'Lindenhof', address: 'Testweg 1' },
	notes: 'Hauswart neu',
	lineItems: [
		{
			id: 'l1',
			description: 'Heating',
			totalAmount: '1000.00',
			tenantShare: '1000.00',
			sharePercentage: '100'
		}
	]
};

describe('Abrechnung aus dem Backend', () => {
	it('berechnet den verwendeten Satz der Verwaltungspauschale aus Pauschale und Nebenkosten', () => {
		expect(toStatement(backendStatement).managementFeePercent).toBe(4.5);
	});

	it('zeigt 0 %, wenn keine Nebenkosten angefallen sind', () => {
		const statement = toStatement({
			...backendStatement,
			totalCosts: '0.00',
			managementFee: '0.00'
		});

		expect(statement.managementFeePercent).toBe(0);
	});

	it('übernimmt Mieter, Wohnung, Bemerkungen und Kostenpositionen', () => {
		expect(toStatement(backendStatement)).toMatchObject({
			tenantName: 'Eva Frei',
			apartmentUnit: '3.01',
			buildingName: 'Lindenhof',
			notes: 'Hauswart neu',
			lineItems: [{ categoryName: 'Heating', tenantShare: 1000, percentage: 100 }]
		});
	});
});
