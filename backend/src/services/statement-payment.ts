/**
 * What a statement's Saldo asks of whom, by the Swiss day (#815): the pages show it and decide nothing. A Saldo below
 * CHF 5 is neither claimed nor paid out but carried over, unless it is a Schlussabrechnung's (#448)
 */

import { belowMinimum } from './pdf-format';

interface Payment {
	balance: string;
	status: string;
	final: boolean;
	paidAmount: string | null;
	paymentDeadline: string | null;
	nextReminderFrom: string | null;
}


export function paymentOf(statement: Payment, today: string) {
	const balance = Number(statement.balance);
	// no payment: a Saldo of 0, a settled one (also when the contract's end moves into the period afterwards, 448-2
	// V-17) or one below CHF 5 that is no Schlussabrechnung's
	const unpaid = balance === 0 || statement.status === 'settled' || (belowMinimum(balance) && !statement.final);
	// settled under #94, paid with 0.00 below CHF 5: a Nachzahlung was waived, a refund is carried over (448-2 V-18)
	const paidNothing =
		belowMinimum(balance) && statement.status === 'paid' && statement.paidAmount !== null && Number(statement.paidAmount) === 0;
	return {
		unpaid,
		claimed: balance > 0 && !unpaid,
		noPayment: paidNothing || unpaid,
		waived: paidNothing && balance >= 0,
		// already carried over: a settled Saldo other than 0.00, or a refund settled under #94 (448-3 V-25, 448-4 V-32)
		carried: (statement.status === 'settled' && balance !== 0) || (paidNothing && balance < 0),
		// the next Mahnung waits for the last one's Zahlungsfrist (#107)
		reminderWaitsUntil: statement.nextReminderFrom && statement.nextReminderFrom > today ? statement.nextReminderFrom : null,
		deadlinePassed: !!statement.paymentDeadline && statement.paymentDeadline < today
	};
}

/** A draft whose Akonto differs from the replaced statement's is checked before sending (#464, domain review F-4) */
export const advanceChanged = (
	statement: { status: string; totalAdvancePayments: string },
	replaced: { totalAdvancePayments: string } | null
) =>
	statement.status === 'draft' &&
	!!replaced &&
	Math.abs(Number(replaced.totalAdvancePayments) - Number(statement.totalAdvancePayments)) >= 0.005;
