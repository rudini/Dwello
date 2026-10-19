/**
 * A draft statement is calculated again from the invoices as they are now (#338), against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { categories, invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

type Statement = {
	id: string;
	status: string;
	statementNumber: string;
	statementDate: string;
	paymentDeadline: string;
	managementFeePercent: string;
	totalCosts: string;
	balance: string;
	priorPayments: string;
	replaces: { id: string } | null;
};

let rental: Awaited<ReturnType<typeof createRental>>;
const statement = async (id: string) => (await (await callApi(`/api/v1/statements/${id}`)).json()) as Statement;
const recalculate = (id: string) => sendJson('POST', `/api/v1/statements/${id}/recalculation`, {});
const generate = async (year: number) =>
	idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`
		})
	);

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2025-01-01', monthlyAdvancePayment: '100' });
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2025-03-31' });
});

const own: string[] = [];
afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	for (const id of own) await db.delete(categories).where(eq(categories.id, id));
	await rental.remove();
});

describe('Entwurf neu berechnen', () => {
	it('rechnet einen Entwurf mit einer später erfassten Rechnung neu und behält seine Nummer', async () => {
		const id = await generate(2025);
		const before = await statement(id);
		await insertInvoice(rental.building, { amount: '600.00', invoiceDate: '2025-09-30' });

		const response = await recalculate(id);

		expect(response.status).toBe(200);
		const after = await statement(id);
		// what stays: number, date, Zahlungsfrist, Verwaltungspauschale (review 338-1 C-9)
		const { statementNumber, statementDate, paymentDeadline, managementFeePercent } = before;
		expect(after).toMatchObject({ id, status: 'draft', statementNumber, statementDate, paymentDeadline, managementFeePercent });
		expect(Number(after.totalCosts)).toBeGreaterThan(Number(before.totalCosts));
		const changed = (await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as unknown;
		expect(changed).toMatchObject({ invoiceIds: [] });
	});

	it('rechnet eine versendete oder bezahlte Abrechnung nicht neu', async () => {
		const id = await generate(2026);
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' });

		await expectRejection(await recalculate(id), 409, 'Only a draft can be recalculated', 'STATEMENT_NOT_RECALCULABLE');
		await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' }) });
		await expectRejection(await recalculate(id), 409, 'Only a draft can be recalculated', 'STATEMENT_NOT_RECALCULABLE');
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
	});

	// review 338-1 C-1: a berichtigte Abrechnung keeps what was paid on the statement it replaces
	it('behält bei einer berichtigten Abrechnung, was schon bezahlt ist', async () => {
		const sent = await generate(2027);
		await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'sent' });
		await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'paid', paidDate: new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' }) });
		await sendJson('POST', `/api/v1/statements/${sent}/replace`, {});
		const corrected = await idOf(await sendJson('POST', `/api/v1/statements/${sent}/correction`, {}));
		const before = await statement(corrected);
		await insertInvoice(rental.building, { amount: '300.00', invoiceDate: '2027-06-30' });

		await recalculate(corrected);

		const after = await statement(corrected);
		expect(after.replaces?.id).toBe(sent);
		expect(after.priorPayments).toBe(before.priorPayments);
		expect(Number(before.priorPayments)).not.toBe(0);
		expect(Number(after.balance)).toBeGreaterThan(Number(before.balance));
	});

	// review 338-1 C-3: the wizard does not ask for a contract with a draft; the refusal sends to deleting it first
	it('lehnt ab, solange eine Kategorie mit Kosten nicht beantwortet ist, und sagt, was zu tun ist', async () => {
		const id = await generate(2028);
		const [category] = await db
			.insert(categories)
			.values({ name: `Treppenhaus ${crypto.randomUUID()}`, isAllowedUtilityCost: true, type: 'custom' })
			.returning();
		own.push(category.id);
		await insertInvoice(rental.building, { categoryId: category.id, amount: '200.00', invoiceDate: '2028-06-30' });

		await expectRejection(
			await recalculate(id),
			409,
			'Whether the contract agrees these categories is not answered',
			'STATEMENT_RECALCULATION_AGREEMENTS_OPEN',
			{ categories: category.name }
		);
	});
});
