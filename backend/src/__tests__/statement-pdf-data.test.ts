/**
 * What the statement PDF prints: Swiss formats and the data of the statement in the tenant's language
 */

import { describe, expect, it } from 'bun:test';
import { formatCHF, formatSwissDate, roundToRappen } from '../services/pdf-format';
import { toPdfData } from '../services/statement-pdf.service';
import type { StatementWithDetails } from '../services/statement.service';

describe('Schweizer Formate im PDF', () => {
	it('schreibt ein Datum immer als TT.MM.JJJJ', () => {
		expect(formatSwissDate('2024-01-01')).toBe('01.01.2024');
		expect(formatSwissDate('2025-12-31')).toBe('31.12.2025');
	});

	it('schreibt Franken mit Apostroph als Tausendertrennung und zwei Rappenstellen', () => {
		expect(formatCHF(1234.5)).toBe("1'234.50");
		expect(formatCHF(1234567.891)).toBe("1'234'567.89");
		expect(formatCHF(-88.16)).toBe('-88.16');
		expect(formatCHF(0)).toBe('0.00');
	});
});

const statement = {
	id: 's1',
	statementNumber: 'NK-1',
	statementDate: '2026-09-28',
	periodStart: '2025-01-01',
	periodEnd: '2025-12-31',
	rentalDays: 365,
	totalCosts: '3037.85',
	totalAdvancePayments: '2880.00',
	managementFee: '93.99',
	managementFeePercent: '3.00',
	balance: '157.85',
	paymentDeadline: '2026-10-28',
	tenant: {
		id: 't1',
		firstName: 'Pierre',
		lastName: 'Dubois',
		email: null,
		language: 'fr',
		address: 'Bahnhofstrasse 42',
		postalCode: '8001',
		city: 'Zürich'
	},
	apartment: { id: 'a1', number: '2.01', floor: 2, area: '85.00' },
	building: { id: 'b1', name: 'Musterhaus Zentrum', address: 'Bahnhofstrasse 42' },
	lineItems: [
		{ categoryId: 'heating', description: 'Heating', totalAmount: '6565.00', tenantShare: '1120.00', sharePercentage: '17.06' },
		{ categoryId: null, description: 'Nicht kategorisiert', totalAmount: '100.00', tenantShare: '16.67', sharePercentage: '16.67' }
	]
} as unknown as StatementWithDetails;

const categories = new Map([
	['heating', { name: 'Heating', nameDE: 'Heizung', nameFR: 'Chauffage', nameIT: 'Riscaldamento', nameEN: 'Heating' }]
]);

describe('Daten der Abrechnung im PDF', () => {
	it('druckt die Postadresse des Mieters', () => {
		expect(toPdfData(statement, categories, 'fr').tenant).toMatchObject({
			firstName: 'Pierre',
			lastName: 'Dubois',
			address: 'Bahnhofstrasse 42',
			postalCode: '8001',
			city: 'Zürich'
		});
	});

	it('nennt die Kategorie in der Sprache des Mieters, sonst deutsch', () => {
		expect(toPdfData(statement, categories, 'fr').lineItems[0].category).toBe('Chauffage');
		expect(toPdfData(statement, categories, 'rm').lineItems[0].category).toBe('Heizung');
		expect(toPdfData(statement, categories, 'de').lineItems[1].category).toBe('Nicht kategorisiert');
	});
});

describe('Rundung auf Rappen', () => {
	// 3060 × 82/320 ist genau 784.125; als Fliesskommazahl 784.1249999…, darf aber nicht abgerundet werden
	it('rundet kaufmännisch, auch wenn die Fliesskommazahl knapp darunter liegt', () => {
		expect(roundToRappen(3060 * (82 / 320))).toBe(784.13);
		expect(roundToRappen(1.005)).toBe(1.01);
		expect(roundToRappen(2.344)).toBe(2.34);
	});
});
