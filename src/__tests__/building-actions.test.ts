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
			errors: { name: 'Gebäudename ist erforderlich', canton: 'Kanton ist erforderlich' }
		});
	});

	it('nennt den fehlenden Ort wie das Glossar', async () => {
		const result = await run(
			action as Action,
			rejected,
			{ id: 'b1' },
			{ ...validBuilding, city: '' }
		);

		expect(result).toMatchObject({ errors: { city: 'Ort ist erforderlich' } });
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

	it('zählt wiedervermietete und gesperrte Wohnungen und nennt den Einzugstag', async () => {
		const apartments = [
			{ id: 'a1', status: 'relet', nextContractStart: '2099-11-01' },
			{ id: 'a2', status: 'reserved', nextContractStart: null },
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

		expect(data.building).toMatchObject({ reletCount: 1, reservedCount: 1 });
		expect(data.apartments[0]).toMatchObject({ status: 'relet', nextContractStart: '2099-11-01' });
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
			buildings: { name: string; latitude: number; occupiedCount: number; vacantCount: number }[];
			total: number;
		};

		expect(data.total).toBe(1);
		expect(data.buildings[0]).toMatchObject({
			name: 'Seeblick',
			latitude: 47.3769,
			occupiedCount: 1,
			vacantCount: 1
		});
	});

	it('zählt die wiedervermieteten und gesperrten Wohnungen jedes Gebäudes', async () => {
		const apartments = [
			{ buildingId: 'b1', status: 'relet' },
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
		} as never)) as { buildings: { reletCount: number; reservedCount: number }[] };

		expect(urls).toContain('http://localhost:3001/api/v1/apartments?limit=1000');
		expect(data.buildings[0]).toMatchObject({ reletCount: 1, reservedCount: 0 });
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
		} as never)) as { buildings: { name: string; reletCount: number }[] };

		expect(data.buildings).toMatchObject([{ name: 'Seeblick', reletCount: 0 }]);
	});
});
