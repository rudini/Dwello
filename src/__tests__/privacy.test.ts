import { describe, it, expect } from 'vitest';
import { load } from '../routes/privacy/+page.server';

const respond = (status: number, body: object) =>
	(async (url: string) => {
		expect(url).toBe('http://localhost:3001/api/v1/invoices/llm-recipient');
		return Response.json(body, { status });
	}) as typeof globalThis.fetch;

describe('Datenschutzerklärung laden', () => {
	it('übernimmt den Empfänger der Rechnungsdaten vom Backend', async () => {
		const recipient = { provider: 'Beispiel AG', country: 'Schweiz' };

		expect(await load({ fetch: respond(200, { recipient }) } as never)).toEqual({ recipient });
	});

	// Without the backend's answer the statement could name the wrong recipient
	it('zeigt einen Fehler statt einer möglicherweise falschen Erklärung, wenn das Backend nicht antwortet', async () => {
		await expect(load({ fetch: respond(500, {}) } as never)).rejects.toMatchObject({ status: 500 });
	});
});
