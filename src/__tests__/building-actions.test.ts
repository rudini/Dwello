import { describe, it, expect } from 'vitest';
import { actions as newActions } from '../routes/buildings/new/+page.server';
import { actions as editActions } from '../routes/buildings/[id]/edit/+page.server';
import {
	actions as detailActions,
	load as detailLoad,
	type BuildingDetailsData
} from '../routes/buildings/[id]/+page.server';
import backendBuilding from '../../tests/contracts/building.json';
import buildingList from '../../tests/contracts/buildings.json';
import fuelStocks from '../../tests/contracts/fuel-stocks.json';
import { load as listLoad } from '../routes/buildings/+page.server';

type Action = (event: never) => Promise<unknown>;

const validBuilding = {
	name: 'Lindenhof',
	address: 'Lindenweg 1',
	postalCode: '8400',
	city: 'Winterthur',
	canton: 'ZH'
};

function run(
	action: Action,
	backend: (url: string, init?: RequestInit) => Response,
	params = {},
	fields: Record<string, string> = validBuilding
) {
	const body = new FormData();
	for (const [key, value] of Object.entries(fields)) body.set(key, value);
	const request = new Request('http://localhost/', { method: 'POST', body });
	const fetch = async (url: string, init?: RequestInit) => backend(url, init);
	return action({ request, fetch, params } as never);
}

const sentBody = async (action: Action, params = {}) => {
	let body: Record<string, unknown> = {};
	await run(
		action,
		(_url, init) => {
			body = JSON.parse(String(init?.body));
			return Response.json({ id: 'b1' });
		},
		params
	).catch(() => {});
	return body;
};

// Elysia answers schema violations with { message }, the building routes with { error }
const rejected = () => Response.json({ message: 'Kanton fehlt' }, { status: 422 });
const refused = () => Response.json({ error: 'Gebäude existiert bereits' }, { status: 400 });

describe('Neues Gebäude', () => {
	it('zeigt die Fehlermeldung des Backends im Formular', async () => {
		const result = await run(newActions.default as Action, rejected);

		expect(result).toEqual({ success: false, errors: { form: 'Kanton fehlt' } });
	});

	it('zeigt die Fehlermeldung der Gebäude-Route im Formular', async () => {
		const result = await run(newActions.default as Action, refused);

		expect(result).toEqual({ success: false, errors: { form: 'Gebäude existiert bereits' } });
	});

	it('lässt den optionalen Gebäudetyp weg, statt null zu senden', async () => {
		expect(await sentBody(newActions.default as Action)).not.toHaveProperty('buildingType');
	});
	// Wohnungen aus dem Gebäuderegister (#479): nur die übernommenen Zeilen kommen mit (die anderen sind deaktiviert)
	const withApartments = {
		...validBuilding,
		'apartments.0.number': '101',
		'apartments.0.floor': '1',
		'apartments.0.area': '75',
		'apartments.0.rooms': '3',
		'apartments.2.number': '201',
		'apartments.2.floor': '2',
		'apartments.2.area': '98',
		'apartments.2.rooms': '4.5'
	};

	it('sendet die übernommenen Wohnungen mit dem Gebäude', async () => {
		let body: Record<string, unknown> = {};
		await run(
			newActions.default as Action,
			(_url, init) => {
				body = JSON.parse(String(init?.body));
				return Response.json({ id: 'b1' });
			},
			{},
			withApartments
		).catch(() => {});

		expect(body.apartments).toEqual([
			{ number: '101', floor: 1, area: '75', rooms: '3' },
			{ number: '201', floor: 2, area: '98', rooms: '4.5' }
		]);
	});

	it('verlangt Fläche, Stockwerk und Zimmeranzahl jeder übernommenen Wohnung', async () => {
		const result = await run(
			newActions.default as Action,
			() => Response.json({ id: 'b1' }),
			{},
			{
				...withApartments,
				'apartments.2.floor': '',
				'apartments.2.area': '',
				'apartments.2.rooms': '',
				'apartments.0.number': ''
			}
		);

		expect(result).toMatchObject({
			success: false,
			errors: {
				'apartments.0.number': 'Wohnungsnummer ist erforderlich.',
				'apartments.2.floor': 'Stockwerk ist erforderlich.',
				'apartments.2.area': 'Fläche ist erforderlich.',
				'apartments.2.rooms': 'Zimmeranzahl ist erforderlich.'
			}
		});
	});
});

describe('Gebäude bearbeiten', () => {
	it('zeigt die Fehlermeldung des Backends im Formular', async () => {
		const result = await run(editActions.default as Action, rejected, { id: 'b1' });

		expect(result).toEqual({ success: false, errors: { form: 'Kanton fehlt' } });
	});

	it('zeigt die Fehlermeldung der Gebäude-Route im Formular', async () => {
		const result = await run(editActions.default as Action, refused, { id: 'b1' });

		expect(result).toEqual({ success: false, errors: { form: 'Gebäude existiert bereits' } });
	});

	it('sendet null, damit ein leerer Gebäudetyp den gespeicherten Wert löscht', async () => {
		expect(await sentBody(editActions.default as Action, { id: 'b1' })).toMatchObject({
			buildingType: null
		});
	});
});

describe('Gebäude löschen', () => {
	it('löscht das Gebäude im Backend und kehrt zur Gebäudeliste zurück', async () => {
		const calls: string[] = [];
		const deleted = (url: string, init?: RequestInit) => {
			calls.push(`${init?.method} ${url}`);
			return new Response(null, { status: 204 });
		};

		await expect(run(detailActions.delete as Action, deleted, { id: 'b1' })).rejects.toMatchObject({
			status: 303,
			location: '/buildings'
		});
		expect(calls).toEqual(['DELETE http://localhost:3001/api/v1/buildings/b1']);
	});

	it('meldet einen Fehler, wenn das Backend das Löschen ablehnt', async () => {
		const result = await run(
			detailActions.delete as Action,
			() => Response.json({}, { status: 400 }),
			{
				id: 'b1'
			}
		);

		expect(result).toMatchObject({
			status: 400,
			data: { deleteError: 'Gebäude konnte nicht gelöscht werden.' }
		});
	});
});

describe.each([
	['Neues Gebäude', newActions.default],
	['Gebäude bearbeiten', editActions.default]
])('%s', (_page, action) => {
	it('verlangt Gebäudename und Kanton', async () => {
		const result = await run(
			action as Action,
			rejected,
			{ id: 'b1' },
			{ ...validBuilding, name: '', canton: '' }
		);

		expect(result).toMatchObject({
			errors: { name: 'Gebäudename ist erforderlich.', canton: 'Kanton ist erforderlich.' }
		});
	});

	it('nennt den fehlenden Ort wie das Glossar', async () => {
		const result = await run(
			action as Action,
			rejected,
			{ id: 'b1' },
			{ ...validBuilding, city: '' }
		);

		expect(result).toMatchObject({ errors: { city: 'Ort ist erforderlich.' } });
	});
});

describe('Gebäudedetail', () => {
	// Backend-Antwort aus dem API-Vertrag (tests/contracts/building.json)
	it('zeigt die Belegung der Wohnungen', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('/apartments') ? { apartments: [] } : backendBuilding
			)) as typeof globalThis.fetch;

		const { building } = (await detailLoad({
			params: { id: 'b1' },
			fetch
		} as never)) as BuildingDetailsData;

		expect(building).toMatchObject({
			name: 'Seeblick',
			apartmentCount: 2,
			occupiedCount: 1,
			vacantCount: 1
		});
	});

	it('zählt künftig vermietete und gesperrte Wohnungen und nennt den Einzugstag', async () => {
		const apartments = [
			{ id: 'a1', status: 'relet', nextContractStart: '2099-11-01' },
			{ id: 'a2', status: 'reserved', nextContractStart: null, lastContractEnd: '2024-03-31' },
			{ id: 'a3', status: 'occupied', nextContractStart: null }
		];
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('/apartments') ? { apartments } : backendBuilding
			)) as typeof globalThis.fetch;

		const data = (await detailLoad({
			params: { id: 'b1' },
			fetch
		} as never)) as BuildingDetailsData;

		expect(data.building).toMatchObject({ reletStarts: ['2099-11-01'], reservedCount: 1 });
		expect(data.apartments[0]).toMatchObject({ status: 'relet', nextContractStart: '2099-11-01' });
		// «Leer seit» on the floor plan too (#145, review C-2)
		expect(data.apartments[1]).toMatchObject({ lastContractEnd: '2024-03-31' });
	});
});

describe('Gebäudeliste', () => {
	// Backend-Antwort aus dem API-Vertrag (tests/contracts/buildings.json)
	it('zeigt die Gebäude mit der Belegung ihrer Wohnungen', async () => {
		const fetch = (async () => Response.json(buildingList)) as unknown as typeof globalThis.fetch;

		const data = (await listLoad({
			url: new URL('http://localhost/buildings'),
			fetch
		} as never)) as {
			buildings: { name: string; occupiedCount: number; vacantCount: number }[];
			total: number;
		};

		expect(data.total).toBe(1);
		expect(data.buildings[0]).toMatchObject({
			name: 'Seeblick',
			occupiedCount: 1,
			vacantCount: 1
		});
	});

	it('zählt die künftig vermieteten und gesperrten Wohnungen jedes Gebäudes', async () => {
		const apartments = [
			{ buildingId: 'b1', status: 'relet', nextContractStart: '2099-11-01' },
			{ buildingId: 'b1', status: 'occupied' },
			{ buildingId: 'b2', status: 'reserved' }
		];
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			return Response.json(url.includes('/apartments') ? { apartments } : buildingList);
		}) as unknown as typeof globalThis.fetch;

		const data = (await listLoad({
			url: new URL('http://localhost/buildings'),
			fetch
		} as never)) as { buildings: { reletStarts: string[]; reservedCount: number }[] };

		expect(urls).toContain('http://localhost:3001/api/v1/apartments?limit=1000');
		expect(data.buildings[0]).toMatchObject({ reletStarts: ['2099-11-01'], reservedCount: 0 });
	});

	// The counts are an addition: without them the buildings still show
	it('zeigt die Gebäude auch, wenn die Wohnungen nicht geladen werden können', async () => {
		const fetch = (async (url: string) =>
			url.includes('/apartments')
				? new Response('Internal Server Error', { status: 500 })
				: Response.json(buildingList)) as unknown as typeof globalThis.fetch;

		const data = (await listLoad({
			url: new URL('http://localhost/buildings'),
			fetch
		} as never)) as { buildings: { name: string; reletStarts: string[] }[] };

		expect(data.buildings).toMatchObject([{ name: 'Seeblick', reletStarts: [] }]);
	});
});

describe('Tankbestand', () => {
	const stockId = '7d0f2c1e-6b9a-4c8e-9f3a-2b1c0d9e8f7a';
	const stock = { readingDate: '2024-12-31', amount: "2'650.00", categoryId: 'c1' };

	it('erfasst den Wert des Heizöls im Tank an einem Stichtag, mit seiner Kategorie', async () => {
		const calls: string[] = [];
		const backend = (url: string, init?: RequestInit) => {
			calls.push(`${init?.method} ${url} ${init?.body}`);
			return Response.json({ id: 's1' }, { status: 201 });
		};

		expect(await run(detailActions.addFuelStock as Action, backend, { id: 'b1' }, stock)).toEqual({
			fuelStockSaved: true
		});
		expect(calls).toEqual([
			'POST http://localhost:3001/api/v1/buildings/b1/fuel-stocks {"readingDate":"2024-12-31","amount":"2650.00","categoryId":"c1"}'
		]);
	});

	it('verlangt Stichtag und Betrag, bevor es speichert', async () => {
		const result = await run(
			detailActions.addFuelStock as Action,
			refused,
			{ id: 'b1' },
			{
				readingDate: '',
				amount: 'viel',
				categoryId: 'c1'
			}
		);

		expect(result).toMatchObject({
			status: 400,
			data: {
				fuelStockErrors: {
					readingDate: 'Bitte geben Sie den Stichtag ein.',
					amount: 'Bitte geben Sie den Wert in Franken ein, zum Beispiel 2650.00.'
				}
			}
		});
	});

	it.each([
		[409, {}, 'Für diesen Stichtag ist schon ein Bestand erfasst. Löschen Sie ihn zuerst.'],
		[
			409,
			{ error: 'The building records its fuel stock in another category' },
			'Alle Bestände eines Gebäudes gehören zur selben Kategorie. Wählen Sie die Kategorie der bisherigen Bestände.'
		],
		[500, {}, 'Der Bestand konnte nicht gespeichert werden. Versuchen Sie es erneut.']
	])('meldet eine Ablehnung des Backends (%i) verständlich', async (status, body, message) => {
		const result = await run(
			detailActions.addFuelStock as Action,
			() => Response.json(body, { status }),
			{ id: 'b1' },
			stock
		);

		expect(result).toMatchObject({ status, data: { fuelStockErrors: { form: message } } });
	});

	const answer = (stocks: () => Response) =>
		(async (url: string) =>
			url.endsWith('/fuel-stocks')
				? stocks()
				: Response.json(
						url.includes('/categories')
							? {
									categories: [
										{
											id: 'c1',
											name: 'Heating',
											nameDE: 'Heizung',
											isHeatingCost: true,
											isFuel: true,
											isAllowedUtilityCost: true
										},
										{
											id: 'c5',
											name: 'Heizungsservice',
											nameDE: 'Heizungsservice',
											isHeatingCost: true,
											isFuel: false,
											isAllowedUtilityCost: true
										},
										{
											id: 'c2',
											name: 'Caretaker',
											nameDE: 'Hauswart',
											isHeatingCost: false,
											isAllowedUtilityCost: true
										},
										{
											id: 'c3',
											name: 'Chimney Sweep',
											nameDE: 'Kaminfeger',
											isHeatingCost: true,
											isAllowedUtilityCost: true
										},
										{
											id: 'c4',
											name: 'Owner heating',
											nameDE: 'Heizung Eigentümer',
											isHeatingCost: true,
											isFuel: true,
											isAllowedUtilityCost: false
										}
									]
								}
							: url.includes('/apartments')
								? { apartments: [] }
								: backendBuilding
					)) as typeof globalThis.fetch;

	// only allocable fuel (#100): the chimney sweep and a heating service are shared like heating but are no fuel
	it('lädt die Stichtage des Gebäudes und die umlagefähigen Kategorien für den Brennstoff', async () => {
		const data = (await detailLoad({
			params: { id: 'b1' },
			fetch: answer(() => Response.json(fuelStocks))
		} as never)) as BuildingDetailsData;

		expect(data.fuelStocks).toEqual([
			{
				id: 'f1',
				readingDate: '2024-12-31',
				amount: 2650,
				categoryId: 'c1',
				categoryName: 'Heizung'
			}
		]);
		expect(data.heatingCategories).toEqual([{ id: 'c1', name: 'Heizung' }]);
	});

	// die Kategorie eines Stands bleibt lesbar, auch wenn sie nicht mehr zur Auswahl steht
	it('nennt die Kategorie eines Stands auch, wenn sie nicht mehr umlagefähig ist', async () => {
		const stock = { ...fuelStocks[0], categoryId: 'c4' };
		const data = (await detailLoad({
			params: { id: 'b1' },
			fetch: answer(() => Response.json([stock]))
		} as never)) as BuildingDetailsData;

		expect(data.fuelStocks![0].categoryName).toBe('Heizung Eigentümer');
	});

	it('zeigt die Gebäudeseite auch, wenn die Kategorien nicht geladen werden können', async () => {
		const fetch = (async (url: string) =>
			url.includes('/categories')
				? new Response('kaputt', { status: 500 })
				: answer(() => Response.json(fuelStocks))(url)) as typeof globalThis.fetch;

		const data = (await detailLoad({
			params: { id: 'b1' },
			fetch
		} as never)) as BuildingDetailsData;

		expect(data.heatingCategories).toBeNull(); // not "no category": they could not be loaded
	});

	it('meldet, wenn die Stichtage nicht geladen werden können, statt eine leere Liste zu zeigen', async () => {
		const data = (await detailLoad({
			params: { id: 'b1' },
			fetch: answer(() => Response.json({}, { status: 500 }))
		} as never)) as BuildingDetailsData;

		expect(data.fuelStocks).toBeNull();
	});

	it('löscht einen Stichtag', async () => {
		const calls: string[] = [];
		const backend = (url: string, init?: RequestInit) => {
			calls.push(`${init?.method} ${url}`);
			return new Response(null, { status: 204 });
		};

		expect(
			await run(detailActions.deleteFuelStock as Action, backend, { id: 'b1' }, { stockId })
		).toEqual({
			fuelStockDeleted: true
		});
		expect(calls).toEqual([
			`DELETE http://localhost:3001/api/v1/buildings/b1/fuel-stocks/${stockId}`
		]);
	});

	it('löscht nur einen Stichtag mit gültiger Kennung und meldet eine Ablehnung', async () => {
		const calls: string[] = [];
		const backend = (url: string) => {
			calls.push(url);
			return new Response(null, { status: 404 });
		};
		const failed = {
			status: 400,
			data: {
				fuelStockDeleteError: 'Der Bestand konnte nicht gelöscht werden. Laden Sie die Seite neu.'
			}
		};

		expect(
			await run(
				detailActions.deleteFuelStock as Action,
				backend,
				{ id: 'b1' },
				{ stockId: '../..' }
			)
		).toMatchObject(failed);
		expect(calls).toEqual([]);
		expect(
			await run(detailActions.deleteFuelStock as Action, backend, { id: 'b1' }, { stockId })
		).toMatchObject({
			...failed,
			status: 404
		});
	});
});
