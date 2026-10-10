import type { ContractHistory } from './types';
import type { Tone } from './ui/tone';
import { formatDate } from './utils/format';

type Status = ContractHistory['status'];

/** Badge of a contract in a contract history */
export const contractBadges = {
	active: { status: 'AKTIV', variant: 'success' },
	future: { status: 'Künftig', variant: 'info' },
	ended: { status: 'Beendet', variant: 'gray' }
} as const satisfies Record<Status, { status: string; variant: string }>;

/** Vertragsstatus on a day (YYYY-MM-DD): running up to and including its last day, as the backend filters */
export function contractStatusOn(
	startDate: string,
	endDate: string | null | undefined,
	today: string
): Status {
	if (startDate.slice(0, 10) > today) return 'future';
	return endDate && endDate.slice(0, 10) < today ? 'ended' : 'active';
}

/** Today in this browser or server, as YYYY-MM-DD */
export const localToday = () => new Date().toLocaleDateString('sv-SE');

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
