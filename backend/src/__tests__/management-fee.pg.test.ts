/**
 * Management fee chosen per generation run (real PostgreSQL database)
 *
 * One apartment rented all year, caretaker invoice CHF 1000 → subtotal CHF 1000.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices } from '../db/schema';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;

const preview = async (managementFeePercent?: number) =>
	(await (
		await callApi('/api/v1/statements/preview', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				contractId: rental.contract,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31',
				managementFeePercent
			})
		})
	).json()) as { subtotal: number; managementFee: number };

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
	const [caretaker] = await db.select().from(categories).where(eq(categories.name, 'Caretaker'));
	await db.insert(invoices).values({
		buildingId: rental.building,
		categoryId: caretaker.id,
		billingEntityName: 'Hauswart AG',
		description: 'Hauswartung 2024',
		amount: '1000.00',
		invoiceDate: '2024-06-30',
		isValidUtilityCost: true
	});
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Verwaltungspauschale pro Abrechnungslauf', () => {
	it('verwendet den Prozentsatz des Abrechnungslaufs, auch über 3 %', async () => {
		const result = await preview(4.5);

		expect(result.subtotal).toBe(1000);
		expect(result.managementFee).toBe(45);
	});
});

describe('Verwaltungspauschale in der Konfiguration', () => {
	const setFee = (value: string) =>
		callApi('/api/v1/config/management_fee_pct', {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ value })
		});

	it('lässt einen Standardsatz über 3 % zu', async () => {
		const before = (await (await callApi('/api/v1/config/management_fee_pct')).json()) as { value: number };
		try {
			expect((await setFee('4.5')).status).toBe(200);
		} finally {
			await setFee(String(before.value));
		}
	});
});
