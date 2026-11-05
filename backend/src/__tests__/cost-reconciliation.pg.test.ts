/**
 * #1126: the Kostenabstimmung of a building's period (real PostgreSQL database): the allocable invoices per
 * Abrechnungsposition against what the valid statements bill the tenants. Building with one apartment (70 m²), tenant
 * from 1.1. to 31.3.2024 (91 of 366 days), Abrechnungsperiode 2024.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { and, eq } from 'drizzle-orm';
import { db } from '../db/connection';
import {
	categories,
	distributionKeys,
	invoices,
	rentalContracts,
	utilityStatements
} from '../db/schema';
import type { reportPeriods, reportReconciliation } from '../services/cost-reconciliation.service';
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
		expect(await report()).toMatchObject({ drafts: 1, withoutStatement: 0, notUpToDate: [] });
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
			drafts: 0
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
