/**
 * Heating oil counts by consumption, not by purchase (real PostgreSQL database):
 * heating costs = stock at the start + purchases − stock at the end.
 * A reading "am 31.12.2024" closes 2024 and opens 2025.
 */

import { afterAll, beforeAll, describe, expect, it, setSystemTime } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { buildings, categories, distributionKeys, invoices } from '../db/schema';
import { calculateStatement } from '../services/statement.service';
import { checkBuildingInvoices } from '../services/invoice-completeness.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice, perAreaKey } from './helpers/records';
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

	// a time of the real UTC day, so Bun and PostgreSQL agree on it
	const onDay = async <T>(day: string, run: () => Promise<T>) => {
		setSystemTime(new Date(`${day}T12:00:00Z`));
		try {
			return await run();
		} finally {
			setSystemTime();
		}
	};

	it('meldet in der Prüfung den fehlenden Stichtag, damit die Abrechnung nicht still nach Einkauf rechnet', async () => {
		expect(await onDay('2027-01-01', () => findings(rental.building, 2026))).toContainEqual(
			expect.objectContaining({ kind: 'stock', categoryId: heating, missingParts: [{ start: '2026-12-31', end: '2026-12-31' }] })
		);
	});

	// Periode läuft noch: den Endbestand kann es noch nicht geben (#136)
	it('meldet keinen fehlenden Endbestand, dessen Stichtag nach heute liegt', async () => {
		expect((await onDay('2026-12-30', () => findings(rental.building, 2026))).map((f) => f.kind)).not.toContain('stock');
	});

	it('meldet einen fehlenden Anfangsbestand auch in einer laufenden Periode', async () => {
		const own = await createRental(`${token}-running`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await record('2024-12-31', '700.00', own.building);
		const found = await onDay('2026-06-30', () => findings(own.building, 2026));
		await own.remove();

		expect(found).toContainEqual(expect.objectContaining({ kind: 'stock', missingParts: [{ start: '2025-12-31', end: '2025-12-31' }] }));
	});

	// 2025 ohne Einkauf: kein «Keine Rechnung in dieser Kategorie»; beide Jahre mit Anfangs- und Endbestand:
	// ein Hinweis auf die Tankbestände (#73)
	it('vergleicht in der Prüfung den Verbrauch, nicht den Einkauf', async () => {
		expect((await findings(rental.building, 2025)).filter((f) => f.categoryId === heating)).toEqual([
			expect.objectContaining({ kind: 'consumption', current: { count: 0, total: 400 }, previous: { count: 1, total: 4500 }, changePercent: -91 })
		]);
	});

	// ein negativer Verbrauch im Vorjahr ist schon ein eigener Hinweis: kein Vergleich mit falschem Vorzeichen
	it('vergleicht den Verbrauch nur, wenn er in beiden Jahren über null liegt', async () => {
		const own = await createRental(`${token}-negative`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(own.building, { invoiceDate: '2023-01-15' });
		await insertInvoice(own.building, { categoryId: heating, amount: '1700.00', invoiceDate: '2024-05-10' });
		await record('2022-12-31', '100.00', own.building);
		await record('2023-12-31', '400.00', own.building);
		await record('2024-12-31', '100.00', own.building);
		const found = (await findings(own.building, 2024)).filter((f) => f.categoryId === heating);
		await db.delete(invoices).where(eq(invoices.buildingId, own.building));
		await own.remove();

		expect(found).toEqual([]);
	});

	// umgekehrt: ein negativer Verbrauch im Vorjahr taugt nicht als Vergleich für den Einkauf (fach-review V-16)
	it('vergleicht den Einkauf nicht mit einem negativen Verbrauch im Vorjahr', async () => {
		const own = await createRental(`${token}-before`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(own.building, { invoiceDate: '2023-01-15' });
		await record('2022-12-31', '100.00', own.building);
		await record('2023-12-31', '400.00', own.building);
		await insertInvoice(own.building, { categoryId: heating, amount: '1000.00', invoiceDate: '2024-05-10' });
		const found = (await findings(own.building, 2024)).filter((f) => f.categoryId === heating && f.kind !== 'stock');
		await db.delete(invoices).where(eq(invoices.buildingId, own.building));
		await own.remove();

		expect(found).toEqual([]);
	});

	// ohne Tankbestände im Vorjahr ist dessen Betrag der Einkauf, kein Verbrauch: die Prüfung vergleicht die Kosten
	it('vergleicht den Verbrauch nur mit einem Vorjahr, das Anfangs- und Endbestand hat', async () => {
		expect((await findings(rental.building, 2024)).filter((f) => f.categoryId === heating).map((f) => f.kind)).not.toContain('consumption');
	});

	// Erste Abrechnung mit Dwello: noch kein Stand erfasst, vielleicht heizt das Gebäude mit Öl
	it('fragt bei Heizkosten ohne jeden Tankbestand, ob das Gebäude mit Öl oder Pellets heizt', async () => {
		await insertInvoice(noTank.building, { categoryId: heating, amount: '2000.00', invoiceDate: '2025-05-10' });

		expect(await findings(noTank.building, 2025)).toContainEqual(expect.objectContaining({ kind: 'tank', categoryId: heating }));
		expect((await findings(tankOnly.building, 2025)).map((f) => f.kind)).not.toContain('tank');
	});

	// Ein vergessener Tankbestand fällt auf: das Gebäude hatte Tankbestände und ist nicht als ohne Tank festgehalten (#72)
	it('meldet die fehlenden Stände einer Periode nach dem letzten Stand', async () => {
		expect(await onDay('2030-01-15', () => findings(rental.building, 2029))).toContainEqual(
			expect.objectContaining({
				kind: 'stock',
				categoryId: heating,
				missingParts: [
					{ start: '2028-12-31', end: '2028-12-31' },
					{ start: '2029-12-31', end: '2029-12-31' }
				]
			})
		);
	});

	// Tank stillgelegt (z.B. Wechsel auf Fernwärme): spätere Perioden brauchen keinen Stand mehr (#72)
	it('verlangt keinen Stand, wenn das Gebäude ohne Tank oder mit stillgelegtem Tank festgehalten ist', async () => {
		const own = await createRental(`${token}-decommissioned`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await record('2024-12-31', '700.00', own.building);
		await db.update(buildings).set({ noTank: true }).where(eq(buildings.id, own.building));
		await insertInvoice(own.building, { categoryId: heating, amount: '2000.00', invoiceDate: '2026-05-10' });
		const found = (await findings(own.building, 2026)).map((f) => f.kind);
		await db.delete(invoices).where(eq(invoices.buildingId, own.building));
		await own.remove();

		expect(found).not.toContain('stock');
		expect(found).not.toContain('tank');
	});

	// im Jahr der Stilllegung zählt noch der Verbrauch: der Endbestand fehlt (fach-review V-1)
	it('verlangt den Endbestand einer Periode mit Anfangsbestand, auch wenn der Tank stillgelegt ist', async () => {
		const own = await createRental(`${token}-last-year`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await record('2023-12-31', '700.00', own.building);
		await db.update(buildings).set({ noTank: true }).where(eq(buildings.id, own.building));
		const found = await findings(own.building, 2024);
		await own.remove();

		expect(found).toContainEqual(expect.objectContaining({ kind: 'stock', missingParts: [{ start: '2024-12-31', end: '2024-12-31' }] }));
	});

	// der Endbestand 0 des Stilllegungsjahres ist der Anfangsbestand des nächsten: dort braucht es keinen mehr (fach-review V-11)
	it('verlangt nach dem Jahr der Stilllegung keinen Tankbestand mehr', async () => {
		const own = await createRental(`${token}-after`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await record('2023-12-31', '700.00', own.building);
		await record('2024-12-31', '0.00', own.building);
		await db.update(buildings).set({ noTank: true }).where(eq(buildings.id, own.building));
		const found = (await findings(own.building, 2025)).map((f) => f.kind);
		await own.remove();

		expect(found).not.toContain('stock');
	});

	// ein negativer Verbrauch ist ein eigener Hinweis, auch wenn das Vorjahr nur Einkauf hat (fach-review V-12)
	it('vergleicht einen negativen Verbrauch nicht mit dem Einkauf des Vorjahres', async () => {
		const own = await createRental(`${token}-mixed`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await insertInvoice(own.building, { categoryId: heating, amount: '1000.00', invoiceDate: '2023-02-10' });
		await record('2023-12-31', '100.00', own.building);
		await record('2024-12-31', '400.00', own.building);
		const found = (await findings(own.building, 2024)).filter((f) => f.categoryId === heating).map((f) => f.kind);
		await db.delete(invoices).where(eq(invoices.buildingId, own.building));
		await own.remove();

		expect(found).toEqual(['consumption']);
	});

	it('fragt nicht nach dem Heizmaterial, wenn das Gebäude ohne Tank festgehalten ist', async () => {
		const own = await createRental(`${token}-district`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await db.update(buildings).set({ noTank: true }).where(eq(buildings.id, own.building));
		await insertInvoice(own.building, { categoryId: heating, amount: '2000.00', invoiceDate: '2025-05-10' });
		const found = (await findings(own.building, 2025)).map((f) => f.kind);
		await db.delete(invoices).where(eq(invoices.buildingId, own.building));
		await own.remove();

		expect(found).not.toContain('tank');
	});

	// Ein Schlüssel, der erst nach der Periode gilt, ändert eine ältere Abrechnung nicht
	it('verteilt den Verbrauch nach dem Schlüssel der letzten Rechnung bis zum Ende der Periode', async () => {
		const [perUnit] = await db.select().from(distributionKeys).where(eq(distributionKeys.name, 'Per Unit'));
		await insertInvoice(rental.building, { categoryId: heating, distributionKeyId: perUnit.id, amount: '100.00', invoiceDate: '2027-02-01' });

		expect((await linesOf(rental.contract, 2025)).filter((line) => line.categoryId === heating)).toMatchObject([
			{ distributionKeyName: 'Per Area (m²)', totalBuildingAmount: 400 }
		]);
	});

	// Fachreview 452-2 V-22: an invoice recorded before the key was required (#379) does not hide an older key
	it('nimmt den Schlüssel der letzten Rechnung, die einen hat', async () => {
		await insertInvoice(rental.building, { categoryId: heating, description: 'Ohne Schlüssel', amount: '0.00', invoiceDate: '2025-12-01' });
		await db.update(invoices).set({ distributionKeyId: null }).where(eq(invoices.description, 'Ohne Schlüssel'));
		try {
			// the stock's line; the invoice itself is a line of its own, without key
			const stock = (await linesOf(rental.contract, 2025)).filter((line) => line.categoryId === heating && line.totalBuildingAmount !== 0);
			expect(stock).toMatchObject([{ distributionKeyName: 'Per Area (m²)', totalBuildingAmount: 400 }]);
		} finally {
			await db.delete(invoices).where(eq(invoices.description, 'Ohne Schlüssel'));
		}
	});

	// ein Hinweis auf die Tankbestände, keine Bestätigung (#73); nur einer für die Kategorie
	it('meldet einen negativen Verbrauch', async () => {
		await record('2026-12-31', '5000.00');

		expect((await findings(rental.building, 2026)).filter((f) => f.categoryId === heating)).toEqual([
			expect.objectContaining({ kind: 'consumption', missingParts: [], changePercent: null, current: { count: 0, total: -4900 } })
		]);
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
		expect((await record('2027-12-31', '-1')).status).toBe(400);
		expect((await record('2027-02-30', '10.00')).status).toBe(400);
		expect((await record('2027-12-31', '10.00', rental.building, caretaker)).status).toBe(400);
		expect((await record('2027-12-31', '10.00', rental.building, '')).status).toBe(400);
		expect((await record('2024-12-31', '700.00')).status).toBe(409);
		expect((await callApi(stocks(crypto.randomUUID()))).status).toBe(404);
		expect((await sendJson('DELETE', `${stocks()}/not-a-uuid`)).status).toBe(404); // no UUID: no record
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

	// #100: eine eigene Heizkosten-Kategorie hat nur als Brennstoff einen Tankbestand, nicht wegen ihres Namens
	it.each([
		[false, 400],
		[true, 201]
	])('nimmt den Tankbestand einer eigenen Heizkosten-Kategorie nur als Brennstoff an (Brennstoff: %p)', async (isFuel, status) => {
		const own = (await (
			await sendJson('POST', '/api/v1/categories', {
				name: `Heizungsservice ${isFuel} ${token}`,
				isAllowedUtilityCost: true,
				isHeatingCost: true,
				isFuel
			})
		).json()) as { id: string };
		const building = await createRental(`${token}-own-${isFuel}`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });

		expect((await record('2028-12-31', '10.00', building.building, own.id)).status).toBe(status);
		await building.remove();
		await db.delete(categories).where(eq(categories.id, own.id));
	});

	// #100 (Fachreview V-2): ohne «Brennstoff» liesse sich der nächste Endbestand nicht erfassen, die Abrechnung nähme den Einkauf
	it.each([{ isFuel: false }, { isHeatingCost: false }])('lässt einer Kategorie mit Tankbestand «Brennstoff» (%j)', async (change) => {
		const [own] = await db
			.insert(categories)
			.values({ name: `Pellets ${Object.keys(change)[0]} ${token}`, isHeatingCost: true, isFuel: true, type: 'custom' })
			.returning();
		const pellets = await createRental(`${token}-pellets-${Object.keys(change)[0]}`, { startDate: '2023-01-01', monthlyAdvancePayment: '0' });
		await record('2024-12-31', '900.00', pellets.building, own.id);

		const response = await sendJson('PUT', `/api/v1/categories/${own.id}`, change);

		// 400, not 409: the form shows a 409 at the name, which is not what was refused
		expect(response.status).toBe(400);
		expect(((await response.json()) as { code: string }).code).toBe('CATEGORY_FUEL_HAS_STOCK');
		await pellets.remove();
		await db.delete(categories).where(eq(categories.id, own.id));
	});

	// OR 257a: wird die Kategorie später nicht umlagefähig, trägt der Mieter auch den Verbrauch aus dem Tank nicht
	it('rechnet den Tankbestand einer Kategorie nicht ab, die nicht mehr umlagefähig ist', async () => {
		const [own] = await db.insert(categories).values({ name: `Holz ${token}`, nameDE: `Holz ${token}`, isHeatingCost: true, isFuel: true }).returning();
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
		const [own] = await db.insert(categories).values({ name: `Öl ${token}`, nameDE: `Öl ${token}`, isHeatingCost: true, isFuel: true }).returning();
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
			distributionKeyId: await perAreaKey(),
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
		const [pellets] = await db.insert(categories).values({ name: `Pellets B ${token}`, isHeatingCost: true, isFuel: true }).returning();

		const refused = await record('2028-12-31', '10.00', rental.building, pellets.id);
		await db.delete(categories).where(eq(categories.id, pellets.id));

		expect(refused.status).toBe(409);
		expect(await refused.json()).toMatchObject({ code: 'FUEL_STOCK_OTHER_CATEGORY' });
	});

	it('lehnt eine Kategorie ab, die nicht umlagefähig ist', async () => {
		const [owner] = await db
			.insert(categories)
			.values({ name: `Heizung Eigentümer ${token}`, isHeatingCost: true, isFuel: true, isAllowedUtilityCost: false })
			.returning();

		expect((await record('2028-12-31', '10.00', noTank.building, owner.id)).status).toBe(400);
		await db.delete(categories).where(eq(categories.id, owner.id));
	});

	it('verhindert das Löschen einer Kategorie mit Tankbeständen', async () => {
		const [own] = await db
			.insert(categories)
			.values({ name: `Pellets ${token}`, nameDE: `Pellets ${token}`, isHeatingCost: true, isFuel: true })
			.returning();
		await record('2027-12-31', '10.00', noTank.building, own.id);

		expect((await sendJson('DELETE', `/api/v1/categories/${own.id}`)).status).toBe(409);
	});
});

// H-28 (#717): the checks of the Tankbestand form are the backend's, the value as typed
describe('Tankbestand erfassen', () => {
	// code review h28h C-1: also without a category to choose (none set up, or not loaded), the fields first
	it.each([['Kategorie gewählt'], ['ohne Kategorie']])('lehnt Stichtag und Betrag am Feld ab (%s)', async (chosen) => {
		const response = await record('', 'viel', rental.building, chosen === 'ohne Kategorie' ? '' : heating);

		expect(response.status).toBe(400);
		expect(((await response.json()) as { causes: unknown }).causes).toEqual([
			{ code: 'FUEL_STOCK_DATE_REQUIRED', params: { field: 'readingDate' } },
			{ code: 'FUEL_STOCK_AMOUNT_INVALID', params: { field: 'amount' } }
		]);
	});

	it('nimmt den Betrag, wie er getippt wird', async () => {
		const response = await record('2029-12-31', "2'650,5");
		const saved = (await response.json()) as { id: string; amount: string };
		await sendJson('DELETE', `${stocks()}/${saved.id}`);
		const whole = await record('2029-12-31', "1'450.-");
		const francs = (await whole.json()) as { id: string; amount: string };
		await sendJson('DELETE', `${stocks()}/${francs.id}`);

		expect(response.status).toBe(201);
		expect(saved.amount).toBe('2650.50');
		expect(francs.amount).toBe('1450.00');
	});

	it('nennt den Grund, wenn der Stichtag schon erfasst ist', async () => {
		const response = await record('2024-12-31', '700.00');

		expect(response.status).toBe(409);
		expect(await response.json()).toMatchObject({ code: 'FUEL_STOCK_DATE_TAKEN' });
	});
});
