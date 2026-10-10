/**
 * Heating oil counts by consumption, not by purchase (real PostgreSQL database):
 * heating costs = stock at the start + purchases − stock at the end.
 * A reading "am 31.12.2024" closes 2024 and opens 2025.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices } from '../db/schema';
import { calculateStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;

const stocks = () => `/api/v1/buildings/${rental.building}/fuel-stocks`;
const record = (readingDate: string, amount: string) => sendJson('POST', stocks(), { readingDate, amount });

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
	const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
	await insertInvoice(rental.building, { categoryId: heating.id, amount: '3000.00', invoiceDate: '2024-05-10', description: 'Heizöl' });
	await record('2023-12-31', '2000.00');
	await record('2024-12-31', '500.00');
	await record('2025-12-31', '100.00');
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

const heatingLine = async (year: number) =>
	(
		await calculateStatement({
			contractId: rental.contract,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`,
			managementFeePercent: 0
		})
	).lineItems.find((line) => line.description === 'Heating');

describe('Tankbestand', () => {
	it('rechnet das verbrauchte Heizöl ab: Anfangsbestand + Einkauf − Endbestand', async () => {
		expect((await heatingLine(2024))?.totalBuildingAmount).toBe(2000 + 3000 - 500);
	});

	it('rechnet den Verbrauch aus dem Tank auch in einem Jahr ohne Einkauf ab', async () => {
		expect((await heatingLine(2025))?.totalBuildingAmount).toBe(400);
	});

	it('lässt den Tankbestand weg, solange ein Stichtag fehlt', async () => {
		expect(await heatingLine(2023)).toBeUndefined();
	});

	it('listet die Stichtage des Gebäudes und lehnt einen negativen Bestand und einen doppelten Stichtag ab', async () => {
		const list = (await (await callApi(stocks())).json()) as { readingDate: string; amount: string }[];

		expect(list.map((stock) => [stock.readingDate, stock.amount])).toEqual([
			['2023-12-31', '2000.00'],
			['2024-12-31', '500.00'],
			['2025-12-31', '100.00']
		]);
		expect((await record('2026-12-31', '-1')).status).toBe(422);
		expect((await record('2024-12-31', '700.00')).status).toBe(409);
	});

	it('löscht einen Stichtag', async () => {
		const id = ((await (await record('2026-06-30', '50.00')).json()) as { id: string }).id;

		expect((await sendJson('DELETE', `${stocks()}/${id}`)).status).toBe(204);
		expect(((await (await callApi(stocks())).json()) as unknown[]).length).toBe(3);
	});
});
