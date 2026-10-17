import { describe, expect, it } from 'vitest';
import { toAuditEntries } from '../lib/server/audit-log';
// What GET /api/v1/audit-log answers, checked against the real API (backend/src/__tests__/api-contracts.pg.test.ts)
import auditLog from '../../tests/contracts/audit-log.json';

type Sample = (typeof auditLog.data)[number];
const textOf = (entry: Sample, details: object) =>
	toAuditEntries([{ ...entry, details: { ...entry.details, ...details } }])[0].text;
const [login, fee, category, invoice, reset] = auditLog.data;

// Protokoll (#357): jeder Eintrag nennt Zeitpunkt (Schweizer Zeit) und was sich geändert hat, in der Sprache der Oberfläche
describe('Protokoll aus dem Backend', () => {
	const entries = toAuditEntries(auditLog.data);

	it('nennt jeden Eintrag mit Datum und Uhrzeit in der Schweiz', () => {
		expect(entries[0]).toEqual({
			id: 'a1',
			when: '17.10.2026, 14:05',
			text: 'Anmeldung mit Google'
		});
	});

	it('nennt, was sich geändert hat', () => {
		expect(entries.map((entry) => entry.text)).toEqual([
			'Anmeldung mit Google',
			'Vorgeschlagene Verwaltungspauschale von 3 % auf 4.5 % geändert',
			'Kategorie «Gartenpflege»: von umlagefähig auf nicht umlagefähig geändert; 2 Rechnungen sind damit nicht mehr umlagefähig',
			'Rechnung «Treppenhausreinigung» von Hauswart Meier vom 31.03.2026 über CHF\u00a0450.00 (Lindenhof): als nicht umlagefähig markiert',
			'Zahlung der Abrechnung NK-2025-0001 vom 02.03.2026 zurückgesetzt',
			'Abrechnung NK-2025-0002 durch die berichtigte Abrechnung NK-2025-0007 ersetzt'
		]);
	});

	it('nennt die Gegenrichtung: wieder umlagefähig', () => {
		expect(textOf(category, { allocable: true, invoices: undefined })).toBe(
			'Kategorie «Gartenpflege»: von nicht umlagefähig auf umlagefähig geändert'
		);
		expect(textOf(invoice, { allocable: true })).toBe(
			'Rechnung «Treppenhausreinigung» von Hauswart Meier vom 31.03.2026 über CHF\u00a0450.00 (Lindenhof): wieder als umlagefähig markiert'
		);
	});

	it('nennt eine einzelne oder keine Rechnung der Kategorie', () => {
		expect(textOf(category, { invoices: 1 })).toBe(
			'Kategorie «Gartenpflege»: von umlagefähig auf nicht umlagefähig geändert; 1 Rechnung ist damit nicht mehr umlagefähig'
		);
		expect(textOf(category, { invoices: 0 })).toBe(
			'Kategorie «Gartenpflege»: von umlagefähig auf nicht umlagefähig geändert'
		);
	});

	it('nennt die Anmeldung mit Microsoft', () => {
		expect(textOf(login, { provider: 'microsoft' })).toBe('Anmeldung mit Microsoft');
	});

	// Fachprüfung V-5: 0 % heisst keine Verwaltungspauschale; sie steht wie jeder andere Satz
	it('nennt 0 % als Satz', () => {
		expect(textOf(fee, { from: '0', to: '3' })).toBe(
			'Vorgeschlagene Verwaltungspauschale von 0 % auf 3 % geändert'
		);
	});

	// Fachprüfung V-3: eine früher erfasste Zahlung ohne Datum
	it('nennt eine zurückgesetzte Zahlung ohne Datum', () => {
		expect(textOf(reset, { paidDate: null })).toBe(
			'Zahlung der Abrechnung NK-2025-0001 zurückgesetzt'
		);
	});
});
