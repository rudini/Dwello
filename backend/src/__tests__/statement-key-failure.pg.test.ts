/**
 * #1221 (decided by the product owner): a custom Verteilschlüssel that cannot be calculated for the apartments of the
 * building holds the run instead of splitting its invoices equally; the wizard's check names the invoices, generation
 * and «Neu berechnen» refuse (real PostgreSQL database)
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, distributionKeys, fuelStocks, heatingProfiles, invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let key: string;
const token = crypto.randomUUID();
const name = `Halbe Zimmer ${token}`;

beforeAll(async () => {
	// apartment 2.01 has 3.5 rooms: the formula divides by zero there; the four sample apartments all pass
	rental = await createRental(token, { startDate: '2025-01-01', monthlyAdvancePayment: '100' });
	const created = await sendJson('POST', '/api/v1/distribution-keys', { name, nameDE: name, formula: '1 / (({rooms} - 3.5) * ({rooms} - 3.5))' });
	expect(created.status).toBe(201); // saved: the formula passes the four sample apartments (#737)
	key = await idOf(created);
	await insertInvoice(rental.building, { distributionKeyId: key, billingEntityName: 'Garten AG', amount: '600.00', invoiceDate: '2025-05-31' });
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2025-03-31' });
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
	await db.delete(distributionKeys).where(eq(distributionKeys.id, key));
});

const run = { periodStart: '2025-01-01', periodEnd: '2025-12-31' };
// #1315 (product owner): the refusal names where the formula fails and why
const refusal = (invoices: string, failure: { reason: string; apartment?: string } = { reason: 'STATEMENT_KEY_REASON_DIVISION_BY_ZERO', apartment: '2.01' }) =>
	[
		'The distribution key cannot be calculated for the apartments of the building',
		'STATEMENT_KEY_NOT_CALCULABLE',
		{ key: name, building: `Ahornhof ${token}`, invoices, ...failure }
	] as const;

describe('Verteilschlüssel, der sich für das Gebäude nicht berechnen lässt', () => {
	it('nennt die Rechnungen in der Prüfung der Rechnungen und verweigert die Abrechnung, statt gleich zu verteilen', async () => {
		const check = await callApi(`/api/v1/invoices/completeness/${rental.building}?periodStart=${run.periodStart}&periodEnd=${run.periodEnd}`);
		expect(((await check.json()) as { uncalculableKeys: unknown }).uncalculableKeys).toEqual([
			expect.objectContaining({
				billingEntityName: 'Garten AG',
				invoiceDate: '2025-05-31',
				amount: '600.00',
				distributionKeyName: name,
				reason: 'STATEMENT_KEY_REASON_DIVISION_BY_ZERO', // #1315: the apartment where the formula fails, and why
				apartment: '2.01'
			})
		]);

		await expectRejection(
			await sendJson('POST', '/api/v1/statements/generate', { contractId: rental.contract, buildingId: rental.building, ...run }),
			400,
			...refusal('Garten AG, 31.05.2025, CHF 600.00')
		);
	});

	it('rechnet einen Entwurf nicht neu, sondern nennt Schlüssel und Rechnungen', async () => {
		const period = { periodStart: '2026-01-01', periodEnd: '2026-12-31' };
		await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2026-03-31' });
		const draft = await idOf(await sendJson('POST', '/api/v1/statements/generate', { contractId: rental.contract, buildingId: rental.building, ...period }));
		await insertInvoice(rental.building, { distributionKeyId: key, billingEntityName: 'Garten AG', amount: '300.00', invoiceDate: '2026-05-31' });

		await expectRejection(await sendJson('POST', `/api/v1/statements/${draft}/recalculation`, {}), 409, ...refusal('Garten AG, 31.05.2026, CHF 300.00'));
	});

	it('erstellt keine berichtigte Abrechnung, sondern nennt Schlüssel und Rechnungen', async () => {
		const period = { periodStart: '2027-01-01', periodEnd: '2027-12-31' };
		await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2027-03-31' });
		const sent = await idOf(await sendJson('POST', '/api/v1/statements/generate', { contractId: rental.contract, buildingId: rental.building, ...period }));
		await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'sent' });
		await sendJson('POST', `/api/v1/statements/${sent}/replace`, {});
		await insertInvoice(rental.building, { distributionKeyId: key, billingEntityName: 'Garten AG', amount: '150.00', invoiceDate: '2027-05-31' });

		await expectRejection(await sendJson('POST', `/api/v1/statements/${sent}/correction`, {}), 409, ...refusal('Garten AG, 31.05.2027, CHF 150.00'));
	});
});

// #1315 (product owner): the hint and the refusal say why the formula fails, for which apartment if it is one
describe('Grund, warum sich ein Verteilschlüssel nicht berechnen lässt', () => {
	const cases = [
		['negativ', '({rooms} - 3.5) * ({rooms} - 3.5) - 0.1', '2030', { reason: 'STATEMENT_KEY_REASON_NEGATIVE', apartment: '2.01' }],
		['null für alle', '({rooms} - 3.5) * ({rooms} - 3.5)', '2031', { reason: 'STATEMENT_KEY_REASON_ALL_ZERO' }]
	] as const;
	const keys: string[] = [];

	afterAll(async () => {
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		for (const id of keys) await db.delete(distributionKeys).where(eq(distributionKeys.id, id));
	});

	for (const [title, formula, year, failure] of cases)
		it(`nennt den Grund «${title}» in der Prüfung der Rechnungen und in der Weigerung`, async () => {
			const keyName = `${title} ${token}`;
			const created = await sendJson('POST', '/api/v1/distribution-keys', { name: keyName, nameDE: keyName, formula });
			expect(created.status).toBe(201); // the four sample apartments pass (#737)
			keys.push(await idOf(created));
			await insertInvoice(rental.building, { distributionKeyId: keys.at(-1), billingEntityName: 'Garten AG', amount: '100.00', invoiceDate: `${year}-05-31` });
			const period = { periodStart: `${year}-01-01`, periodEnd: `${year}-12-31` };

			const check = await callApi(`/api/v1/invoices/completeness/${rental.building}?periodStart=${period.periodStart}&periodEnd=${period.periodEnd}`);
			const [hinted] = ((await check.json()) as { uncalculableKeys: Record<string, unknown>[] }).uncalculableKeys;
			expect({ reason: hinted.reason, apartment: hinted.apartment }).toEqual({ apartment: null, ...failure });

			const response = await sendJson('POST', '/api/v1/statements/generate', { contractId: rental.contract, buildingId: rental.building, ...period });
			expect(response.status).toBe(400);
			expect(((await response.json()) as { params: unknown }).params).toEqual({
				key: keyName,
				building: `Ahornhof ${token}`,
				invoices: `Garten AG, 31.05.${year}, CHF 100.00`,
				...failure
			});
		});
});

// #1323: the change of the Tankbestand takes the key of the latest delivery up to the period end, also of an earlier
// period; that key holds the run like one of the period's invoices
describe('Verteilschlüssel der Veränderung des Tankbestands', () => {
	const other = crypto.randomUUID();
	let heated: Awaited<ReturnType<typeof createRental>>;
	const period = { periodStart: '2025-01-01', periodEnd: '2025-12-31' };

	beforeAll(async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		heated = await createRental(other, { startDate: '2024-01-01', monthlyAdvancePayment: '100' });
		await insertInvoice(heated.building, { categoryId: heating.id, distributionKeyId: key, billingEntityName: 'Öl AG', description: 'Heizöl', amount: '800.00', invoiceDate: '2024-10-15' });
		await insertInvoice(heated.building, { amount: '1200.00', invoiceDate: '2025-03-31' });
		for (const [readingDate, amount] of [['2024-12-31', '600.00'], ['2025-12-31', '100.00']])
			expect((await sendJson('POST', `/api/v1/buildings/${heated.building}/fuel-stocks`, { readingDate, amount, categoryId: heating.id })).status).toBe(201);
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, heated.contract));
		await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, heated.building));
		await db.delete(invoices).where(eq(invoices.buildingId, heated.building));
		await heated.remove();
	});

	// Fachreview 1309-1 V-2: a statement whose Veränderung Tankbestand was split equally is outdated like one of an invoice
	it('nennt eine versendete Abrechnung als zu berichtigen, wenn nur der Verteilschlüssel der Veränderung Tankbestand scheitert', async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		const [profile] = await db.select().from(heatingProfiles).limit(1);
		const later = { periodStart: '2026-01-01', periodEnd: '2026-12-31' };
		const formulaKey = `Später ${other}`;
		const changing = await idOf(await sendJson('POST', '/api/v1/distribution-keys', { name: formulaKey, nameDE: formulaKey, formula: '{rooms}' }));
		await insertInvoice(heated.building, { categoryId: heating.id, distributionKeyId: changing, billingEntityName: 'Öl AG', amount: '500.00', invoiceDate: '2025-12-20' });
		expect((await sendJson('POST', `/api/v1/buildings/${heated.building}/fuel-stocks`, { readingDate: '2026-12-31', amount: '50.00', categoryId: heating.id })).status).toBe(201);
		await insertInvoice(heated.building, { amount: '1200.00', invoiceDate: '2026-03-31' });
		const sent = await idOf(await sendJson('POST', '/api/v1/statements/generate', { contractId: heated.contract, buildingId: heated.building, ...later, heatingProfileId: profile.id }));
		await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'sent' });
		await sendJson('PUT', `/api/v1/distribution-keys/${changing}`, { formula: '1 / (({rooms} - 3.5) * ({rooms} - 3.5))' });

		const changes = (await (await callApi(`/api/v1/statements/${sent}/changed-invoices`)).json()) as Record<string, unknown>;
		await db.delete(utilityStatements).where(eq(utilityStatements.id, sent));
		await db.delete(invoices).where(eq(invoices.distributionKeyId, changing));
		await db.delete(distributionKeys).where(eq(distributionKeys.id, changing));
		expect(changes).toEqual(expect.objectContaining({ invoiceIds: [], fuelStockChanged: false, correctionDue: true, uncalculableKeys: [expect.objectContaining({ key: formulaKey })] }));
	});

	it('nennt die frühere Lieferung in der Prüfung der Rechnungen und verweigert die Abrechnung', async () => {
		const check = await callApi(`/api/v1/invoices/completeness/${heated.building}?periodStart=${period.periodStart}&periodEnd=${period.periodEnd}`);
		expect(((await check.json()) as { uncalculableKeys: unknown }).uncalculableKeys).toEqual([
			expect.objectContaining({ billingEntityName: 'Öl AG', invoiceDate: '2024-10-15', amount: '800.00', distributionKeyName: name, fuelStock: true })
		]);

		const [profile] = await db.select().from(heatingProfiles).limit(1);
		const response = await sendJson('POST', '/api/v1/statements/generate', { contractId: heated.contract, buildingId: heated.building, ...period, heatingProfileId: profile.id });
		expect(response.status).toBe(400);
		// Fachreview 1309-1: the refusal says the delivery of another period distributes the Veränderung Tankbestand
		expect(((await response.json()) as { params: unknown }).params).toEqual(
			expect.objectContaining({ key: name, invoices: 'Öl AG, 15.10.2024, CHF 800.00', fuelStock: 'STATEMENT_KEY_FUEL_STOCK', date: '2024-10-15' })
		);
	});
});

// #1309 (product owner): a statement with an invoice whose key cannot be calculated for the building is outdated, like
// one with changed invoices: a draft «nicht aktuell», a sent one to correct (before #1221 Dwello split it equally)
describe('Abrechnung mit einem Verteilschlüssel, der sich nicht (mehr) berechnen lässt', () => {
	let changing: string;
	let draft: string;
	let sent: string;
	const changingName = `Zimmer ${token}`;
	const changes = async (id: string) => (await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as Record<string, unknown>;

	beforeAll(async () => {
		changing = await idOf(await sendJson('POST', '/api/v1/distribution-keys', { name: changingName, nameDE: changingName, formula: '{rooms}' }));
		const generate = async (year: string) => {
			await insertInvoice(rental.building, { distributionKeyId: changing, billingEntityName: 'Garten AG', amount: '400.00', invoiceDate: `${year}-05-31` });
			return idOf(await sendJson('POST', '/api/v1/statements/generate', { contractId: rental.contract, buildingId: rental.building, periodStart: `${year}-01-01`, periodEnd: `${year}-12-31` }));
		};
		draft = await generate('2032');
		sent = await generate('2033');
		await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'sent' });
		// the formula passes the four sample apartments, but divides by zero for apartment 2.01
		expect((await sendJson('PUT', `/api/v1/distribution-keys/${changing}`, { formula: '1 / (({rooms} - 3.5) * ({rooms} - 3.5))' })).status).toBe(200);
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		await db.delete(distributionKeys).where(eq(distributionKeys.id, changing));
	});

	it('nennt beim Entwurf den Verteilschlüssel, ohne geänderte Rechnungen', async () => {
		expect(await changes(draft)).toEqual(
			expect.objectContaining({
				invoiceIds: [],
				uncalculableKeys: [
					{
						key: changingName,
						reason: 'STATEMENT_KEY_REASON_DIVISION_BY_ZERO',
						apartment: '2.01',
						// persona Anna 1309 P-1: the hint names the invoices to change
						invoices: [expect.objectContaining({ billingEntityName: 'Garten AG', invoiceDate: '2032-05-31', amount: '400.00' })]
					}
				]
			})
		);
	});

	it('nennt den Entwurf als nicht aktuell und die versendete Abrechnung als zu berichtigen in der Übersicht', async () => {
		const { statements } = (await (await callApi('/api/v1/statements/outdated')).json()) as { statements: { id: string }[] };

		expect(statements.map((s) => s.id)).toEqual(expect.arrayContaining([draft, sent]));
	});

	it('verlangt bei der versendeten Abrechnung das Berichtigen, ohne neu gerechneten Saldo und ohne «Nicht berichtigen»', async () => {
		expect(await changes(sent)).toEqual(
			expect.objectContaining({ uncalculableKeys: [expect.objectContaining({ key: changingName })], correctionDue: true, correctionDeclinable: false, recalculated: null })
		);
	});

	// Fachreview 1309-1 V-1: replacing first would leave it «Ersetzt» without a berichtigte Abrechnung
	it('ersetzt die versendete Abrechnung nicht, solange sich der Verteilschlüssel nicht berechnen lässt', async () => {
		const response = await sendJson('POST', `/api/v1/statements/${sent}/replace`, {});

		expect(response.status).toBe(409);
		expect(((await response.json()) as { code: string }).code).toBe('STATEMENT_KEY_NOT_CALCULABLE');
		const [statement] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, sent));
		expect(statement.status).toBe('sent');
	});
});

// Fachreview 1309-1 V-3: only what the statement bills counts, the categories its Mietvertrag agreed
describe('Verteilschlüssel einer nicht vereinbarten Kategorie', () => {
	const third = crypto.randomUUID();
	let lift: Awaited<ReturnType<typeof createRental>>;
	let changing: string;
	let draft: string;

	beforeAll(async () => {
		const [elevator] = await db.select().from(categories).where(eq(categories.name, 'Elevator'));
		lift = await createRental(third, { startDate: '2024-01-01', monthlyAdvancePayment: '100' });
		const keyName = `Lift ${third}`;
		changing = await idOf(await sendJson('POST', '/api/v1/distribution-keys', { name: keyName, nameDE: keyName, formula: '{rooms}' }));
		await insertInvoice(lift.building, { amount: '1200.00', invoiceDate: '2024-03-31' });
		await insertInvoice(lift.building, { categoryId: elevator.id, distributionKeyId: changing, amount: '400.00', invoiceDate: '2024-06-30' });
		await sendJson('PUT', `/api/v1/contracts/${lift.contract}/agreements`, { categoryId: elevator.id, agreed: false });
		draft = await idOf(await sendJson('POST', '/api/v1/statements/generate', { contractId: lift.contract, buildingId: lift.building, periodStart: '2024-01-01', periodEnd: '2024-12-31' }));
		await sendJson('PUT', `/api/v1/distribution-keys/${changing}`, { formula: '1 / (({rooms} - 3.5) * ({rooms} - 3.5))' });
	});

	afterAll(async () => {
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, lift.contract));
		await db.delete(invoices).where(eq(invoices.buildingId, lift.building));
		await lift.remove();
		await db.delete(distributionKeys).where(eq(distributionKeys.id, changing));
	});

	it('nennt den Entwurf nicht, wenn nur eine nicht vereinbarte Rechnung den Verteilschlüssel hat', async () => {
		const changes = (await (await callApi(`/api/v1/statements/${draft}/changed-invoices`)).json()) as Record<string, unknown>;

		expect(changes).toEqual(expect.objectContaining({ invoiceIds: [], uncalculableKeys: [] }));
	});
});
