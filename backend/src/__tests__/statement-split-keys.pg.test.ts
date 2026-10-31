/**
 * #528: a Kategorie billed with several Verteilschlüssel has a line per key; the statement marks the lines whose key
 * differs from its largest line and keeps the lines of one Kategorie together
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, invoices } from '../db/schema';
import { deleteStatement, generateStatement, getStatement } from '../services/statement.service';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-01-01', monthlyAdvancePayment: '100' });
	const [coldWater] = await db.select().from(categories).where(eq(categories.name, 'Cold Water'));
	const [perUnit] = await db.select().from(distributionKeys).where(eq(distributionKeys.name, 'Per Unit'));
	await insertInvoice(rental.building, { description: 'Hauswart Q1', amount: '900.00', invoiceDate: '2024-03-31' });
	await insertInvoice(rental.building, { description: 'Wasser 2024', amount: '400.00', invoiceDate: '2024-06-30', categoryId: coldWater.id });
	await insertInvoice(rental.building, { description: 'Hauswart Q4', amount: '300.00', invoiceDate: '2024-12-31', distributionKeyId: perUnit.id });
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Kategorie mit verschiedenen Verteilschlüsseln', () => {
	it('markiert die kleinere Position der Kategorie und stellt sie neben die grössere', async () => {
		const { id } = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			managementFeePercent: 0
		});
		const statement = (await getStatement(id))!;
		await deleteStatement(id);

		expect(
			statement.lineItems.map((item) => [item.description, item.invoices?.map((invoice) => invoice.description), item.otherKey])
		).toEqual([
			['Caretaker', ['Hauswart Q1'], false],
			['Caretaker', ['Hauswart Q4'], true],
			['Cold Water', ['Wasser 2024'], false]
		]);
	});
});
