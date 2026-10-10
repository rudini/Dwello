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
});
