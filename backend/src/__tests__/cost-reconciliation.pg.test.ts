/**
 * #1126: the Kostenabstimmung of a building's period (real PostgreSQL database): the allocable invoices per
 * Abrechnungsposition against what the valid statements bill the tenants. Building with one apartment (70 m²), tenant
 * from 1.1. to 31.3.2024 (91 of 366 days), Abrechnungsperiode 2024.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	apartments,
	categories,
	distributionKeys,
	fuelStocks,
	invoices,
	rentalContracts,
	utilityStatements
} from '../db/schema';
import type { reportPeriods, reportReconciliation } from '../services/cost-reconciliation.service';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createContract, deleteContract } from '../services/contract.service';
import { generateStatement } from '../services/statement.service';
import { callApi } from './helpers/auth';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let caretakerId: string;
const statements: string[] = [];
const period = 'periodStart=2024-01-01&periodEnd=2024-12-31';

beforeAll(async () => {
	rental = await createRental(token, {
		startDate: '2024-01-01',
		endDate: '2024-03-31',
		monthlyAdvancePayment: '0'
	});
	caretakerId = (await db.select().from(categories).where(eq(categories.name, 'Caretaker')))[0].id;
});

afterAll(async () => {
	// a replaced statement cannot be deleted through the service; its berichtigte Abrechnung first
	for (const id of statements.reverse())
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
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

async function statement(managementFeePercent = 0) {
	const created = await generateStatement({
		contractId: rental.contract,
		buildingId: rental.building,
		periodStart: '2024-01-01',
		periodEnd: '2024-12-31',
		managementFeePercent
	});
	statements.push(created.id);
	return created;
}

type Report = Awaited<ReturnType<typeof reportReconciliation>>;
type Period = Awaited<ReturnType<typeof reportPeriods>>[number];
const report = async () =>
	(
		await callApi(`/api/v1/reports/reconciliation?buildingId=${rental.building}&${period}`)
	).json() as Promise<Report>;
const run = async (query = '') =>
	(
		await callApi(
			`/api/v1/statements/run-reconciliation?buildingId=${rental.building}&${period}${query}`
		)
	).json() as Promise<Report>;
const key = async (name: string) =>
	(await db.select().from(distributionKeys).where(eq(distributionKeys.name, name)))[0].id;

// the tests build on each other: one statement, then invoices and statements change
describe('Kostenabstimmung der Berichte', () => {
	let first: Awaited<ReturnType<typeof statement>>;
	let late: string;

	it('stellt die Kosten des Gebäudes pro Position dem Anteil der Mieter gegenüber; den Rest trägt der Vermieter', async () => {
		await invoice();
		first = await statement(3);
		// 732.00 × 91/366 = 182.00 for the tenant, the vacancy from April 550.00 for the landlord
		expect((await report()).positions).toEqual([
			expect.objectContaining({
				categoryId: caretakerId,
				buildingCosts: 732,
				tenants: 182,
				landlord: 550
			})
		]);
	});

	it('zählt die Positionen zusammen und nennt die Verwaltungspauschale getrennt', async () => {
		// 3 % of 182.00 = 5.46, not part of the comparison
		expect(await report()).toMatchObject({
			total: { buildingCosts: 732, tenants: 182, landlord: 550 },
			managementFee: 5.46
		});
	});

	it('zählt die Abrechnungen im Entwurf und die Mietverträge ohne Abrechnung', async () => {
		// PO 05.11.2026 (persona Sven 1126 P-2): the drafts named by their tenants, for links
		expect(await report()).toMatchObject({
			drafts: [{ id: first.id, tenantName: `Anna Keller ${token}` }],
			withoutStatement: 0,
			notUpToDate: []
		});
		// code review 1126-1 C-4: a sent statement is no draft
		await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, first.id));
		expect((await report()).drafts).toEqual([]);
		await db.update(utilityStatements).set({ status: 'draft' }).where(eq(utilityStatements.id, first.id));
	});

	// PO 05.11.2026, code review 1126-1 C-3: the preview counts the statement already created, once
	it('zählt in der Vorschau die schon erstellte Abrechnung einmal mit', async () => {
		expect((await run()).total.tenants).toBe(182);
	});

	it('nennt die nicht umlagefähigen Rechnungen getrennt, ohne dass die Abrechnung deshalb nicht aktuell ist', async () => {
		const [repairs] = await db.select().from(categories).where(eq(categories.name, 'Repairs'));
		await invoice({
			categoryId: repairs.id,
			isValidUtilityCost: false,
			amount: '100.00',
			invoiceDate: '2024-06-01'
		});
		// another building's period does not count: an invoice of 2025
		await invoice({
			categoryId: repairs.id,
			isValidUtilityCost: false,
			amount: '900.00',
			invoiceDate: '2025-01-10'
		});
		expect(await report()).toMatchObject({ nonAllocable: 100, notUpToDate: [] });
	});

	it('nennt eine Kategorie mit mehreren Verteilschlüsseln mit ihrem Schlüssel', async () => {
		late = await invoice({ amount: '366.00', distributionKeyId: await key('Per Unit') });
		const positions = (await report()).positions;
		expect(positions.map((p) => p.severalKeys)).toEqual([true, true]);
	});

	it('nennt die Abrechnungen, die seit dem Erstellen nicht mehr aktuell sind', async () => {
		expect((await report()).notUpToDate).toEqual([
			{ id: first.id, tenantName: `Anna Keller ${token}` }
		]);
	});

	it('zeigt eine Position, die keine Rechnung mehr hat, mit dem, was die Abrechnungen verrechnen', async () => {
		await db.delete(invoices).where(eq(invoices.id, late));
		await db
			.delete(invoices)
			.where(and(eq(invoices.buildingId, rental.building), eq(invoices.amount, '732.00')));
		// Fachreview 1126-1 M-1: the statements bill more than the invoices: the landlord's part is negative
		expect(await report()).toMatchObject({
			positions: [
				expect.objectContaining({
					categoryId: caretakerId,
					buildingCosts: 0,
					tenants: 182,
					landlord: -182
				})
			],
			total: { buildingCosts: 0, tenants: 182, landlord: -182 } // Fachreview 1126-2 V-9: it counts in the total
		});
	});

	it('zählt eine ersetzte Abrechnung nicht und nennt den Mietvertrag ohne Abrechnung', async () => {
		await invoice();
		await db
			.update(utilityStatements)
			.set({ status: 'replaced' })
			.where(eq(utilityStatements.id, first.id));
		expect(await report()).toMatchObject({
			total: { buildingCosts: 732, tenants: 0, landlord: 732 },
			withoutStatement: 1,
			drafts: []
		});
	});

	it('zählt einen Mietvertrag nicht, dessen Tage ausserhalb von Dwello abgerechnet sind', async () => {
		// Fachreview 1126-1 V-3: «Abgerechnet bis» leaves the contract no Mietstage in the period
		await db
			.update(rentalContracts)
			.set({ billedUntil: '2024-03-31' })
			.where(eq(rentalContracts.id, rental.contract));
		expect((await report()).withoutStatement).toBe(0);
		await db
			.update(rentalContracts)
			.set({ billedUntil: null })
			.where(eq(rentalContracts.id, rental.contract));
	});
});

describe('Kostenabstimmung der Vorschau', () => {
	it('zählt die Abrechnungen mit, die der Lauf erstellt', async () => {
		// the replaced statement does not count; the run bills the contract anew: 182.00, 3 % = 5.46
		expect(await run('&managementFeePercent=3')).toMatchObject({
			total: { buildingCosts: 732, tenants: 182, landlord: 550 },
			managementFee: 5.46
		});
	});
});

// #1138 (PO 06.11.2026): the apartments with Leerstand, each once with its vacant days, in both Kostenabstimmungen
describe('Leerstand der Kostenabstimmung', () => {
	it('nennt jede Wohnung mit ihren Tagen ohne Mietvertrag', async () => {
		// 2.01 is let 1.1. to 31.3.2024: vacant from 1.4., 275 of 366 days
		expect([(await report()).vacancies, (await run()).vacancies]).toEqual([
			[{ apartmentNumber: '2.01', days: 275 }],
			[{ apartmentNumber: '2.01', days: 275 }]
		]);
	});

	// Fachreview 1138-1 V-2, V-4: the gaps of one apartment summed; ordered as on the building page, floor by floor, by number
	it('zählt die Lücken einer Wohnung zusammen und nennt die Wohnungen nach Stockwerk und Nummer', async () => {
		const later = await createContract({
			apartmentId: rental.apartment,
			tenantId: rental.tenant,
			startDate: '2024-05-01',
			endDate: '2024-10-31',
			baseRent: '950',
			monthlyAdvancePayment: '0'
		});
		const added = [];
		for (const [number, floor] of [['10', 1], ['EG', 0], ['9', 1]] as const)
			added.push(await createApartment({ buildingId: rental.building, number, floor, area: '40', rooms: '2' }));
		const { vacancies } = await report();
		for (const apartment of added) await deleteApartment(apartment.id);
		await deleteContract(later.id, true);
		// 2.01: April 30 + November and December 61 = 91
		expect(vacancies).toEqual([
			{ apartmentNumber: 'EG', days: 366 },
			{ apartmentNumber: '9', days: 366 },
			{ apartmentNumber: '10', days: 366 },
			{ apartmentNumber: '2.01', days: 91 }
		]);
	});

	it('zählt die Tage ab «Aufgehoben ab» nicht als Leerstand', async () => {
		await db.update(apartments).set({ discontinuedFrom: '2024-07-01' }).where(eq(apartments.id, rental.apartment));
		const { vacancies } = await report();
		await db.update(apartments).set({ discontinuedFrom: null }).where(eq(apartments.id, rental.apartment));
		// April to June: 91 days
		expect(vacancies).toEqual([{ apartmentNumber: '2.01', days: 91 }]);
	});

	it('zählt die Tage bis «Abgerechnet bis» nicht als Leerstand', async () => {
		await db.update(rentalContracts).set({ billedUntil: '2024-03-31' }).where(eq(rentalContracts.id, rental.contract));
		const { vacancies } = await report();
		await db.update(rentalContracts).set({ billedUntil: null }).where(eq(rentalContracts.id, rental.contract));
		expect(vacancies).toEqual([{ apartmentNumber: '2.01', days: 275 }]);
	});
});

// #1138 (PO 06.11.2026): a position that includes the change of the Tankbestand names its Anfangs- and Endbestand
describe('Tankbestand der Kostenabstimmung', () => {
	it('nennt bei der Position mit Tankbestand den Anfangs- und den Endbestand, bei den anderen keinen', async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await db.insert(fuelStocks).values([
			{ buildingId: rental.building, readingDate: '2023-12-31', amount: '600.00', categoryId: heating.id },
			{ buildingId: rental.building, readingDate: '2024-12-31', amount: '100.00', categoryId: heating.id }
		]);
		const [ofReport, ofRun] = [await report(), await run()];
		await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, rental.building));
		const stocks = (body: Report) =>
			body.positions.map((p) => [p.categoryId, p.buildingCosts, p.fuelStock ?? null]);
		expect([stocks(ofReport), stocks(ofRun)]).toEqual([
			expect.arrayContaining([
				[heating.id, 500, { opening: 600, closing: 100 }],
				[caretakerId, expect.any(Number), null]
			]),
			expect.arrayContaining([[heating.id, 500, { opening: 600, closing: 100 }]])
		]);
	});

	// Fachreview 1138-1 V-1: a tank decommissioned, both readings 0, changes nothing to explain
	it('nennt keinen Tankbestand, wenn Anfangs- und Endbestand 0 sind', async () => {
		const [heating] = await db.select().from(categories).where(eq(categories.name, 'Heating'));
		await db.insert(fuelStocks).values([
			{ buildingId: rental.building, readingDate: '2023-12-31', amount: '0.00', categoryId: heating.id },
			{ buildingId: rental.building, readingDate: '2024-12-31', amount: '0.00', categoryId: heating.id }
		]);
		const { positions } = await report();
		await db.delete(fuelStocks).where(eq(fuelStocks.buildingId, rental.building));
		expect(positions.map((p) => p.fuelStock ?? null)).toEqual(positions.map(() => null));
	});
});

describe('Kostenabstimmung eines unbekannten Gebäudes', () => {
	it('wird mit BUILDING_NOT_FOUND abgelehnt', async () => {
		const unknown = crypto.randomUUID();
		for (const path of [`reports/reconciliation`, `statements/run-reconciliation`]) {
			const response = await callApi(`/api/v1/${path}?buildingId=${unknown}&${period}`);
			expect([response.status, ((await response.json()) as { code: string }).code]).toEqual([404, 'BUILDING_NOT_FOUND']);
		}
	});
});

describe('Perioden der Berichte', () => {
	const listed = async () =>
		(
			(await (await callApi('/api/v1/reports/reconciliations')).json()) as { periods: Period[] }
		).periods.filter((p) => p.buildingId === rental.building);

	it('nennt eine Periode nur mit einer gültigen Abrechnung', async () => {
		expect(await listed()).toEqual([]);
		await statement();
		expect(await listed()).toEqual([
			{
				buildingId: rental.building,
				buildingName: `Ahornhof ${token}`,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31'
			}
		]);
	});
});
