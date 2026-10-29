import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from '../routes/mcp/+server';

const call = { jsonrpc: '2.0', id: 1, method: 'tools/list' };

afterEach(() => vi.unstubAllGlobals());

// #817: the web app only passes /mcp on; the backend checks the Zugangsschlüssel and answers (ADR 0007)
describe('/mcp in der Web-App', () => {
	it('reicht Aufruf und Schlüssel unverändert ans Backend weiter und gibt dessen Antwort zurück', async () => {
		const backend = vi.fn(async (_url: string, _init: RequestInit) =>
			Response.json({ code: 'ACCESS_KEY_EXPIRED' }, { status: 401 })
		);
		vi.stubGlobal('fetch', backend);
		const request = new Request('http://localhost/mcp', {
			method: 'POST',
			headers: {
				authorization: 'Bearer dwello_abc',
				'content-type': 'application/json',
				cookie: 'dwello_session=jwt'
			},
			body: JSON.stringify(call)
		});

		const response = await (POST as (event: never) => Promise<Response>)({ request } as never);

		expect(response.status).toBe(401);
		expect(await response.json()).toEqual({ code: 'ACCESS_KEY_EXPIRED' });
		const [url, init] = backend.mock.calls[0];
		expect(url).toBe('http://localhost:3001/mcp');
		expect(JSON.parse(String(init.body))).toEqual(call);
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe('Bearer dwello_abc');
		expect(headers.get('cookie')).toBeNull();
	});

	it('nimmt nur POST an', async () => {
		const response = await (GET as () => Response)();

		expect(response.status).toBe(405);
		expect(response.headers.get('allow')).toBe('POST');
	});
});
