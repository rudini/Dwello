/**
 * Gebäuderegister stand-in for the acceptance tests: the two calls of api3.geo.admin.ch that the address search of
 * «Neues Gebäude» makes (src/lib/server/building-register.ts), shaped like the real answers. The searched text comes
 * back as the street (the scenario's unique name stays in it), and its house number picks the building:
 *
 *   155  3 Wohnungen (101, 102 bestehend, 201 im Bau) and 301 projektiert; Mehrfamilienhaus of 1965
 *     7  a Wohnung without number (2. OG, Links) and one without Stockwerk, Fläche and Zimmeranzahl
 *   500  two entrances (500 and 502) with a Wohnung 101 each
 *     1  no Wohnungen
 *   a text with «Nirgend» finds nothing
 *
 *   bun run gwr-stub      http://127.0.0.1:2529
 */

const PORT = Number(process.env.GWR_STUB_PORT ?? 2529);

type Apartment = { whgnr: string | null; wstwk: number | null; wbez?: string; warea: number | null; wazim: number | null; wstat: number };
type Entrance = { deinr: string; apartments: Apartment[] };

const buildings: Record<string, { gklas: number | null; gbauj: number | null; entrances: (nr: string) => Entrance[] }> = {
	'155': {
		gklas: 1122,
		gbauj: 1965,
		entrances: (nr) => [
			{
				deinr: nr,
				apartments: [
					{ whgnr: '101', wstwk: 3101, warea: 75, wazim: 3, wstat: 3004 },
					{ whgnr: '102', wstwk: 3101, warea: 52, wazim: 2, wstat: 3004 },
					{ whgnr: '201', wstwk: 3102, warea: 98, wazim: 4, wstat: 3003 },
					{ whgnr: '301', wstwk: 3103, warea: 98, wazim: 4, wstat: 3001 }
				]
			}
		]
	},
	'7': {
		gklas: 1122,
		gbauj: null,
		entrances: (nr) => [
			{
				deinr: nr,
				apartments: [
					{ whgnr: null, wstwk: 3102, wbez: 'Links', warea: 64, wazim: 3, wstat: 3004 },
					{ whgnr: '12', wstwk: null, warea: null, wazim: null, wstat: 3004 }
				]
			}
		]
	},
	'500': {
		gklas: 1122,
		gbauj: 1990,
		entrances: () => [
			{ deinr: '500', apartments: [{ whgnr: '101', wstwk: 3101, warea: 80, wazim: 3, wstat: 3004 }] },
			{ deinr: '502', apartments: [{ whgnr: '101', wstwk: 3101, warea: 82, wazim: 3, wstat: 3004 }] }
		]
	},
	'1': { gklas: 1220, gbauj: 1950, entrances: (nr) => [{ deinr: nr, apartments: [] }] }
};

// EGID → the searched text, so the second call knows the building of the first
const searched = new Map<string, string>();
let nextEgid = 900000;

const houseNumber = (text: string) => text.match(/(?:^| )(\d{1,4})(?= |$)/)?.[1] ?? '';

function search(text: string) {
	if (/nirgend/i.test(text) || !buildings[houseNumber(text)]) return { results: [] };
	const egid = String(nextEgid++);
	searched.set(egid, text);
	return {
		results: [
			{
				attrs: {
					label: `${text} <b>8400 Winterthur</b>`,
					detail: `${text.toLowerCase()} 8400 winterthur 230 winterthur ch zh`,
					featureId: `${egid}_0`,
					lat: 47.5,
					lon: 8.72,
					origin: 'address'
				}
			}
		]
	};
}

function find(egid: string) {
	const text = searched.get(egid);
	if (!text) return { results: [] };
	const nr = houseNumber(text);
	const building = buildings[nr];
	return {
		results: building.entrances(nr).map((entrance, edid) => {
			const list = <K extends keyof Apartment>(key: K) =>
				entrance.apartments.length ? entrance.apartments.map((a) => a[key] ?? null) : null;
			return {
				featureId: `${egid}_${edid}`,
				attributes: {
					egid,
					strname_deinr: text.replace(nr, entrance.deinr),
					deinr: entrance.deinr,
					dplz4: 8400,
					dplzname: 'Winterthur',
					gdekt: 'ZH',
					gklas: building.gklas,
					gbauj: building.gbauj,
					whgnr: list('whgnr'),
					wstwk: list('wstwk'),
					wbez: list('wbez'),
					warea: list('warea'),
					wazim: list('wazim'),
					wstat: list('wstat')
				}
			};
		})
	};
}

// Both calls carry what they look for in `searchText`
const routes: Record<string, (text: string) => object> = {
	'/rest/services/api/SearchServer': search,
	'/rest/services/ech/MapServer/find': find
};

Bun.serve({
	port: PORT,
	hostname: '127.0.0.1',
	fetch(request) {
		const url = new URL(request.url);
		const answer = routes[url.pathname];
		return answer
			? Response.json(answer(url.searchParams.get('searchText') ?? ''))
			: new Response('Not found', { status: 404 });
	}
});

console.log(`Gebäuderegister stand-in on http://127.0.0.1:${PORT}`);
