/**
 * #1464: what «Kosten des Gebäudes» of a position of the Kostenabstimmung is calculated from (real PostgreSQL
 * database): today's Rechnungen with their part in the period, and the Tankbestand. Building with one apartment,
 * tenant from 1.1. to 31.3.2024, Abrechnungsperiode 2024 (366 days).
 */

import { afterAll, afterEach, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, fuelStocks, invoices, utilityStatements } from '../db/schema';
import { generateStatement } from '../services/statement-generation.service';
import type { ReconciliationBody } from '../api/report';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', endDate: '2024-03-31', monthlyAdvancePayment: '0' });
});
afterEach(async () => {
	await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, rental.building));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
});
afterAll(() => rental.remove());

const categoryNamed = async (name: string) => (await db.select().from(categories).where(eq(categories.name, name)))[0].id;

async function invoice(values: Partial<typeof invoices.$inferInsert> = {}) {
	const [row] = await db
		.insert(invoices)
		.values({
			buildingId: rental.building,
			categoryId: await categoryNamed('Caretaker'),
			billingEntityName: 'Muster AG',
			description: `Hauswart ${token}`,
			amount: '732.00',
			invoiceDate: '2024-12-31',
			isValidUtilityCost: true,
			...values
		})
		.returning();
	return row.id;
}

const stocks = (categoryId: string, opening: string, closing: string) =>
	db.insert(fuelStocks).values([
		{ buildingId: rental.building, readingDate: '2023-12-31', amount: opening, categoryId },
		{ buildingId: rental.building, readingDate: '2024-12-31', amount: closing, categoryId }
	]);

const body = async (path: string, year = 2024) =>
	(await callApi(`/api/v1/${path}?buildingId=${rental.building}&periodStart=${year}-01-01&periodEnd=${year}-12-31`)).json() as Promise<ReconciliationBody>;
const report = (year?: number) => body('reports/reconciliation', year);

describe('Rechnungen einer Position der Kostenabstimmung', () => {
	it('nennt eine Rechnung ohne Leistungszeitraum mit Rechnungssteller, Rechnungsdatum und ihrem ganzen Betrag', async () => {
		const id = await invoice();
		expect((await report()).positions.map((p) => p.rows)).toEqual([
			[{ kind: 'invoice', id, billingEntityName: 'Muster AG', invoiceDate: '2024-12-31', amount: 732, inPeriod: 732, beyond: null }]
		]);
	});

	// 800.00 over 01.01.2024 – 31.12.2027 (1461 days): 366 days count in 2024, 365 in 2025
	it('nennt bei einer Rechnung über mehrere Jahre den Leistungszeitraum, die Tage in der Periode und den Anteil', async () => {
		await invoice({ amount: '800.00', invoiceDate: '2024-03-15', servicePeriodStart: '2024-01-01', servicePeriodEnd: '2027-12-31' });
		const beyond = { start: '2024-01-01', end: '2027-12-31', ofDays: 1461 };
		const rows = async (year: number) => (await report(year)).positions.flatMap((p) => p.rows);
		expect([await rows(2024), await rows(2025)]).toEqual([
			[expect.objectContaining({ amount: 800, inPeriod: 200.41, beyond: { ...beyond, days: 366 } })],
			[expect.objectContaining({ amount: 800, inPeriod: 199.86, beyond: { ...beyond, days: 365 } })]
		]);
	});

	it('nennt eine Rechnung, deren Leistungszeitraum ganz in der Periode liegt, ohne Tage', async () => {
		await invoice({ servicePeriodStart: '2024-04-01', servicePeriodEnd: '2024-06-30' });
		expect((await report()).positions.flatMap((p) => p.rows)).toEqual([expect.objectContaining({ inPeriod: 732, beyond: null })]);
	});

	// Fachreview 1464-1 F-2: Anfangsbestand 600.00 + Lieferung 1'000.00 − Endbestand 100.00 = 1'500.00; the Lieferung
	// counts in full in the period of its Lieferdatum, its one-day Leistungszeitraum (#1469)
	it('nennt bei einer Position mit Tankbestand den Anfangsbestand, die Lieferungen und den Endbestand, die zusammen die Kosten des Gebäudes ergeben', async () => {
		const heating = await categoryNamed('Heating');
		await stocks(heating, '600.00', '100.00');
		const id = await invoice({ categoryId: heating, amount: '1000.00', invoiceDate: '2024-06-15', servicePeriodStart: '2024-06-15', servicePeriodEnd: '2024-06-15' });
		const [position] = (await report()).positions;
		expect(position).toMatchObject({
			buildingCosts: 1500,
			rows: [
				{ kind: 'opening', date: '2023-12-31', amount: 600 },
				{ kind: 'invoice', id, billingEntityName: 'Muster AG', invoiceDate: '2024-06-15', amount: 1000, inPeriod: 1000, beyond: null },
				{ kind: 'closing', date: '2024-12-31', amount: 100 }
			]
		});
	});

	// #1469 (Fachreview 1469-1 V-6): a Tankrevision is no Lieferung: it follows the Endbestand, 732.00 × 366 / 1'096 = 244.45
	it('nennt bei einer Position mit Tankbestand eine Tankrevision nach dem Endbestand', async () => {
		const heating = await categoryNamed('Heating');
		await stocks(heating, '600.00', '100.00');
		const id = await invoice({ categoryId: heating, invoiceDate: '2024-02-01', servicePeriodStart: '2024-01-01', servicePeriodEnd: '2026-12-31' });
		expect((await report()).positions.flatMap((p) => p.rows).map((row) => row.kind === 'invoice' ? row.id : row.kind)).toEqual(['opening', 'closing', id]);
	});

	// Fachreview 1464-1 F-2: a tank without a Lieferung, also one at 0 and 0, still has its two rows
	it('nennt bei einem Tank ohne Lieferung den Anfangs- und den Endbestand, auch mit CHF 0.00', async () => {
		await stocks(await categoryNamed('Heating'), '0.00', '0.00');
		expect((await report()).positions.map((p) => p.rows)).toEqual([
			[
				{ kind: 'opening', date: '2023-12-31', amount: 0 },
				{ kind: 'closing', date: '2024-12-31', amount: 0 }
			]
		]);
	});

	it('nennt die nicht umlagefähigen Rechnungen mit ihrem Anteil in der Periode, nach Rechnungsdatum', async () => {
		const repairs = { categoryId: await categoryNamed('Repairs'), isValidUtilityCost: false };
		const late = await invoice({ ...repairs, amount: '500.00', invoiceDate: '2024-08-20' });
		const early = await invoice({ ...repairs, amount: '800.00', invoiceDate: '2024-03-15', servicePeriodStart: '2024-01-01', servicePeriodEnd: '2027-12-31' });
		expect(await report()).toMatchObject({
			nonAllocable: 700.41,
			nonAllocableRows: [
				{ kind: 'invoice', id: early, amount: 800, inPeriod: 200.41, beyond: { start: '2024-01-01', end: '2027-12-31', days: 366, ofDays: 1461 } },
				{ kind: 'invoice', id: late, billingEntityName: 'Muster AG', invoiceDate: '2024-08-20', amount: 500, inPeriod: 500, beyond: null }
			]
		});
	});

	it('nennt bei einer Position, deren Rechnung seit der Abrechnung gelöscht ist, keine Zeile', async () => {
		await invoice();
		const { id } = await generateStatement({ contractId: rental.contract, buildingId: rental.building, periodStart: '2024-01-01', periodEnd: '2024-12-31', managementFeePercent: 0 });
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		const { positions } = await report();
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		expect(positions).toEqual([expect.objectContaining({ buildingCosts: 0, tenants: 182, rows: [] })]);
	});

	it('nennt die Rechnungen auch in der Kostenabstimmung der Vorschau', async () => {
		const id = await invoice();
		await invoice({ categoryId: await categoryNamed('Repairs'), isValidUtilityCost: false });
		const run = await body('statements/run-reconciliation');
		expect([run.positions.flatMap((p) => p.rows), run.nonAllocableRows]).toEqual([
			[expect.objectContaining({ kind: 'invoice', id, inPeriod: 732 })],
			[expect.objectContaining({ kind: 'invoice', inPeriod: 732 })]
		]);
	});
});

