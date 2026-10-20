/**
 * #454 (#408 point 1): the invoice list filtered by an Abrechnungsperiode shows the invoices of the building that fall
 * into it by rule 1: without a Leistungszeitraum by the Rechnungsdatum, with one when it touches the period; allocable
 * and not (PO 2026-10-20, Fachreview 454-1 E-1, 454-2 V-26), so its allocable ones are the selection of
 * `getInvoicesForStatement` (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { callApi } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let other: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
	other = await createRental(`${token}-other`, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
	const invoice = (description: string, values: Parameters<typeof insertInvoice>[1] = {}) =>
		insertInvoice(rental.building, { description, ...values });
	await invoice('by date inside', { invoiceDate: '2025-11-15' });
	await invoice('by date before', { invoiceDate: '2025-09-30' });
	await invoice('by date after', { invoiceDate: '2026-01-02' });
	await invoice('service touching, dated after', { invoiceDate: '2026-01-20', servicePeriodStart: '2025-10-01', servicePeriodEnd: '2025-12-31' });
	await invoice('service across the year end', { invoiceDate: '2026-03-31', servicePeriodStart: '2025-12-01', servicePeriodEnd: '2026-02-28' });
	await invoice('service outside, dated inside', { invoiceDate: '2025-12-20', servicePeriodStart: '2026-01-01', servicePeriodEnd: '2026-03-31' });
	await invoice('not allocable', { invoiceDate: '2025-11-20', isValidUtilityCost: false });
	await insertInvoice(other.building, { description: 'other building', invoiceDate: '2025-11-15' });
});

afterAll(async () => {
	for (const one of [rental, other]) {
		await db.delete(invoices).where(eq(invoices.buildingId, one.building));
		await one.remove();
	}
});

const listed = async (query: string) =>
	((await (await callApi(`/api/v1/invoices?${query}&limit=100`)).json()) as { invoices: { description: string }[]; total: number }).invoices
		.map((invoice) => invoice.description)
		.sort();

describe('Rechnungen einer Abrechnungsperiode', () => {
	it('zeigt die Rechnungen, die eine Abrechnung der Periode nimmt', async () => {
		expect(await listed(`buildingId=${rental.building}&periodStart=2025-10-01&periodEnd=2025-12-31`)).toEqual([
			'by date inside',
			'not allocable',
			'service across the year end',
			'service touching, dated after'
		]);
	});

	// PO 2026-10-20 (Fachreview 454-1 E-1): the allocable ones first, so the list can group them; each with its part
	// in the period (V-11): 31 of the 90 days of 01.12.2025 – 28.02.2026
	it('nennt die umlagefähigen zuerst, jede mit ihrem Teil in der Periode', async () => {
		const response = (await (
			await callApi(`/api/v1/invoices?buildingId=${rental.building}&periodStart=2025-10-01&periodEnd=2025-12-31`)
		).json()) as { invoices: { description: string; isValidUtilityCost: boolean; inPeriod: { amount: number } }[] };
		expect(response.invoices.map((invoice) => invoice.isValidUtilityCost)).toEqual([true, true, true, false]);
		const across = response.invoices.find((invoice) => invoice.description === 'service across the year end')!;
		expect(across.inPeriod.amount).toBe(413.33);
	});

	it('gilt auch für eine Periode über den Jahreswechsel', async () => {
		expect(await listed(`buildingId=${rental.building}&periodStart=2025-12-01&periodEnd=2026-01-31`)).toEqual([
			'by date after',
			'service across the year end',
			'service touching, dated after'
		]);
	});

	it('zählt im Total nur diese Rechnungen', async () => {
		const response = (await (
			await callApi(`/api/v1/invoices?buildingId=${rental.building}&periodStart=2025-10-01&periodEnd=2025-12-31`)
		).json()) as { total: number };
		expect(response.total).toBe(4);
	});
});
