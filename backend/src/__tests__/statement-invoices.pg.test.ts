/**
 * A statement keeps the invoices each position billed (#96), and what changed in its period since (real PostgreSQL
 * database). Building with one apartment (70 m²), tenant from 1.1. to 31.3.2024, Abrechnungsperiode 2024.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, fuelStocks, invoices, utilityStatementLineItems, utilityStatements } from '../db/schema';
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

// each test starts without invoices and statements
async function clear() {
	for (const id of statements.splice(0)) await deleteStatement(id);
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
}

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
		const [water] = await db.select().from(categories).where(eq(categories.name, 'Cold Water'));
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

	// The change of the Tankbestand is billed like an invoice but is none: it is never «deleted» (C-4)
	it('meldet nichts bei einer Abrechnung mit der Veränderung des Tankbestands', async () => {
		await clear();
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		for (const [readingDate, amount] of [['2023-12-31', '600.00'], ['2024-12-31', '100.00']])
			await sendJson('POST', `/api/v1/buildings/${rental.building}/fuel-stocks`, { readingDate, amount, categoryId: heating.id });
		try {
			const { id, lineItems } = await statement();
			expect(lineItems[0].invoices).toEqual([
				{ id: 'fuel-stock-2024-12-31', description: 'Veränderung Tankbestand', amount: 500, start: '2024-01-01', end: '2024-12-31', fuelStock: true }
			]);
			expect(await changed(id)).toEqual([]);
		} finally {
			await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, rental.building));
		}
	});

	// #454 (#408 point 8, #307): a Tankbestand of the period changed since counts like a changed invoice
	describe('Tankbestand der Periode', () => {
		const reading = async (readingDate: string, amount: string) => {
			const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
			await db.delete(fuelStocks).where(and(eq(fuelStocks.buildingId, rental.building), eq(fuelStocks.readingDate, readingDate)));
			await sendJson('POST', `/api/v1/buildings/${rental.building}/fuel-stocks`, { readingDate, amount, categoryId: heating.id });
		};
		const fuelStockChanged = async (id: string) =>
			((await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as { fuelStockChanged: boolean }).fuelStockChanged;
		const withReadings = async (check: () => Promise<void>) => {
			await clear();
			try {
				await check();
			} finally {
				await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, rental.building));
			}
		};

		it('meldet einen danach geänderten Tankbestand', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id } = await statement();
				expect(await fuelStockChanged(id)).toBe(false);
				await reading('2024-12-31', '200.00');
				expect(await fuelStockChanged(id)).toBe(true);
				expect(await changed(id)).toEqual([]);
			}));

		it('meldet nichts, wenn der Verbrauch gleich bleibt', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id } = await statement();
				await reading('2023-12-31', '700.00');
				await reading('2024-12-31', '200.00');
				expect(await fuelStockChanged(id)).toBe(false);
			}));

		// Fachreview 454-1 V-3: a statement from before migration 0014 keeps no invoices in its positions, but its Tankbestand
		// in utility_statements.fuel_stock
		it('meldet bei einer Abrechnung ohne gespeicherte Rechnungen keinen unveränderten Tankbestand', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id, lineItems } = await statement();
				for (const item of lineItems) await forget(item.id);
				expect(await fuelStockChanged(id)).toBe(false);
			}));

		// Fachreview 454-1 V-15
		it('meldet einen danach gelöschten Tankbestand', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id } = await statement();
				await db.delete(fuelStocks).where(and(eq(fuelStocks.buildingId, rental.building), eq(fuelStocks.readingDate, '2024-12-31')));
				expect(await fuelStockChanged(id)).toBe(true);
			}));

		it('meldet keinen Tankbestand, wenn der Mietvertrag die Heizkosten nicht vereinbart hat', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id } = await statement();
				await db.update(utilityStatements).set({ agreedCategoryIds: [] }).where(eq(utilityStatements.id, id));
				await reading('2024-12-31', '200.00');
				expect(await fuelStockChanged(id)).toBe(false);
			}));

		it('meldet einen Tankbestand, der nach der Abrechnung dazukam', () =>
			withReadings(async () => {
				const { id } = await statement();
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				expect(await fuelStockChanged(id)).toBe(true);
			}));
	});

	// Before #96 a statement kept no invoices: as before, the invoices recorded after it count (V-15)
	it('meldet bei einer Abrechnung ohne gespeicherte Rechnungen die danach erfassten', async () => {
		await clear();
		await invoice();
		const { id, lineItems } = await statement();
		await forget(lineItems[0].id);
		const later = await invoice({ amount: '100.00' });
		expect(await changed(id)).toEqual([later]);
	});
});

// a statement as it was stored before #96: without the invoices of its positions
const forget = (lineItemId: string) =>
	db.update(utilityStatementLineItems).set({ invoices: null }).where(eq(utilityStatementLineItems.id, lineItemId));

describe('Unbekannte Abrechnung oder Rechnung', () => {
	it('antwortet 404', async () => {
		const unknown = crypto.randomUUID();
		expect((await callApi(`/api/v1/statements/${unknown}/changed-invoices`)).status).toBe(404);
		expect((await callApi(`/api/v1/invoices/${unknown}/statements`)).status).toBe(404);
	});
});

describe('Abrechnungen einer Rechnung', () => {
	type Periods = {
		billedIn: { start: string; end: string }[];
		missedIn: { start: string; end: string }[];
		statements: { id: string; statementNumber: string; status: string }[];
	};
	const periodsOf = async (invoiceId: string) =>
		(await (await callApi(`/api/v1/invoices/${invoiceId}/statements`)).json()) as Periods;
	const year = { start: '2024-01-01', end: '2024-12-31' };

	it('nennt die Periode einer Abrechnung, die die Rechnung so abrechnet', async () => {
		await clear();
		const billed = await invoice();
		await statement();
		expect(await periodsOf(billed)).toMatchObject({ billedIn: [year], missedIn: [] });
	});

	// #455 (#263): abgerechnet heisst enthalten, gleich welchen Status die Abrechnung hat; jede mit Nummer und Status
	it('nennt jede Abrechnung, in der die Rechnung enthalten ist, mit Nummer und Status', async () => {
		await clear();
		const billed = await invoice();
		const { id, statementNumber } = await statement();
		expect((await periodsOf(billed)).statements).toEqual([{ id, statementNumber, status: 'draft' }]);
		await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, id));
		expect((await periodsOf(billed)).statements).toEqual([{ id, statementNumber, status: 'sent' }]);
		await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, id)); // deletable again
		const later = await invoice({ amount: '100.00' });
		expect((await periodsOf(later)).statements).toEqual([]);
	});

	it('nennt die Periode einer Abrechnung ohne die Rechnung als verpasst', async () => {
		await clear();
		await statement();
		const later = await invoice();
		expect(await periodsOf(later)).toMatchObject({ billedIn: [], missedIn: [year] });
	});

	// abgerechnet mit dem früheren Stand: beide Hinweise
	it('nennt bei einer danach geänderten Rechnung die Periode als abgerechnet und als verpasst', async () => {
		await clear();
		const billed = await invoice();
		await statement();
		await sendJson('PUT', `/api/v1/invoices/${billed}`, { amount: '800.00' });
		expect(await periodsOf(billed)).toMatchObject({ billedIn: [year], missedIn: [year] });
	});

	// M-2: abgerechnet und danach als nicht umlagefähig markiert: die Abrechnung verrechnet sie noch
	it('nennt bei einer abgerechneten, danach nicht umlagefähigen Rechnung die Periode als abgerechnet', async () => {
		await clear();
		const billed = await invoice();
		const { id } = await statement();
		await db.update(invoices).set({ isValidUtilityCost: false }).where(eq(invoices.id, billed));
		expect(await periodsOf(billed)).toMatchObject({ billedIn: [year], missedIn: [] });
		expect(await changed(id)).toEqual([billed]);
	});

	// Before #96: as before by the time the invoice was recorded (V-15)
	it('nennt bei Abrechnungen ohne gespeicherte Rechnungen die Perioden nach dem Zeitpunkt des Erfassens', async () => {
		await clear();
		const billed = await invoice();
		const { lineItems } = await statement();
		await forget(lineItems[0].id);
		const later = await invoice({ amount: '100.00' });
		expect(await periodsOf(billed)).toMatchObject({ billedIn: [year], missedIn: [] });
		expect(await periodsOf(later)).toMatchObject({ billedIn: [], missedIn: [year] });
	});

	it('nennt bei einer nicht umlagefähigen Rechnung keine verpasste Periode', async () => {
		await clear();
		await statement();
		const excluded = await invoice({ isValidUtilityCost: false });
		expect(await periodsOf(excluded)).toMatchObject({ billedIn: [], missedIn: [] });
	});
});
