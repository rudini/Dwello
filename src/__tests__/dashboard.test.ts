import { describe, it, expect } from 'vitest';
import { load } from '../routes/dashboard/+page.server';

const respond = (status: number, body: object) =>
	(async (url: string) => {
		expect(url).toBe('http://localhost:3001/api/v1/dashboard');
		return Response.json(body, { status });
	}) as typeof globalThis.fetch;

describe('Dashboard laden', () => {
	it('zeigt die Kennzahlen des Backends', async () => {
		const figures = { portfolio: { totalBuildings: 3 } };

		expect(await load({ fetch: respond(200, figures) } as never)).toEqual(figures);
	});

	// Zeros would look like an empty portfolio
	it('zeigt einen Fehler statt leerer Kennzahlen, wenn das Backend nicht antwortet', async () => {
		await expect(load({ fetch: respond(500, {}) } as never)).rejects.toMatchObject({
			status: 500,
			body: { message: 'Dashboard konnte nicht geladen werden' }
		});
	});
});
