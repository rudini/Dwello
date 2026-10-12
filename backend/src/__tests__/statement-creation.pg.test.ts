/**
 * Creating a Nebenkostenabrechnung as a function, without HTTP and without PDF (scenario Q5), against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import {
	createStatement,
	deleteStatement,
	generateStatement,
	listStatements
} from '../services/statement.service';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), {
		startDate: '2024-01-01',
		monthlyAdvancePayment: '100'
	});
	await insertInvoice(rental.building, { amount: '1500.00', invoiceDate: '2024-06-30' });
});

afterAll(async () => {
	const { statements } = await listStatements({ tenantId: rental.tenant });
	for (const statement of statements) await deleteStatement(statement.id);
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Nebenkostenabrechnung erstellen', () => {
	it('erstellt die Abrechnung eines Mietvertrags als Entwurf mit ihren Abrechnungspositionen', async () => {
		const statement = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			managementFeePercent: 0
		});

		// Einzige Wohnung, ganzes Jahr: Hauswart CHF 1500 ganz, Akonto 12 × CHF 100
		expect(statement).toMatchObject({
			status: 'draft',
			rentalDays: 366,
			rentalStart: '2024-01-01',
			rentalEnd: '2024-12-31',
			totalCosts: '1500.00',
			totalAdvancePayments: '1200.00',
			balance: '300.00',
			lineItems: [{ description: 'Caretaker', tenantShare: '1500.00' }]
		});
		await deleteStatement(statement.id);
	});

	// Das PDF erklärt jede Position: Anteil der Wohnung an den Kosten der Liegenschaft und Anteil der Mietdauer
	it('hält je Position den Anteil der Wohnung und den Zeitanteil fest', async () => {
		const statement = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2023-07-01',
			periodEnd: '2024-06-30',
			managementFeePercent: 0
		});

		// eingezogen am 1.1.2024: 182 von 366 Tagen
		expect(statement.lineItems[0]).toMatchObject({ apartmentShare: '1500.00', periodShare: '0.4973', tenantShare: '745.90' });
		await deleteStatement(statement.id);
	});
});

describe('Nebenkostenabrechnung speichern', () => {
	it('speichert keine Abrechnung, wenn eine Abrechnungsposition nicht gespeichert werden kann', async () => {
		const statement = {
			tenantId: rental.tenant,
			apartmentId: rental.apartment,
			contractId: rental.contract,
			statementNumber: `NK-${crypto.randomUUID()}`,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			statementDate: '2025-01-15',
			rentalDays: 366,
			rentalStart: '2024-01-01',
			rentalEnd: '2024-12-31',
			totalCosts: '100.00',
			totalAdvancePayments: '1200.00',
			managementFee: '0.00',
			balance: '-1100.00'
		};
		// The description column holds at most 255 characters
		const tooLong = { description: 'x'.repeat(256), totalAmount: '100.00', tenantShare: '100.00' };

		await expect(createStatement(statement, [tooLong])).rejects.toThrow();

		expect((await listStatements({ tenantId: rental.tenant })).total).toBe(0);
	});
});
