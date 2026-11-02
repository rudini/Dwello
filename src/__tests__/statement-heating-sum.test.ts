import { describe, expect, it } from 'vitest';
import { heatingSumText, type HeatingSum } from '$lib/heating-sum';

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
	// #1026 (PO 02.11.2026, A): after the numbers the advice of the result
	it('nennt den Leerstand, wie viel die Abrechnungen zu viel verrechnen, und rät zu berichtigen', () => {
		expect(heatingSumText(sum({}), 'Marc Huber')).toBe(
			'Die Heizkosten der Wohnung betragen CHF 2’000.00, davon tragen die Mieter CHF 1’920.00 und Sie CHF 80.00 für den Leerstand. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 2’370.00 ohne Verwaltungspauschale, CHF 450.00 zu viel. Erstellen Sie für Marc Huber eine berichtigte Abrechnung.'
		);
	});

	it('nennt ohne Leerstand nur die Heizkosten, wie viel zu wenig verrechnet wird, und wer den Unterschied trägt', () => {
		expect(
			heatingSumText(
				sum({
					tenants: '2000.00',
					landlord: '0.00',
					billed: '1470.00',
					difference: '530.00',
					result: 'less',
					landlordFor: null
				}),
				'Marc Huber'
			)
		).toBe(
			'Die Heizkosten der Wohnung betragen CHF 2’000.00. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 1’470.00 ohne Verwaltungspauschale, CHF 530.00 zu wenig. Den Unterschied tragen Sie, wenn Sie die Abrechnung von Marc Huber nicht berichtigen.'
		);
	});

	it('nennt Mietverträge ohne vereinbarte Heizkosten und gleich viel, ohne Rat', () => {
		expect(
			heatingSumText(
				sum({
					tenants: '1500.00',
					landlord: '500.00',
					billed: '1500.00',
					difference: '0.00',
					result: 'equal',
					landlordFor: 'leases'
				}),
				'Marc Huber'
			)
		).toBe(
			'Die Heizkosten der Wohnung betragen CHF 2’000.00, davon tragen die Mieter CHF 1’500.00 und Sie CHF 500.00 für Leerstand und Mietverträge ohne vereinbarte Heizkosten. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 1’500.00 ohne Verwaltungspauschale, gleich viel.'
		);
	});

	// #1026 (A, Fachreview 508-1 V-2, 1026-1): with heating invoices without Leistungszeitraum in the run the numbers may be
	// wrong; only the advice to enter it first, whatever the result
	it('rät bei Heizrechnungen ohne Leistungszeitraum nur, diesen zuerst einzutragen', () => {
		expect(heatingSumText(sum({ periodFirst: true }), 'Marc Huber')).toBe(
			'Die Heizkosten der Wohnung betragen CHF 2’000.00, davon tragen die Mieter CHF 1’920.00 und Sie CHF 80.00 für den Leerstand. Die Abrechnungen der Wohnung verrechnen dafür zusammen CHF 2’370.00 ohne Verwaltungspauschale, CHF 450.00 zu viel. Fehlt einer Heizrechnung der Leistungszeitraum, tragen Sie ihn zuerst ein und öffnen Sie die Vorschau erneut. Erst dann zeigt sich, ob eine Abrechnung berichtigt werden muss.'
		);
	});
});
