import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST as createInvoice } from '../routes/api/invoices/+server';
import { POST as extract } from '../routes/api/invoices/extract/+server';
import { PUT as putBeleg } from '../routes/api/invoices/[id]/document/+server';
import { GET as getBeleg } from '../routes/invoices/[id]/document/+server';
import extraction from '../../tests/contracts/invoice-extraction.json';

const API = 'http://localhost:3001/api/v1/invoices';
const pdf = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 1]);

// The signed-in property manager: session and XSRF cookies, the XSRF token in the header
const cookies = { get: (name: string) => (name.includes('xsrf') ? 'x1' : 'jwt1') };

/** The backend answers with `answer` and records what the BFF sent */
function backend(answer: object, status = 200) {
	const calls: { url: string; method?: string; body?: unknown }[] = [];
	vi.stubGlobal('fetch', async (url: string, init?: RequestInit) => {
		calls.push({ url, method: init?.method, body: init?.body && JSON.parse(String(init.body)) });
		return Response.json(answer, { status });
	});
	return calls;
}

const multipart = (form: FormData, method = 'POST') =>
	new Request('http://localhost/api/x', { method, body: form, headers: { 'X-XSRF-TOKEN': 'x1' } });

afterEach(() => vi.unstubAllGlobals());

describe('Rechnung mit Beleg erstellen', () => {
	it('schickt die Rechnung mit ihrer Datei als Base64 ans Backend', async () => {
		const calls = backend({ id: 'i1' }, 201);
		const form = new FormData();
		form.set('invoice', JSON.stringify({ buildingId: 'b1', billingEntityName: 'Blitz' }));
		form.set('file', new File([pdf], 'blitz.pdf', { type: 'application/pdf' }));

		const response = await createInvoice({ request: multipart(form), cookies } as never);

		expect(response.status).toBe(201);
		expect(calls).toEqual([
			{
				url: API,
				method: 'POST',
				body: {
					buildingId: 'b1',
					billingEntityName: 'Blitz',
					beleg: { fileName: 'blitz.pdf', content: Buffer.from(pdf).toString('base64') }
				}
			}
		]);
	});
});

describe('Beleg einer Rechnung ersetzen', () => {
	it('schickt die gewählte Datei als Base64 ans Backend', async () => {
		const calls = backend({ id: 'i1' });
		const form = new FormData();
		form.set('file', new File([pdf], 'neu.pdf'));

		await putBeleg({ request: multipart(form, 'PUT'), cookies, params: { id: 'i1' } } as never);

		expect(calls).toEqual([
			{ url: `${API}/i1/document`, method: 'PUT', body: { fileName: 'neu.pdf', content: Buffer.from(pdf).toString('base64') } }
		]);
	});
});

describe('Datei auslesen', () => {
	it('reicht die Seiten ans Backend weiter und gibt den Vorschlag zurück', async () => {
		const calls = backend(extraction);
		const body = { buildingId: 'b1', fileName: 'r.pdf', pages: ['data:image/jpeg;base64,/9j/'] };
		const request = new Request('http://localhost/api/invoices/extract', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: { 'X-XSRF-TOKEN': 'x1' }
		});

		const response = await extract({ request, cookies } as never);

		expect(await response.json()).toEqual(extraction);
		expect(calls).toEqual([{ url: `${API}/extract`, method: 'POST', body }]);
	});
});

describe('Beleg anzeigen', () => {
	it('liefert die Datei des Backends mit Art und Namen', async () => {
		const fetch = async () =>
			new Response(pdf, {
				headers: { 'content-type': 'application/pdf', 'content-disposition': 'attachment; filename="blitz.pdf"' }
			});

		const response = await getBeleg({ params: { id: 'i1' }, fetch } as never);

		expect(response.headers.get('content-type')).toBe('application/pdf');
		expect(response.headers.get('content-disposition')).toContain('blitz.pdf');
		expect(new Uint8Array(await response.arrayBuffer())).toEqual(pdf);
	});
});
