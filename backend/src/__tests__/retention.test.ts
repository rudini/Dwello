import { describe, expect, test } from 'bun:test';
import { keepUntil } from '../services/invoice-retention';

// #1410 (Entscheid PO, Fachreview 1410-1 V-1): 10 Jahre ab dem 31.12. des Jahres, in dem die Abrechnungsperiode der
// Rechnung endet; Stichtag ist das spätere von Rechnungsdatum und Ende des Leistungszeitraums
describe('Aufbewahrungsfrist einer Rechnung', () => {
	test('läuft 10 Jahre ab dem Ende des Kalenderjahres ihres Rechnungsdatums', () => {
		expect(keepUntil('calendar', { invoiceDate: '2024-03-31', servicePeriodEnd: null })).toBe('2034-12-31');
	});

	test('läuft bei Juli bis Juni ab dem Ende des Jahres, in dem die Abrechnungsperiode endet', () => {
		expect(keepUntil('july-june', { invoiceDate: '2024-03-31', servicePeriodEnd: null })).toBe('2034-12-31');
		expect(keepUntil('july-june', { invoiceDate: '2024-07-01', servicePeriodEnd: null })).toBe('2035-12-31');
	});

	test('läuft bei November bis Oktober ab dem Ende des Jahres, in dem die Abrechnungsperiode endet', () => {
		expect(keepUntil('november-october', { invoiceDate: '2024-10-15', servicePeriodEnd: null })).toBe('2034-12-31');
		expect(keepUntil('november-october', { invoiceDate: '2024-11-01', servicePeriodEnd: null })).toBe('2035-12-31');
	});

	test('zählt bei einer nach dem Leistungszeitraum gestellten Rechnung ab ihrem Rechnungsdatum', () => {
		expect(keepUntil('calendar', { invoiceDate: '2025-02-20', servicePeriodEnd: '2024-12-31' })).toBe('2035-12-31');
	});

	test('zählt bei einem Leistungszeitraum nach dem Rechnungsdatum ab dessen Ende', () => {
		expect(keepUntil('calendar', { invoiceDate: '2024-12-15', servicePeriodEnd: '2025-03-31' })).toBe('2035-12-31');
	});
});
