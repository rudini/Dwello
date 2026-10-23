/**
 * #759: invoices of one day keep the order they were entered in when a statement takes them, so the statement's
 * positions and the PDF's list of agreed categories come in the same order on every run. The order the rows lie in
 * on disk is not the order of entry: here the lift invoice lies first, the caretaker invoice was entered earlier.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { getInvoicesForStatement } from '../services/invoice.service';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
	await insertInvoice(rental.building, { description: 'Lift 2024', amount: '366.00', invoiceDate: '2024-06-30' });
	await insertInvoice(rental.building, { description: 'Hauswart 2024', amount: '1000.00', invoiceDate: '2024-06-30' });
	await db.update(invoices).set({ createdAt: new Date('2024-07-01T08:00:00Z') }).where(eq(invoices.description, 'Hauswart 2024'));
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Rechnungen einer Abrechnung', () => {
	it('kommen am selben Tag in der Reihenfolge ihrer Erfassung', async () => {
		const listed = await getInvoicesForStatement(rental.building, '2024-01-01', '2024-12-31');
		expect(listed.map((invoice) => invoice.description)).toEqual(['Hauswart 2024', 'Lift 2024']);
	});
});
