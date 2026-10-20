import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET as search } from '../routes/api/addresses/+server';
import { GET as building } from '../routes/api/addresses/[egid]/+server';

// The BFF asks the Gebäuderegister (api3.geo.admin.ch) for the browser (#479); the register is replaced at the boundary
const register = (answer: () => Response) => {
	const calls: string[] = [];
	vi.stubGlobal('fetch', async (url: string) => {
		calls.push(url);
		return answer();
	});
	return calls;
};
afterEach(() => vi.unstubAllGlobals());

const event = (url: string, params = {}) => ({ url: new URL(url), params }) as never;

describe('Adresssuche über den Server', () => {
	it('fragt das Gebäuderegister nach dem Suchtext und gibt die Adressen weiter', async () => {
		const calls = register(() =>
			Response.json({
				results: [
					{
						attrs: {
							label: 'Seebahnstrasse 155 <b>8003 Zürich</b>',
							detail: 'seebahnstrasse 155 8003 zuerich 261 zuerich ch zh',
							featureId: '147881_0',
							lat: 47.37,
							lon: 8.51,
							origin: 'address'
						}
					}
				]
			})
		);

		const response = await search(event('http://localhost/api/addresses?q=Seebahnstrasse%20155'));

		expect(new URL(calls[0]).searchParams.get('searchText')).toBe('Seebahnstrasse 155');
		expect(await response.json()).toMatchObject([{ egid: '147881', street: 'Seebahnstrasse 155' }]);
	});

	it('meldet, dass das Gebäuderegister nicht erreichbar ist', async () => {
		register(() => new Response('', { status: 503 }));

		const response = await search(event('http://localhost/api/addresses?q=Seebahnstrasse'));

		expect(response.status).toBe(502);
	});
});

describe('Gebäude aus dem Gebäuderegister über den Server', () => {
	it('liest das Gebäude mit seiner Nummer im Register', async () => {
		const calls = register(() => Response.json({ results: [] }));

		const response = await building(
			event('http://localhost/api/addresses/147881', { egid: '147881' })
		);

		expect(new URL(calls[0]).searchParams.get('searchText')).toBe('147881');
		expect(await response.json()).toEqual({ buildingType: null, yearBuilt: null, apartments: [] });
	});

	it('fragt das Register nur mit einer Gebäudenummer aus Ziffern', async () => {
		const calls = register(() => Response.json({ results: [] }));

		const response = await building(
			event('http://localhost/api/addresses/x', { egid: '1 OR 1=1' })
		);

		expect(response.status).toBe(400);
		expect(calls).toEqual([]);
	});

	it('meldet, dass das Gebäuderegister nicht erreichbar ist', async () => {
		register(() => new Response('', { status: 500 }));

		const response = await building(event('http://localhost/api/addresses/1', { egid: '1' }));

		expect(response.status).toBe(502);
	});
});
