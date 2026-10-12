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

/** A real day as YYYY-MM-DD: not 2025-13-01 or 2025-02-30 */
function isDay(date: string) {
	const day = new Date(`${date}T00:00:00Z`);
	return (
		/^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(day.getTime()) && day.toISOString().startsWith(date)
	);
}

/** Why a contract cannot be ended on that day (YYYY-MM-DD), or null: never before its start */
export function contractEndError(endDate: string, startDate: string, today: string): string | null {
	if (!isDay(endDate))
		return `Bitte geben Sie das Vertragsende ein, zum Beispiel 31.12.${today.slice(0, 4)}.`;
	if (endDate < startDate.slice(0, 10))
		return `Das Vertragsende kann nicht vor dem Vertragsbeginn am ${formatDate(startDate.slice(0, 10))} liegen.`;
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
	return `Bitte bestätigen Sie, dass der Mietvertrag am ${formatDate(endDate)} endete, oder korrigieren Sie das Vertragsende.`;
}

/** New contract dates would take billed Mietstage from stored statements (backend 409, tests/contracts/contract-end-refused.json) */
export function billedDaysError(statements: { statementNumber: string; status: string }[]): string {
	const sent = statements.find((statement) => statement.status !== 'draft');
	if (sent)
		return `Die Nebenkostenabrechnung ${sent.statementNumber} ist schon versendet und rechnet Mietstage ab, die mit diesem Datum wegfallen. Dwello ändert eine versendete Abrechnung nicht. Prüfen Sie das Datum.`;
	const numbers = statements.map((statement) => statement.statementNumber);
	if (numbers.length === 1)
		return `Die Nebenkostenabrechnung ${numbers[0]} (Entwurf) rechnet Mietstage ab, die mit diesem Datum wegfallen. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.`;
	return `Die Nebenkostenabrechnungen ${numbers.slice(0, -1).join(', ')} und ${numbers.at(-1)} (Entwürfe) rechnen Mietstage ab, die mit diesem Datum wegfallen. Löschen Sie zuerst die Entwürfe und erstellen Sie die Nebenkostenabrechnungen danach neu.`;
}
