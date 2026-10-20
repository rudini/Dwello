/**
 * A statement keeps the invoices each position billed (#96), and what changed in its period since (real PostgreSQL
 * database). Building with one apartment (70 m²), tenant from 1.1. to 31.3.2024, Abrechnungsperiode 2024.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, fuelStocks, invoices, rentalContracts, utilityStatementLineItems, utilityStatements } from '../db/schema';
import { deleteStatement, generateStatement } from '../services/statement.service';
import { swissToday } from '../services/today';
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

		// PO 2026-10-20 (Fachreview 454-1 E-2, 454-2 V-16): the PDF prints the readings, not only their difference
		it('meldet andere Werte auch bei gleichem Verbrauch', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id } = await statement();
				await reading('2023-12-31', '700.00');
				await reading('2024-12-31', '200.00');
				expect(await fuelStockChanged(id)).toBe(true);
			}));

		// the Anfangsbestand is the Endbestand of the period before
		it('meldet einen danach geänderten Anfangsbestand', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id } = await statement();
				await reading('2023-12-31', '650.00');
				expect(await fuelStockChanged(id)).toBe(true);
			}));

		// a negative change (600 - 700 = -100.00) is a change as well
		it('meldet einen danach höheren Endbestand', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id } = await statement();
				await reading('2024-12-31', '700.00');
				expect(await fuelStockChanged(id)).toBe(true);
			}));

		it('meldet nichts bei denselben Werten', () =>
			withReadings(async () => {
				await reading('2023-12-31', '600.00');
				await reading('2024-12-31', '100.00');
				const { id } = await statement();
				await reading('2024-12-31', '100.00');
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
				// as created for a contract without agreed heating costs: no readings billed (agreedStock)
				await db.update(utilityStatements).set({ agreedCategoryIds: [], fuelStock: null }).where(eq(utilityStatements.id, id));
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

// #454 (#408 point 7), PO 2026-10-20 (Fachreview 454-1 E-3, E-6): a sent statement is due for correcting only when
// recalculating it changes this contract's Saldo or a position; «Nicht berichtigen» leaves it as it is until a change
// after that changes them again
describe('Abrechnung berichtigen fällig', () => {
	const due = async (id: string) =>
		((await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as { correctionDue: boolean }).correctionDue;
	const decline = (id: string) => sendJson('POST', `/api/v1/statements/${id}/decline-correction`, {});
	const sent = async (check: (id: string) => Promise<void>) => {
		await clear();
		const { id } = await statement();
		await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, id));
		try {
			await check(id);
		} finally {
			await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, id)); // deletable again
		}
	};

	it('ist fällig, wenn das Neuberechnen den Anteil des Mieters ändert', () =>
		sent(async (id) => {
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			expect(await due(id)).toBe(true);
		}));

	it('ist nicht fällig, wenn die Rechnung keine Mietstage des Mietvertrags trifft', () =>
		sent(async (id) => {
			await invoice({ amount: '100.00', invoiceDate: '2024-12-15', servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' });
			expect(await changed(id)).toHaveLength(1);
			expect(await due(id)).toBe(false);
		}));

	// a sent statement whose Zahlungsfrist passed reads «Überfällig» (computed from the deadline)
	it('ist auch bei einer überfälligen Abrechnung fällig', () =>
		sent(async (id) => {
			await db.update(utilityStatements).set({ paymentDeadline: '2025-01-31' }).where(eq(utilityStatements.id, id));
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			expect(await due(id)).toBe(true);
		}));

	// Fachreview 454-2 V-23: also an erledigte Abrechnung (#448)
	it('ist auch bei einer erledigten Abrechnung fällig', () =>
		sent(async (id) => {
			await db.update(utilityStatements).set({ status: 'settled' }).where(eq(utilityStatements.id, id));
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			expect(await due(id)).toBe(true);
		}));

	// Fachreview 454-2 V-18: only with a change the hint names, not by other data a recalculation takes
	it('ist ohne geänderte Rechnung und ohne geänderten Tankbestand nicht fällig', () =>
		sent(async (id) => {
			await db.update(utilityStatements).set({ totalCosts: '1.00' }).where(eq(utilityStatements.id, id));
			expect(await due(id)).toBe(false);
		}));

	// a statement that cannot be recalculated any more (here the Mietvertrag starts after the period now): the hint
	// alone says to correct, as before #454
	it('ist fällig, wenn sich die Abrechnung nicht mehr neu berechnen lässt', () =>
		sent(async (id) => {
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			await db.update(rentalContracts).set({ startDate: '2025-01-01', endDate: null }).where(eq(rentalContracts.id, rental.contract));
			try {
				expect(await due(id)).toBe(true);
			} finally {
				await db.update(rentalContracts).set({ startDate: '2024-01-01', endDate: '2024-03-31' }).where(eq(rentalContracts.id, rental.contract));
			}
		}));

	it('ist bei einem Entwurf nie fällig', async () => {
		await clear();
		const { id } = await statement();
		await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
		expect(await due(id)).toBe(false);
	});

	it('ist nach «Nicht berichtigen» nicht mehr fällig, bis eine weitere Änderung den Saldo ändert', () =>
		sent(async (id) => {
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			const declined = await decline(id);
			expect(declined.status).toBe(200);
			expect(((await declined.json()) as { correctionDeclined: { on: string } }).correctionDeclined.on).toBe(swissToday());
			expect(await due(id)).toBe(false);
			await invoice({ amount: '50.00', invoiceDate: '2024-03-15' });
			expect(await due(id)).toBe(true);
		}));

	// Fachreview 454-2 V-21: a change back to what the statement billed makes it current again, not due
	it('ist nach «Nicht berichtigen» nicht fällig, wenn die Abrechnung wieder stimmt', () =>
		sent(async (id) => {
			const later = await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			expect((await decline(id)).status).toBe(200);
			await db.delete(invoices).where(eq(invoices.id, later));
			expect(await due(id)).toBe(false);
		}));

	// PO 2026-10-20 (Fachreview 454-2 M-3 B): «Nicht berichtigen» only when the Saldo would rise
	it('erlaubt «Nicht berichtigen» nur, wenn die Neuberechnung den Saldo erhöht', () =>
		sent(async (id) => {
			await db.update(utilityStatements).set({ balance: '9999.00' }).where(eq(utilityStatements.id, id));
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			const changes = (await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as { correctionDeclinable: boolean };
			expect(changes.correctionDeclinable).toBe(false);
			const refused = await decline(id);
			expect(refused.status).toBe(409);
			expect(((await refused.json()) as { code: string }).code).toBe('STATEMENT_CORRECTION_LOWERS_BALANCE');
		}));

	// Fachreview 454-3 V-35: a billed invoice deleted afterwards (a duplicate): the Saldo falls; V-32: the page says so
	it('meldet, dass die Neuberechnung nach einer gelöschten Rechnung den Saldo senkt', async () => {
		await clear();
		const billed = await invoice({ amount: '732.00', invoiceDate: '2024-02-15' });
		const { id } = await statement();
		await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, id));
		try {
			await db.delete(invoices).where(eq(invoices.id, billed));
			const changes = (await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as {
				correctionDue: boolean;
				correctionDeclinable: boolean;
				correctionLowers: boolean;
			};
			expect(changes).toMatchObject({ correctionDue: true, correctionDeclinable: false, correctionLowers: true });
			expect(((await (await decline(id)).json()) as { code: string }).code).toBe('STATEMENT_CORRECTION_LOWERS_BALANCE');
		} finally {
			await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, id));
		}
	});

	// Fachreview 454-3 V-31: not to be recalculated, the refusal says so, not that the Saldo falls
	it('verweigert «Nicht berichtigen», wenn sich die Abrechnung nicht neu berechnen lässt', () =>
		sent(async (id) => {
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			await db.update(rentalContracts).set({ startDate: '2025-01-01', endDate: null }).where(eq(rentalContracts.id, rental.contract));
			try {
				const refused = await decline(id);
				expect(refused.status).toBe(409);
				expect(((await refused.json()) as { code: string }).code).toBe('STATEMENT_CORRECTION_NOT_RECALCULABLE');
			} finally {
				await db.update(rentalContracts).set({ startDate: '2024-01-01', endDate: '2024-03-31' }).where(eq(rentalContracts.id, rental.contract));
			}
		}));

	// PO 2026-10-20 (Fachreview 454-3 V-30 A): also when the Saldo does not fall; a Saldo below CHF 5 counts as 0, but
	// in a Schlussabrechnung (#448): here a contract over the whole year, 4.00 before, 3.00 after
	it('erlaubt «Nicht berichtigen», wenn beide Saldi unter CHF 5 liegen', async () => {
		const whole = await createRental(`${token}-whole`, { startDate: '2024-01-01', monthlyAdvancePayment: '0' });
		const created = await generateStatement({
			contractId: whole.contract,
			buildingId: whole.building,
			periodStart: '2024-01-01',
			periodEnd: '2024-12-31',
			managementFeePercent: 0
		});
		try {
			await db.update(utilityStatements).set({ status: 'sent', balance: '4.00' }).where(eq(utilityStatements.id, created.id));
			await invoice({ buildingId: whole.building, amount: '3.00', invoiceDate: '2024-02-15' });
			const changes = (await (await callApi(`/api/v1/statements/${created.id}/changed-invoices`)).json()) as {
				correctionDue: boolean;
				correctionDeclinable: boolean;
				correctionLowers: boolean;
			};
			expect(changes).toMatchObject({ correctionDue: true, correctionDeclinable: true, correctionLowers: false });
		} finally {
			await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, created.id));
			await deleteStatement(created.id);
			await db.delete(invoices).where(eq(invoices.buildingId, whole.building));
			await whole.remove();
		}
	});

	it('erlaubt «Nicht berichtigen», wenn die Neuberechnung den Saldo erhöht', () =>
		sent(async (id) => {
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			const changes = (await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as { correctionDeclinable: boolean };
			expect(changes.correctionDeclinable).toBe(true);
		}));

	it('verweigert «Nicht berichtigen», wenn kein Berichtigen fällig ist', async () => {
		await clear();
		const { id } = await statement();
		const refused = await decline(id);
		expect(refused.status).toBe(409);
		expect(((await refused.json()) as { code: string }).code).toBe('STATEMENT_CORRECTION_NOT_DUE');
	});
});

// #454 (#408 point 7): for the Übersicht, the drafts with a change since and the sent or paid statements to correct
describe('Nicht aktuelle Abrechnungen', () => {
	type Outdated = { id: string; status: string; invoices: number; fuelStock: boolean; buildingId: string; periodEnd: string };
	const outdated = async (id: string) =>
		((await (await callApi('/api/v1/statements/outdated')).json()) as { statements: Outdated[] }).statements.find(
			(one) => one.id === id
		);

	it('nennt einen Entwurf mit einer danach erfassten Rechnung, mit Gebäude und Periode', async () => {
		await clear();
		const { id } = await statement();
		expect(await outdated(id)).toBeUndefined();
		await invoice({ amount: '100.00', invoiceDate: '2024-12-15', servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' });
		expect(await outdated(id)).toMatchObject({ status: 'draft', invoices: 1, fuelStock: false, buildingId: rental.building, periodEnd: '2024-12-31' });
	});

	it('nennt eine versendete Abrechnung nur, wenn ihr Berichtigen fällig ist', async () => {
		await clear();
		const { id } = await statement();
		await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, id));
		try {
			await invoice({ amount: '100.00', invoiceDate: '2024-12-15', servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' });
			expect(await outdated(id)).toBeUndefined();
			await invoice({ amount: '100.00', invoiceDate: '2024-02-15' });
			expect(await outdated(id)).toMatchObject({ status: 'sent', invoices: 2 });
		} finally {
			await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, id));
		}
	});
});
