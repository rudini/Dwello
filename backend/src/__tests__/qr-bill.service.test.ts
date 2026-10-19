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

		expect(lines).toHaveLength(31); // SIX Version 2.0: 31 Elemente bis zum Trailer EPD, leere Rechnungsinformationen entfallen
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

	// Eine Korrespondenzadresse im Ausland: das Land des Mieters, nicht immer CH (#102)
	it('schreibt das Land der Korrespondenzadresse in den Zahler', async () => {
		const tenant = {
			firstName: 'Eva',
			lastName: 'Frei',
			address: 'Marktstätte 3',
			postalCode: '78462',
			city: 'Konstanz',
			country: 'DE'
		};
		const { qrDataString } = await generateQRBillForStatement(
			{ ...statement('a1111111-1111-4111-8111-111111111111'), tenant },
			config
		);

		expect(qrDataString.split('\n').slice(20, 27)).toEqual(['S', 'Eva Frei', 'Marktstätte 3', '', '78462', 'Konstanz', 'DE']);
	});

	// SIX IG 4.1.1: im QR-Code nur Basic Latin, Latin-1 Supplement, Latin Extended-A, Ș ș Ț ț und €; ein anderes
	// Zeichen kann die Bank ablehnen (#78)
	it('schreibt nur die zulässigen Zeichen in den QR-Code', async () => {
		const tenant = {
			firstName: 'Zoe\u0308', // «e» und Trema getrennt, wie macOS es speichern kann
			lastName: 'D’Angelo–Țîrlea Nguyễn Ωmega',
			address: '„Seehof“\n5\t€…',
			postalCode: '8002',
			city: 'Zürich'
		};
		const { qrDataString } = await generateQRBillForStatement(
			{ ...statement('a1111111-1111-4111-8111-111111111111'), tenant },
			config
		);

		expect(qrDataString.split('\n').slice(21, 23)).toEqual(["Zoë D'Angelo-Țîrlea Nguyen .mega", '"Seehof" 5 €...']);
	});

	// Der Zahlteil druckt die Angaben aus dem QR-Code: schon dort auf die Länge der SIX gekürzt (#78)
	it('kürzt Name und Ort auf die Länge der SIX', async () => {
		const tenant = { firstName: 'Eva', lastName: 'Frei'.repeat(20), address: 'Seestrasse 5', postalCode: '8002', city: 'Z'.repeat(40) };
		const { qrData } = await generateQRBillForStatement(
			{ ...statement('a1111111-1111-4111-8111-111111111111'), tenant },
			{ ...config, companyName: 'V'.repeat(80) }
		);

		expect([qrData.debtorName?.length, qrData.debtorCity?.length, qrData.creditorName.length]).toEqual([70, 35, 70]);
	});

	// SIX IG 4.1: die IBAN ohne Leerzeichen in Grossbuchstaben; das letzte Element endet ohne Zeilenumbruch (#78)
	it('schreibt die IBAN in Grossbuchstaben und endet mit EPD', async () => {
		const { qrDataString } = await generateQRBillForStatement(
			statement('a1111111-1111-4111-8111-111111111111'),
			{ ...config, iban: 'ch44 3199 9123 0008 8901 2' }
		);

		expect(qrDataString.split('\n')[3]).toBe('CH4431999123000889012');
		expect(qrDataString.endsWith('\nEPD')).toBe(true);
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

	// #450 (Entscheid in #404, Punkt 8): das Land des Zahlungsempfängers aus seiner PLZ, Liechtenstein hat 9485 bis 9498
	it('nennt als Land des Zahlungsempfängers Liechtenstein nur für die PLZ 9485 bis 9498', async () => {
		const countries: Record<string, string> = {};
		for (const postalCode of ['9484', '9485', '9498', '9499']) {
			const { qrData } = await generateQRBillForStatement(statement('a1111111-1111-4111-8111-111111111111'), {
				...config,
				postalCode
			});
			countries[postalCode] = qrData.creditorCountry;
		}

		expect(countries).toEqual({ '9484': 'CH', '9485': 'LI', '9498': 'LI', '9499': 'CH' });
	});

	// #450: ohne Name, PLZ oder Ort gäbe es keinen echten Zahlungsempfänger; der Zahlteil entsteht dann nicht
	it('lehnt einen Zahlteil ohne vollständige Firmenadresse ab', async () => {
		for (const missing of ['companyName', 'postalCode', 'city'] as const) {
			for (const value of ['', '  ']) {
				const bill = generateQRBillForStatement(statement('a1111111-1111-4111-8111-111111111111'), {
					...config,
					[missing]: value
				});

				await expect(bill).rejects.toMatchObject({ code: 'CREDITOR_ADDRESS_MISSING' });
			}
		}
	});
});
