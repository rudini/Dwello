/**
 * The amount of an invoice through the API (real PostgreSQL): a credit is deducted from its invoice, never recorded as a
 * negative invoice, as the form says (#451, point 1; #237)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { createBuilding, deleteBuilding } from '../services/building.service';
import { sendJson } from './helpers/auth';
import { expectRejection, idOf } from './helpers/records';

let buildingId: string;
const invoice = () => ({
	buildingId,
	billingEntityName: `Muster ${crypto.randomUUID()}`,
	description: 'Hauswart Q3',
	amount: '900.00',
	invoiceDate: '2025-09-30'
});

beforeAll(async () => {
	buildingId = (await createBuilding({ name: `Betrag ${crypto.randomUUID()}`, address: 'Testweg 1', postalCode: '8400', city: 'Winterthur', canton: 'ZH' })).id;
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, buildingId));
	await deleteBuilding(buildingId);
});

describe('Betrag einer Rechnung', () => {
	it('lehnt einen negativen Betrag beim Erfassen ab', async () => {
		const response = await sendJson('POST', '/api/v1/invoices?skipLlm=true', { ...invoice(), amount: '-900.00' });

		await expectRejection(response, 400, 'The amount of an invoice cannot be negative', 'INVOICE_AMOUNT_NEGATIVE');
		expect(await db.select().from(invoices).where(eq(invoices.buildingId, buildingId))).toHaveLength(0);
	});

	it('lehnt einen negativen Betrag beim Ändern ab und behält den alten', async () => {
		const id = await idOf(await sendJson('POST', '/api/v1/invoices?skipLlm=true', invoice()));

		const response = await sendJson('PUT', `/api/v1/invoices/${id}`, { amount: '-300.00' });

		await expectRejection(response, 400, 'The amount of an invoice cannot be negative', 'INVOICE_AMOUNT_NEGATIVE');
		const [stored] = await db.select({ amount: invoices.amount }).from(invoices).where(eq(invoices.id, id));
		expect(stored.amount).toBe('900.00');
	});
});
