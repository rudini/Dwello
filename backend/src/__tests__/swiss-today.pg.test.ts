/**
 * The backend's «today» is the Swiss day, also between midnight and 02:00 when UTC is still on the day before
 * (real PostgreSQL database, clock set to 23:30 UTC = 00:30 Swiss winter time, 01:30 summer time)
 */

import { afterAll, beforeAll, describe, expect, it, setSystemTime } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, invoices, utilityStatements } from '../db/schema';
import { createApartment, deleteApartment, getApartment } from '../services/apartment.service';
import { createContract, listContracts } from '../services/contract.service';
import {
	createStatement,
	deleteStatement,
	generateStatement,
	getStatement,
	listStatements
} from '../services/statement.service';
import { markDocumentPosted, sendReminder } from '../services/reminder.service';
import { getTenant, getTenantWithHistory, listTenants } from '../services/tenant.service';
import { callApi } from './helpers/auth';
import { readPdf } from './helpers/pdf-text';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

// The real UTC day, so the database's own current_date is that day too
const utcDay = new Date().toISOString().slice(0, 10);
const daysAfter = (days: number) =>
	new Date(Date.parse(utcDay) + days * 86_400_000).toISOString().slice(0, 10);
const swissDay = daysAfter(1);
const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
const swissDate = (isoDate: string) => isoDate.split('-').reverse().join('.');

/** A sent statement of 2025 for CHF 100 with the given payment deadline */
const sentStatement = (paymentDeadline: string, paid: object = {}) =>
	createStatement({
		tenantId: rental.tenant,
		apartmentId: rental.apartment,
		contractId: rental.contract,
		statementNumber: `NK-${crypto.randomUUID()}`,
		periodStart: '2025-01-01',
		periodEnd: '2025-12-31',
		statementDate: '2026-01-15',
		rentalDays: 365,
		rentalStart: '2025-01-01',
		rentalEnd: '2025-12-31',
		totalCosts: '100.00',
		totalAdvancePayments: '0.00',
		managementFee: '0.00',
		balance: '100.00',
		status: 'sent',
		paymentDeadline,
		...paid
	});

beforeAll(async () => {
	setSystemTime(new Date(`${utcDay}T23:30:00Z`));
	rental = await createRental(token, {
		startDate: '2026-01-01',
		endDate: utcDay,
		monthlyAdvancePayment: '100'
	});
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2026-03-31' });
});

afterAll(async () => {
	setSystemTime();
	await db.delete(documents).where(eq(documents.tenantId, rental.tenant));
	// Directly: the service deletes only drafts, and a statement left behind blocks the contract and the apartment (#223)
	await db.delete(utilityStatements).where(eq(utilityStatements.tenantId, rental.tenant));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Heute ist der Schweizer Tag, auch kurz nach Mitternacht', () => {
	it('zeigt eine Abrechnung mit Zahlungsfrist am Vortag als überfällig', async () => {
		const statement = await sentStatement(utcDay);

		expect((await getStatement(statement.id))!.status).toBe('overdue');
		const overdue = await listStatements({ tenantId: rental.tenant, status: 'overdue' });
		expect(overdue.statements.map((s) => s.id)).toEqual([statement.id]);
		await deleteStatement(statement.id);
	});

	it('zählt einen Mietvertrag, der am Vortag endete, zu den beendeten', async () => {
		const ended = await listContracts({ tenantId: rental.tenant, status: 'ended' });
		const active = await listContracts({ tenantId: rental.tenant, status: 'active' });

		expect([ended.total, active.total]).toEqual([1, 0]);
	});

	it('zeigt den Mieter dieses Vertrags als ehemaligen Mieter ohne Wohnung', async () => {
		const [listed] = (await listTenants({ search: `Keller ${token}` })).tenants;
		const inactive = await listTenants({ search: `Keller ${token}`, status: 'inactive' });

		expect(listed).toMatchObject({ isActive: false, currentApartment: undefined });
		expect(inactive.total).toBe(1);
		expect((await getTenant(rental.tenant))?.currentApartment).toBeUndefined();
	});

	it('zeigt die Wohnung dieses Vertrags nicht mehr als vermietet', async () => {
		expect((await getApartment(rental.apartment))?.status).toBe('vacant');
	});

	it('datiert eine neue Abrechnung auf den Schweizer Tag', async () => {
		const statement = await generateStatement({
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: '2026-01-01',
			periodEnd: '2026-06-30',
			managementFeePercent: 0
		});

		expect(statement.statementDate).toBe(swissDay);
		expect(statement.paymentDeadline).toBe(daysAfter(31));
	});

	it('datiert eine Mahnung auf den Schweizer Tag und setzt die neue Zahlungsfrist von dort aus', async () => {
		const statement = await sentStatement('2026-01-31');
		const { document } = await sendReminder(statement.id);
		const pdf = readPdf(
			Buffer.from(await (await callApi(`/api/v1/documents/${document.id}/pdf`)).arrayBuffer())
		).flowing;

		expect(pdf).toContain(swissDate(swissDay));
		expect(pdf).toContain(`bis ${swissDate(daysAfter(11))}`);
		// gemahnt from the Swiss day the letter is marked sent (#545)
		await markDocumentPosted(document.id);
		expect((await getStatement(statement.id))!.reminderSentDate).toBe(swissDay);
	});

	it('führt den Vertrag in der Geschichte des Mieters als beendet und nicht mehr als aktiven Vertrag der Wohnung', async () => {
		expect((await getTenantWithHistory(rental.tenant))!.contracts.map((c) => c.isActive)).toEqual([
			false
		]);
		expect((await callApi(`/api/v1/contracts/apartment/${rental.apartment}/active`)).status).toBe(
			404
		);
	});

	it('löscht eine Wohnung, deren Vertrag am Vortag endete', async () => {
		const apartment = await createApartment({
			buildingId: rental.building,
			number: '3.01',
			floor: 3,
			area: '50',
			rooms: '2'
		});
		await createContract({
			apartmentId: apartment.id,
			tenantId: rental.tenant,
			startDate: '2026-01-01',
			endDate: utcDay,
			baseRent: '900',
			monthlyAdvancePayment: '100'
		});

		expect(await deleteApartment(apartment.id)).toEqual({ success: true });
	});

	it('zählt eine am letzten Tag des Vormonats bezahlte Abrechnung nicht zu den Zahlungen dieses Monats', async () => {
		setSystemTime(new Date('2026-10-31T23:30:00Z'));
		await sentStatement('2026-09-30', {
			status: 'paid',
			paidDate: '2026-10-31',
			paidAmount: '100.00'
		});
		const dashboard = (await (await callApi('/api/v1/dashboard')).json()) as {
			financial: { paidThisMonth: number };
		};
		setSystemTime(new Date(`${utcDay}T23:30:00Z`));

		expect(dashboard.financial.paidThisMonth).toBe(0);
	});
});
