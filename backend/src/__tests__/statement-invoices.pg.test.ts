/**
 * A statement keeps the invoices each position billed (#96), and what changed in its period since (real PostgreSQL
 * database). Building with one apartment (70 m²), tenant from 1.1. to 31.3.2024, Abrechnungsperiode 2024.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices, utilityStatementLineItems } from '../db/schema';
import { deleteStatement, generateStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
const statements: string[] = [];

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', endDate: '2024-03-31', monthlyAdvancePayment: '0' });
});

afterAll(async () => {
	for (const id of statements) await deleteStatement(id);
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

async function invoice(values: Partial<typeof invoices.$inferInsert> = {}) {
	const [caretaker] = await db.select().from(categories).where(eq(categories.name, 'Caretaker'));
	const [row] = await db
		.insert(invoices)
		.values({
			buildingId: rental.building,
			categoryId: caretaker.id,
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

async function statement() {
	const created = await generateStatement({
		contractId: rental.contract,
		buildingId: rental.building,
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31',
		managementFeePercent: 0
	});
	statements.push(created.id);
	return created;
}

// The invoices of the period the statement does not bill as they are now
const changed = async (id: string) =>
	((await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as { invoiceIds: string[] }).invoiceIds;

const clear = () => db.delete(invoices).where(eq(invoices.buildingId, rental.building));

describe('Rechnungen einer Abrechnungsposition', () => {
	it('speichert zu jeder Position die abgerechneten Rechnungen mit Betrag und Tagen in der Periode', async () => {
		await clear();
		const first = await invoice();
		const second = await invoice({ amount: '400.00', servicePeriodStart: '2024-07-01', servicePeriodEnd: '2025-06-30', invoiceDate: '2024-07-05' });

		const { lineItems } = await statement();

		expect(lineItems).toHaveLength(1);
		expect(lineItems[0].invoices).toEqual([
			{ id: second, description: `Hauswart ${token}`, amount: 201.64, start: '2024-07-01', end: '2024-12-31' },
			{ id: first, description: `Hauswart ${token}`, amount: 732, start: '2024-01-01', end: '2024-12-31' }
		]);
	});
});

describe('Geänderte Rechnungen seit der Abrechnung', () => {
	it('meldet nichts, solange die Rechnungen der Periode unverändert sind', async () => {
		await clear();
		await invoice();
		const { id } = await statement();
		expect(await changed(id)).toEqual([]);
	});

	it('meldet eine danach erfasste Rechnung der Periode', async () => {
		await clear();
		await invoice();
		const { id } = await statement();
		const later = await invoice({ amount: '100.00' });
		expect(await changed(id)).toEqual([later]);
	});

	it('meldet eine danach geänderte Rechnung wie eine neue', async () => {
		await clear();
		const billed = await invoice();
		const { id } = await statement();
		await sendJson('PUT', `/api/v1/invoices/${billed}`, { amount: '800.00' });
		expect(await changed(id)).toEqual([billed]);
	});

	it('meldet eine Rechnung, die danach einer anderen Kategorie zugeordnet wurde', async () => {
		await clear();
		const billed = await invoice();
		const { id } = await statement();
		const [water] = await db.select().from(categories).where(eq(categories.name, 'Water'));
		await db.update(invoices).set({ categoryId: water.id }).where(eq(invoices.id, billed));
		expect(await changed(id)).toEqual([billed]);
	});

	it('meldet eine abgerechnete Rechnung, die danach gelöscht wurde', async () => {
		await clear();
		const billed = await invoice();
		const { id } = await statement();
		await db.delete(invoices).where(eq(invoices.id, billed));
		expect(await changed(id)).toEqual([billed]);
	});

	// Before #96 a statement kept no invoices: what changed since is not known
	it('meldet nichts bei einer Abrechnung ohne gespeicherte Rechnungen', async () => {
		await clear();
		await invoice();
		const { id, lineItems } = await statement();
		await db.update(utilityStatementLineItems).set({ invoices: null }).where(eq(utilityStatementLineItems.id, lineItems[0].id));
		await invoice({ amount: '100.00' });
		expect(await changed(id)).toEqual([]);
	});
});

describe('Abrechnungen einer Rechnung', () => {
	type Periods = { billedIn: { start: string; end: string }[]; missedIn: { start: string; end: string }[] };
	const periodsOf = async (invoiceId: string) =>
		(await (await callApi(`/api/v1/invoices/${invoiceId}/statements`)).json()) as Periods;
	const year = { start: '2024-01-01', end: '2024-12-31' };

	it('nennt die Periode einer Abrechnung, die die Rechnung so abrechnet', async () => {
		await clear();
		const billed = await invoice();
		await statement();
		expect(await periodsOf(billed)).toEqual({ billedIn: [year], missedIn: [] });
	});

	it('nennt die Periode einer Abrechnung ohne die Rechnung als verpasst', async () => {
		await clear();
		await statement();
		const later = await invoice();
		expect(await periodsOf(later)).toEqual({ billedIn: [], missedIn: [year] });
	});

	// abgerechnet mit dem früheren Stand: beide Hinweise
	it('nennt bei einer danach geänderten Rechnung die Periode als abgerechnet und als verpasst', async () => {
		await clear();
		const billed = await invoice();
		await statement();
		await sendJson('PUT', `/api/v1/invoices/${billed}`, { amount: '800.00' });
		expect(await periodsOf(billed)).toEqual({ billedIn: [year], missedIn: [year] });
	});

	it('nennt bei einer nicht umlagefähigen Rechnung keine verpasste Periode', async () => {
		await clear();
		await statement();
		const excluded = await invoice({ isValidUtilityCost: false });
		expect(await periodsOf(excluded)).toEqual({ billedIn: [], missedIn: [] });
	});
});
