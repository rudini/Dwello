/**
 * Invoices count for the period they bill (Leistungszeitraum), not for their date (real PostgreSQL database).
 * Building with one apartment (70 m²): tenant A from 1.1. to 31.3.2024, tenant B from 1.5.2024.
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices } from '../db/schema';
import { createContract, deleteContract } from '../services/contract.service';
import { createTenant, deleteTenant } from '../services/tenant.service';
import { calculateStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

const token = crypto.randomUUID();
let rental: Awaited<ReturnType<typeof createRental>>;
let next: { tenant: string; contract: string };

beforeAll(async () => {
	rental = await createRental(token, { startDate: '2024-01-01', endDate: '2024-03-31', monthlyAdvancePayment: '0' });
	const tenant = await createTenant({ firstName: 'Beat', lastName: `Huber ${token}` });
	const contract = await createContract({
		apartmentId: rental.apartment,
		tenantId: tenant.id,
		startDate: '2024-05-01',
		baseRent: '1000',
		monthlyAdvancePayment: '0'
	});
	next = { tenant: tenant.id, contract: contract.id };
	// The fourth quarter of 2024, billed in January 2025
	await insertInvoice(rental.building, {
		amount: '900.00',
		invoiceDate: '2025-01-15',
		servicePeriodStart: '2024-10-01',
		servicePeriodEnd: '2024-12-31'
	});
});

afterAll(async () => {
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await deleteContract(next.contract);
	await deleteTenant(next.tenant);
	await rental.remove();
});

const statement = (contractId: string, periodStart = '2024-01-01', periodEnd = '2024-12-31') =>
	calculateStatement({ contractId, periodStart, periodEnd, managementFeePercent: 0 });

describe('Leistungszeitraum einer Rechnung', () => {
	it('rechnet eine im Januar gestellte Rechnung für das 4. Quartal im alten Jahr ab', async () => {
		expect((await statement(next.contract)).lineItems).toMatchObject([{ totalBuildingAmount: 900, tenantShare: 900 }]);
		expect((await statement(next.contract, '2025-01-01', '2025-12-31')).lineItems).toEqual([]);
	});

	// Wer im 4. Quartal nicht mehr dort wohnte, trägt nichts davon
	it('belastet nur den Mieter, der im Leistungszeitraum in der Wohnung war', async () => {
		expect((await statement(rental.contract)).totalCosts).toBe(0);
	});

	// Jahresrechnung 1.7.2023–30.6.2024 (366 Tage): 182 Tage davon gehören in die Periode 2024
	it('teilt eine Rechnung, deren Leistungszeitraum über zwei Perioden reicht, nach Tagen auf', async () => {
		await insertInvoice(rental.building, {
			amount: '1200.00',
			invoiceDate: '2023-07-05',
			servicePeriodStart: '2023-07-01',
			servicePeriodEnd: '2024-06-30',
			description: 'Jahresabo'
		});
		const lines = (await statement(next.contract)).lineItems;

		// one line per category: 900 + 1200 × 182/366 = 900 + 596.72; tenant B: all of Q4, May and June of the annual invoice
		expect(lines[0].totalBuildingAmount).toBe(1496.72);
		expect(lines[0].tenantShare).toBe(roundRappen(900 + (1200 * 61) / 366));
	});
});

const roundRappen = (amount: number) => Math.round(amount * 100) / 100;

describe('Leistungszeitraum über die API', () => {
	const post = (period: object) =>
		sendJson('POST', '/api/v1/invoices?skipLlm=true', {
			buildingId: rental.building,
			billingEntityName: 'Muster AG',
			description: 'Hauswartung Q4',
			amount: '900.00',
			invoiceDate: '2025-01-15',
			...period
		});

	it('speichert Beginn und Ende des Leistungszeitraums', async () => {
		const response = await post({ servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' });
		const { id } = (await response.json()) as { id: string };
		const saved = (await (await callApi(`/api/v1/invoices/${id}`)).json()) as Record<string, unknown>;

		expect(saved).toMatchObject({ servicePeriodStart: '2024-10-01', servicePeriodEnd: '2024-12-31' });
	});

	it('lehnt einen Leistungszeitraum ohne Ende oder mit Ende vor dem Beginn ab', async () => {
		expect((await post({ servicePeriodStart: '2024-10-01' })).status).toBe(400);
		expect((await post({ servicePeriodStart: '2024-12-31', servicePeriodEnd: '2024-10-01' })).status).toBe(400);
	});
});
