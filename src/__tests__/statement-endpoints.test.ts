import { describe, it, expect } from 'vitest';
import { POST as markPaid } from '../routes/statements/[id]/mark-paid/+server';
import { POST as sendReminder } from '../routes/statements/[id]/send-reminder/+server';
import { POST as generatePdf } from '../routes/api/statements/[id]/generate-pdf/+server';

const API = 'http://localhost:3001/api/v1/statements/s1';

function call(handler: unknown, status: number, answer: object) {
	const calls: { method?: string; url: string; body?: unknown }[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
		return Response.json(answer, { status });
	};
	const result = (handler as (event: never) => Promise<Response>)({
		params: { id: 's1' },
		fetch
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
				body: { status: 'paid', paidDate: new Date().toISOString().split('T')[0] }
			}
		]);
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
