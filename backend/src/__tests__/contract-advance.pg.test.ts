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
		const refusal = async (response: Response) => {
			const { code, params } = (await response.json()) as { code: string; params?: object };
			return [response.status, code, params];
		};

		// the example is the next first of a month; the Vertragsbeginn is named (fach review F-10)
		expect(await refusal(await setAdvance('90', '2024-08-15'))).toEqual([400, 'ADVANCE_FROM_NOT_MONTH_START', { next: '01.09.2024' }]);
		expect(await refusal(await setAdvance('90', '2024-04-01'))).toEqual([400, 'ADVANCE_FROM_BEFORE_START', { date: '01.05.2024' }]);
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
				// persona Helga 464-2 P-2: the earliest day no statement bills
				params: { from: '01.09.2024', number: statementNumber, next: '01.01.2025' }
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

	it('nimmt den ersten Betrag mit seinem alten Tag an, wenn sich der Vertragsbeginn ändert, und rückt ihn mit', async () => {
		const moved = await createRental(crypto.randomUUID(), { startDate: '2024-05-15', monthlyAdvancePayment: '50' });
		try {
			const response = await sendJson('PUT', `/api/v1/contracts/${moved.contract}`, {
				startDate: '2024-05-20',
				monthlyAdvancePayment: '60',
				advancePaymentFrom: '2024-05-15'
			});

			expect(response.status).toBe(200);
			const { advancePayments } = (await (await callApi(`/api/v1/contracts/${moved.contract}`)).json()) as Contract;
			expect(advancePayments).toEqual([{ validFrom: '2024-05-20', amount: '60.00' }]);
		} finally {
			await moved.remove();
		}
	});

	it('nennt das Vertragsende, wenn ein Akonto danach gelten soll', async () => {
		const ending = await createRental(crypto.randomUUID(), { startDate: '2024-05-01', endDate: '2024-12-31', monthlyAdvancePayment: '50' });
		try {
			const response = await sendJson('PUT', `/api/v1/contracts/${ending.contract}`, {
				monthlyAdvancePayment: '60',
				advancePaymentFrom: '2025-01-01'
			});

			expect(response.status).toBe(400);
			expect(await response.json()).toMatchObject({ code: 'ADVANCE_FROM_AFTER_END', params: { date: '31.12.2024' } });
		} finally {
			await ending.remove();
		}
	});
});

describe('Akonto mit Gültig ab: Korrektur und Vertragsdaten', () => {
	const rentals: Awaited<ReturnType<typeof createRental>>[] = [];
	const rentalFrom = async (startDate: string, monthlyAdvancePayment: string, endDate?: string) => {
		const created = await createRental(crypto.randomUUID(), { startDate, endDate, monthlyAdvancePayment });
		await insertInvoice(created.building, { amount: '1200.00', invoiceDate: '2024-03-31' });
		rentals.push(created);
		return created;
	};
	const statementOf = async (contract: Awaited<ReturnType<typeof createRental>>, status: 'draft' | 'sent') => {
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: contract.contract,
				buildingId: contract.building,
				periodStart: '2024-01-01',
				periodEnd: '2024-12-31'
			})
		);
		if (status === 'sent') await db.update(utilityStatements).set({ status }).where(eq(utilityStatements.id, id));
		return id;
	};
	const advancesOf = async (contract: Awaited<ReturnType<typeof createRental>>) =>
		((await (await callApi(`/api/v1/contracts/${contract.contract}`)).json()) as Contract).advancePayments;
	const put = (contract: Awaited<ReturnType<typeof createRental>>, body: object) =>
		sendJson('PUT', `/api/v1/contracts/${contract.contract}`, body);
	const codeOf = async (response: Response) => [response.status, ((await response.json()) as { code: string }).code];

	afterAll(async () => {
		for (const created of rentals) {
			await db.delete(utilityStatements).where(eq(utilityStatements.contractId, created.contract));
			await db.delete(invoices).where(eq(invoices.buildingId, created.building));
			await created.remove();
		}
	});

	// fach review 464-2 V-1: the migration took today's amount; the amount the sent statement counted may be entered
	it('nimmt einen Betrag an, der zum gespeicherten Akonto einer versendeten Abrechnung passt', async () => {
		const contract = await rentalFrom('2024-01-01', '200');
		const id = await statementOf(contract, 'sent');
		await db.update(utilityStatements).set({ totalAdvancePayments: '1800.00' }).where(eq(utilityStatements.id, id));

		expect((await put(contract, { monthlyAdvancePayment: '150' })).status).toBe(200);
		expect(await codeOf(await put(contract, { monthlyAdvancePayment: '160' }))).toEqual([400, 'ADVANCE_CHANGES_STATEMENT']);
	});

	// V-3: the first amount applies from the Vertragsbeginn, stored so, also when the start moves
	it('rückt den ersten Betrag mit dem Vertragsbeginn mit', async () => {
		const contract = await rentalFrom('2024-03-15', '100');

		expect((await put(contract, { startDate: '2024-01-01' })).status).toBe(200);
		expect((await put(contract, { monthlyAdvancePayment: '120', advancePaymentFrom: '2024-02-01' })).status).toBe(200);
		expect(await advancesOf(contract)).toEqual([
			{ validFrom: '2024-01-01', amount: '100.00' },
			{ validFrom: '2024-02-01', amount: '120.00' }
		]);
	});

	// fach review 464-3 V-12: «Gültig ab» on the new Vertragsbeginn corrects the first amount, in both directions
	it.each([
		['2027-04-01', '2027-03-15'],
		['2027-03-15', '2027-04-01']
	])('korrigiert den ersten Betrag, wenn «Gültig ab» der neue Vertragsbeginn %s → %s ist', async (start, moved) => {
		const contract = await rentalFrom(start, '100');

		expect((await put(contract, { startDate: moved, monthlyAdvancePayment: '120', advancePaymentFrom: moved })).status).toBe(200);
		expect(await advancesOf(contract)).toEqual([{ validFrom: moved, amount: '120.00' }]);
	});

	it('lehnt einen Vertragsbeginn oder ein Vertragsende über ein späteres Akonto hinaus ab', async () => {
		const contract = await rentalFrom('2024-01-01', '100');
		await put(contract, { monthlyAdvancePayment: '120', advancePaymentFrom: '2024-07-01' });

		const start = await put(contract, { startDate: '2024-07-01' });
		expect(start.status).toBe(400);
		expect(await start.json()).toMatchObject({ code: 'CONTRACT_START_AFTER_ADVANCE', params: { date: '01.07.2024' } });
		const end = await put(contract, { endDate: '2024-06-30' });
		expect(end.status).toBe(400);
		expect(await end.json()).toMatchObject({ code: 'CONTRACT_END_BEFORE_ADVANCE', params: { date: '01.07.2024' } });
		expect(await advancesOf(contract)).toHaveLength(2);
	});

	// V-6, review C-5: deleting an Akonto a stored statement counts is refused, with a message without «Gültig ab»
	it('lehnt das Löschen eines Akontos ab, das eine erstellte Abrechnung zählt', async () => {
		const contract = await rentalFrom('2024-01-01', '100');
		await put(contract, { monthlyAdvancePayment: '120', advancePaymentFrom: '2024-07-01' });
		const remove = () => callApi(`/api/v1/contracts/${contract.contract}/advance-payments/2024-07-01`, { method: 'DELETE' });

		const id = await statementOf(contract, 'draft');
		expect(await codeOf(await remove())).toEqual([400, 'ADVANCE_DELETE_CHANGES_DRAFT']);
		await db.update(utilityStatements).set({ status: 'sent' }).where(eq(utilityStatements.id, id));
		expect(await codeOf(await remove())).toEqual([400, 'ADVANCE_DELETE_CHANGES_STATEMENT']);
		expect(await advancesOf(contract)).toHaveLength(2);
	});
});
