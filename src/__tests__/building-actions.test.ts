import { describe, it, expect } from 'vitest';
import { actions as newActions } from '../routes/buildings/new/+page.server';
import { actions as editActions } from '../routes/buildings/[id]/edit/+page.server';
import { actions as detailActions } from '../routes/buildings/[id]/+page.server';

type Action = (event: never) => Promise<unknown>;

const validBuilding = {
	name: 'Lindenhof',
	address: 'Lindenweg 1',
	postalCode: '8400',
	city: 'Winterthur',
	canton: 'ZH'
};

function run(action: Action, backend: (url: string, init?: RequestInit) => Response, params = {}) {
	const body = new FormData();
	for (const [key, value] of Object.entries(validBuilding)) body.set(key, value);
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
		expect(await sentBody(editActions.default as Action, { id: 'b1' })).toMatchObject({ buildingType: null });
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
		const result = await run(detailActions.delete as Action, () => Response.json({}, { status: 400 }), {
			id: 'b1'
		});

		expect(result).toMatchObject({ status: 400, data: { deleteError: 'Gebäude konnte nicht gelöscht werden.' } });
	});
});
