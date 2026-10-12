import { getLocale } from '$lib/paraglide/runtime';
import type { ApartmentStatus } from './types';
import type { IconName } from './ui/icons';
import type { Tone } from './ui/tone';
import { formatDate } from './utils/format';
import { m } from '$lib/paraglide/messages';

// Texts are getters and functions: read when shown, so they are in the language of the request

/** The floor in the words of the statement PDF; the UI shows any floor below ground as one */
export const floorLabel = (floor: number) =>
	floor < 0
		? m.apartments_floor_basement()
		: floor === 0
			? m.apartments_floor_ground()
			: floor === 1
				? m.apartments_floor_first()
				: m.apartments_floor_upper({ floor });

export const floorOptions = [-1, 0, 1, 2, 3, 4, 5, 6].map((floor) => ({
	value: String(floor),
	get label() {
		return floorLabel(floor);
	}
}));

export const roomOptions = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5'];

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
	}
};

export const statusTones = {
	occupied: 'positive',
	relet: 'info',
	vacant: 'caution',
	reserved: 'neutral'
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
	// TODO(fachlich prüfen): the glossary names Leer and Gesperrt without explaining them
	get vacant() {
		return m.apartments_status_help_vacant();
	},
	get reserved() {
		return m.apartments_status_help_reserved();
	}
};

/** A building's apartments per Mietstatus so that they add up; relet and reserved only when there are any */
export function occupancyParts(b: {
	occupiedCount: number;
	reletCount?: number;
	vacantCount: number;
	reservedCount?: number;
}) {
	const count = (n: number, one: typeof m.apartments_count_occupied_one, many: typeof one) =>
		(n === 1 ? one : many)({ count: n });
	const parts = [
		count(b.occupiedCount, m.apartments_count_occupied_one, m.apartments_count_occupied_many)
	];
	if (b.reletCount)
		parts.push(count(b.reletCount, m.apartments_count_relet_one, m.apartments_count_relet_many));
	parts.push(count(b.vacantCount, m.apartments_count_vacant_one, m.apartments_count_vacant_many));
	if (b.reservedCount)
		parts.push(
			count(b.reservedCount, m.apartments_count_reserved_one, m.apartments_count_reserved_many)
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
	const next = new Date(`${currentContractEnd.slice(0, 10)}T00:00:00Z`);
	next.setUTCDate(next.getUTCDate() + 1);
	return next.toISOString().slice(0, 10) === nextContractStart.slice(0, 10);
}

/** Status with the day a relet apartment's next tenant moves in, or the last day of the running contract (A-4) */
export function statusText(a: {
	status: ApartmentStatus;
	nextContractStart?: string | null;
	currentContractEnd?: string | null;
}) {
	if (a.status === 'relet' && a.nextContractStart)
		return m.apartments_status_relet_from({ date: formatDate(a.nextContractStart) });
	// the end matters while a vacancy may follow; a next tenant from the day after closes it (review K-4)
	if (a.status === 'occupied' && a.currentContractEnd && !followedOn(a))
		return m.apartments_status_occupied_until({ date: formatDate(a.currentContractEnd) });
	return statusLabels[a.status];
}

/** «3.5 Zimmer» in the UI language, singular where its plural rule says so (French: «1.5 pièce») */
export const roomsLabel = (rooms: string) =>
	new Intl.PluralRules(getLocale()).select(Number(rooms)) === 'one'
		? m.buildings_rooms_one({ rooms })
		: m.buildings_rooms({ rooms });
