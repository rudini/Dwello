import { describe, it, expect } from 'vitest';
import { toAddressHits, toRegisterBuilding } from '$lib/server/building-register';

// Answers of api3.geo.admin.ch as fetched on 2026-10-19 (Seebahnstrasse 155, Zürich), shortened to the fields used
const searchAnswer = {
	results: [
		{
			attrs: {
				label: 'Seebahnstrasse 155 <b>8003 Zürich</b>',
				detail: 'seebahnstrasse 155 8003 zuerich 261 zuerich ch zh',
				featureId: '147881_0',
				lat: 47.37352752685547,
				lon: 8.515159606933594,
				origin: 'address'
			}
		},
		{
			attrs: {
				label: 'Seebahnstrasse',
				detail: 'seebahnstrasse',
				featureId: 'x',
				origin: 'gazetteer'
			}
		}
	]
};

type Attributes = Record<string, unknown>;
const entrance = (attributes: Attributes) => ({
	featureId: `147881_${attributes.edid ?? 0}`,
	attributes: {
		egid: '147881',
		deinr: '155',
		gklas: 1122,
		gkat: 1020,
		gbauj: 1932,
		whgnr: null,
		wstwk: null,
		wbez: null,
		warea: null,
		wazim: null,
		wstat: null,
		...attributes
	}
});
const findAnswer = (...entrances: Attributes[]) => ({ results: entrances.map(entrance) });
const apartments = (...rows: Attributes[]) =>
	Object.fromEntries(
		['whgnr', 'wstwk', 'wbez', 'warea', 'wazim', 'wstat'].map((key) => [
			key,
			rows.map((row) => row[key] ?? null)
		])
	);
const flat = (whgnr: string | null, wstwk: number | null, more: Attributes = {}) => ({
	whgnr,
	wstwk,
	warea: 70,
	wazim: 3,
	wstat: 3004,
	...more
});

describe('Adresssuche im Gebäuderegister', () => {
	it('liefert Adressen mit Hausnummer, PLZ, Ort und Kanton', () => {
		expect(toAddressHits(searchAnswer)).toEqual([
			{
				egid: '147881',
				street: 'Seebahnstrasse 155',
				postalCode: '8003',
				city: 'Zürich',
				canton: 'ZH'
			}
		]);
	});

	it('findet nichts, wenn das Register keine Adresse kennt', () => {
		expect(toAddressHits({ results: [] })).toEqual([]);
	});
});

describe('Gebäude aus dem Gebäuderegister', () => {
	it('übernimmt Gebäudetyp und Baujahr', () => {
		const building = toRegisterBuilding(findAnswer({}));
		expect(building.buildingType).toBe('Mehrfamilienhaus');
		expect(building.yearBuilt).toBe(1932);
	});

	it.each([
		[1110, 'Einfamilienhaus'],
		[1121, 'Mehrfamilienhaus'],
		[1122, 'Mehrfamilienhaus'],
		[1130, null],
		[1220, 'Geschäftshaus'],
		[1230, 'Geschäftshaus'],
		[1251, 'Gewerbegebäude'],
		[1242, null],
		[null, null]
	])('Gebäudeklasse %s ergibt den Gebäudetyp %s', (gklas, type) => {
		expect(toRegisterBuilding(findAnswer({ gklas })).buildingType).toBe(type);
	});

	it('nennt ein Gebäude mit teilweiser Wohnnutzung Mischnutzung, auch ein Geschäftshaus', () => {
		expect(toRegisterBuilding(findAnswer({ gklas: 1220, gkat: 1040 })).buildingType).toBe(
			'Mischnutzung'
		);
	});

	it('übernimmt Wohnungsnummer, Stockwerk, Fläche und Zimmeranzahl', () => {
		const building = toRegisterBuilding(
			findAnswer(apartments(flat('101', 3101, { warea: 75, wazim: 3 })))
		);
		expect(building.apartments).toEqual([
			{ number: '101', floor: 1, area: '75', rooms: '3', missing: [] }
		]);
	});

	it.each([
		[3100, 0],
		[3104, 4],
		[3401, -1],
		[3403, -3],
		[3200, null],
		[null, null]
	])('Stockwerk %s im Register ergibt das Stockwerk %s', (wstwk, floor) => {
		expect(toRegisterBuilding(findAnswer(apartments(flat('1', wstwk)))).apartments[0].floor).toBe(
			floor
		);
	});

	it('übernimmt nur bestehende Wohnungen und solche im Bau', () => {
		const building = toRegisterBuilding(
			findAnswer(
				apartments(
					flat('1', 3100, { wstat: 3004 }),
					flat('2', 3100, { wstat: 3003 }),
					flat('3', 3100, { wstat: 3001 }),
					flat('4', 3100, { wstat: 3002 }),
					flat('5', 3100, { wstat: 3007 })
				)
			)
		);
		expect(building.apartments.map((a) => a.number)).toEqual(['1', '2']);
	});

	it('nennt, was im Register fehlt', () => {
		const [apartment] = toRegisterBuilding(
			findAnswer(apartments(flat('2', null, { warea: null, wazim: null })))
		).apartments;
		expect(apartment).toEqual({
			number: '2',
			floor: null,
			area: '',
			rooms: '',
			missing: ['floor', 'area', 'rooms']
		});
	});

	it('schlägt eine fehlende Wohnungsnummer aus Stockwerk und Position im Stockwerk vor', () => {
		const building = toRegisterBuilding(
			findAnswer(
				apartments(
					flat(null, 3102, { wbez: 'Links' }),
					flat(null, 3102, { wbez: 'Rechts' }),
					flat(null, 3100),
					flat(null, 3100),
					flat(null, null)
				)
			)
		);
		expect(building.apartments.map((a) => [a.number, a.missing])).toEqual([
			['2. OG Links', ['number']],
			['2. OG Rechts', ['number']],
			['EG', ['number']],
			['EG 2', ['number']],
			['', ['number', 'floor']]
		]);
	});

	it('stellt bei gleichen Wohnungsnummern an zwei Eingängen die Hausnummer voran', () => {
		const building = toRegisterBuilding(
			findAnswer(
				{ deinr: '500', ...apartments(flat('101', 3101), flat('102', 3101)) },
				{ edid: 1, deinr: '502', ...apartments(flat('101', 3101), flat('103', 3101)) }
			)
		);
		expect(building.apartments.map((a) => a.number)).toEqual(['500-101', '102', '502-101', '103']);
	});

	it('hat keine Wohnungen, wenn das Register keine kennt', () => {
		expect(toRegisterBuilding(findAnswer({ gklas: 1220 }, { edid: 1 })).apartments).toEqual([]);
	});
});
