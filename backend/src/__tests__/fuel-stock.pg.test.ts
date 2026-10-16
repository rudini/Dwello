/**
 * Heating oil counts by consumption, not by purchase (real PostgreSQL database):
 * heating costs = stock at the start + purchases − stock at the end.
 * A reading "am 31.12.2024" closes 2024 and opens 2025.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, invoices } from '../db/schema';
import { calculateStatement } from '../services/statement.service';
import { checkBuildingInvoices } from '../services/invoice-completeness.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let tankOnly: Awaited<ReturnType<typeof createRental>>;
let noTank: Awaited<ReturnType<typeof createRental>>;
let heating: string;
let caretaker: string;

const stocks = (building = rental.building) => `/api/v1/buildings/${building}/fuel-stocks`;
const record = (readingDate: string, amount: string, building = rental.building, categoryId = heating) =>
	sendJson('POST', stocks(building), { readingDate, amount, categoryId });

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
	tankOnly = await createRental(`${token}-tank`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
	noTank = await createRental(`${token}-none`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
	[{ id: heating }] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
	[{ id: caretaker }] = await db.select().from(categories).where(eq(categories.name, 'Caretaker'));
	await insertInvoice(rental.building, { categoryId: heating, amount: '3000.00', invoiceDate: '2024-05-10', description: 'Heizöl' });
	// recorded from the start of 2024, so the check compares 2025 with 2024
	await insertInvoice(rental.building, { invoiceDate: '2024-01-15' });
	await record('2023-12-31', '2000.00');
	await record('2024-12-31', '500.00');
	await record('2025-12-31', '100.00');
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await db.delete(invoices).where(eq(invoices.buildingId, noTank.building));
	await rental.remove();
	await tankOnly.remove();
	await noTank.remove();
});

const linesOf = async (contractId: string, year: number) =>
	(
		await calculateStatement({ contractId, periodStart: `${year}-01-01`, periodEnd: `${year}-12-31`, managementFeePercent: 0 })
	).lineItems;
const heatingLine = async (year: number) => (await linesOf(rental.contract, year)).find((line) => line.description === 'Heating');
const findings = async (building: string, year: number) =>
	(await checkBuildingInvoices(building, { start: `${year}-01-01`, end: `${year}-12-31` })).findings;

describe('Tankbestand', () => {
	it('rechnet das verbrauchte Heizöl ab: Anfangsbestand + Einkauf − Endbestand', async () => {
		expect((await heatingLine(2024))?.totalBuildingAmount).toBe(2000 + 3000 - 500);
	});

	it('rechnet den Verbrauch aus dem Tank auch in einem Jahr ohne Einkauf ab', async () => {
		expect((await heatingLine(2025))?.totalBuildingAmount).toBe(400);
	});

	// Öl erst später gekauft: der Verbrauch aus dem Starttank zählt trotzdem
	it('rechnet den Verbrauch in der Kategorie des Tankbestands ab, auch ohne jede Heizungsrechnung', async () => {
		await record('2024-12-31', '900.00', tankOnly.building);
		await record('2025-12-31', '300.00', tankOnly.building);

		expect(await linesOf(tankOnly.contract, 2025)).toMatchObject([{ categoryId: heating, totalBuildingAmount: 600 }]);
	});

	it('lässt den Tankbestand weg, solange ein Stichtag fehlt', async () => {
		expect(await heatingLine(2023)).toBeUndefined();
	});

	it('meldet in der Prüfung den fehlenden Stichtag, damit die Abrechnung nicht still nach Einkauf rechnet', async () => {
		expect(await findings(rental.building, 2026)).toContainEqual(
			expect.objectContaining({ kind: 'stock', categoryId: heating, missingParts: [{ start: '2026-12-31', end: '2026-12-31' }] })
		);
	});

	it('vergleicht in der Prüfung den Verbrauch, nicht den Einkauf', async () => {
		// 2025 ohne Einkauf: kein «Keine Rechnung in dieser Kategorie»
		expect((await findings(rental.building, 2025)).filter((f) => f.categoryId === heating)).toEqual([
			expect.objectContaining({ kind: 'deviation', current: { count: 0, total: 400 }, previous: { count: 1, total: 4500 } })
		]);
	});

	// Erste Abrechnung mit Dwello: noch kein Stand erfasst, vielleicht heizt das Gebäude mit Öl
	it('fragt bei Heizkosten ohne jeden Tankbestand, ob das Gebäude mit Öl oder Pellets heizt', async () => {
		await insertInvoice(noTank.building, { categoryId: heating, amount: '2000.00', invoiceDate: '2025-05-10' });

		expect(await findings(noTank.building, 2025)).toContainEqual(expect.objectContaining({ kind: 'tank', categoryId: heating }));
		expect((await findings(tankOnly.building, 2025)).map((f) => f.kind)).not.toContain('tank');
	});

	// Tank stillgelegt (z.B. Wechsel auf Fernwärme): spätere Perioden brauchen keinen Stand mehr
	it('verlangt keinen Stand für eine Periode nach dem letzten Stand', async () => {
		expect((await findings(rental.building, 2029)).map((f) => f.kind)).not.toContain('stock');
	});

	// Ein Schlüssel, der erst nach der Periode gilt, ändert eine ältere Abrechnung nicht
	it('verteilt den Verbrauch nach dem Schlüssel der letzten Rechnung bis zum Ende der Periode', async () => {
		const [perUnit] = await db.select().from(distributionKeys).where(eq(distributionKeys.name, 'Per Unit'));
		await insertInvoice(rental.building, { categoryId: heating, distributionKeyId: perUnit.id, amount: '100.00', invoiceDate: '2027-02-01' });

		expect((await linesOf(rental.contract, 2025)).filter((line) => line.categoryId === heating)).toMatchObject([
			{ distributionKeyName: 'Per Area (m²)', totalBuildingAmount: 400 }
		]);
	});

	it('meldet einen negativen Verbrauch', async () => {
		await record('2026-12-31', '5000.00');

		expect(await findings(rental.building, 2026)).toContainEqual(
			expect.objectContaining({ kind: 'stock', missingParts: [], current: { count: 0, total: -4900 } })
		);
	});
});

describe('Tankbestand über die API', () => {
	it('listet die Stichtage des Gebäudes', async () => {
		const list = (await (await callApi(stocks())).json()) as { readingDate: string; amount: string; categoryId: string }[];

		expect(list.slice(0, 3).map((stock) => [stock.readingDate, stock.amount, stock.categoryId])).toEqual([
			['2023-12-31', '2000.00', heating],
			['2024-12-31', '500.00', heating],
			['2025-12-31', '100.00', heating]
		]);
	});

	it('lehnt ungültige Angaben ab', async () => {
		expect((await record('2027-12-31', '-1')).status).toBe(422);
		expect((await record('2027-02-30', '10.00')).status).toBe(400);
		expect((await record('2027-12-31', '10.00', rental.building, caretaker)).status).toBe(400);
		expect((await record('2024-12-31', '700.00')).status).toBe(409);
		expect((await callApi(stocks(crypto.randomUUID()))).status).toBe(404);
		expect((await sendJson('DELETE', `${stocks()}/not-a-uuid`)).status).toBe(422);
	});

	it('löscht einen Stichtag', async () => {
		const id = ((await (await record('2027-06-30', '50.00')).json()) as { id: string }).id;

		expect((await sendJson('DELETE', `${stocks()}/${id}`)).status).toBe(204);
		expect((await sendJson('DELETE', `${stocks()}/${id}`)).status).toBe(404);
	});

	// Der Kaminfeger wird nach dem Heizprofil verteilt, ist aber kein Brennstoff
	it('lehnt den Kaminfeger als Kategorie des Tanks ab', async () => {
		const [chimney] = await db.select().from(categories).where(eq(categories.name, 'Chimney Sweep'));

		expect((await record('2028-12-31', '10.00', noTank.building, chimney.id)).status).toBe(400);
	});

	// OR 257a: wird die Kategorie später nicht umlagefähig, trägt der Mieter auch den Verbrauch aus dem Tank nicht
	it('rechnet den Tankbestand einer Kategorie nicht ab, die nicht mehr umlagefähig ist', async () => {
		const [own] = await db.insert(categories).values({ name: `Holz ${token}`, nameDE: `Holz ${token}`, isHeatingCost: true }).returning();
		const wood = await createRental(`${token}-wood`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await record('2024-12-31', '900.00', wood.building, own.id);
		await record('2025-12-31', '300.00', wood.building, own.id);
		await db.update(categories).set({ isAllowedUtilityCost: false }).where(eq(categories.id, own.id));

		expect(await linesOf(wood.contract, 2025)).toEqual([]);
		await wood.remove();
		await db.delete(categories).where(eq(categories.id, own.id));
	});

	// #74: eine von Hand umlagefähig markierte Ölrechnung brächte sonst den Einkauf statt des Verbrauchs in die Abrechnung
	it('rechnet in einer nicht umlagefähigen Tankkategorie weder Einkauf noch Verbrauch ab, auch wenn das Formular die Rechnung umlagefähig schickt', async () => {
		const [own] = await db.insert(categories).values({ name: `Öl ${token}`, nameDE: `Öl ${token}`, isHeatingCost: true }).returning();
		const oil = await createRental(`${token}-oil`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await record('2024-12-31', '900.00', oil.building, own.id);
		await record('2025-12-31', '300.00', oil.building, own.id);
		await sendJson('PUT', `/api/v1/categories/${own.id}`, { isAllowedUtilityCost: false });
		const purchase = await sendJson('POST', '/api/v1/invoices', {
			buildingId: oil.building,
			billingEntityName: `Ölhandel ${token}`,
			description: 'Heizöl',
			amount: '2000.00',
			invoiceDate: '2025-06-10',
			categoryId: own.id,
			isValidUtilityCost: true
		});

		expect(purchase.status).toBe(201);
		expect(await linesOf(oil.contract, 2025)).toEqual([]);
		await db.delete(invoices).where(eq(invoices.buildingId, oil.building));
		await oil.remove();
		await db.delete(categories).where(eq(categories.id, own.id));
	});

	// Ein Tank, eine Kategorie: sonst landet der Verbrauch still in einer anderen Kategorie (z.B. Kaminfeger)
	it('lehnt einen Stand in einer anderen Kategorie als die übrigen Stände des Gebäudes ab', async () => {
		const [pellets] = await db.insert(categories).values({ name: `Pellets B ${token}`, isHeatingCost: true }).returning();

		expect((await record('2028-12-31', '10.00', rental.building, pellets.id)).status).toBe(409);
		await db.delete(categories).where(eq(categories.id, pellets.id));
	});

	it('lehnt eine Kategorie ab, die nicht umlagefähig ist', async () => {
		const [owner] = await db
			.insert(categories)
			.values({ name: `Heizung Eigentümer ${token}`, isHeatingCost: true, isAllowedUtilityCost: false })
			.returning();

		expect((await record('2028-12-31', '10.00', noTank.building, owner.id)).status).toBe(400);
		await db.delete(categories).where(eq(categories.id, owner.id));
	});

	it('verhindert das Löschen einer Kategorie mit Tankbeständen', async () => {
		const [own] = await db
			.insert(categories)
			.values({ name: `Pellets ${token}`, nameDE: `Pellets ${token}`, isHeatingCost: true })
			.returning();
		await record('2027-12-31', '10.00', noTank.building, own.id);

		expect((await sendJson('DELETE', `/api/v1/categories/${own.id}`)).status).toBe(409);
	});
});
