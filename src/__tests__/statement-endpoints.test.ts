import { afterEach, describe, it, expect, vi } from 'vitest';
import { POST as markPaid } from '../routes/statements/[id]/mark-paid/+server';
import { POST as sendReminder } from '../routes/statements/[id]/send-reminder/+server';
import { POST as generatePdf } from '../routes/api/statements/[id]/generate-pdf/+server';
import { GET as getPdf } from '../routes/statements/[id]/pdf/+server';
import { GET as getListPdf } from '../routes/api/statements/[id]/pdf/+server';
import refusedPdf from '../../tests/contracts/statement-pdf-refused.json';
import { localToday } from '$lib/contract-status';

const API = 'http://localhost:3001/api/v1/statements/s1';

function call(handler: unknown, status: number, answer: object) {
	const calls: { method?: string; url: string; body?: unknown }[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
		return Response.json(answer, { status });
	};
	const result = (handler as (event: never) => Promise<Response>)({
		params: { id: 's1' },
		fetch,
		request: new Request('http://localhost/', { method: 'POST' }) // no body: the defaults apply
	} as never);
	return { calls, result };
}

describe('POST /statements/[id]/mark-paid', () => {
	it('speichert den Zahlungseingang mit heutigem Datum in der Datenbank', async () => {
		const { calls, result } = call(markPaid, 200, { id: 's1', status: 'paid' });

		expect((await result).status).toBe(200);
		expect(calls).toEqual([
			{
				method: 'PUT',
				url: `${API}/status`,
				body: { status: 'paid', paidDate: localToday() }
			}
		]);
	});
});

describe('POST /statements/[id]/mark-paid (Ablehnung)', () => {
	it('sagt in Worten, was passiert ist und was zu tun ist, wenn das Backend ablehnt', async () => {
		const { result } = call(markPaid, 409, { error: 'Statement must be sent first' });

		const response = await result;
		expect(response.status).toBe(409);
		expect(await response.json()).toEqual({
			message: 'Abrechnung konnte nicht als bezahlt markiert werden. Versuchen Sie es erneut.'
		});
	});
});

describe('POST /statements/[id]/send-reminder', () => {
	it('versendet die nächste Mahnung über den Korrespondenzkanal des Mieters', async () => {
		const document = { reminderLevel: 2, channel: 'letter', status: 'to_send' };
		const { calls, result } = call(sendReminder, 201, { document });

		const response = await result;
		expect(response.status).toBe(201);
		expect(await response.json()).toEqual({ document });
		expect(calls).toEqual([{ method: 'POST', url: `${API}/reminders`, body: undefined }]);
	});

	it('gibt die Ablehnung des Backends weiter', async () => {
		const { result } = call(sendReminder, 400, {
			error: 'Es wurden bereits 3 Mahnungen versendet.'
		});

		const response = await result;
		expect(response.status).toBe(400);
		expect(await response.json()).toEqual({ error: 'Es wurden bereits 3 Mahnungen versendet.' });
	});
});

describe('POST /api/statements/[id]/generate-pdf', () => {
	it('sendet dem Backend einen JSON-Body, den es als Objekt validiert', async () => {
		const { calls, result } = call(generatePdf, 200, { success: true });

		expect((await result).status).toBe(200);
		expect(calls).toEqual([{ method: 'POST', url: `${API}/generate-pdf`, body: {} }]);
	});
});

describe('GET /statements/[id]/pdf', () => {
	const pdf = () => new Response(new Uint8Array([37, 80, 68, 70]), { status: 200 });

	function backend(generated: boolean) {
		const calls: string[] = [];
		let ready = generated;
		const fetch = async (url: string, init?: RequestInit) => {
			calls.push(`${init?.method ?? 'GET'} ${url}`);
			if (init?.method === 'POST') return ((ready = true), Response.json({ ok: true }));
			return ready ? pdf() : Response.json({ error: 'PDF not generated yet' }, { status: 404 });
		};
		return { calls, fetch };
	}
	const get = (fetch: unknown, search = '') =>
		getPdf({
			params: { id: 's1' },
			fetch,
			url: new URL(`http://localhost/statements/s1/pdf${search}`)
		} as never);

	it('lädt das PDF herunter', async () => {
		const response = await get(backend(true).fetch);
		expect(response.headers.get('Content-Disposition')).toMatch(/^attachment/);
	});

	// Before marking a statement as sent, the user looks at the document the tenant gets
	it('sagt in Worten, wenn das PDF nicht erstellt werden kann', async () => {
		const fetch = async () => Response.json({ error: 'PDF not generated yet' }, { status: 404 });
		const response = await get(fetch, '?ansehen');
		expect(response.status).toBe(404);
		expect(response.headers.get('Content-Type')).toMatch(/text\/plain/);
		expect(await response.text()).toContain('Das PDF konnte nicht erstellt werden');
	});

	// A tab with a statement deleted in the meantime: the download opens in the tab, as the view does
	it('sagt beim Herunterladen in Worten, dass es die Abrechnung nicht gibt', async () => {
		const response = await get(async () => Response.json(refusedPdf, { status: 404 }));
		expect(response.status).toBe(404);
		expect(response.headers.get('Content-Type')).toMatch(/text\/plain/);
		expect(await response.text()).toBe('Abrechnung nicht gefunden.');
	});

	it('nennt beim Ansehen den Grund, den das Backend mit Code angibt', async () => {
		const fetch = async () => Response.json({ error: 'IBAN not configured', code: 'IBAN_MISSING', params: {} }, { status: 400 });
		const response = await get(fetch, '?ansehen');
		expect(await response.text()).toBe('Es ist keine IBAN hinterlegt. Erfassen Sie die IBAN in den Einstellungen.');
	});

	it('zeigt das PDF zum Ansehen im Browser und erstellt es, wenn es noch fehlt', async () => {
		const { calls, fetch } = backend(false);
		const response = await get(fetch, '?ansehen');
		expect(response.status).toBe(200);
		expect(response.headers.get('Content-Disposition')).toMatch(/^inline/);
		expect(calls).toEqual([`GET ${API}/pdf`, `POST ${API}/generate-pdf`, `GET ${API}/pdf`]);
	});
});

describe('GET /api/statements/[id]/pdf (PDF aus der Liste)', () => {
	afterEach(() => vi.unstubAllGlobals());
	const get = () =>
		getListPdf({ params: { id: 's1' }, cookies: { get: () => 'jwt' } } as never);

	it('sagt in Worten, dass es die Abrechnung nicht gibt, statt die Antwort als PDF auszugeben', async () => {
		vi.stubGlobal('fetch', async () => Response.json(refusedPdf, { status: 404 }));
		const response = await get();
		expect(response.status).toBe(404);
		expect(response.headers.get('Content-Type')).toMatch(/text\/plain/);
		expect(await response.text()).toBe('Abrechnung nicht gefunden.');
	});

	it('sagt in Worten, wenn das Backend nicht erreichbar ist', async () => {
		vi.stubGlobal('fetch', async () => {
			throw new TypeError('fetch failed');
		});
		const response = await get();
		expect(response.headers.get('Content-Type')).toMatch(/text\/plain/);
		expect(await response.text()).toBe('Das PDF konnte nicht erstellt werden. Versuchen Sie es später erneut.');
	});
});
