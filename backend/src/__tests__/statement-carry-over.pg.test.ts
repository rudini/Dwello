/**
 * #403/#448: a Saldo below the Mindestbetrag of CHF 5.00 is neither claimed nor paid out but carried over to the next
 * statement of the same Mietvertrag; a sent statement without payment is «Erledigt»; the Schlussabrechnung has no
 * Mindestbetrag; statements sent under #94 stay as the tenant was told. Against the real database
 */

import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../db/connection';
import { contractAdvancePayments, contractCategories, documents, invoices, rentalContracts, utilityStatements } from '../db/schema';
import { callApi, sendJson } from './helpers/auth';
import { expectRejection, idOf, insertInvoice } from './helpers/records';
import { createRental } from './helpers/rental';

type Rental = Awaited<ReturnType<typeof createRental>>;
type Statement = {
	id: string;
	status: string;
	balance: string;
	paidDate: string | null;
	paidAmount: string | null;
	carriedFrom: { id: string; statementNumber: string; balance: string } | null;
};

const rentals: Rental[] = [];
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

// No invoices and no Akonto: a statement's own Saldo is 0.00, so what it shows beyond that is the Übertrag
const rentalOf = async (contract: { startDate: string; endDate?: string; monthlyAdvancePayment?: string } = { startDate: '2020-01-01' }) => {
	const rental = await createRental(crypto.randomUUID(), { monthlyAdvancePayment: '0', managementFeeAgreed: false, ...contract });
	rentals.push(rental);
	return rental;
};
const generate = async (rental: Rental, year: number) =>
	idOf(
		await sendJson('POST', '/api/v1/statements/generate', {
			contractId: rental.contract,
			buildingId: rental.building,
			periodStart: `${year}-01-01`,
			periodEnd: `${year}-12-31`
		})
	);
const read = async (id: string) => (await (await callApi(`/api/v1/statements/${id}`)).json()) as Statement;
const send = async (id: string) => (await (await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'sent' })).json()) as Statement;
// a statement of the year with the given Saldo, sent
const sentWith = async (rental: Rental, year: number, balance: string) => {
	const id = await generate(rental, year);
	await db.update(utilityStatements).set({ balance }).where(eq(utilityStatements.id, id));
	return send(id);
};

afterAll(async () => {
	for (const rental of rentals) {
		const ids = db.select({ id: utilityStatements.id }).from(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
		await db.delete(documents).where(inArray(documents.statementId, ids)); // the Mahnung
		await db.update(utilityStatements).set({ carriedFromId: null }).where(eq(utilityStatements.contractId, rental.contract));
		await db.delete(invoices).where(eq(invoices.buildingId, rental.building));
		await db.delete(utilityStatements).where(eq(utilityStatements.contractId, rental.contract));
		await rental.remove();
	}
});

describe('Saldo unter CHF 5', () => {
	it.each(['3.00', '-3.00', '4.95', '0.00'])('ist bei %s mit dem Versenden erledigt, ohne Zahlung', async (balance) => {
		const sent = await sentWith(await rentalOf(), 2024, balance);

		expect(sent).toMatchObject({ status: 'settled', paidDate: null, paidAmount: null });
	});

	it.each(['5.00', '-5.00'])('bleibt bei %s versendet', async (balance) => {
		expect(await sentWith(await rentalOf(), 2024, balance)).toMatchObject({ status: 'sent' });
	});

	it('lässt sich als erledigte Abrechnung nicht als bezahlt markieren und nicht zurücksetzen', async () => {
		const sent = await sentWith(await rentalOf(), 2024, '3.00');

		const paid = await sendJson('PUT', `/api/v1/statements/${sent.id}/status`, { status: 'paid', paidDate: today() });
		expect(paid.status).toBe(400);
		await expectRejection(await callApi(`/api/v1/statements/${sent.id}/payment-reset`, { method: 'POST' }), 400, 'Statement is not paid', 'STATEMENT_NOT_PAID');
		expect(await read(sent.id)).toMatchObject({ status: 'settled', paidDate: null });
	});

	it('wird als erledigte Abrechnung nicht gemahnt', async () => {
		const sent = await sentWith(await rentalOf(), 2024, '3.00');
		await db.update(utilityStatements).set({ paymentDeadline: '2025-01-31' }).where(eq(utilityStatements.id, sent.id));

		const reminder = await sendJson('POST', `/api/v1/statements/${sent.id}/reminders`, {});

		expect(reminder.status).toBe(400);
		expect(await reminder.json()).toMatchObject({ code: 'REMINDER_NOT_SENT' });
	});

	it('zählt eine erledigte Abrechnung unter «Erledigt», nicht unter «Bezahlt» oder «Überfällig»', async () => {
		const rental = await rentalOf();
		const sent = await sentWith(rental, 2024, '3.00');
		await db.update(utilityStatements).set({ paymentDeadline: '2025-01-31' }).where(eq(utilityStatements.id, sent.id));
		await generate(rental, 2025); // a draft: must not match the filter

		const { data } = (await (await callApi(`/api/v1/statements?buildingId=${rental.building}&status=settled`)).json()) as { data: Statement[] };
		const counts = await (await callApi(`/api/v1/statements/counts?buildingId=${rental.building}`)).json();

		expect(data.map((s) => s.id)).toEqual([sent.id]);
		expect(counts).toMatchObject({ settled: 1, paid: 0, overdue: 0, draft: 1 });
	});
});

describe('Übertrag', () => {
	it.each([
		['3.00', '3.00'],
		['-3.00', '-3.00']
	])('rechnet einen übertragenen Saldo von %s in die nächste Abrechnung desselben Mietvertrags ein', async (carried, balance) => {
		const rental = await rentalOf();
		const previous = await sentWith(rental, 2024, carried);

		const next = await read(await generate(rental, 2025));

		expect(next.balance).toBe(balance);
		expect(next.carriedFrom).toMatchObject({ id: previous.id, balance: carried });
	});

	it('rechnet einen Saldo nur einmal ein, auch nicht in der übernächsten Abrechnung', async () => {
		const rental = await rentalOf();
		await sentWith(rental, 2023, '3.00');
		const second = await send(await generate(rental, 2024)); // with the Übertrag: 3.00, settled and carried itself

		const third = await read(await generate(rental, 2025));

		expect(second).toMatchObject({ status: 'settled', balance: '3.00' });
		expect(third).toMatchObject({ balance: '3.00', carriedFrom: { id: second.id } });
		expect(((await (await callApi(`/api/v1/statements?contractId=${rental.contract}&status=settled`)).json()) as { data: Statement[] }).data).toHaveLength(2);
	});

	it('rechnet einen Saldo, den die nächste Abrechnung schon zählt, in der übernächsten nicht noch einmal ein', async () => {
		const rental = await rentalOf();
		await sentWith(rental, 2023, '3.00');
		const second = await generate(rental, 2024);
		await db.update(utilityStatements).set({ balance: '53.00' }).where(eq(utilityStatements.id, second)); // claimed
		await send(second);

		expect(await read(await generate(rental, 2025))).toMatchObject({ balance: '0.00', carriedFrom: null });
	});

	// Fachreview 448-1 V-8: übertragen wird der gerundete Saldo: 1'203.02 − 1'200.00 = 3.02 → 3.00
	it('überträgt den auf 5 Rappen gerundeten Saldo', async () => {
		const rental = await rentalOf({ startDate: '2020-01-01', monthlyAdvancePayment: '100' });
		await insertInvoice(rental.building, { amount: '1203.02', invoiceDate: '2024-06-30' });
		const first = await send(await generate(rental, 2024));

		const next = await read(await generate(rental, 2025));

		expect(first).toMatchObject({ status: 'settled', balance: '3.00' });
		expect(next).toMatchObject({ balance: '-1197.00', carriedFrom: { id: first.id, balance: '3.00' } });
	});

	it('rechnet einen Saldo, der ein anderer Mietvertrag übertragen hat, nicht ein', async () => {
		await sentWith(await rentalOf(), 2024, '3.00');

		const other = await read(await generate(await rentalOf(), 2025));

		expect(other).toMatchObject({ balance: '0.00', carriedFrom: null });
	});

	// die berichtigte Abrechnung ersetzt die Abrechnung mit dem Übertrag: sie rechnet ihn wieder ein
	it('bleibt in der berichtigten Abrechnung', async () => {
		const rental = await rentalOf();
		const previous = await sentWith(rental, 2024, '-3.00');
		const next = await generate(rental, 2025);
		await db.update(utilityStatements).set({ balance: '20.00' }).where(eq(utilityStatements.id, next)); // claimed
		await send(next);
		await callApi(`/api/v1/statements/${next}/replace`, { method: 'POST' });

		const corrected = (await (await callApi(`/api/v1/statements/${next}/correction`, { method: 'POST' })).json()) as Statement;

		expect(corrected).toMatchObject({ balance: '-3.00', carriedFrom: { id: previous.id } });
	});

	// PO 2026-10-19 (Fachreview 448-1 M-1): eine nach #94 einbehaltene Rückerstattung steht dem Mieter weiter zu
	it('übernimmt eine kleine Rückerstattung einer Abrechnung, die nach #94 erledigt wurde', async () => {
		const rental = await rentalOf();
		const id = await generate(rental, 2024);
		await db
			.update(utilityStatements)
			.set({ status: 'paid', balance: '-3.00', paidDate: '2025-02-01', paidAmount: '0.00' })
			.where(eq(utilityStatements.id, id));

		const next = await read(await generate(rental, 2025));

		expect(next).toMatchObject({ balance: '-3.00', carriedFrom: { id, balance: '-3.00' } });
		expect(await read(id)).toMatchObject({ status: 'paid', paidAmount: '0.00' });
	});

	// #94: eine erlassene Nachzahlung bleibt erlassen
	it('übernimmt keine kleine Nachzahlung einer Abrechnung, die nach #94 als bezahlt erledigt wurde', async () => {
		const rental = await rentalOf();
		const id = await generate(rental, 2024);
		await db
			.update(utilityStatements)
			.set({ status: 'paid', balance: '3.00', paidDate: '2025-02-01', paidAmount: '0.00' })
			.where(eq(utilityStatements.id, id));

		const next = await read(await generate(rental, 2025));

		expect(next).toMatchObject({ balance: '0.00', carriedFrom: null });
		expect(await read(id)).toMatchObject({ status: 'paid', paidAmount: '0.00' });
	});
});

// PO 2026-10-19 (Fachreview 448-1 V-2): eine erledigte Abrechnung lässt sich berichtigen; ein schon übertragener Saldo
// gilt in der berichtigten als «Bereits verrechnet mit NK-…», einer noch nicht übertragene entfällt
describe('Übertrag und Berichtigung', () => {
	const replaceAndCorrect = async (id: string) => {
		await callApi(`/api/v1/statements/${id}/replace`, { method: 'POST' });
		return (await (await callApi(`/api/v1/statements/${id}/correction`, { method: 'POST' })).json()) as Statement & {
			priorPayments: string;
			priorPaidOn: string[];
			offsetWith: { statementNumber: string; amount: string }[];
		};
	};

	it('lässt eine erledigte Abrechnung berichtigen, ohne nach dem bereits Bezahlten zu fragen', async () => {
		const sent = await sentWith(await rentalOf(), 2024, '3.00');

		const replaced = await (await callApi(`/api/v1/statements/${sent.id}/replace`, { method: 'POST' })).json();
		const asked = await sendJson('POST', `/api/v1/statements/${sent.id}/replace`, { paidAmount: '1.00' });

		expect(replaced).toMatchObject({ status: 'replaced' });
		expect(asked.status).toBe(409);
	});

	it('rechnet einen schon übertragenen Saldo in der berichtigten Abrechnung als verrechnet an', async () => {
		const rental = await rentalOf();
		const first = await sentWith(rental, 2024, '3.00');
		const next = await send(await generate(rental, 2025)); // with the Übertrag: 3.00, settled itself

		const corrected = await replaceAndCorrect(first.id);
		const detail = (await read(corrected.id)) as typeof corrected;

		expect(corrected).toMatchObject({ priorPayments: '3.00', balance: '-3.00' });
		expect(detail.priorPaidOn).toEqual([]);
		expect(detail.offsetWith).toEqual([{ statementNumber: (next as Statement & { statementNumber: string }).statementNumber, amount: '3.00' }]);
		expect((await read(next.id)).carriedFrom).toMatchObject({ id: first.id });
	});

	// Fachreview 448-2 V-14: verrechnet ist ein Saldo erst in einer versendeten Abrechnung; ein Entwurf verliert ihn
	it('nimmt einem Entwurf, der den Saldo zählt, den Übertrag, wenn die übertragene Abrechnung ersetzt wird', async () => {
		const rental = await rentalOf();
		const first = await sentWith(rental, 2024, '-3.00');
		const draft = await generate(rental, 2025);
		await db.update(utilityStatements).set({ balance: '47.00' }).where(eq(utilityStatements.id, draft)); // own Saldo 50.00

		const corrected = await replaceAndCorrect(first.id);
		const replacedDraft = await read(draft); // Fachreview 448-3 V-24: right after the replacement
		// Code-Review 448-1 C-1: also once the draft is calculated again
		await callApi(`/api/v1/statements/${draft}/recalculation`, { method: 'POST' });

		expect(corrected).toMatchObject({ priorPayments: '0.00', balance: '0.00' });
		expect(replacedDraft).toMatchObject({ balance: '50.00', carriedFrom: null });
		expect(await read(draft)).toMatchObject({ balance: '0.00', carriedFrom: null });
	});

	// Fachreview 448-2 M-5: auch eine nach #94 einbehaltene Rückerstattung, die die nächste Abrechnung schon zählt
	it('rechnet eine nach #94 erledigte Rückerstattung, die die nächste Abrechnung zählt, als verrechnet an', async () => {
		const rental = await rentalOf();
		const first = await generate(rental, 2024);
		await db
			.update(utilityStatements)
			.set({ status: 'paid', balance: '-3.00', paidDate: '2025-02-01', paidAmount: '0.00' })
			.where(eq(utilityStatements.id, first));
		const next = await generate(rental, 2025);
		await db.update(utilityStatements).set({ balance: '50.00' }).where(eq(utilityStatements.id, next)); // claimed
		await send(next);

		const corrected = await replaceAndCorrect(first);

		expect(corrected).toMatchObject({ priorPayments: '-3.00', balance: '3.00' });
	});

	it('lässt einen noch nicht übertragenen Saldo entfallen; die nächste Abrechnung nimmt den der berichtigten', async () => {
		const rental = await rentalOf();
		const first = await sentWith(rental, 2024, '3.00');
		const corrected = await replaceAndCorrect(first.id);
		await db.update(utilityStatements).set({ balance: '-2.00' }).where(eq(utilityStatements.id, corrected.id));
		await send(corrected.id);

		const next = await read(await generate(rental, 2025));

		expect(corrected).toMatchObject({ priorPayments: '0.00' });
		expect(next).toMatchObject({ balance: '-2.00', carriedFrom: { id: corrected.id } });
	});
});

describe('Schlussabrechnung', () => {
	it.each(['3.00', '-3.00'])('fordert einen Saldo von %s ein oder zahlt ihn aus', async (balance) => {
		const rental = await rentalOf({ startDate: '2020-01-01', endDate: '2024-12-31' });

		const sent = await sentWith(rental, 2024, balance);
		const paid = await (await sendJson('PUT', `/api/v1/statements/${sent.id}/status`, { status: 'paid', paidDate: today() })).json();

		expect(sent).toMatchObject({ status: 'sent' });
		expect(paid).toMatchObject({ status: 'paid', paidAmount: balance });
	});

	it('mahnt auch eine kleine Nachzahlung nach Ablauf der Zahlungsfrist', async () => {
		const sent = await sentWith(await rentalOf({ startDate: '2020-01-01', endDate: '2024-12-31' }), 2024, '3.00');
		await db.update(utilityStatements).set({ paymentDeadline: '2025-01-31' }).where(eq(utilityStatements.id, sent.id));

		const reminder = await sendJson('POST', `/api/v1/statements/${sent.id}/reminders`, {});

		expect(await reminder.json()).not.toMatchObject({ code: expect.any(String) });
	});

	// das Ende am ersten Tag nach der Periode ist keine Schlussabrechnung dieser Periode; eines mitten darin schon
	it.each([
		['2025-01-01', 'settled'],
		['2024-06-30', 'sent'],
		['2024-01-01', 'sent']
	])('mit Vertragsende %s ist eine Abrechnung 2024 mit 3.00 nach dem Versenden %s', async (endDate, status) => {
		expect(await sentWith(await rentalOf({ startDate: '2020-01-01', endDate }), 2024, '3.00')).toMatchObject({ status });
	});

	it('rechnet den Übertrag der letzten Abrechnung ein', async () => {
		const rental = await rentalOf({ startDate: '2020-01-01', endDate: '2024-06-30' });
		const previous = await sentWith(rental, 2023, '3.00');

		const last = await send(await generate(rental, 2024));

		expect(last).toMatchObject({ balance: '3.00', status: 'sent', carriedFrom: { id: previous.id } });
	});
});

// #403 (4): ein Mieter darf vor dem Abrechnungsdatum zahlen, aber nicht vor dem Ende der Abrechnungsperiode
describe('Zahlungsdatum', () => {
	let id: string;
	beforeAll(async () => {
		id = (await sentWith(await rentalOf(), 2024, '100.00')).id;
	});

	it('liegt nicht vor dem Ende der Abrechnungsperiode', async () => {
		await expectRejection(
			await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: '2024-12-30' }),
			400,
			'Payment date before the end of the period',
			'PAID_DATE_BEFORE_PERIOD_END',
			{ date: '2024-12-31' }
		);
	});

	it('darf vor dem Abrechnungsdatum liegen', async () => {
		const paid = await sendJson('PUT', `/api/v1/statements/${id}/status`, { status: 'paid', paidDate: '2024-12-31' });

		expect(await paid.json()).toMatchObject({ status: 'paid', paidDate: '2024-12-31' });
	});
});

// #403 (5): beim Berichtigen einer versendeten oder überfälligen Abrechnung, was der Mieter schon überwiesen hat
describe('Bereits bezahlt beim Berichtigen', () => {
	it('hält einen Teilbetrag auf der ersetzten Abrechnung fest und rechnet ihn in der berichtigten an', async () => {
		const sent = await sentWith(await rentalOf(), 2024, '100.00');

		const replaced = await (await sendJson('POST', `/api/v1/statements/${sent.id}/replace`, { paidAmount: '40.00' })).json();
		const corrected = await (await callApi(`/api/v1/statements/${sent.id}/correction`, { method: 'POST' })).json();

		expect(replaced).toMatchObject({ status: 'replaced', paidAmount: '40.00' });
		expect(corrected).toMatchObject({ priorPayments: '40.00', balance: '-40.00' });
	});

	// Fachreview 448-1 V-1: bei einer Rückerstattung hat der Vermieter schon zurückerstattet; das zählt negativ
	it('hält bei einer Rückerstattung das schon Zurückerstattete negativ fest', async () => {
		const sent = await sentWith(await rentalOf(), 2024, '-100.00');

		const replaced = await (await sendJson('POST', `/api/v1/statements/${sent.id}/replace`, { paidAmount: '40.00' })).json();
		const corrected = await (await callApi(`/api/v1/statements/${sent.id}/correction`, { method: 'POST' })).json();

		expect(replaced).toMatchObject({ paidAmount: '-40.00' });
		expect(corrected).toMatchObject({ priorPayments: '-40.00', balance: '40.00' });
	});

	it('lehnt einen Betrag auf einer bezahlten Abrechnung ab: sie nennt ihn schon', async () => {
		const sent = await sentWith(await rentalOf(), 2024, '100.00');
		await sendJson('PUT', `/api/v1/statements/${sent.id}/status`, { status: 'paid', paidDate: today() });

		await expectRejection(
			await sendJson('POST', `/api/v1/statements/${sent.id}/replace`, { paidAmount: '40.00' }),
			409,
			'Only a sent or overdue statement takes what was already paid',
			'STATEMENT_PAID_AMOUNT_NOT_OPEN'
		);
		expect(await read(sent.id)).toMatchObject({ status: 'paid', paidAmount: '100.00' });
	});

	it.each(['-1.00', 'abc'])('lehnt den Betrag %s ab', async (paidAmount) => {
		const sent = await sentWith(await rentalOf(), 2024, '100.00');

		const response = await sendJson('POST', `/api/v1/statements/${sent.id}/replace`, { paidAmount });

		await expectRejection(response, 409, 'Invalid amount already paid', 'STATEMENT_PAID_AMOUNT_INVALID', { amount: paidAmount });
		expect(await read(sent.id)).toMatchObject({ status: 'sent' });
	});
});

// #403 (6): das PDF druckt die Bemerkung; eine geänderte verwirft das gespeicherte
describe('Bemerkung', () => {
	// Code-Review 448-1 C-4: die Bearbeitungsseite sendet eine leere Bemerkung als ''
	it('behält das gespeicherte PDF, wenn die leere Bemerkung leer bleibt', async () => {
		const sent = await sentWith(await rentalOf(), 2024, '100.00');
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: new Date() }).where(eq(utilityStatements.id, sent.id));

		await sendJson('PUT', `/api/v1/statements/${sent.id}`, { notes: '' });

		const [row] = await db.select({ pdfBlob: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, sent.id));
		expect(row.pdfBlob).toBe('JVBERi0=');
	});

	it('verwirft das gespeicherte PDF, wenn sie sich ändert', async () => {
		const sent = await sentWith(await rentalOf(), 2024, '100.00');
		await db.update(utilityStatements).set({ pdfBlob: 'JVBERi0=', pdfGeneratedAt: new Date() }).where(eq(utilityStatements.id, sent.id));

		await sendJson('PUT', `/api/v1/statements/${sent.id}`, { notes: 'Ratenzahlung vereinbart' });

		const [row] = await db.select({ pdfBlob: utilityStatements.pdfBlob }).from(utilityStatements).where(eq(utilityStatements.id, sent.id));
		expect(row.pdfBlob).toBeNull();
	});
});

// #506 C: a draft created before the Übertrag it would count now is not current (Fachreview 448-3 V-23)
describe('Übertrag eines Entwurfs', () => {
	const changes = async (id: string) =>
		(await (await callApi(`/api/v1/statements/${id}/changed-invoices`)).json()) as { carryOverChanged: boolean };

	it('meldet einem Entwurf, dass er jetzt einen anderen Übertrag verrechnen würde', async () => {
		const rental = await rentalOf();
		const previous = await generate(rental, 2024);
		await db.update(utilityStatements).set({ balance: '3.00' }).where(eq(utilityStatements.id, previous));
		const draft = await generate(rental, 2025);
		expect((await changes(draft)).carryOverChanged).toBe(false);

		await send(previous);

		expect((await changes(draft)).carryOverChanged).toBe(true);
	});

	// Fachreview 506-1 V-8, code review 506-1 C-1: such a draft is not «zu versenden» on the Übersicht either
	it('zählt einen Entwurf, der jetzt einen anderen Übertrag verrechnen würde, nicht als zu versenden', async () => {
		const toSend = async () => ((await (await callApi('/api/v1/dashboard')).json()) as { statements: { toSend: number } }).statements.toSend;
		const rental = await rentalOf();
		const previous = await generate(rental, 2024);
		await db.update(utilityStatements).set({ balance: '3.00' }).where(eq(utilityStatements.id, previous));
		await generate(rental, 2025);
		const before = await toSend();

		await send(previous);

		// the sent one is no draft any more, and the other is not current
		expect(await toSend()).toBe(before - 2);
	});
});

// #506 B: an Übertrag no statement counts any more is a task, settled by hand
describe('Offener Übertrag', () => {
	type Open = { id: string; statementNumber: string; tenantName: string; balance: string };
	const openCarryOvers = async () =>
		((await (await callApi('/api/v1/dashboard')).json()) as { contractTasks: { openCarryOvers: Open[] } }).contractTasks.openCarryOvers;
	const settle = (id: string) => sendJson('POST', `/api/v1/statements/${id}/carry-settled`, {});
	const replaceAndCorrect = async (id: string) => {
		await callApi(`/api/v1/statements/${id}/replace`, { method: 'POST' });
		return (await (await callApi(`/api/v1/statements/${id}/correction`, { method: 'POST' })).json()) as Statement & { priorPayments: string };
	};

	it('nennt einen Übertrag, wenn der Mietvertrag in seiner Periode endet', async () => {
		const rental = await rentalOf();
		const previous = await sentWith(rental, 2024, '3.00');
		expect((await sendJson('PUT', `/api/v1/contracts/${rental.contract}`, { endDate: '2024-12-31', confirmPastEnd: true })).status).toBe(200);

		expect(await openCarryOvers()).toContainEqual(expect.objectContaining({ id: previous.id, balance: '3.00' }));
	});

	it('nennt einen Übertrag, den eine spätere versendete Abrechnung nicht verrechnet', async () => {
		const rental = await rentalOf();
		const previous = await generate(rental, 2023);
		await db.update(utilityStatements).set({ balance: '-3.00' }).where(eq(utilityStatements.id, previous));
		const later = await generate(rental, 2024);
		await send(previous);
		await send(later);

		expect(await openCarryOvers()).toContainEqual(expect.objectContaining({ id: previous, balance: '-3.00' }));
	});

	it('nennt einen Übertrag nicht, den die nächste Abrechnung noch verrechnen kann', async () => {
		const rental = await rentalOf();
		const previous = await sentWith(rental, 2024, '3.00');

		expect((await openCarryOvers()).map((open) => open.id)).not.toContain(previous.id);
	});

	it('gleicht einen Übertrag von Hand aus: keine Aufgabe mehr, und keine spätere Abrechnung verrechnet ihn', async () => {
		const rental = await rentalOf();
		const previous = await sentWith(rental, 2024, '3.00');

		const response = await settle(previous.id);

		expect(response.status).toBe(200);
		expect(await response.json()).toMatchObject({ carrySettledOn: today() });
		expect((await openCarryOvers()).map((open) => open.id)).not.toContain(previous.id);
		expect((await read(await generate(rental, 2025))).carriedFrom).toBeNull();
	});

	// Fachreview 506-1 V-1: an open Übertrag is not counted by a later statement after all
	it('verrechnet einen offenen Übertrag in keiner späteren Abrechnung', async () => {
		const rental = await rentalOf();
		const previous = await generate(rental, 2023);
		await db.update(utilityStatements).set({ balance: '-3.00' }).where(eq(utilityStatements.id, previous));
		const later = await generate(rental, 2024);
		await send(previous);
		await db.update(utilityStatements).set({ balance: '30.00' }).where(eq(utilityStatements.id, later));
		await send(later);

		expect((await read(await generate(rental, 2025))).carriedFrom).toBeNull();
	});

	it('nimmt den Übertrag beim Ausgleich von Hand einem Entwurf, der ihn verrechnet', async () => {
		const rental = await rentalOf();
		const previous = await sentWith(rental, 2024, '3.00');
		const draft = await generate(rental, 2025);

		await settle(previous.id);

		expect(await read(draft)).toMatchObject({ balance: '0.00', carriedFrom: null });
	});

	// Fachreview 506-1 V-3: after the period the tenant pays a Nebenkostenpauschale only
	it('nennt einen Übertrag, wenn der Mietvertrag danach nur eine Nebenkostenpauschale hat', async () => {
		const rental = await rentalOf();
		const previous = await sentWith(rental, 2024, '3.00');
		await db.update(rentalContracts).set({ flatRateUtilityCharge: '80.00' }).where(eq(rentalContracts.id, rental.contract));
		await db.update(contractCategories).set({ agreed: false }).where(eq(contractCategories.contractId, rental.contract));

		expect(await openCarryOvers()).toContainEqual(expect.objectContaining({ id: previous.id }));
	});

	// PR #941 review: an Akonto of 0 from the day after the period ends the Akonto of before
	it('nennt einen Übertrag, wenn das Akonto ab dem Tag nach der Periode 0 ist und danach nur die Pauschale gilt', async () => {
		const rental = await rentalOf();
		await db.update(contractAdvancePayments).set({ amount: '100.00' }).where(eq(contractAdvancePayments.contractId, rental.contract));
		await db.insert(contractAdvancePayments).values({ contractId: rental.contract, validFrom: '2025-01-01', amount: '0.00' });
		const previous = await sentWith(rental, 2024, '3.00');
		await db.update(rentalContracts).set({ flatRateUtilityCharge: '80.00' }).where(eq(rentalContracts.id, rental.contract));
		await db.update(contractCategories).set({ agreed: false }).where(eq(contractCategories.contractId, rental.contract));

		expect(await openCarryOvers()).toContainEqual(expect.objectContaining({ id: previous.id }));
	});

	// code review 506-1 C-2: a Pauschale with an Akonto above 0 after the period, or with agreed costs, is still billed
	it.each([
		['einem Akonto über 0', 'advance'],
		['vereinbarten Nebenkosten', 'agreed']
	])('nennt einen Übertrag bei einer Nebenkostenpauschale mit %s nicht', async (_what, kept) => {
		const rental = await rentalOf();
		const previous = await sentWith(rental, 2024, '3.00');
		await db.update(rentalContracts).set({ flatRateUtilityCharge: '80.00' }).where(eq(rentalContracts.id, rental.contract));
		if (kept === 'advance') {
			await db.update(contractCategories).set({ agreed: false }).where(eq(contractCategories.contractId, rental.contract));
			await db.insert(contractAdvancePayments).values({ contractId: rental.contract, validFrom: '2025-01-01', amount: '100.00' });
		}

		expect((await openCarryOvers()).map((open) => open.id)).not.toContain(previous.id);
	});

	// Fachreview 506-1 V-2: a berichtigte Abrechnung counts an Übertrag settled by hand as paid
	it('rechnet einen von Hand ausgeglichenen Übertrag in der berichtigten Abrechnung als bezahlt an', async () => {
		const rental = await rentalOf({ startDate: '2020-01-01', endDate: '2024-12-31' });
		const previous = await generate(rental, 2024);
		await db.update(utilityStatements).set({ balance: '3.00', status: 'settled', statementDate: today() }).where(eq(utilityStatements.id, previous));
		await settle(previous);

		const corrected = await replaceAndCorrect(previous);

		expect(corrected).toMatchObject({ priorPayments: '3.00', balance: '-3.00' });
	});

	// Fachreview 506-1 V-9: «Zahlung zurücksetzen» of a refund settled under #94 carries it over again
	it('nimmt den Ausgleich von Hand zurück, wenn die Zahlung zurückgesetzt wird', async () => {
		const rental = await rentalOf();
		const previous = await generate(rental, 2024);
		await db
			.update(utilityStatements)
			.set({ status: 'paid', balance: '-3.00', paidDate: '2025-02-01', paidAmount: '0.00' })
			.where(eq(utilityStatements.id, previous));
		await settle(previous);

		await callApi(`/api/v1/statements/${previous}/payment-reset`, { method: 'POST' });

		expect(await read(previous)).toMatchObject({ carrySettledOn: null });
	});

	it('lehnt den Ausgleich einer Abrechnung ohne Übertrag ab', async () => {
		const rental = await rentalOf();
		const statement = await sentWith(rental, 2024, '30.00');

		const response = await settle(statement.id);

		expect(response.status).toBe(400);
		expect(((await response.json()) as { code: string }).code).toBe('STATEMENT_NO_CARRY_OVER');
	});
});
