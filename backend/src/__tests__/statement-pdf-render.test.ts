/**
 * The statement PDF as the tenant reads it, rendered from given data (no database)
 */

import { describe, expect, it } from 'bun:test';
import { generateStatementPDFBase64, type StatementPDFData } from '../services/pdf.service';
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
	lineItems: [{ category: 'Hauswart', key: 'Pro Fläche (m²)', totalAmount: 3060, apartmentShare: 784.13, periodShare: 1, tenantShare: 784.13, sharePercentage: 0.2563 }],
	rentalStart: '2025-01-01',
	rentalEnd: '2025-12-31',
	periodDays: 365,
	subtotal: 784.13,
	managementFee: 0,
	managementFeePercent: 0,
	managementFeeBase: 784.13,
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
