import { m } from '$lib/paraglide/messages';
import { isDay, localToday } from '$lib/contract-status';
import { formatDate } from '$lib/utils/format';
import type { StatementStatus } from './types';
import type { Tone } from './ui/tone';

// Getters: read when shown, in the language of the request
export const statusLabels: Record<StatementStatus, string> = {
	get draft() {
		return m.statements_status_draft();
	},
	get sent() {
		return m.statements_status_sent();
	},
	get paid() {
		return m.statements_status_paid();
	},
	get overdue() {
		return m.statements_status_overdue();
	}
};

export const statusTones: Record<StatementStatus, Tone> = {
	draft: 'neutral',
	sent: 'info',
	paid: 'positive',
	overdue: 'critical'
};

/** The Saldo in words: positive, the tenant pays; negative, the tenant gets money back */
export function balanceLabel(balance: number): string {
	if (balance > 0) return m.statements_balance_due();
	if (balance < 0) return m.statements_balance_refund();
	return m.statements_balance_settled();
}

/** The day the help of «Bezahlt am» asks for: the tenant's payment, or for a refund the landlord's transfer */
export const paidHelp = (balance: number) =>
	balance < 0 ? m.statements_paid_help_refund() : m.statements_paid_help();

/** Why a payment date cannot be stored: none or a day that does not exist, before the Abrechnungsdatum (#138), or in the future */
export const paidDateError = (paidDate: string, statementDate: string) =>
	!isDay(paidDate)
		? m.statements_paid_date_invalid()
		: paidDate < statementDate
			? m.statements_paid_date_before({ date: formatDate(statementDate) })
			: paidDate > localToday()
				? m.statements_paid_date_future()
				: null;

/** The day the next Mahnung becomes possible while the last one's Zahlungsfrist runs, else null (#107) */
export const nextReminderLater = (statement: { nextReminderFrom?: string | null }) =>
	statement.nextReminderFrom && statement.nextReminderFrom > localToday()
		? statement.nextReminderFrom
		: null;
