import { m } from '$lib/paraglide/messages';
import { localToday } from '$lib/contract-status';
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
	if (balance > 0) return 'Nachzahlung';
	if (balance < 0) return 'Rückerstattung';
	return 'Ausgeglichen';
}

/** The day the help of «Bezahlt am» asks for: the tenant's payment, or for a refund the landlord's transfer */
export const paidHelp = (balance: number) =>
	balance < 0
		? 'Der Tag, an dem Sie den Betrag überwiesen haben.'
		: 'Der Tag, an dem das Geld eingegangen ist.';

/** Why a payment date cannot be stored: none, or a day in the future */
export const paidDateError = (paidDate: string) =>
	!/^\d{4}-\d{2}-\d{2}$/.test(paidDate)
		? 'Bitte geben Sie das Zahlungsdatum als TT.MM.JJJJ ein.'
		: paidDate > localToday()
			? 'Das Zahlungsdatum liegt in der Zukunft. Geben Sie den Tag ein, an dem das Geld eingegangen ist.'
			: null;
