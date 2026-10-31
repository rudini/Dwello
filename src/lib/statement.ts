import { m } from '$lib/paraglide/messages';
import { isDay, localToday } from '$lib/contract-status';
import { formatCurrency, formatDate } from '$lib/utils/format';
import { apiCall } from './api';
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

type Owed = {
	status: StatementStatus;
	balance: number;
	paidAmount?: number | null;
	waived?: boolean;
};

/** #959: what is still owed after the part payments recorded, in francs, without the sign of the Saldo */
export const openAmount = ({ balance, paidAmount }: Owed) =>
	Math.abs(Math.round((balance - (paidAmount ?? 0)) * 100) / 100);

/** «Bezahlt: CHF x, offen: CHF y» on a sent or overdue statement a part was paid on (#959, Fachreview 959-1 Regel 1) */
export function partPaid(statement: Owed): string | null {
	if (!statement.paidAmount || (statement.status !== 'sent' && statement.status !== 'overdue'))
		return null;
	const amounts = {
		paid: formatCurrency(Math.abs(statement.paidAmount)),
		rest: formatCurrency(openAmount(statement))
	};
	return statement.balance < 0
		? m.statements_part_refunded(amounts)
		: m.statements_part_paid(amounts);
}

/** The amount of «Als bezahlt markieren» as the backend takes it: with the sign of the Saldo (#959) */
export const signedPaid = ({ balance, waived }: Owed, amount: string) =>
	waived ? undefined : balance < 0 ? `-${amount.trim()}` : amount.trim();

/** Less than the open amount: a part payment, the statement stays open (#959) */
export const isPartPayment = (statement: Owed, amount: string) =>
	!statement.waived && Number(amount) < openAmount(statement);

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

/** Whether the Abrechnungsperiode is still running, as the backend says it by the Swiss day (#815) */
export async function periodRunning(periodEnd: string): Promise<boolean> {
	if (!isDay(periodEnd)) return false;
	const response = await apiCall<{ running: boolean }>(
		`/statements/check-period?periodEnd=${encodeURIComponent(periodEnd)}`
	);
	return response.data?.running === true;
}
