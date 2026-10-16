import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '$lib/api';

afterEach(() => vi.unstubAllGlobals());

describe('Anfrage mit Datei', () => {
	it('schickt ein Formular als multipart, mit dem XSRF-Token, ohne es in JSON zu verwandeln', async () => {
		document.cookie = 'dwello_xsrf=x1';
		const sent: RequestInit[] = [];
		vi.stubGlobal('fetch', async (_url: string, init: RequestInit) => {
			sent.push(init);
			return Response.json({ id: 'i1' }, { status: 201 });
		});
		const form = new FormData();
		form.set('file', new File(['%PDF-'], 'r.pdf'));

		expect((await api.post('/invoices', form)).data).toEqual({ id: 'i1' });
		expect(sent[0].body).toBe(form);
		const headers = sent[0].headers as Record<string, string>;
		expect(headers['X-XSRF-TOKEN']).toBe('x1');
		expect(headers['Content-Type']).toBeUndefined(); // the browser sets multipart with its boundary
	});
});
