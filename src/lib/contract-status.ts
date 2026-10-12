import type { ContractHistory } from './types';
import type { Tone } from './ui/tone';
import { formatDate } from './utils/format';
import { m } from '$lib/paraglide/messages';

type Status = ContractHistory['status'];

/** Vertragsstatus on a day (YYYY-MM-DD): running up to and including its last day, as the backend filters */
export function contractStatusOn(
	startDate: string,
	endDate: string | null | undefined,
	today: string
): Status {
	if (startDate.slice(0, 10) > today) return 'future';
	return endDate && endDate.slice(0, 10) < today ? 'ended' : 'active';
}

/** Today in Switzerland, as YYYY-MM-DD: the server runs in UTC, two hours behind in summer */
export const localToday = () =>
	new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' });

/** Vertragsstatus in the glossary's words, with its badge tone */
export const statusBadges: Record<Status, { label: string; tone: Tone }> = {
	active: {
		get label() {
			return m.contracts_status_active();
		},
		tone: 'positive'
	},
	future: {
		get label() {
			return m.contracts_status_future();
		},
		tone: 'info'
	},
	ended: {
		get label() {
			return m.contracts_status_ended();
		},
		tone: 'neutral'
	}
};

/** Contract period in words; a contract without end is named by its start, never "bis heute" */
export function contractPeriod(
	startDate: string,
	endDate: string | null | undefined,
	status: Status,
	terminated = false
) {
	const start = formatDate(startDate);
	if (endDate) {
		const end = formatDate(endDate);
		return terminated
			? m.contracts_period_range_terminated({ start, end })
			: m.contracts_period_range_fixed({ start, end });
	}
	return status === 'future'
		? m.contracts_period_from({ date: start })
		: m.contracts_period_since({ date: start });
}

/** The Vertragsende in words: agreed in a fixed-term contract, or the Kündigungstermin of an open-ended one */
export function contractEnd(endDate: string | null | undefined, terminated = false) {
	if (!endDate) return m.contracts_unlimited();
	const date = formatDate(endDate);
	return terminated ? m.contracts_end_terminated({ date }) : m.contracts_end_fixed({ date });
}

/** A real day as YYYY-MM-DD: not 2025-13-01 or 2025-02-30 */
function isDay(date: string) {
	const day = new Date(`${date}T00:00:00Z`);
	return (
		/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(day.getTime()) && day.toISOString().startsWith(date)
	);
}

/** Why a contract cannot be ended on that day (YYYY-MM-DD), or null: never before its start */
export function contractEndError(endDate: string, startDate: string, today: string): string | null {
	if (!isDay(endDate)) return m.contracts_end_missing({ example: `31.12.${today.slice(0, 4)}` });
	if (endDate < startDate.slice(0, 10))
		return m.contracts_end_before_start_on({ date: formatDate(startDate.slice(0, 10)) });
	return null;
}

/** The day a contract counts as ended: the day after its last day */
export function endedSince(endDate: string) {
	const day = new Date(`${endDate}T00:00:00Z`);
	day.setUTCDate(day.getUTCDate() + 1);
	return formatDate(day.toISOString().slice(0, 10));
}

/** An end before today, e.g. a notice recorded late, is confirmed with its consequence; null when none is needed */
export function pastEndConfirmation(endDate: string, today: string): string | null {
	if (!endDate || endDate >= today) return null;
	return m.contracts_end_past_confirm({ date: formatDate(endDate) });
}

const listed = (numbers: string[]) =>
	numbers.length === 1
		? numbers[0]
		: m.contracts_list_and({ rest: numbers.slice(0, -1).join(', '), last: numbers.at(-1)! });

/** New contract dates would change the Mietstage of stored statements (backend 409, tests/contracts/contract-end-refused.json) */
export function billedDaysError(statements: { statementNumber: string; status: string }[]): string {
	const drafts = statements
		.filter((statement) => statement.status === 'draft')
		.map((s) => s.statementNumber);
	const locked = statements
		.filter((statement) => statement.status !== 'draft')
		.map(
			(s) =>
				`${s.statementNumber} (${s.status === 'paid' ? m.contracts_billed_paid() : m.contracts_billed_sent()})`
		);
	const one = (locked.length || drafts.length) === 1;
	if (locked.length)
		return [
			(one ? m.contracts_billed_locked_one : m.contracts_billed_locked_many)({
				numbers: listed(locked)
			}),
			m.contracts_billed_locked_rest(),
			...(drafts.length ? [m.contracts_billed_also_draft({ numbers: listed(drafts) })] : [])
		].join(' ');
	return one
		? m.contracts_billed_draft_one({ number: drafts[0] })
		: m.contracts_billed_draft_many({ numbers: listed(drafts) });
}
