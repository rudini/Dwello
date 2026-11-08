/**
 * #1221 (decided by the product owner): a custom Verteilschlüssel that cannot be calculated for the apartments of the
 * building holds the run instead of splitting its invoices equally; the wizard's check names the invoices, generation
 * and «Neu berechnen» refuse (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { distributionKeys, invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let key: string;
const token = crypto.randomUUID();
const name = `Halbe Zimmer ${token}`;

beforeAll(async () => {
	// apartment 2.01 has 3.5 rooms: the formula divides by zero there; the four sample apartments all pass
	rental = await createRental(token, { startDate: '2025-01-01', monthlyAdvancePayment: '100' });
	const created = await sendJson('POST', '/api/v1/distribution-keys', { name, nameDE: name, formula: '1 / (({rooms} - 3.5) * ({rooms} - 3.5))' });
	expect(created.status).toBe(201); // saved: the formula passes the four sample apartments (#737)
	key = await idOf(created);
	await insertInvoice(rental.building, { distributionKeyId: key, billingEntityName: 'Garten AG', amount: '600.00', invoiceDate: '2025-05-31' });
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2025-03-31' });
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
	await db.delete(distributionKeys).where(eq(distributionKeys.id, key));
});

const run = { periodStart: '2025-01-01', periodEnd: '2025-12-31' };
const refusal = (invoices: string) =>
	['The distribution key cannot be calculated for the apartments of the building', 'STATEMENT_KEY_NOT_CALCULABLE', { key: name, building: `Ahornhof ${token}`, invoices }] as const;

describe('Verteilschlüssel, der sich für das Gebäude nicht berechnen lässt', () => {
	it('nennt die Rechnungen in der Prüfung der Rechnungen und verweigert die Abrechnung, statt gleich zu verteilen', async () => {
		const check = await callApi(`/api/v1/invoices/completeness/${rental.building}?periodStart=${run.periodStart}&periodEnd=${run.periodEnd}`);
		expect(((await check.json()) as { uncalculableKeys: unknown }).uncalculableKeys).toEqual([
			expect.objectContaining({ billingEntityName: 'Garten AG', invoiceDate: '2025-05-31', amount: '600.00', distributionKeyName: name })
		]);

		await expectRejection(
			await sendJson('POST', '/api/v1/statements/generate', { contractId: rental.contract, buildingId: rental.building, ...run }),
			400,
			...refusal('Garten AG, 31.05.2025, CHF 600.00')
		);
	});

	it('rechnet einen Entwurf nicht neu, sondern nennt Schlüssel und Rechnungen', async () => {
		const period = { periodStart: '2026-01-01', periodEnd: '2026-12-31' };
		await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2026-03-31' });
		const draft = await idOf(await sendJson('POST', '/api/v1/statements/generate', { contractId: rental.contract, buildingId: rental.building, ...period }));
		await insertInvoice(rental.building, { distributionKeyId: key, billingEntityName: 'Garten AG', amount: '300.00', invoiceDate: '2026-05-31' });

		await expectRejection(await sendJson('POST', `/api/v1/statements/${draft}/recalculation`, {}), 409, ...refusal('Garten AG, 31.05.2026, CHF 300.00'));
	});
});
