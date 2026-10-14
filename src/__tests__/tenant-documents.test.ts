import { describe, it, expect } from 'vitest';
import { actions } from '../routes/tenants/[id]/+page.server';
import uploaded from '../../tests/contracts/document-uploaded.json';
import refused from '../../tests/contracts/document-refused.json';
import notDeletable from '../../tests/contracts/document-not-deletable.json';

const API = 'http://localhost:3001/api/v1';
type Call = { method?: string; url: string; body?: unknown };

// The page's upload or delete action with a form as the browser sends it, against a backend that answers each call
function run(
	action: unknown,
	fields: Record<string, string | File>,
	status = 201,
	answer: unknown = {}
) {
	const form = new FormData();
	for (const [name, value] of Object.entries(fields)) form.append(name, value);
	const calls: Call[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
		return Response.json(answer, { status });
	};
	const request = new Request('http://localhost:3000', { method: 'POST', body: form });
	type Action = (event: never) => Promise<unknown>;
	return { calls, result: (action as Action)({ params: { id: 't1' }, fetch, request } as never) };
}

const pdf = new File(['%PDF-1.4 Inhalt'], 'betreibung.pdf', { type: 'application/pdf' });

describe('Dokument hochladen', () => {
	it('schickt Titel, Dateiname und Inhalt der Datei an den Mieter', async () => {
		const { calls, result } = run(actions.upload, { title: 'Betreibungsauszug', file: pdf }, 201, uploaded);

		expect(await result).toEqual({ uploaded: 'Betreibungsauszug' });
		expect(calls).toEqual([
			{
				method: 'POST',
				url: `${API}/tenants/t1/documents`,
				body: {
					title: 'Betreibungsauszug',
					fileName: 'betreibung.pdf',
					content: Buffer.from('%PDF-1.4 Inhalt').toString('base64')
				}
			}
		]);
	});

	it('zeigt die Ablehnung des Backends in der Sprache der Oberfläche und behält den Titel', async () => {
		const { result } = run(actions.upload, { title: 'Scan', file: pdf }, 400, refused);

		expect(await result).toMatchObject({
			status: 400,
			data: {
				title: 'Scan',
				uploadError:
					'Die Datei ist grösser als 10 MB. Wählen Sie eine kleinere Datei oder verkleinern Sie den Scan.'
			}
		});
	});

	it('verlangt eine Datei, bevor es etwas sendet', async () => {
		const empty = new File([], '', { type: 'application/octet-stream' }); // what a form without a file sends
		const { calls, result } = run(actions.upload, { title: 'Scan', file: empty });

		expect(await result).toMatchObject({
			status: 400,
			data: { title: 'Scan', uploadError: 'Wählen Sie eine Datei aus.' }
		});
		expect(calls).toEqual([]);
	});
});

describe('Dokument löschen', () => {
	it('löscht das gewählte Dokument', async () => {
		const { calls, result } = run(actions.deleteDocument, { id: 'd1' }, 200, { success: true });

		expect(await result).toBeUndefined();
		expect(calls).toEqual([{ method: 'DELETE', url: `${API}/documents/d1`, body: undefined }]);
	});

	it('sagt, warum eine Mahnung bleibt', async () => {
		const { result } = run(actions.deleteDocument, { id: 'd1' }, 409, notDeletable);

		expect(await result).toMatchObject({
			status: 409,
			data: { deleteError: 'Mahnungen bleiben erhalten, weil sie belegen, dass der Mieter gemahnt wurde.' }
		});
	});
});
