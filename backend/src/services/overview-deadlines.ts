/**
 * The overview's deadlines, by the Swiss day (#815): open Zahlungsfristen within the configured days and passed ones
 * (#87), and contract ends within 60 days (#64), with the days from today, earliest first
 */

// How far ahead the overview looks at contract ends: a UX choice (#64)
const CONTRACT_END_WINDOW_DAYS = 60;

const daysFrom = (today: string, date: string) => Math.round((Date.parse(date.slice(0, 10)) - Date.parse(today)) / 86_400_000);

export function deadlinesOf({
	today,
	dueStatements,
	endingContracts,
	paymentDeadlineDays
}: {
	today: string;
	dueStatements: { id: string; tenantName: string; paymentDeadline: string }[];
	endingContracts: { id: string; tenantName: string; endDate: string }[];
	paymentDeadlineDays: number;
}) {
	const payments = dueStatements.map((s) => ({
		id: s.id,
		kind: 'Zahlungsfrist' as const,
		name: s.tenantName,
		date: s.paymentDeadline,
		days: daysFrom(today, s.paymentDeadline)
	}));
	const ends = endingContracts.map((c) => ({
		id: c.id,
		kind: 'Vertragsende' as const,
		name: c.tenantName,
		date: c.endDate,
		days: daysFrom(today, c.endDate)
	}));
	return [
		...payments.filter((d) => d.days <= paymentDeadlineDays),
		...ends.filter((d) => d.days >= 0 && d.days <= CONTRACT_END_WINDOW_DAYS)
	].sort((a, b) => a.days - b.days);
}
