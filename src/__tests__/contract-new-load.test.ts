import { describe, it, expect, vi } from 'vitest';
import { load } from '../routes/contracts/new/+page.server';
import allowed from '../../tests/contracts/categories-allowed.json';
import contract from '../../tests/contracts/contract.json';
import apartmentList from '../../tests/contracts/apartments.json';

describe('Neuer Mietvertrag laden', () => {
	// A tenant just created must be in the list, however many tenants exist (the backend sends 50 by default)
	it('lädt alle Mieter und Wohnungen zur Auswahl', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			return Response.json(url.includes('categories') ? [] : { tenants: [], apartments: [] });
		}) as typeof globalThis.fetch;
		await load({ fetch } as never);
		expect(urls).toEqual([
			'http://localhost:3001/api/v1/tenants?limit=1000',
			'http://localhost:3001/api/v1/apartments?limit=1000',
			'http://localhost:3001/api/v1/categories/allowed' // the boxes of the agreed Nebenkosten (#91), all of them (#522)
		]);
	});

	// #368 (#407 point 3, follow-up contract (a)): a new contract from the old one starts with its agreed Nebenkosten
	it('übernimmt beim neuen Mietvertrag aus dem bisherigen dessen vereinbarte Nebenkosten', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			if (url.endsWith('/contracts/c1')) return Response.json(contract);
			return Response.json(url.includes('categories') ? [] : { tenants: [], apartments: [] });
		}) as typeof globalThis.fetch;
		const from = (query: string) =>
			load({ fetch, url: new URL(`http://localhost:3000/contracts/new${query}`) } as never) as Promise<{
				agreed: string[] | null;
			}>;

		expect((await from('?tenant=t1&start=2099-04-01&from=c1')).agreed).toEqual(contract.agreedCategoryIds);
		expect(urls).toContain('http://localhost:3001/api/v1/contracts/c1');
		expect((await from('?tenant=t1')).agreed).toBeNull();
	});

	// #522: the form lists every umlagefähige category; a limit counting all categories hid some
	it('bietet jede umlagefähige Kategorie zur Vereinbarung an', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('categories') ? allowed : { tenants: [], apartments: [] }
			)) as typeof globalThis.fetch;
		const data = (await load({ fetch } as never)) as { categories: { id: string; name: string }[] };
		expect(data.categories).toEqual([{ id: allowed[0].id, name: 'Internet' }]);
	});

	it('nennt Zimmer und Fläche jeder Wohnung', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('tenants')
					? { tenants: [] }
					: url.includes('categories')
						? []
						: {
								apartments: [
									{
										id: 'a1',
										number: '2.02',
										buildingName: 'Musterhaus',
										rooms: '2.5',
										area: '65.00'
									}
								]
							}
			)) as typeof globalThis.fetch;
		const data = (await load({ fetch } as never)) as { apartments: { size: string }[] };
		expect(data.apartments[0].size).toBe('2.5 Zimmer, 65 m²');
	});

	// #815: whether a new contract can be recorded, the backend decides by the Swiss day; the wizard shows it
	it('gibt weiter, ab wann eine Wohnung frei ist, wie es das Backend nennt', async () => {
		const [listed] = apartmentList.apartments;
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('tenants')
					? { tenants: [] }
					: url.includes('categories')
						? []
						: { apartments: [{ ...listed, blocked: true, availableFrom: '2030-05-01' }] }
			)) as typeof globalThis.fetch;
		const data = (await load({ fetch } as never)) as {
			apartments: { blocked: boolean; availableFrom: string | null }[];
		};
		expect(data.apartments[0]).toMatchObject({ blocked: true, availableFrom: '2030-05-01' });
	});

	// B-14 (#147): an empty choice would look like "no tenants yet"; the landlord sees a load error instead
	it.each(['tenants', 'apartments'])('meldet einen Ladefehler, wenn %s fehlen', async (failing) => {
		const fetch = (async (url: string) =>
			url.includes(failing)
				? new Response(null, { status: 500 })
				: Response.json({ tenants: [], apartments: [] })) as typeof globalThis.fetch;
		await expect(load({ fetch } as never)).rejects.toMatchObject({
			status: 500,
			body: { message: 'Die Mieter und Wohnungen konnten nicht geladen werden.' }
		});
	});

	it('meldet einen Ladefehler, wenn das Backend nicht antwortet', async () => {
		const fetch = (async () => {
			throw new TypeError('fetch failed');
		}) as typeof globalThis.fetch;
		await expect(load({ fetch } as never)).rejects.toMatchObject({ status: 500 });
	});

	// without a response there are no statuses to log, only the network error (#715)
	it('protokolliert einen Netzwerkfehler einmal, ohne leere Status', async () => {
		const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
		const fetch = (async () => {
			throw new TypeError('fetch failed');
		}) as typeof globalThis.fetch;
		await expect(load({ fetch } as never)).rejects.toMatchObject({ status: 500 });
		expect(logged).toHaveBeenCalledTimes(1);
		logged.mockRestore();
	});
});
