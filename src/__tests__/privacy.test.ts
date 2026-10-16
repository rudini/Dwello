import { describe, it, expect } from 'vitest';
import { env } from '../../tests/mocks/env'; // what vitest provides as $env/dynamic/private
import { load } from '../routes/privacy/+page.server';
import answer from '../../tests/contracts/llm-recipient.json';

const respond = (status: number, body: object) =>
	(async (url: string) => {
		expect(url).toBe('http://localhost:3001/api/v1/invoices/llm-recipient');
		return Response.json(body, { status });
	}) as typeof globalThis.fetch;

describe('Datenschutzerklärung laden', () => {
	it('übernimmt den Empfänger der Rechnungsdaten und ob die KI eingeschaltet ist vom Backend', async () => {
		expect(await load({ fetch: respond(200, answer) } as never)).toMatchObject(answer);
	});

	it('nennt nur die eingerichteten Anmeldeanbieter', async () => {
		const clientId = env.OAUTH_MICROSOFT_CLIENT_ID;
		env.OAUTH_MICROSOFT_CLIENT_ID = '';
		try {
			const data = (await load({ fetch: respond(200, { ...answer, recipient: null }) } as never)) as {
				providers: string[];
			};
			expect(data.providers).toEqual(['Google']);
		} finally {
			env.OAUTH_MICROSOFT_CLIENT_ID = clientId;
		}
	});

	// Without the backend's answer the statement could name the wrong recipient
	it('zeigt einen Fehler statt einer möglicherweise falschen Erklärung, wenn das Backend nicht antwortet', async () => {
		await expect(load({ fetch: respond(500, {}) } as never)).rejects.toMatchObject({ status: 500 });
	});
});
