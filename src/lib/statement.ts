import { m } from '$lib/paraglide/messages';
import { isDay, localToday } from '$lib/contract-status';
import { formatDate } from '$lib/utils/format';
import type { StatementStatus } from './types';
import type { Tone } from './ui/tone';
import type { IconName } from './ui/icons';

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
	get settled() {
		return m.statements_status_settled();
	},
	get overdue() {
		return m.statements_status_overdue();
	},
	get replaced() {
		return m.statements_status_replaced();
	}
};

export const statusTones: Record<StatementStatus, Tone> = {
	draft: 'neutral',
	sent: 'info',
	paid: 'positive',
	settled: 'neutral', // no payment: not the colour of «Bezahlt» (personas dr-weber-448 P-2, anna-448 P-4)
	overdue: 'critical',
	replaced: 'neutral'
};

/** The badge's own icon where the tone's would mislead: «Erledigt» is no hint (persona anna-448-2 P-1) */
export const statementIcons: Partial<Record<StatementStatus, IconName>> = { settled: 'check' };

/** The Saldo in words: positive, the tenant pays; negative, the tenant gets money back */
export function balanceLabel(balance: number): string {
	if (balance > 0) return m.statements_balance_due();
	if (balance < 0) return m.statements_balance_refund();
	return m.statements_balance_settled();
}

/** The day the help of «Bezahlt am» asks for: the tenant's payment, or for a refund the landlord's transfer */
export const paidHelp = (balance: number) =>
	balance < 0 ? m.statements_paid_help_refund() : m.statements_paid_help();

/** Why a payment date cannot be stored: none or a day that does not exist (#138), before the end of the
 * Abrechnungsperiode (#448), or in the future */
export const paidDateError = (paidDate: string, periodEnd: string) =>
	!isDay(paidDate)
		? m.statements_paid_date_invalid()
		: paidDate < periodEnd
			? m.statements_paid_date_before_period({ date: formatDate(periodEnd) })
			: paidDate > localToday()
				? m.statements_paid_date_future()
				: null;

/** The question before a payment date before the Abrechnungsdatum is stored: a tenant may pay early (#448) */
export const earlyPaidDate = (paidDate: string, statementDate: string) =>
	paidDate < statementDate ? m.statements_paid_date_early({ date: formatDate(statementDate) }) : null;

