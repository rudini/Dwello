/**
 * What a statement's Saldo asks of whom (#815): the backend says it, the pages only show it. A Saldo below CHF 5 is
 * carried over unless it is a Schlussabrechnung's (#448), settled under #94 a Nachzahlung was waived (448-2 V-18), a
 * Mahnung waits for the last one's Zahlungsfrist (#107)
 */

import { describe, expect, it } from 'bun:test';
import { advanceChanged, paymentOf } from '../services/statement-payment';

const today = '2026-10-10';
const statement = (fields: Record<string, unknown>) => ({
	balance: '120.00',
	status: 'sent',
	final: false,
	paidAmount: null,
	paymentDeadline: '2026-11-10',
	nextReminderFrom: null,
	...fields
});
const of = (fields: Record<string, unknown>) => paymentOf(statement(fields), today);

describe('Was der Saldo einer Nebenkostenabrechnung verlangt', () => {
	it('fordert eine Nachzahlung ab CHF 5, auf einer Schlussabrechnung jede', () => {
		expect(of({})).toMatchObject({ unpaid: false, claimed: true });
		expect(of({ balance: '4.95' })).toMatchObject({ unpaid: true, claimed: false });
		expect(of({ balance: '4.95', final: true })).toMatchObject({ unpaid: false, claimed: true });
		expect(of({ balance: '-120.00' })).toMatchObject({ unpaid: false, claimed: false });
	});

	it('verlangt bei einem Saldo von 0.00 und einer verrechneten nichts', () => {
		expect(of({ balance: '0.00', final: true })).toMatchObject({ unpaid: true, claimed: false });
		expect(of({ status: 'settled' })).toMatchObject({ unpaid: true, claimed: false });
	});

	// 448-2 V-18: paid with 0.00 below CHF 5, a Nachzahlung was waived, a refund is carried over
	it('erwartet nach einer Zahlung von 0.00 unter CHF 5 nichts mehr und nennt eine Nachzahlung erlassen', () => {
		const paidNothing = { status: 'paid', paidAmount: '0.00', final: true };
		expect(of({ ...paidNothing, balance: '4.00' })).toMatchObject({ noPayment: true, waived: true });
		expect(of({ ...paidNothing, balance: '-4.00' })).toMatchObject({ noPayment: true, waived: false });
		expect(of({ ...paidNothing, balance: '4.00', paidAmount: null })).toMatchObject({ noPayment: false, waived: false });
		expect(of({ balance: '4.00' })).toMatchObject({ noPayment: true, waived: false });
	});

	// 448-3 V-25, 448-4 V-32: what a berichtigte Abrechnung finds already carried over
	it('nennt den Saldo einer verrechneten und einer unter #94 erledigten Rückerstattung übertragen', () => {
		expect(of({ status: 'settled' })).toMatchObject({ carried: true });
		expect(of({ status: 'settled', balance: '0.00' })).toMatchObject({ carried: false });
		expect(of({ status: 'paid', paidAmount: '0.00', balance: '-4.00' })).toMatchObject({ carried: true });
		expect(of({ status: 'paid', paidAmount: '0.00', balance: '4.00' })).toMatchObject({ carried: false });
		expect(of({ status: 'paid', paidAmount: '-4.00', balance: '-4.00' })).toMatchObject({ carried: false });
	});

	// #107: the next Mahnung waits for the last one's Zahlungsfrist
	it('nennt den Tag, ab dem die nächste Mahnung möglich ist, solange er noch kommt', () => {
		expect(of({ nextReminderFrom: '2026-10-11' })).toMatchObject({ reminderWaitsUntil: '2026-10-11' });
		expect(of({ nextReminderFrom: today })).toMatchObject({ reminderWaitsUntil: null });
		expect(of({})).toMatchObject({ reminderWaitsUntil: null });
	});

	// #92: a payment taken back makes the statement overdue again once its Zahlungsfrist has passed
	it('sagt, ob die Zahlungsfrist vorbei ist', () => {
		expect(of({ paymentDeadline: '2026-10-09' })).toMatchObject({ deadlinePassed: true });
		expect(of({ paymentDeadline: today })).toMatchObject({ deadlinePassed: false });
		expect(of({ paymentDeadline: null })).toMatchObject({ deadlinePassed: false });
	});
});

// #464 (domain review F-4): a berichtigte Abrechnung counting another Akonto than the replaced one is checked before sending
describe('Akonto einer berichtigten Abrechnung', () => {
	it('nennt nur einen Entwurf geändert, dessen Akonto von der ersetzten Abrechnung abweicht', () => {
		const draft = { status: 'draft', totalAdvancePayments: '1800.00' };
		expect(advanceChanged(draft, { totalAdvancePayments: '1200.00' })).toBe(true);
		expect(advanceChanged(draft, { totalAdvancePayments: '1800.00' })).toBe(false);
		expect(advanceChanged({ ...draft, status: 'sent' }, { totalAdvancePayments: '1200.00' })).toBe(false);
		expect(advanceChanged(draft, null)).toBe(false);
	});
});
