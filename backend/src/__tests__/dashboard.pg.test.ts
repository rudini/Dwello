/**
 * Dashboard figures (real PostgreSQL database); compared before and after this test's records,
 * because the database holds other data as well
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, invoices, utilityStatements } from '../db/schema';
import { createApartment, deleteApartment } from '../services/apartment.service';
import { createContract, deleteContract } from '../services/contract.service';
import { updateStatementStatus } from '../services/statement.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { callApi } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';
import { daysAfter, swissToday } from '../services/today';

type Dashboard = {
	portfolio: Record<string, number>;
	financial: Record<string, number>;
	statements: Record<string, number>;
	recentActivity: { title: string; description: string; timestamp: string }[];
	buildingOccupancy: { buildingId: string; totalApartments: number; occupiedApartments: number; occupancyRate: number }[];
};

const day = (offset: number) => daysAfter(swissToday(), offset);
const token = crypto.randomUUID();
const dashboard = async () => (await (await callApi('/api/v1/dashboard')).json()) as Dashboard;

let rental: Awaited<ReturnType<typeof createRental>>; // apartment 2.01, rented since yesterday
const apartments: string[] = [];
let nextTenant: string;
let nextContract: string;
const statements: string[] = [];
let before: Dashboard;
let after: Dashboard;

async function statement(n: number, values: Partial<typeof utilityStatements.$inferInsert>) {
	const [created] = await db
		.insert(utilityStatements)
		.values({
			tenantId: rental.tenant,
			apartmentId: rental.apartment,
			contractId: rental.contract,
			statementNumber: `NK-${token}-${n}`,
			periodStart: `20${10 + n}-01-01`,
			periodEnd: `20${10 + n}-12-31`,
			statementDate: day(0),
			rentalDays: 365,
			rentalStart: `20${10 + n}-01-01`,
			rentalEnd: `20${10 + n}-12-31`,
			totalCosts: '0',
			totalAdvancePayments: '0',
			balance: '0',
			createdAt: new Date('2020-01-01'), // created long ago
			updatedAt: new Date(),
			...values
		})
		.returning();
	statements.push(created.id);
}

beforeAll(async () => {
	before = await dashboard();

	rental = await createRental(token, { startDate: day(-1), monthlyAdvancePayment: '150' });
	const relet = await createApartment({ buildingId: rental.building, number: '2.02', floor: 2, area: '50', rooms: '2.5' });
	const vacant = await createApartment({ buildingId: rental.building, number: '2.03', floor: 2, area: '40', rooms: '1.5' });
	apartments.push(relet.id, vacant.id);
	nextTenant = (await createTenant({ firstName: 'Ben', lastName: `Frei ${token}` })).id;
	nextContract = (
		await createContract({ apartmentId: relet.id, tenantId: nextTenant, startDate: day(30), baseRent: '800', monthlyAdvancePayment: '100' })
	).id;

	await statement(1, { status: 'draft', balance: '50' });
	await statement(2, { status: 'sent', balance: '300', paymentDeadline: day(-1) }); // overdue
	await statement(3, { status: 'sent', balance: '200', paymentDeadline: day(30) });
	await statement(4, { status: 'sent', balance: '-100', paymentDeadline: day(30) }); // refund to the tenant
	// paid through the service, which stores the Saldo as the amount paid (#93); a refund paid does not count
	await statement(5, { status: 'sent', balance: '150', paymentDeadline: day(30) });
	await statement(6, { status: 'sent', balance: '80', paymentDeadline: day(30) });
	await statement(7, { status: 'sent', balance: '-60', paymentDeadline: day(30) });
	for (const id of statements.slice(-3)) await updateStatementStatus(id, 'paid', { paidDate: day(0) });
	// #120, Fachreview W2e V-15: a payment received stays received when its statement is replaced afterwards
	await statement(8, { status: 'replaced', balance: '40', paidAmount: '40', paidDate: day(0) });

	after = await dashboard();
});

afterAll(async () => {
	await db.delete(documents).where(inArray(documents.statementId, statements)); // a PDF kept before a change (#969)
	await db.delete(utilityStatements).where(inArray(utilityStatements.id, statements));
	await deleteContract(nextContract, true);
	await deleteTenant(nextTenant);
	for (const id of apartments) await deleteApartment(id);
	await rental.remove();
});

const added = (section: 'portfolio' | 'financial' | 'statements') =>
	Object.fromEntries(Object.keys(after[section]).map((key) => [key, after[section][key] - before[section][key]]));

describe('Dashboard', () => {
	it('zählt Gebäude und Wohnungen nach Mietstatus', () => {
		expect(added('portfolio')).toMatchObject({
			totalBuildings: 1,
			totalApartments: 3,
			occupiedApartments: 1,
			reletApartments: 1,
			vacantApartments: 1,
			reservedApartments: 0
		});
	});

	it('zählt Abrechnungen nach Status, überfällige getrennt von versendeten', () => {
		expect(added('statements')).toEqual({ draft: 1, toSend: 1, sent: 2, overdue: 1, paid: 3, settled: 0 });
	});

	// H-28 (#717), #454: a draft is to send only while it is current; the backend counts them, the overview takes the number
	it('zählt nur die aktuellen Entwürfe als zu versenden', async () => {
		const start = await dashboard();
		await statement(9, { status: 'draft' });
		await statement(10, { status: 'draft' });
		await insertInvoice(rental.building, { invoiceDate: '2019-06-30' }); // recorded after the draft of 2019
		try {
			const end = await dashboard();

			expect(end.statements.draft - start.statements.draft).toBe(2);
			expect(end.statements.toSend - start.statements.toSend).toBe(1);
		} finally {
			await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		}
	});

	it('zählt versendete und überfällige Abrechnungen als offen', () => {
		expect(added('financial').outstandingStatements).toBe(3);
	});

	// #93: «Als bezahlt markieren» ohne Betrag speichert den Saldo als bezahlten Betrag
	it('speichert beim Bezahlen den Saldo als bezahlten Betrag', async () => {
		const paid = await db.select({ paidAmount: utilityStatements.paidAmount }).from(utilityStatements).where(inArray(utilityStatements.id, statements.slice(4, 7)));
		expect(paid.map((row) => row.paidAmount).sort()).toEqual(['-60.00', '150.00', '80.00']);
	});

	it('summiert ausstehende Nachzahlungen der Mieter ohne Guthaben', () => {
		expect(added('financial')).toMatchObject({ totalPending: 500, overdueAmount: 300, paidThisMonth: 270 });
	});

	it('zeigt die Belegung des Gebäudes', () => {
		expect(after.buildingOccupancy.find((b) => b.buildingId === rental.building)).toMatchObject({
			totalApartments: 3,
			occupiedApartments: 1,
			occupancyRate: 33.3
		});
	});

	it('meldet Zahlungen älterer Abrechnungen unter den letzten Aktivitäten', () => {
		expect(after.recentActivity).toContainEqual(
			expect.objectContaining({ title: 'Zahlung eingegangen', description: `Abrechnung NK-${token}-6` })
		);
	});
});
