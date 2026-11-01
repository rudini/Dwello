/**
 * A statement that left the draft stays as it was sent (scenario D1), against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { documents, utilityStatements } from '../db/schema';
import { updateStatement } from '../services/statement.service';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf } from './helpers/records';
import { createRental } from './helpers/rental';

let rental: Awaited<ReturnType<typeof createRental>>;
let statementId: string;
let sentId: string;

const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

// A statement of the rental for one year, sent to the tenant
async function sentStatement(year: number) {
	const id = await idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`
		})
	);
	await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' });
	return id;
}

beforeAll(async () => {
	rental = await createRental(crypto.randomUUID(), { startDate: '2023-01-01', monthlyAdvancePayment: '100' });
	sentId = await sentStatement(2023);
	// Overdue is not set by hand: the payment deadline has passed
	statementId = await sentStatement(2024);
	const overdue = await sendJson('PUT', `/api/v1/statements/${statementId}`, { paymentDeadline: '2025-01-31' });
	expect(await overdue.json()).toMatchObject({ status: 'overdue' });
});

afterAll(async () => {
	// Locked statements cannot be deleted through the API
	await db.delete(documents).where(inArray(documents.statementId, [statementId, sentId])); // a PDF kept before a change (#969)
	await db.delete(utilityStatements).where(inArray(utilityStatements.id, [statementId, sentId]));
	await rental.remove();
});

describe('Versendete Abrechnung', () => {
	// Überfällig ist sie erst, wenn die Zahlungsfrist abgelaufen ist; sonst fehlte sie in den Filtern und Zahlen
	it('lässt sich nicht von Hand auf überfällig setzen', async () => {
		const response = await sendJson('PUT', `/api/v1/statements/${sentId}/status`, { status: 'overdue' });

		await expectRejection(response, 400, 'Invalid status transition from sent to overdue');
	});
});

describe('Überfällige Abrechnung', () => {
	it('lässt sich nicht löschen', async () => {
		await expectRejection(
			await callApi(`/api/v1/statements/${statementId}`, { method: 'DELETE' }),
			400,
			'Cannot delete a statement that is no longer a draft',
			'STATEMENT_NOT_DRAFT'
		);
		expect((await callApi(`/api/v1/statements/${statementId}`)).status).toBe(200);
	});

	it('bekommt keine weiteren Abrechnungspositionen', async () => {
		await expectRejection(
			await sendJson('POST', `/api/v1/statements/${statementId}/line-items`, {
				items: [{ description: 'Nachtrag', totalAmount: '50.00', tenantShare: '50.00' }]
			}),
			400,
			'Cannot add line items to a statement that is no longer a draft'
		);
	});

	it('behält ihre Beträge', async () => {
		await expect(updateStatement(statementId, { balance: '0.00' })).rejects.toThrow(
			'Cannot modify balance for a statement that is no longer a draft'
		);
		await expect(updateStatement(statementId, { managementFeePercent: '5.00' })).rejects.toThrow(
			'Cannot modify managementFeePercent for a statement that is no longer a draft'
		);
	});
});

// Ein Saldo von 0 (oft nach der Rundung auf 5 Rappen) ist mit dem Versenden erledigt: nichts zu zahlen, nichts
// zurückzuerstatten; sonst würde die Abrechnung nach der Zahlungsfrist überfällig und verlangte eine Prüfung. Seit #448
// «Erledigt», ohne Zahlungsdatum
describe('Abrechnung mit Saldo 0', () => {
	it('ist mit dem Versenden erledigt', async () => {
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		);
		await db.update(utilityStatements).set({ balance: '0.00' }).where(eq(utilityStatements.id, id));
		try {
			const sent = await (await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' })).json();
			const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });
			expect(sent).toMatchObject({ status: 'settled', paidDate: null, statementDate: today, paidAmount: null });
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		}
	});
});

// #94: eine so erledigte Abrechnung (bezahlt mit 0.00), deren Zahlung zurückgesetzt wurde (#92): wieder als bezahlt
// markiert, zählt der Betrag nicht als Einnahme (Datenprüfung D-1); seit #448 entsteht keine solche mehr
describe('Abrechnung mit kleinem Saldo nach #94', () => {
	it('hält auch nach dem Zurücksetzen der Zahlung keinen bezahlten Betrag fest', async () => {
		const id = await idOf(
			await sendJson('POST', '/api/v1/statements/generate', {
				contractId: rental.contract,
				buildingId: rental.building,
				periodStart: '2025-01-01',
				periodEnd: '2025-12-31'
			})
		);
		await db
			.update(utilityStatements)
			.set({ status: 'paid', balance: '3.40', statementDate: today(), paidDate: today(), paidAmount: '0.00' })
			.where(eq(utilityStatements.id, id));
		try {
			await callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });
			const paidAgain = await (await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: today() })).json();
			expect(paidAgain).toMatchObject({ status: 'paid', paidAmount: '0.00' });
		} finally {
			await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
		}
	});
});

const markPaid = (id: string, paidDate: string) => sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate });

// #138: das Zahlungsdatum ist ein Tag bis heute; ab dem Ende der Abrechnungsperiode: statement-carry-over.pg.test.ts (#448)
describe('Zahlungsdatum', () => {
	it('ist ein Tag, den es gibt', async () => {
		for (const day of ['2025-02-30', '2025-13-01', ''])
			await expectRejection(await markPaid(statementId, day), 400, 'Invalid payment date', 'PAID_DATE_INVALID', { date: day });
	});

	it('liegt nicht in der Zukunft', async () => {
		await expectRejection(await markPaid(statementId, '2099-01-01'), 400, 'Payment date in the future', 'PAID_DATE_IN_FUTURE', { date: today() });
		expect(await (await callApi(`/api/v1/statements/${statementId}`)).json()).toMatchObject({ status: 'overdue', paidDate: null });
	});
});

// #92: eine erfasste Zahlung lässt sich zurücksetzen; der Verlauf behält das Zurücksetzen
describe('Zahlung zurücksetzen', () => {
	const reset = (id: string) => callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });

	it('macht eine bezahlte Abrechnung wieder versendet, ohne Zahlungsdatum und Betrag', async () => {
		await markPaid(sentId, today());
		const response = await reset(sentId);

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ status: 'sent', paidDate: null, paidAmount: null, statementDate: today() });
		const stored = (await (await callApi(`/api/v1/statements/${sentId}`)).json()) as { balance: string; paymentResets: unknown[] };
		expect(stored.paymentResets).toEqual([{ resetOn: today(), paidDate: today(), paidAmount: stored.balance, part: false }]);
	});

	// erstellt, als die Abrechnung versendet war, das Geld kam aber am selben Tag: das PDF nennt keine Zahlung (Code-Review C-11)
	it('behält das PDF, das vor dem Erfassen der Zahlung erstellt wurde, auch am Tag der Zahlung', async () => {
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: new Date() }).where(eq(utilityStatements.id, sentId));
		await markPaid(sentId, today());
		await reset(sentId);

		const [row] = await db.select({ pdfBlob: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, sentId));
		expect(row.pdfBlob).toBe('JVBERi0=');
	});

	// das PDF beim Versand nennt keine Zahlung: es bleibt, und mit ihm der Eintrag im Verlauf (Persona Dr. Weber P-1)
	it('behält das PDF, das vor der Zahlung erstellt wurde', async () => {
		const yesterday = new Date(Date.now() - 86_400_000);
		await markPaid(sentId, today());
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: yesterday }).where(eq(utilityStatements.id, sentId));
		await reset(sentId);

		const [row] = await db.select({ pdfBlob: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, sentId));
		expect(row.pdfBlob).toBe('JVBERi0=');
	});

	// das PDF einer bezahlten Abrechnung sagt «Bezahlt am …»: nach dem Zurücksetzen gilt es nicht mehr (Fachprüfung V-1)
	it('verwirft das PDF, das die Zahlung bestätigt', async () => {
		await markPaid(sentId, today());
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: new Date() }).where(eq(utilityStatements.id, sentId));
		await reset(sentId);

		const [row] = await db.select({ pdfBlob: utilityStatements.pdfBlob, pdfGeneratedAt: utilityStatements.pdfGeneratedAt }).from(utilityStatements).where(eq(utilityStatements.id, sentId));
		expect(row).toEqual({ pdfBlob: null, pdfGeneratedAt: null });
	});

	it('macht eine Abrechnung mit abgelaufener Zahlungsfrist wieder überfällig', async () => {
		await markPaid(statementId, today());
		expect(await (await reset(statementId)).json()).toMatchObject({ status: 'overdue', paidDate: null });
	});

	it('gibt es nur für eine bezahlte Abrechnung', async () => {
		await expectRejection(await reset(statementId), 400, 'Statement is not paid', 'STATEMENT_NOT_PAID');
		await expectRejection(await reset(crypto.randomUUID()), 404, 'Statement not found', 'STATEMENT_NOT_FOUND');
	});
});

// #959 (A): ein kleinerer Betrag ist eine Teilzahlung; die Abrechnung bleibt mit dem Rest offen (Art. 69, 85 OR)
describe('Teilzahlung', () => {
	let id: string;
	const pay = (paidAmount: string) => sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: today(), paidAmount });

	beforeAll(async () => {
		id = await sentStatement(2025);
		await db.update(utilityStatements).set({ balance: '442.90' }).where(eq(utilityStatements.id, id));
	});

	afterAll(async () => {
		await db.delete(documents).where(eq(documents.statementId, id));
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
	});

	it('lässt die Abrechnung versendet, ohne Zahlungsdatum, mit dem bezahlten Teil', async () => {
		const response = await pay('10.00');

		expect(await response.json()).toMatchObject({ status: 'sent', paidDate: null, paidAmount: '10.00', payments: [{ date: today(), amount: '10.00' }] });
	});

	it('nimmt höchstens den offenen Betrag an und keinen Betrag von 0.00', async () => {
		await expectRejection(await pay('432.91'), 400, 'Paid amount above the open amount', 'STATEMENT_PAID_AMOUNT_TOO_HIGH', { rest: 'CHF 432.90' });
		await expectRejection(await pay('0.00'), 400, 'Paid amount not above 0.00', 'STATEMENT_PAID_AMOUNT_ZERO');
		await expectRejection(await pay('-5.00'), 400, 'Paid amount not above 0.00', 'STATEMENT_PAID_AMOUNT_ZERO');
	});

	// code review 959a-1 C-1: francs and Rappen, as «Bereits bezahlt»; a refund with its minus
	it('nimmt nur Franken mit höchstens zwei Dezimalstellen an', async () => {
		for (const amount of ['432.899', 'abc', "1'000.00"])
			await expectRejection(await pay(amount), 400, 'Invalid amount paid', 'STATEMENT_PAID_AMOUNT_INVALID', { amount });
	});

	it('zählt die Zahlungen zusammen und ist bezahlt, sobald sie den Saldo erreichen', async () => {
		const response = await pay('432.90');

		expect(await response.json()).toMatchObject({ status: 'paid', paidDate: today(), paidAmount: '442.90', payments: [{ amount: '10.00' }, { amount: '432.90' }] });
	});

	// Fachreview 959-1, Regel 6: zurückgesetzt wird die zuletzt festgehaltene Zahlung, die Teile davor bleiben
	it('setzt nur die zuletzt festgehaltene Zahlung zurück, auch eine Teilzahlung', async () => {
		const reset = () => callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });

		expect(await (await reset()).json()).toMatchObject({ status: 'sent', paidDate: null, paidAmount: '10.00', payments: [{ amount: '10.00' }] });
		expect(await (await reset()).json()).toMatchObject({ status: 'sent', paidAmount: null, payments: [] });
	});

	// #999: the Verlauf names a reset part payment as one (Fachreview 999-1); the payment that reached the Saldo is none
	it('hält beim Zurücksetzen fest, ob es eine Teilzahlung war', async () => {
		const reset = () => callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });
		await pay('10.00');
		await pay('432.90');
		await reset();

		const resets = ((await (await reset()).json()) as { paymentResets: unknown[] }).paymentResets.slice(-2);
		expect(resets).toEqual([
			{ resetOn: today(), paidDate: today(), paidAmount: '432.90', part: false },
			{ resetOn: today(), paidDate: today(), paidAmount: '10.00', part: true }
		]);
	});

	// Copilot review PR #1006: the last payment without a date is of today, and so is the Zahlungsdatum
	it('ist am Tag der letzten Zahlung bezahlt, auch wenn diese ohne Datum festgehalten wird', async () => {
		const reset = () => callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });
		await pay('10.00');

		const response = await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidAmount: '432.90' });

		expect(await response.json()).toMatchObject({ status: 'paid', paidDate: today(), payments: [{ amount: '10.00' }, { date: today(), amount: '432.90' }] });
		await reset();
		await reset();
	});

	// #1015: the PDF made after a part payment names it; once it is reset, that PDF no longer holds (as #92 for a payment)
	it('verwirft beim Zurücksetzen einer Teilzahlung das PDF, das danach erstellt wurde', async () => {
		await pay('10.00');
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: new Date() }).where(eq(utilityStatements.id, id));
		await callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });

		const [row] = await db.select({ pdfBlob: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, id));
		expect(row.pdfBlob).toBeNull();
	});

	// Datenprüfung 999-1 D-1: after a reset that leaves a part, the PDF and the new PDF made after that part name it; the
	// next reset takes them back too
	it('verwirft beim Zurücksetzen der Teilzahlung, die nach einem Zurücksetzen bleibt, die PDFs, die sie nennen', async () => {
		const [{ tenantId }] = await db.select({ tenantId: utilityStatements.tenantId }).from(utilityStatements).where(eq(utilityStatements.id, id));
		const pdfBlob = async () => (await db.select({ pdfBlob: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, id)))[0].pdfBlob;
		await pay('10.00');
		await Bun.sleep(5);
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: new Date() }).where(eq(utilityStatements.id, id));
		const [pending] = await db
			.insert(documents)
			.values({ tenantId, statementId: id, type: 'new_pdf', status: 'to_send', title: 'Nebenkostenabrechnung, neues PDF', fileName: 'neu.pdf', content: 'JVBERi0=' })
			.returning({ id: documents.id });
		await Bun.sleep(5);
		await pay('20.00');
		await callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });
		expect(await pdfBlob()).toBe('JVBERi0=');

		await callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });

		expect(await pdfBlob()).toBeNull();
		expect(await db.select().from(documents).where(eq(documents.id, pending.id))).toEqual([]);
	});

	it('verwirft beim Zurücksetzen einer Teilzahlung das neue PDF «Zu versenden», das danach erstellt wurde', async () => {
		const [{ tenantId }] = await db.select({ tenantId: utilityStatements.tenantId }).from(utilityStatements).where(eq(utilityStatements.id, id));
		await pay('10.00');
		const [pending] = await db
			.insert(documents)
			.values({ tenantId, statementId: id, type: 'new_pdf', status: 'to_send', title: 'Nebenkostenabrechnung, neues PDF', fileName: 'neu.pdf', content: 'JVBERi0=' })
			.returning({ id: documents.id });
		await callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });

		expect(await db.select().from(documents).where(eq(documents.id, pending.id))).toEqual([]);
	});

	// code review 1015-1 C-1: one made before the part payment does not name it and stays
	it('behält beim Zurücksetzen einer Teilzahlung das neue PDF «Zu versenden», das davor erstellt wurde', async () => {
		const [{ tenantId }] = await db.select({ tenantId: utilityStatements.tenantId }).from(utilityStatements).where(eq(utilityStatements.id, id));
		const [pending] = await db
			.insert(documents)
			.values({ tenantId, statementId: id, type: 'new_pdf', status: 'to_send', title: 'Nebenkostenabrechnung, neues PDF', fileName: 'neu.pdf', content: 'JVBERi0=', createdAt: new Date(Date.now() - 86_400_000) })
			.returning({ id: documents.id });
		await pay('10.00');
		await callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' });

		expect(await db.select({ id: documents.id }).from(documents).where(eq(documents.id, pending.id))).toEqual([pending]);
		await db.delete(documents).where(eq(documents.id, pending.id));
	});

	// code review 959a-1 C-2: a replaced statement stays replaced, also with a part payment on it
	it('setzt bei einer ersetzten Abrechnung keine Teilzahlung zurück', async () => {
		await pay('10.00');
		await sendJson('POST', `/api/v1/statements/${id}/replace`, {});

		await expectRejection(await callApi(`/api/v1/statements/${id}/payment-reset`, { method: 'POST' }), 400, 'Statement is not paid', 'STATEMENT_NOT_PAID');
	});
});

// Fachreview 959-1, Regel 5: auf eine Rückerstattung gilt dieselbe Regel, die Beträge negativ (code review 959a-1 C-5)
describe('Teilrückerstattung', () => {
	let id: string;
	const pay = (paidAmount?: string, paidDate = today()) => sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate, paidAmount });

	beforeAll(async () => {
		id = await sentStatement(2026);
		// a period that has ended, so today is a payment day
		await db.update(utilityStatements).set({ balance: '-120.00', periodEnd: '2026-06-30' }).where(eq(utilityStatements.id, id));
	});

	afterAll(async () => {
		await db.delete(documents).where(eq(documents.statementId, id));
		await db.delete(utilityStatements).where(eq(utilityStatements.id, id));
	});

	it('lässt die Rückerstattung mit dem Rest offen und zahlt ohne Betrag den Rest', async () => {
		await expectRejection(await pay('50.00'), 400, 'Paid amount not above 0.00', 'STATEMENT_PAID_AMOUNT_ZERO');
		expect(await (await pay('-50.00')).json()).toMatchObject({ status: 'sent', paidAmount: '-50.00' });
		// the rest entered with an earlier day: paid on the day of the latest payment (code review 959a-1 C-5)
		expect(await (await pay(undefined, '2026-07-01')).json()).toMatchObject({
			status: 'paid',
			paidDate: today(),
			paidAmount: '-120.00',
			payments: [{ amount: '-50.00' }, { amount: '-70.00', date: '2026-07-01' }]
		});
	});
});
