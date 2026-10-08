import { describe, it, expect } from 'vitest';
import { toStatement } from '../lib/server/statement';
// What GET /api/v1/statements/:id answers, checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
import backendStatement from '../../tests/contracts/statement.json';

describe('Abrechnung aus dem Backend', () => {
	it('zeigt den Satz der Verwaltungspauschale, mit dem die Abrechnung erstellt wurde', () => {
		expect(toStatement(backendStatement).managementFeePercent).toBe(3);
	});

	it('berechnet den Satz älterer Abrechnungen ohne gespeicherten Satz aus Pauschale und Nebenkosten', () => {
		expect(
			toStatement({ ...backendStatement, managementFeePercent: null }).managementFeePercent
		).toBe(4.5);
	});

	it('zeigt 0 %, wenn keine Nebenkosten angefallen sind', () => {
		const statement = toStatement({
			...backendStatement,
			managementFeePercent: null,
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

	// Wie im PDF auf zwei Stellen: der Anteil an den Gebäudekosten ist selten rund
	it('zeigt den Anteil an den Gebäudekosten auf zwei Stellen', () => {
		const [line] = backendStatement.lineItems;
		const statement = toStatement({
			...backendStatement,
			lineItems: [{ ...line, sharePercentage: '26.7233' }]
		});

		expect(statement.lineItems[0].percentage).toBe(26.72);
	});
});
