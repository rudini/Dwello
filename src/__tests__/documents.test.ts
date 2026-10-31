import { describe, it, expect } from 'vitest';
import { actions, load } from '../routes/documents/+page.server';
import { GET as pdf } from '../routes/documents/[id]/pdf/+server';
import { runAction } from './helpers/action';
import { localTitle } from '$lib/server/documents';
import documentList from '../../tests/contracts/documents.json';
import creditorRefused from '../../tests/contracts/statement-pdf-creditor-refused.json';
import paidRefused from '../../tests/contracts/reminder-paid-refused.json';
import notFound from '../../tests/contracts/document-not-found.json';

const API = 'http://localhost:3001/api/v1/documents';

function backend(answer: Response) {
	const urls: string[] = [];
	const fetch = async (url: string) => {
		urls.push(url);
		return answer;
	};
	return { urls, fetch: fetch as typeof globalThis.fetch };
}

describe('Dokumente', () => {
	it('zeigt nur die zu versendenden Dokumente, wenn so gefiltert', async () => {
		const { urls, fetch } = backend(Response.json({ data: [{ id: 'd1' }] }));

		const data = await load({
			fetch,
			url: new URL('http://localhost/documents?status=to_send')
		} as never);

		expect(urls).toEqual([`${API}?status=to_send`]);
		expect(data).toEqual({ documents: [{ id: 'd1' }], status: 'to_send' });
	});

	it('zeigt ohne Filter alle Dokumente', async () => {
		const { urls, fetch } = backend(Response.json({ data: [] }));

		await load({ fetch, url: new URL('http://localhost/documents') } as never);

		expect(urls).toEqual([API]);
	});

	it('hält fest, dass ein Brief versendet wurde', async () => {
		const { calls, result } = runAction(actions.markSent, '', 200, { id: 'd1' });
		await result;

		expect(calls).toEqual([{ method: 'PUT', url: `${API}/d1/sent`, body: undefined }]);
	});

	// #193: the letter is remade on marking; its new PDF is offered to print, also under «Zu versenden»
	it('nennt den eben markierten Brief, damit er jetzt gedruckt wird', async () => {
		const sent = { ...documentList.data[0], id: 'd1', type: 'reminder', reminderLevel: 2 };
		const { result } = runAction(actions.markSent, '', 200, { id: 'd1' }, sent);

		expect(await result).toEqual({
			sent: { id: 'd1', title: '2. Mahnung', tenantName: 'Marco Bernasconi', newPdf: false }
		});
	});

	// Fachreview 534-2 V-1, Code-Review 534-3 C-19: the new PDF of a statement is named as one, its notice differs
	it('nennt ein eben markiertes neues PDF als neues PDF', async () => {
		const sent = { ...documentList.data[0], id: 'd2', type: 'new_pdf', reminderLevel: null };
		const { result } = runAction(actions.markSent, '', 200, { id: 'd2' }, sent);

		expect(await result).toMatchObject({ sent: { id: 'd2', newPdf: true } });
	});

	// #969 (Code-Review 969-1 C-1): stored in the tenant's language, named in the UI's
	it('nennt ein PDF vor der Änderung in der Sprache der Oberfläche', () => {
		const kept = { ...documentList.data[0], type: 'pdf_before_change', title: 'Décompte des charges, PDF avant la modification' };

		expect(localTitle(kept as never)).toBe('Nebenkostenabrechnung, PDF vor der Änderung');
	});

	// #450, Fachreview V-1: a reminder still to send is remade on marking; without the Firmenadresse it is refused
	it('sagt beim Markieren einer Mahnung, dass für den Zahlteil die Firmenadresse fehlt', async () => {
		const { result } = runAction(actions.markSent, '', 400, { id: 'd1' }, creditorRefused);

		expect(await result).toMatchObject({
			status: 400,
			data: {
				actionError:
					'Für den Zahlteil fehlt die Firmenadresse. Ergänzen Sie Name, PLZ und Ort unter «Einstellungen».'
			}
		});
	});

	// #449 (Entscheid in #404, Punkt 3): die Abrechnung ist bezahlt, der Brief geht nicht mehr hinaus
	it('sagt beim Markieren einer Mahnung, dass die Abrechnung schon bezahlt ist', async () => {
		const { result } = runAction(actions.markSent, '', 400, { id: 'd1' }, paidRefused);

		expect(await result).toMatchObject({
			data: { actionError: 'Die Abrechnung ist bereits bezahlt. Schicken Sie diese Mahnung nicht mehr ab.' }
		});
	});

	// #852: a document deleted meanwhile, e.g. in a second tab
	it('sagt beim Markieren eines inzwischen gelöschten Dokuments, dass es das Dokument nicht mehr gibt', async () => {
		const { result } = runAction(actions.markSent, '', 404, { id: 'd1' }, notFound);

		expect(await result).toMatchObject({
			data: { actionError: 'Das Dokument gibt es nicht mehr. Laden Sie die Seite neu.' }
		});
	});

	it('liefert das PDF eines Dokuments zum Herunterladen', async () => {
		const file = new Response('%PDF-1.4', {
			headers: {
				'content-type': 'application/pdf',
				'content-disposition': 'attachment; filename="Mahnung.pdf"'
			}
		});
		const { urls, fetch } = backend(file);

		const response = await pdf({ fetch, params: { id: 'd1' } } as never);

		expect(urls).toEqual([`${API}/d1/pdf`]);
		expect(response.headers.get('content-type')).toBe('application/pdf');
		expect(response.headers.get('content-disposition')).toBe('attachment; filename="Mahnung.pdf"');
		expect(await response.text()).toBe('%PDF-1.4');
	});
});
