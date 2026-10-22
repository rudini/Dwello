/**
 * #368 (#407 point 3): «Vereinbart ab», a category agreed in a Mietvertrag only from a day, e.g. introduced with the
 * official form (Art. 269d Abs. 3 OR); the statement bills it only for the contract's days from then, by the same rule
 * as the Mietstage (real PostgreSQL database)
 *
 * Apartment 2.01 alone in the building, caretaker invoice CHF 1000 and lift invoice CHF 366 by area, 2024 (366 days).
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
const ids: Record<string, string> = {};

const period = { periodStart: '2024-01-01', periodEnd: '2024-12-31' };
const preview = async () =>
	(await (await sendJson('POST', '/api/v1/statements/preview', { contractId: rental.contract, ...period, managementFeePercent: 0 })).json()) as {
		totalCosts: number;
		lineItems: { categoryId: string; tenantShare: number }[];
	};
const contract = async () =>
	(await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()) as { agreedCategoryIds: string[]; agreedFrom: Record<string, string> };
const answer = (body: Record<string, unknown>) => sendJson('PUT', `/api/v1/contracts/${rental.contract}/agreements`, body);

beforeAll(async () => {
	const named = await db.select().from(categories).where(inArray(categories.name, ['Caretaker', 'Elevator']));
	for (const category of named) ids[category.name] = category.id;
	rental = await createRental(token, { startDate: '2020-01-01', monthlyAdvancePayment: '0' });
	await insertInvoice(rental.building, { amount: '1000.00', invoiceDate: '2024-06-30' });
	await insertInvoice(rental.building, { categoryId: ids.Elevator, description: 'Lift 2024', amount: '366.00', invoiceDate: '2024-06-30' });
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Vereinbart ab', () => {
	it('rechnet eine ab einem Tag vereinbarte Kategorie nur für die Tage ab dann ab', async () => {
		expect((await answer({ categoryId: ids.Elevator, agreed: true, from: '2024-10-01' })).status).toBe(200);

		expect((await contract()).agreedFrom).toEqual({ [ids.Elevator]: '2024-10-01' });
		const { totalCosts, lineItems } = await preview();
		expect(lineItems.find((item) => item.categoryId === ids.Elevator)?.tenantShare).toBe(92); // 366 × 92 / 366
		expect(totalCosts).toBe(1092);
	});

	it('rechnet sie nicht ab, wenn der Tag nach dem Ende der Periode liegt', async () => {
		await answer({ categoryId: ids.Elevator, agreed: true, from: '2025-04-01' });

		const { totalCosts, lineItems } = await preview();
		expect(totalCosts).toBe(1000);
		expect(lineItems.map((item) => item.categoryId)).not.toContain(ids.Elevator);
	});

	it('speichert den Tag mit dem Mietvertrag und vergisst ihn bei «Nicht vereinbart»', async () => {
		const saved = await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, {
			agreedCategoryIds: [ids.Caretaker, ids.Elevator],
			agreedFrom: { [ids.Elevator]: '2024-07-01' }
		});

		expect(saved.status).toBe(200);
		expect((await contract()).agreedFrom).toEqual({ [ids.Elevator]: '2024-07-01' });
		expect((await preview()).totalCosts).toBe(1184); // 366 × 184 / 366

		await answer({ categoryId: ids.Elevator, agreed: false });
		expect((await contract()).agreedFrom).toEqual({});
	});

	it('hält die Tage mit der erstellten Abrechnung fest', async () => {
		await answer({ categoryId: ids.Elevator, agreed: true, from: '2024-10-01' });
		const created = await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			...period,
			managementFeePercent: 0
		});
		const { id } = (await created.json()) as { id: string };

		const [statement] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, id));
		expect(statement.agreedFrom).toEqual({ [ids.Elevator]: '2024-10-01' });
		expect(Number(statement.totalCosts)).toBe(1092);
	});

	it('lehnt einen Tag vor dem Vertragsbeginn ab', async () => {
		const refused = await answer({ categoryId: ids.Elevator, agreed: true, from: '2019-12-31' });

		expect(refused.status).toBe(400);
		expect(await refused.json()).toMatchObject({ code: 'AGREED_FROM_BEFORE_START' });
	});
});
