import { describe, it, expect } from 'vitest';
import { handleFetch } from '../hooks.server';

async function forwarded(url: string, session?: string) {
	let sent: Request | undefined;
	await handleFetch({
		event: { cookies: { get: (name: string) => (name === 'dwello_session' ? session : undefined) } },
		request: new Request(url),
		fetch: async (request: Request) => {
			sent = request;
			return new Response('{}');
		}
	} as never);
	return sent!.headers.get('authorization');
}

describe('Server-seitige Backend-Aufrufe', () => {
	it('senden das Sitzungs-Token an das Backend', async () => {
		expect(await forwarded('http://localhost:3001/api/v1/buildings', 'jwt-123')).toBe('Bearer jwt-123');
	});

	it('senden das Sitzungs-Token nie an andere Server', async () => {
		expect(await forwarded('https://openplzapi.org/ch/Localities', 'jwt-123')).toBeNull();
	});

	it('senden ohne Sitzung kein Token', async () => {
		expect(await forwarded('http://localhost:3001/api/v1/buildings')).toBeNull();
	});
});
