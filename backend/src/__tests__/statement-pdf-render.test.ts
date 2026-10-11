/**
 * The statement PDF as the tenant reads it, rendered from given data (no database)
 */

import { describe, expect, it } from 'bun:test';
import { generateStatementPDFBase64, type StatementPDFData } from '../services/pdf.service';
import { generateQRBillForStatement } from '../services/qr-bill.service';
import { readPdf } from './helpers/pdf-text';

const config = { iban: 'CH4431999123000889012', companyName: 'Muster Immobilien AG', address: 'Firmenweg 9', postalCode: '8001', city: 'Zürich' };

const refund: StatementPDFData = {
	id: '00000000-0000-0000-0000-000000000001',
	statementNumber: 'NK-1-2025-0001',
	statementDate: '2026-02-15',
	periodStart: '2025-01-01',
	periodEnd: '2025-12-31',
	rentalDays: 365,
	tenant: { firstName: 'Nina', lastName: 'Brunner', address: 'Seeweg 15', postalCode: '6003', city: 'Luzern' },
	apartment: { number: 'A2', floor: 0, area: '82.00' },
	building: { name: 'Seepark', address: 'Seeweg 15', place: '6003 Luzern' },
	lineItems: [{ category: 'Hauswart', key: 'Pro Fläche (m²)', totalAmount: 3060, apartmentShare: 784.13, periodShare: 1, tenantShare: 784.13 }],
	rentalStart: '2025-01-01',
	rentalEnd: '2025-12-31',
	periodDays: 365,
	subtotal: 784.13,
	managementFee: 0,
	managementFeePercent: 0,
	totalCosts: 784.13,
	totalAdvancePayments: 878,
	balance: -93.87
};

const textOf = async (data: StatementPDFData) => readPdf(Buffer.from(await generateStatementPDFBase64(data, config, 'de'), 'base64'));

describe('PDF einer Rückerstattung', () => {
	it('nennt die Rückerstattung als Betrag ohne Minuszeichen und ohne Zahlteil', async () => {
		const pdf = await textOf(refund);

		expect(pdf.flowing).toContain('Rückerstattung 93.87');
		expect(pdf.flowing).not.toContain('-93.87');
		expect(pdf.flowing).not.toContain('Zahlteil');
		expect(pdf.pages).toBe(1);
	});

	// Ein Entwurf vor der Einführung der Anteile hat keine gespeicherten Anteile: die Spalten bleiben leer
	it('lässt Wohnungs- und Zeitanteil älterer Abrechnungen leer', async () => {
		const older = { ...refund, lineItems: [{ ...refund.lineItems[0], apartmentShare: null, periodShare: null }] };

		expect((await textOf(older)).flowing).toContain("Hauswart Pro Fläche (m²) 3'060.00 – – 784.13");
	});
});

const due: StatementPDFData = { ...refund, totalAdvancePayments: 600, balance: 184.13, paymentDeadline: '2026-03-17' };

describe('PDF einer Nachzahlung', () => {
	// SIX: die Angaben im Zahlteil entsprechen dem QR-Code; Rätoromanisch sieht der Zahlteil nicht vor
	it('druckt den Zahlteil auf Rätoromanisch deutsch und die Mitteilung wie im QR-Code', async () => {
		const rm = readPdf(Buffer.from(await generateStatementPDFBase64(due, config, 'rm'), 'base64')).flowing;
		const fr = readPdf(Buffer.from(await generateStatementPDFBase64(due, config, 'fr'), 'base64')).flowing;

		expect(rm).toContain('Empfangsschein');
		expect(rm).toContain('Zahlteil');
		// Halb übersetzte Sätze wirkten unprofessionell: bis alles übersetzt ist, das ganze PDF deutsch
		expect(rm).toContain('Nebenkostenabrechnung 01.01.2025 – 31.12.2025');
		expect(rm).not.toContain('Rendaquint');
		expect(fr).toContain('Informations supplémentaires Décompte des charges NK-1-2025-0001');
	});

	// Der QR-Code nennt den Zahlungspflichtigen nur mit vollständiger Adresse
	it('nennt «Zahlbar durch» nur mit Name, Postleitzahl und Ort', async () => {
		const pdf = await textOf({ ...due, tenant: { firstName: 'Nina', lastName: 'Brunner' } });

		expect(pdf.flowing).not.toContain('Zahlbar durch');
	});

	it('wiederholt den Tabellenkopf auf jeder Seite der Kostenübersicht', async () => {
		const many = { ...due, lineItems: Array.from({ length: 45 }, (_, i) => ({ ...refund.lineItems[0], category: `Kategorie ${i + 1}` })) };

		const pdf = await textOf(many);

		expect(pdf.pages).toBeGreaterThanOrEqual(3); // two pages of positions and the payment part
		expect(pdf.flowing.split('Kategorie Verteilschlüssel').length - 1).toBe(pdf.pages - 1);
	});

	it('schreibt Zeichen ausserhalb der Schrift lesbar, statt sie zu verstümmeln', async () => {
		const pdf = await textOf({ ...due, tenant: { ...due.tenant, firstName: 'Łukasz', lastName: 'Dragoș' } });

		expect(pdf.flowing).toContain('Lukasz Dragos');
	});

	it('nennt die Grundlage der Verwaltungspauschale als Zwischensumme', async () => {
		const pdf = await textOf({ ...due, managementFee: 23.52, managementFeePercent: 3 });

		expect(pdf.flowing).toContain("3 % der Zwischensumme von CHF 784.13");
	});
});

describe('PDF ohne Saldo und einer bezahlten Abrechnung', () => {
	it('sagt bei Saldo 0, dass nichts zu bezahlen ist', async () => {
		const pdf = await textOf({ ...due, totalAdvancePayments: 784.13, balance: 0 });

		expect(pdf.flowing).toContain('Ausgeglichen');
		expect(pdf.flowing).not.toContain('mit dem Zahlteil');
	});

	// Eine bezahlte Abrechnung neu gedruckt: kein Zahlteil, sonst zahlt der Mieter zweimal
	it('druckt für eine bezahlte Abrechnung keinen Zahlteil', async () => {
		const pdf = await textOf({ ...due, paidDate: '2026-03-01' });

		expect(pdf.flowing).toContain('Bezahlt am 01.03.2026');
		expect(pdf.flowing).not.toContain('Zahlteil');
	});

	// Bei einer Rückerstattung hat die Verwaltung bezahlt: kein Dank an den Mieter
	it('nennt bei einer bezahlten Rückerstattung den Tag der Überweisung', async () => {
		const pdf = await textOf({ ...refund, paidDate: '2026-03-01' });

		expect(pdf.flowing).toContain('Überwiesen am 01.03.2026.');
		expect(pdf.flowing).not.toContain('Vielen Dank');
	});

	// Zwischensumme bis Saldo gehören zusammen: der Saldo stand sonst allein auf der nächsten Seite
	it('hält die Summen bis zum Saldo auf einer Seite', async () => {
		for (let n = 10; n <= 20; n++) {
			const items = Array.from({ length: n }, (_, i) => ({ ...refund.lineItems[0], category: `Kategorie ${i + 1}` }));
			const pages = (await textOf({ ...due, lineItems: items, managementFee: 23.52, managementFeePercent: 3 })).text.split('Seite ');
			const pageOf = (row: RegExp) => pages.findIndex((page) => row.test(page));

			// die Zeilen der Tabelle, nicht der Saldo-Kasten oben («CHF …»)
			expect([/Verwaltungspauschale/, /Ihre Nebenkosten\n\d/, /Nachzahlung\n\d/].map(pageOf), `${n} Positionen`).toEqual(Array(3).fill(pageOf(/Zwischensumme/)));
		}
	});

	it('nennt bei einer Rückerstattung den Termin', async () => {
		const pdf = await textOf({ ...refund, paymentDeadline: '2026-03-17' });

		expect(pdf.flowing).toContain('Wir überweisen Ihnen den Betrag bis 17.03.2026.');
	});
});

describe('QR-Code im Zahlteil', () => {
	// 46 mm gedruckt: mit 166 Pixeln waren die Module ungleich breit; jetzt ganze Pixel je Modul, scharf auch beim Druck
	it('bettet den QR-Code mit ganzen Pixeln je Modul in Druckauflösung ein', async () => {
		const { qrCodeImage } = await generateQRBillForStatement({ id: due.id, statementNumber: due.statementNumber, balance: '184.13', tenant: due.tenant }, config);
		const width = qrCodeImage.readUInt32BE(16); // PNG header

		expect(width).toBeGreaterThanOrEqual(500);
		expect(width % 10).toBe(0);
	});
});

const heated: StatementPDFData = {
	...due,
	heating: { profile: 'Heizung Mittelland', percent: 44.2, months: [{ month: 11, percentage: 10.7 }, { month: 12, percentage: 13 }] },
	fuel: { category: 'Heizöl und Brennstoffe für die Zentralheizung inklusive Tankreinigung und Tankrevision', openingDate: '2025-01-01', opening: 1000, invoices: 3000, closingDate: '2025-12-31', closing: 500, total: 3500 }
};

describe('Heiz- und Warmwasserkosten im PDF', () => {
	it('schreibt die Anteile der Monate einheitlich mit zwei Stellen', async () => {
		expect((await textOf(heated)).flowing).toContain('Nov 10.70 %, Dez 13.00 %');
	});

	// «Jun 3.70» und «%» standen auf zwei Zeilen
	it('trennt einen Monatsanteil nicht von seinem Prozentzeichen', async () => {
		const months = [13.6, 12.1, 11.5, 9.3, 5.6, 3.7].map((percentage, i) => ({ month: i + 1, percentage }));
		const pdf = await textOf({ ...heated, heating: { profile: 'Heizung + Warmwasser', percent: 55.8, months } });

		expect(pdf.text).toContain('Jun 3.70 %');
	});

	// Beim Tank zählt nicht die Rechnung, sondern der Verbrauch
	it('erklärt in der Fussnote, dass beim Tank der Verbrauch zählt', async () => {
		expect((await textOf(heated)).flowing).toContain('Kosten Liegenschaft bei Heizmaterial aus dem Tank: der Verbrauch');
		expect((await textOf(due)).flowing).not.toContain('aus dem Tank');
	});
});
