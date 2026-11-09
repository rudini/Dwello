import { getLocale } from '$lib/paraglide/runtime';
import type { Apartment, ApartmentListItem, ApartmentStatus, MoveOut } from './types';
import type { IconName } from './ui/icons';
import type { Tone } from './ui/tone';
import { endedSince } from './contract-status';
import { dayAfter } from './swiss-date';
import { formatDate } from './utils/format';
import { m } from '$lib/paraglide/messages';

// Texts are getters and functions: read when shown, so they are in the language of the request

// English counts floors with ordinals: 1st, 2nd, 3rd, 4th, 11th, 22nd (461-native-en, EN-32)
const ORDINAL: Record<string, string> = { one: 'st', two: 'nd', few: 'rd', other: 'th' };
const englishOrdinal = (n: number) =>
	`${n}${ORDINAL[new Intl.PluralRules('en', { type: 'ordinal' }).select(n)]}`;

// the first floor below ground has no number, from the second on it is counted, as in the statement PDF (#449, #597)
const belowGround = (floor: number) =>
	floor < -1
		? m.apartments_floor_lower({ floor: getLocale() === 'en' ? englishOrdinal(-floor) : -floor })
		: m.apartments_floor_basement();

/** The floor in the words of the statement PDF */
export const floorLabel = (floor: number) =>
	floor < 0
		? belowGround(floor)
		: floor === 0
			? m.apartments_floor_ground()
			: floor === 1
				? m.apartments_floor_first()
				: m.apartments_floor_upper({ floor: getLocale() === 'en' ? englishOrdinal(floor) : floor });

/** The usual floors, two of them below ground (#597), and the given one when it lies outside them (taken from the
 * Gebäuderegister, #479) */
export const floorOptions = (current?: number | null) =>
	[...new Set([-2, -1, 0, 1, 2, 3, 4, 5, 6, ...(current == null ? [] : [current])])]
		.sort((a, b) => a - b)
		.map((floor) => ({ value: String(floor), label: floorLabel(floor) }));

/** The usual numbers of rooms, and the given one when it lies outside them (#479) */
export const roomOptions = (current?: string) =>
	[
		...new Set([
			...Array.from({ length: 19 }, (_, i) => String(1 + i / 2)), // 1 to 10 in halves (#1301: joined apartments)
			...(current ? [current] : [])
		])
	]
		.sort((a, b) => Number(a) - Number(b))
		.map((value) => ({ value, label: roomsLabel(value) }));

export const statusLabels: Record<ApartmentStatus, string> = {
	get occupied() {
		return m.apartments_status_occupied();
	},
	get relet() {
		return m.apartments_status_relet();
	},
	get vacant() {
		return m.apartments_status_vacant();
	},
	get reserved() {
		return m.apartments_status_reserved();
	},
	get discontinued() {
		return m.apartments_status_discontinued();
	}
};

export const statusTones = {
	occupied: 'positive',
	relet: 'info',
	vacant: 'caution',
	reserved: 'neutral',
	discontinued: 'neutral'
} as const satisfies Record<ApartmentStatus, Tone>;

/** An empty apartment is no error: an open door instead of the caution tone's warning triangle */
export const statusIcons: Partial<Record<ApartmentStatus, IconName>> = { vacant: 'apartment-free' };

/** What each Mietstatus means (UBIQUITOUS_LANGUAGE.md, Mietstatus) */
export const statusHelp: Record<ApartmentStatus, string> = {
	get occupied() {
		return m.apartments_status_help_occupied();
	},
	get relet() {
		return m.apartments_status_help_relet();
	},
	get vacant() {
		return m.apartments_status_help_vacant();
	},
	get reserved() {
		return m.apartments_status_help_reserved();
	},
	get discontinued() {
		return m.apartments_status_help_discontinued();
	}
};

/** Relet apartments by the start of their future contract: «2 vermietet ab 01.11.2026» (F-4, #58) */
export function reletParts(starts: string[] = []) {
	const counts = new Map<string, number>();
	for (const start of starts) counts.set(start, (counts.get(start) ?? 0) + 1);
	return [...counts].map(([start, count]) =>
		(count === 1 ? m.apartments_count_relet_one : m.apartments_count_relet_many)({
			count,
			date: formatDate(start)
		})
	);
}

/** Vertragsbeginn of each relet apartment, for `reletParts` */
export const reletStarts = (apartments: { status?: unknown; nextContractStart?: unknown }[]) =>
	apartments
		.filter((a) => a.status === 'relet')
		.map((a) => String(a.nextContractStart))
		.sort();

/** A building's apartments per Mietstatus so that they add up; relet, reserved and discontinued only when there are any */
export function occupancyParts(b: {
	occupiedCount: number;
	reletStarts?: string[];
	vacantCount: number;
	reservedCount?: number;
	discontinuedCount?: number;
}) {
	const count = (n: number, one: typeof m.apartments_count_occupied_one, many: typeof one) =>
		(n === 1 ? one : many)({ count: n });
	const parts = [
		count(b.occupiedCount, m.apartments_count_occupied_one, m.apartments_count_occupied_many),
		...reletParts(b.reletStarts)
	];
	parts.push(count(b.vacantCount, m.apartments_count_vacant_one, m.apartments_count_vacant_many));
	if (b.reservedCount)
		parts.push(
			count(b.reservedCount, m.apartments_count_reserved_one, m.apartments_count_reserved_many)
		);
	if (b.discontinuedCount)
		parts.push(
			count(
				b.discontinuedCount,
				m.apartments_count_discontinued_one,
				m.apartments_count_discontinued_many
			)
		);
	return parts;
}

/** How many of the apartments have a Mietstatus */
export const countStatus = (apartments: { status: string }[], status: ApartmentStatus) =>
	apartments.filter((a) => a.status === status).length;

// the next contract starts the day after the running one ends
function followedOn({
	currentContractEnd,
	nextContractStart
}: {
	currentContractEnd?: string | null;
	nextContractStart?: string | null;
}) {
	if (!currentContractEnd || !nextContractStart) return false;
	return dayAfter(currentContractEnd) === nextContractStart.slice(0, 10);
}

/** Status with the day a relet apartment's next tenant moves in, the last day of the running contract (A-4), or the
 * day an empty apartment's last contract ended after (#145) */
export function statusText(
	// «Aufgehoben seit» from discontinuedFrom (#1311)
	a: Pick<Apartment, 'status' | 'nextContractStart' | 'currentContractEnd' | 'lastContractEnd'> &
		Partial<Pick<ApartmentListItem, 'discontinuedFrom'>>
) {
	if (a.status === 'discontinued' && a.discontinuedFrom)
		return m.apartments_status_discontinued_since({ date: formatDate(a.discontinuedFrom) });
	if (a.status === 'relet' && a.nextContractStart)
		return m.apartments_status_relet_from({ date: formatDate(a.nextContractStart) });
	if (a.status === 'vacant' && a.lastContractEnd)
		return m.apartments_status_vacant_since({ date: endedSince(a.lastContractEnd) });
	// the end matters while a vacancy may follow; a next tenant from the day after closes it (review K-4)
	if (a.status === 'occupied' && a.currentContractEnd && !followedOn(a))
		return m.apartments_status_occupied_until({ date: formatDate(a.currentContractEnd) });
	return statusLabels[a.status];
}

/** #664: an ended contract's move-out until its Schlussabrechnung exists, as the backend decides it, with whose it is */
export function moveOutText(moveOut: MoveOut) {
	const text = { name: moveOut.tenantName, date: formatDate(moveOut.endDate) };
	if (!moveOut.due)
		return m.apartments_move_out_pending({ ...text, end: formatDate(moveOut.period.end) });
	const due = moveOut.outside ? m.apartments_move_out_due_outside : m.apartments_move_out_due;
	return due(text);
}

/** «3.5 Zimmer» in the UI language, singular where its plural rule says so (French: «1.5 pièce») */
export const roomsLabel = (rooms: string) =>
	new Intl.PluralRules(getLocale()).select(Number(rooms)) === 'one'
		? m.buildings_rooms_one({ rooms })
		: m.buildings_rooms({ rooms });
