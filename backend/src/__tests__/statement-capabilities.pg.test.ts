/**
 * What a statement allows (#788): the backend says it per statement, the frontend shows buttons and hints by it and
 * only labels the status; a replaced statement stays as sent and asks for nothing, its correction does (#120)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
const allows = async (id: string) => {
	const { editable, correctable, asksPayment, superseded } = (await (await callApi(`/api/v1/statements/${id}`)).json()) as Record<string, unknown>;
	return { editable, correctable, asksPayment, superseded };
};

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2025-01-01', monthlyAdvancePayment: '100' });
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2025-03-31' });
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Was eine Nebenkostenabrechnung erlaubt', () => {
	it('erlaubt einem Entwurf das Bearbeiten, nicht das Berichtigen', async () => {
		const draft = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		);

		expect(await allows(draft)).toEqual({ editable: true, correctable: false, asksPayment: true, superseded: false });
	});

	it('erlaubt einer versandten Abrechnung das Berichtigen, einer ersetzten nichts mehr', async () => {
		const sent = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		);
		await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'sent' });
		expect(await allows(sent)).toEqual({ editable: true, correctable: true, asksPayment: true, superseded: false });

		await db.update(utilityStatements).set({ status: 'replaced' }).where(eq(utilityStatements.id, sent));
		expect(await allows(sent)).toEqual({ editable: false, correctable: false, asksPayment: false, superseded: true });
	});
});
