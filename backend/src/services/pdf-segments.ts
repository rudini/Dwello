/**
 * #1284 (Fachreview 1284-1 V-2, V-3): a position split at the day an apartment no longer exists, as the statement PDF
 * prints it: the apartment once above the costs, under the position one row per part with the amounts it calculates with
 */

import { fill, formatCHF, formatSwissDate } from './pdf-format';
import { daysAfter } from './today';

// a part of a position as stored (LineSegment), with the apartment's fraction by the key as printed
export type Segment = {
	start: string;
	end: string;
	count: number;
	keyShare: string;
	costs: number;
	apartment: number;
	periodShare: number;
	days?: number;
	total?: number;
	profileShare?: number;
	share: number;
	discontinued?: { number: string; date: string }[];
};

/** A part as the tenant recomputes it: by days, by the Zeitanteil or by the Heizprofil */
export function segmentLine(segment: Segment, t: Record<string, string>) {
	const text =
		segment.profileShare != null
			? t.segmentLineProfile
			: segment.days != null
				? t.segmentLineDays
				: t.segmentLinePercent;
	return fill(text, {
		start: formatSwissDate(segment.start),
		end: formatSwissDate(segment.end),
		count: segment.count,
		colon: t.colon,
		keyShare: segment.keyShare.includes('+') ? `(${segment.keyShare.replace(/\n/g, ' ')})` : segment.keyShare, // a mixed key in brackets
		costs: formatCHF(segment.costs),
		apartment: formatCHF(segment.apartment),
		days: segment.days ?? '',
		total: segment.total ?? '',
		percent: (segment.periodShare * 100).toFixed(2),
		profileShare: segment.profileShare?.toFixed(2) ?? '',
		share: formatCHF(segment.share)
	});
}

/** Once per apartment that no longer exists from a day of the billed days: what it means, for above the costs */
export function segmentIntros(items: { segments?: Segment[] | null }[], t: Record<string, string>) {
	const gone = new Map(
		items
			.flatMap((item) => item.segments ?? [])
			.flatMap((segment) => segment.discontinued ?? [])
			.map((a) => [a.number, a.date])
	);
	return [...gone].map(([number, date]) =>
		fill(t.segmentIntro, {
			number,
			date: formatSwissDate(date),
			dayBefore: formatSwissDate(daysAfter(date, -1))
		})
	);
}
