import { floorLabel } from '$lib/apartment';

/**
 * The eidgenössische Gebäude- und Wohnungsregister (GWR) through api3.geo.admin.ch (swisstopo): addresses with house
 * number, and a building's type, year and Wohnungen (#479). Called by the BFF, never by the browser; E2E points
 * GEO_ADMIN_URL at a stand-in (backend/scripts/gwr-stub.ts).
 */
const baseUrl = () => process.env.GEO_ADMIN_URL || 'https://api3.geo.admin.ch';

export interface AddressHit {
	egid: string;
	street: string;
	postalCode: string;
	city: string;
	canton: string;
}

type Field = 'number' | 'floor' | 'area' | 'rooms';
export interface RegisterApartment {
	number: string;
	floor: number | null;
	area: string;
	rooms: string;
	missing: Field[]; // what the register lacks, for the landlord to enter
}

export interface RegisterBuilding {
	buildingType: string | null;
	yearBuilt: number | null;
	apartments: RegisterApartment[];
}

type SearchAnswer = { results: { attrs: Record<string, unknown> }[] };
type FindAnswer = { results: { attributes: Record<string, unknown> }[] };

// «Bahnhofstrasse 1 <b>8001 Zürich</b>», detail ending in the canton («… ch zh»)
export function toAddressHits(answer: SearchAnswer): AddressHit[] {
	return answer.results
		.map((result) => result.attrs)
		.filter((attrs) => attrs.origin === 'address')
		.map((attrs) => {
			const [, street, postalCode, city] =
				String(attrs.label).match(/^(.*) <b>(\d{4}) (.*)<\/b>$/) ?? [];
			return {
				egid: String(attrs.featureId).split('_')[0],
				street,
				postalCode,
				city,
				canton: String(attrs.detail).split(' ').at(-1)!.toUpperCase()
			};
		})
		.filter((hit) => hit.street);
}

// Gebäudekategorie 1040 (teilweise Wohnnutzung) first, then the Gebäudeklasse (#479, fach-review V-3, V-10)
const types: Record<number, string> = {
	1110: 'Einfamilienhaus',
	1121: 'Mehrfamilienhaus',
	1122: 'Mehrfamilienhaus',
	1220: 'Geschäftshaus',
	1230: 'Geschäftshaus',
	1251: 'Gewerbegebäude'
};

// WSTWK: 3100 Parterre, 3101–3199 1.–99. Stock, 3401–3419 1.–19. Untergeschoss
function floorOf(code: unknown): number | null {
	const n = Number(code);
	if (code === null || !Number.isInteger(n)) return null;
	if (n >= 3100 && n <= 3199) return n - 3100;
	if (n >= 3401 && n <= 3419) return 3400 - n;
	return null;
}

const taken = new Set([3003, 3004]); // im Bau, bestehend

const text = (value: number | null) => (value === null ? '' : String(value));

// A Wohnungsnummer the register lacks, from Stockwerk and position on the floor («2. OG Links»), a counter on repeats; none without floor
function proposedNumber(floor: number | null, side: string | null, used: Set<string>) {
	if (floor === null) return '';
	const base = [floorLabel(floor), side].filter(Boolean).join(' ');
	let number = base;
	for (let n = 2; used.has(number); n++) number = `${base} ${n}`;
	return number;
}

export function toRegisterBuilding(answer: FindAnswer): RegisterBuilding {
	const entrances = answer.results.map((result) => result.attributes);
	const first = entrances[0] ?? {};
	const rows = entrances.flatMap((entrance) => {
		const column = (key: string) => (entrance[key] as unknown[] | null) ?? [];
		return column('wstat').flatMap((status, i) =>
			taken.has(Number(status))
				? [
						{
							house: String(entrance.deinr ?? ''),
							whgnr: column('whgnr')[i] as string | null,
							floor: floorOf(column('wstwk')[i]),
							side: column('wbez')[i] as string | null,
							area: column('warea')[i] as number | null,
							rooms: column('wazim')[i] as number | null
						}
					]
				: []
		);
	});

	// a number used under two house numbers gets its house number in front («500-101»)
	const count = (whgnr: string) => rows.filter((row) => row.whgnr === whgnr).length;
	const used = new Set<string>();
	const apartments = rows.map((row) => {
		const number = row.whgnr
			? count(row.whgnr) > 1
				? `${row.house}-${row.whgnr}`
				: row.whgnr
			: proposedNumber(row.floor, row.side, used);
		used.add(number);
		const values = { floor: row.floor, area: row.area, rooms: row.rooms };
		return {
			number,
			floor: row.floor,
			area: text(row.area),
			rooms: text(row.rooms),
			missing: [
				...(row.whgnr ? [] : ['number' as const]),
				...(['floor', 'area', 'rooms'] as const).filter((field) => values[field] === null)
			]
		};
	});

	return {
		buildingType:
			Number(first.gkat) === 1040 ? 'Mischnutzung' : (types[Number(first.gklas)] ?? null),
		yearBuilt: typeof first.gbauj === 'number' ? first.gbauj : null,
		apartments
	};
}

async function call<T>(path: string, query: Record<string, string>): Promise<T> {
	const response = await fetch(`${baseUrl()}${path}?${new URLSearchParams(query)}`, {
		signal: AbortSignal.timeout(10_000)
	});
	if (!response.ok) throw new Error(`Building register ${path}: ${response.status}`);
	return response.json();
}

/** Addresses with house number matching the search text; throws when the register cannot be reached */
export async function searchRegister(text: string): Promise<AddressHit[]> {
	const answer = await call<SearchAnswer>('/rest/services/api/SearchServer', {
		searchText: text,
		type: 'locations',
		origins: 'address',
		limit: '8'
	});
	return toAddressHits(answer);
}

/** Type, year and Wohnungen of the building with this EGID, all its entrances together */
export async function readRegisterBuilding(egid: string): Promise<RegisterBuilding> {
	const answer = await call<FindAnswer>('/rest/services/ech/MapServer/find', {
		layer: 'ch.bfs.gebaeude_wohnungs_register',
		searchField: 'egid',
		searchText: egid,
		contains: 'false',
		returnGeometry: 'false'
	});
	return toRegisterBuilding(answer);
}
