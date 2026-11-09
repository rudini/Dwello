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
	balance: number;
	paidAmount?: number | null;
	unpaid?: boolean; // below the Mindestbetrag, no Schlussabrechnung: no money moves (#94)
	asksPayment?: boolean;
};

/** #959: what is still owed after the part payments recorded, in francs, without the sign of the Saldo */
export const openAmount = ({ balance, paidAmount }: Owed) =>
	Math.abs(Math.round((balance - (paidAmount ?? 0)) * 100) / 100);

/** «Bezahlt: CHF x, offen: CHF y» on a sent or overdue statement a part was paid on (#959, Fachreview 959-1 Regel 1) */
export function partPaid(statement: Owed): string | null {
	// a paid one has nothing open, a replaced one asks for nothing (the backend says so, #788)
	if (!statement.paidAmount || !openAmount(statement) || statement.asksPayment === false) return null;
	const amounts = {
		paid: formatCurrency(Math.abs(statement.paidAmount)),
		rest: formatCurrency(openAmount(statement))
	};
	return statement.balance < 0
		? m.statements_part_refunded(amounts)
		: m.statements_part_paid(amounts);
}

/** The amount of «Als bezahlt markieren» as the backend takes it: with the sign of the Saldo (#959) */
export const signedPaid = ({ balance, unpaid }: Owed, amount: string) =>
	unpaid ? undefined : balance < 0 ? `-${amount.trim()}` : amount.trim();

/** Less than the open amount: a part payment, the statement stays open (#959) */
export const isPartPayment = (statement: Owed, amount: string) =>
	!statement.unpaid && Number(amount) < openAmount(statement);

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

/** #546: what the backend says the recalculation of a sent statement gives (`recalculation()`) */
// open (#1403): what the berichtigte Abrechnung would claim after what was paid, 0 when it claims nothing
export type Recalculated = {
	balance: string;
	difference: string;
	belowMinimum: boolean;
	declineCosts: string | null;
	open: string;
};

// the amount the texts put after «CHF», without a sign
export const francs = (amount: number) => formatCurrency(Math.abs(amount)).replace(/^CHF\s*/, '');
const kindOf = (balance: number) => (balance > 0 ? 'due' : balance < 0 ? 'refund' : 'settled');
type Kind = ReturnType<typeof kindOf>;
const NOW_WAS: Record<`${Kind}_${Kind}`, (values: { tenant: string; now: string; before: string }) => string> = {
	due_due: m.statements_later_now_due_was_due,
	refund_refund: m.statements_later_now_refund_was_refund,
	due_refund: m.statements_later_now_due_was_refund,
	refund_due: m.statements_later_now_refund_was_due,
	due_settled: m.statements_later_now_due_was_settled,
	refund_settled: m.statements_later_now_refund_was_settled,
	settled_due: m.statements_later_now_settled_was_due,
	settled_refund: m.statements_later_now_settled_was_refund,
	settled_settled: m.statements_later_now_same
};

/** #546 (Fachreview 546-1): «Neu berechnet ergibt sich für … statt …», amounts without a sign; the same Saldo says so */
export function recalculatedText(tenant: string, before: number, recalculated: Recalculated): string {
	const now = Number(recalculated.balance);
	const amounts = { tenant, now: francs(now), before: francs(before) };
	const text = now === before ? m.statements_later_now_same({ tenant }) : NOW_WAS[`${kindOf(now)}_${kindOf(before)}`](amounts);
	return recalculated.belowMinimum ? `${text} ${m.statements_later_below_minimum()}` : text;
}

/** #1403 (Fachreview 1403-1 V-2): the warning before a Mahnung while a correction is due, against the open amount
 *  `before` the dialog names; without the amount correcting would claim, or with the same one, it points to the hint */
export function reminderCorrectionText(
	tenant: string,
	before: number,
	later: {
		correctionDue: boolean;
		recalculated?: Recalculated | null;
		uncalculableKeys?: unknown[];
	}
): string | null {
	if (!later.correctionDue) return null;
	const open = later.recalculated && !later.uncalculableKeys?.length ? Number(later.recalculated.open) : before;
	if (open === before) return m.statements_reminder_correction_unquantified();
	if (!open) return m.statements_reminder_correction_nothing_due({ tenant, before: francs(before) });
	return m.statements_reminder_correction_due({ tenant, now: francs(open), before: francs(before) });
}

/** A key that cannot be calculated for a building: why, and for which apartment if for one (#1315) */
export type KeyFailure = { key: string; reason: string; apartment: string | null; building: string };
const failureTexts: Record<string, (params: { key: string; apartment: string; building: string }) => string> = {
	STATEMENT_KEY_REASON_DIVISION_BY_ZERO: m.statements_key_failure_division_by_zero,
	STATEMENT_KEY_REASON_NEGATIVE: m.statements_key_failure_negative,
	STATEMENT_KEY_REASON_ALL_ZERO: m.statements_key_failure_all_zero
};

/** One sentence per key and building, the buildings as given, in each the keys by name (Fachreview 1309-1) */
export function keyFailuresText(failures: KeyFailure[]) {
	const once = new Map(failures.map((failure) => [`${failure.building}\n${failure.key}`, failure]));
	const buildings = [...new Set(failures.map((failure) => failure.building))];
	return buildings
		.flatMap((building) =>
			[...once.values()].filter((failure) => failure.building === building).sort((a, b) => a.key.localeCompare(b.key))
		)
		.map(({ reason, key, apartment, building }) =>
			(failureTexts[reason] ?? m.statements_key_failure_other)({ key, apartment: apartment ?? '', building })
		)
		.join(' ');
}

/**
 * A key per position of a statement that outlasts a recalculation, which gives the positions new ids (#1366): its
 * category and key, and how many positions of that pair came before it (a category or key deleted before
 * #1160/#1255 is null; positions saved through the API may repeat a pair, fallback review of #1369)
 */
export const withPositionKeys = <
	P extends { categoryId?: string | null; distributionKeyId?: string | null }
>(
	positions: P[]
) =>
	positions.map((item, index) => {
		const pair = `${item.categoryId}/${item.distributionKeyId}`;
		const before = positions
			.slice(0, index)
			.filter((other) => `${other.categoryId}/${other.distributionKeyId}` === pair);
		return { item, key: `${pair}/${before.length}` };
	});
