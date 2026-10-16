import { describe, it, expect } from 'vitest';
import { load } from '../routes/contracts/new/+page.server';

describe('Neuer Mietvertrag laden', () => {
	// A tenant just created must be in the list, however many tenants exist (the backend sends 50 by default)
	it('lädt alle Mieter und Wohnungen zur Auswahl', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			return Response.json(url.includes('tenants') ? { tenants: [] } : { apartments: [] });
		}) as typeof globalThis.fetch;
		await load({ fetch } as never);
		expect(urls).toEqual([
			'http://localhost:3001/api/v1/tenants?limit=1000',
			'http://localhost:3001/api/v1/apartments?limit=1000'
		]);
	});

	it('nennt Zimmer und Fläche jeder Wohnung', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('tenants')
					? { tenants: [] }
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

	// F-4 (#58), review C-4: «Vermietet ab {Datum}» wie überall
	it('nennt bei einer künftig vermieteten Wohnung den Vertragsbeginn', async () => {
		const fetch = (async (url: string) =>
			Response.json(
				url.includes('tenants')
					? { tenants: [] }
					: {
							apartments: [
								{
									id: 'a1',
									number: '2.02',
									rooms: '2.5',
									area: '65.00',
									status: 'relet',
									nextContractStart: '2099-11-01'
								}
							]
						}
			)) as typeof globalThis.fetch;
		const data = (await load({ fetch } as never)) as { apartments: { status: string }[] };
		expect(data.apartments[0].status).toBe('Vermietet ab 01.11.2099');
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
});
