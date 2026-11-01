import { describe, expect, it } from 'vitest';
import { heatingSumText, type HeatingSum } from '$lib/statement-wizard';

// #508 (Fachreview 508-1 M-1, V-3, V-4): the apartment's heating costs, the landlord's part and what its statements bill
const sum = (more: Partial<HeatingSum>): HeatingSum => ({
	statementId: '1',
	costs: '2000.00',
	tenants: '1920.00',
	landlord: '80.00',
	billed: '2370.00',
	difference: '450.00',
	result: 'more',
	landlordFor: 'vacancy',
	...more
});

describe('Summe der Heizkosten einer Wohnung in der Vorschau', () => {
	it('nennt den Leerstand und wie viel die Abrechnungen zu viel verrechnen', () => {
		expect(heatingSumText(sum({}))).toBe(
			'Die Heizkosten der Wohnung betragen CHF 2’000.00, davon tragen die Mieter CHF 1’920.00 und Sie CHF 80.00 für den Leerstand. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 2’370.00 ohne Verwaltungspauschale, CHF 450.00 zu viel.'
		);
	});

	it('nennt ohne Leerstand nur die Heizkosten und wie viel zu wenig verrechnet wird', () => {
		expect(
			heatingSumText(
				sum({
					tenants: '2000.00',
					landlord: '0.00',
					billed: '1470.00',
					difference: '530.00',
					result: 'less',
					landlordFor: null
				})
			)
		).toBe(
			'Die Heizkosten der Wohnung betragen CHF 2’000.00. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 1’470.00 ohne Verwaltungspauschale, CHF 530.00 zu wenig.'
		);
	});

	it('nennt Mietverträge ohne vereinbarte Heizkosten und gleich viel', () => {
		expect(
			heatingSumText(
				sum({
					tenants: '1500.00',
					landlord: '500.00',
					billed: '1500.00',
					difference: '0.00',
					result: 'equal',
					landlordFor: 'leases'
				})
			)
		).toBe(
			'Die Heizkosten der Wohnung betragen CHF 2’000.00, davon tragen die Mieter CHF 1’500.00 und Sie CHF 500.00 für Leerstand und Mietverträge ohne vereinbarte Heizkosten. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 1’500.00 ohne Verwaltungspauschale, gleich viel.'
		);
	});
});
