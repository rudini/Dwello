import type { ContractHistory } from './types';
import type { Tone } from './ui/tone';
import { formatDate } from './utils/format';

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
	active: { label: 'Laufend', tone: 'positive' },
	future: { label: 'Künftig', tone: 'info' },
	ended: { label: 'Beendet', tone: 'neutral' }
};

/** Contract period in words; a contract without end is named by its start, never "bis heute" */
export function contractPeriod(
	startDate: string,
	endDate: string | null | undefined,
	status: Status
) {
	if (endDate) return `${formatDate(startDate)} – ${formatDate(endDate)}`;
	return `${status === 'future' ? 'ab' : 'seit'} ${formatDate(startDate)}, unbefristet`;
}

/** Why a contract cannot be ended on that day (YYYY-MM-DD), or null: today or later, never before its start */
export function contractEndError(endDate: string, startDate: string, today: string): string | null {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) return 'Bitte geben Sie das Vertragsende ein, zum Beispiel 31.03.2027.';
	if (endDate < today)
		return 'Das Vertragsende kann nicht vor heute liegen. Ein früheres Vertragsende tragen Sie unter «Bearbeiten» ein.';
	if (endDate < startDate.slice(0, 10))
		return `Das Vertragsende kann nicht vor dem Vertragsbeginn am ${formatDate(startDate.slice(0, 10))} liegen.`;
	return null;
}
