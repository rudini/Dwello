import { describe, expect, it } from 'bun:test';
import {
	generateQRBillForStatement,
	validateIBAN,
	validateQRReference
} from '../services/qr-bill.service';

// QR-IBAN aus den Beispielen der SIX Implementation Guidelines
const config = {
	iban: 'CH44 3199 9123 0008 8901 2',
	companyName: 'Verwaltung AG',
	address: 'Bahnhofstrasse 1',
	postalCode: '8001',
	city: 'Zürich'
};
const statement = (id: string) => ({
	id,
	statementNumber: 'NK-2025-001',
	balance: '120.50',
	tenant: { firstName: 'Eva', lastName: 'Frei' }
});

describe('QR-Rechnung einer Abrechnung', () => {
	// Die Referenz ordnet die Zahlung der Abrechnung zu; Abrechnungs-IDs sind UUIDs mit Buchstaben
	it('gibt verschiedenen Abrechnungen verschiedene QR-Referenzen', async () => {
		const first = await generateQRBillForStatement(
			statement('a1111111-1111-4111-8111-111111111111'),
			config
		);
		const second = await generateQRBillForStatement(
			statement('b1111111-1111-4111-8111-111111111111'),
			config
		);

		expect(validateQRReference(first.reference).valid).toBe(true);
		expect(first.reference).not.toBe(second.reference);
	});

	// SIX: Ein Zahler braucht Postleitzahl und Ort; sonst lehnen Banking-Apps den QR-Code ab. Die Abrechnung kennt die Adresse nicht
	it('lässt den Zahler weg, solange seine Adresse fehlt', async () => {
		const { qrDataString } = await generateQRBillForStatement(
			statement('a1111111-1111-4111-8111-111111111111'),
			config
		);
		const lines = qrDataString.split('\n');

		expect(lines).toHaveLength(32); // SIX Version 2.0: 32 Elemente bis zu den Rechnungsinformationen
		expect(lines.slice(20, 27)).toEqual(['', '', '', '', '', '', '']); // Endgültiger Zahlungspflichtiger
	});

	it('schreibt den Zahler mit vollständiger Adresse', async () => {
		const tenant = {
			firstName: 'Eva',
			lastName: 'Frei',
			address: 'Seestrasse 5',
			postalCode: '8002',
			city: 'Zürich'
		};
		const { qrDataString } = await generateQRBillForStatement(
			{ ...statement('a1111111-1111-4111-8111-111111111111'), tenant },
			config
		);

		expect(qrDataString.split('\n').slice(20, 27)).toEqual([
			'S',
			'Eva Frei',
			'Seestrasse 5',
			'',
			'8002',
			'Zürich',
			'CH'
		]);
	});

	// Beispielwerte aus den SIX Implementation Guidelines; eine falsche Prüfziffer lehnt die Bank ab
	it('prüft IBAN und QR-Referenz mit ihren Prüfziffern', () => {
		expect(validateIBAN('CH93 0076 2011 6238 5295 7').valid).toBe(true);
		expect(validateIBAN('CH93 0076 2011 6238 5295 8').valid).toBe(false);
		expect(validateQRReference('21 00000 00003 13947 14300 09017').valid).toBe(true);
		expect(validateQRReference('21 00000 00003 13947 14300 09016').valid).toBe(false);
	});

	// Eine QR-Referenz verlangt eine QR-IBAN; mit gewöhnlicher IBAN bleibt die Rechnung ohne Referenz
	it('setzt ohne QR-IBAN keine Referenz', async () => {
		const bill = await generateQRBillForStatement(
			statement('a1111111-1111-4111-8111-111111111111'),
			{ ...config, iban: 'CH93 0076 2011 6238 5295 7' }
		);

		expect(bill.qrDataString.split('\n').slice(27, 29)).toEqual(['NON', '']);
	});
});
