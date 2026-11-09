import { describe, expect, test } from 'bun:test';
import { keepUntil } from '../services/invoice-retention';

// #1410 (Entscheid PO): 10 Jahre ab dem Ende der Abrechnungsperiode, zu der eine Rechnung gehört
describe('Aufbewahrungsfrist einer Rechnung', () => {
	test('läuft 10 Jahre ab dem Ende des Kalenderjahres ihres Rechnungsdatums', () => {
		expect(keepUntil('calendar', { invoiceDate: '2024-03-31', servicePeriodEnd: null })).toBe(
			'2034-12-31'
		);
	});
});
