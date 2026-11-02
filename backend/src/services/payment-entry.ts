/**
 * The checks of a payment the landlord enters on a statement: the amount (#959) and the day (#138)
 */

import { CodedError } from './coded-error';
import { formatCHF } from './pdf-format';
import { isRealDate } from './real-date';
import { swissToday } from './today';

// The amount paid, the rest when none is given: francs and Rappen, as «Bereits bezahlt» (code review 959a-1 C-1), with
// the sign of the Saldo, above 0.00 and at most the rest
export function paidAmountOf(entered: string | undefined, rest: number) {
	if (entered === undefined) return rest;
	if (!/^-?\d+(\.\d{1,2})?$/.test(entered.trim())) throw new CodedError('STATEMENT_PAID_AMOUNT_INVALID', 'Invalid amount paid', { amount: entered });
	const amount = Number(entered);
	if (!(amount * Math.sign(rest) > 0)) throw new CodedError('STATEMENT_PAID_AMOUNT_ZERO', 'Paid amount not above 0.00');
	if (Math.abs(amount) > Math.abs(rest)) throw new CodedError('STATEMENT_PAID_AMOUNT_TOO_HIGH', 'Paid amount above the open amount', { rest: `CHF ${formatCHF(Math.abs(rest))}` });
	return amount;
}

// #138: a day that exists, up to today; from the end of the Abrechnungsperiode: a tenant may pay before the
// Abrechnungsdatum, which the UI confirms first (#448)
export function checkPaidDate(paidDate: string, periodEnd: string) {
	if (!isRealDate(paidDate)) throw new CodedError('PAID_DATE_INVALID', 'Invalid payment date', { date: paidDate });
	if (paidDate < periodEnd) throw new CodedError('PAID_DATE_BEFORE_PERIOD_END', 'Payment date before the end of the period', { date: periodEnd });
	const today = swissToday();
	if (paidDate > today) throw new CodedError('PAID_DATE_IN_FUTURE', 'Payment date in the future', { date: today });
}

// The payments of a statement: one paid before #959 has no list but its date and amount (data export V-1, domain
// review 1001-1 V-1)
export function recordedPayments(statement: { payments: { date: string; amount: string }[]; paidDate: string | null; paidAmount: string | null }) {
	return statement.payments.length ? statement.payments : statement.paidDate ? [{ date: statement.paidDate, amount: statement.paidAmount }] : [];
}
