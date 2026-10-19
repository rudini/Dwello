/**
 * Akonto with a validity date (#464): amounts per «Gültig ab» on a Mietvertrag, against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { invoices, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

type Contract = { monthlyAdvancePayment: string; advancePayments: { validFrom: string; amount: string }[] };

let rental: Awaited<ReturnType<typeof createRental>>;
const contract = async () => (await (await callApi(`/api/v1/contracts/${rental.contract}`)).json()) as Contract;
const setAdvance = (monthlyAdvancePayment: string, advancePaymentFrom?: string) =>
	sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { monthlyAdvancePayment, advancePaymentFrom });

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2024-05-01', monthlyAdvancePayment: '50' });
	await insertInvoice(rental.building, { amount: '1200.00', invoiceDate: '2024-03-31' });
});

afterAll(async () => {
	await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
	await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
	await rental.remove();
});

describe('Akonto mit Gültig ab', () => {
	it('behält das bisherige Akonto für die Zeit vor einem neuen und nennt das heute gültige', async () => {
		expect((await setAdvance('80', '2024-07-01')).status).toBe(200);

		const { advancePayments, monthlyAdvancePayment } = await contract();
		expect(advancePayments).toEqual([
			{ validFrom: '2024-05-01', amount: '50.00' },
			{ validFrom: '2024-07-01', amount: '80.00' }
		]);
		expect(monthlyAdvancePayment).toBe('80.00');
	});

	it('rechnet in der Abrechnung jeden Betrag für seine Monate und speichert die Zeilen', async () => {
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31'
			})
		);
		try {
			const [stored] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, id));

			expect(stored.totalAdvancePayments).toBe('580.00');
			expect(stored.advanceLines).toEqual([
				{ from: '2024-05-01', to: '2024-06-30', months: 2, amount: 50, total: 100 },
				{ from: '2024-07-01', to: '2024-12-31', months: 6, amount: 80, total: 480 }
			]);
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		}
	});

	it('lässt ein neues Akonto nur ab dem Ersten eines Monats im Mietvertrag gelten (Entscheid zu F-10)', async () => {
		const code = async (response: Response) => [response.status, ((await response.json()) as { code: string }).code];

		expect(await code(await setAdvance('90', '2024-08-15'))).toEqual([400, 'ADVANCE_FROM_NOT_MONTH_START']);
		expect(await code(await setAdvance('90', '2024-04-01'))).toEqual([400, 'ADVANCE_FROM_OUTSIDE_CONTRACT']);
		expect((await contract()).advancePayments).toHaveLength(2);
	});

	it('lehnt ein Akonto ab, das eine schon erstellte Abrechnung ändern würde, und lässt es nach dem Ersetzen zu (Entscheid zu F-3)', async () => {
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31'
			})
		);
		try {
			const [{ statementNumber }] = await db.select().from(utilityStatements).where(eq(utilityStatements.id, id));
			const refused = await setAdvance('90', '2024-09-01');
			expect(refused.status).toBe(400);
			expect(await refused.json()).toMatchObject({
				code: 'ADVANCE_CHANGES_DRAFT',
				params: { from: '01.09.2024', number: statementNumber }
			});
			// the same amount again changes nothing
			expect((await setAdvance('80', '2024-07-01')).status).toBe(200);

			await db.update(utilityStatements).set({ status: 'replaced' }).where(eq(utilityStatements.id, id));
			expect((await setAdvance('90', '2024-09-01')).status).toBe(200);
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		}
	});

	it('löscht einen späteren Betrag, aber nie den ersten (Entscheid zu F-13)', async () => {
		const remove = (validFrom: string) => callApi(`/api/v1/contracts/${rental.contract}/advance-payments/${validFrom}`, { method: 'DELETE' });

		expect((await remove('2024-09-01')).status).toBe(200);
		const first = await remove('2024-05-01');
		expect(first.status).toBe(400);
		expect(((await first.json()) as { code: string }).code).toBe('ADVANCE_FIRST_NOT_DELETABLE');
		expect((await contract()).advancePayments.map((entry) => entry.validFrom)).toEqual(['2024-05-01', '2024-07-01']);
	});

	it('nennt bei einer berichtigten Abrechnung das Akonto der ersetzten (Entscheid zu F-4, Option A)', async () => {
		const sent = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31'
			})
		);
		await sendJson('PUT', `/api/v1/statements/${sent}/status`, { status: 'sent' });
		await sendJson('POST', `/api/v1/statements/${sent}/replace`, {});
		// as after the migration of an Akonto changed before #464: one amount from the Vertragsbeginn
		await setAdvance('80');
		await callApi(`/api/v1/contracts/${rental.contract}/advance-payments/2024-07-01`, { method: 'DELETE' });
		const corrected = await idOf(await sendJson('POST', `/api/v1/statements/${sent}/correction`, {}));
		try {
			const detail = (await (await callApi(`/api/v1/statements/${corrected}`)).json()) as {
				totalAdvancePayments: string;
				replaces: { totalAdvancePayments: string };
			};

			expect(detail.totalAdvancePayments).toBe('640.00');
			expect(detail.replaces.totalAdvancePayments).toBe('580.00');
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
		}
	});

	it('lässt einen Mietvertrag speichern, dessen alte Abrechnung schon vorher ein anderes Akonto zählte', async () => {
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31'
			})
		);
		// as after the migration of an Akonto changed before #464: the stored total no longer matches the amounts
		await db.update(utilityStatements).set({ status: 'sent', totalAdvancePayments: '400.00' }).where(eq(utilityStatements.id, id));
		try {
			const { advancePayments } = await contract();
			const current = advancePayments.at(-1)!;
			expect((await setAdvance(current.amount, current.validFrom)).status).toBe(200);
			expect((await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { baseRent: '990' })).status).toBe(200);
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		}
	});
});

