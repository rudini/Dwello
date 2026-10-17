import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions } from '../routes/statements/[id]/+page.server';
import { localToday } from '$lib/contract-status';
import paidDateRefused from '../../tests/contracts/statement-paid-date-refused.json';
import correctionRefused from '../../tests/contracts/statement-correction-refused.json';

const API = 'http://localhost:3001/api/v1/statements/s1';
const today = localToday(); // the day in Switzerland, as the app takes it

describe('Abrechnung versenden', () => {
	it('setzt den Status im Backend auf versendet', async () => {
		const { calls, result } = runAction(actions.send, 's1');
		await result;

		expect(calls).toEqual([{ method: 'PUT', url: `${API}/status`, body: { status: 'sent' } }]);
	});

	it('meldet einen Fehler, wenn das Backend den Statuswechsel ablehnt', async () => {
		const { result } = runAction(actions.send, 's1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { actionError: 'Abrechnung konnte nicht versendet werden.' }
		});
	});
});

describe('Abrechnung als bezahlt markieren', () => {
	it('setzt den Status auf bezahlt mit heutigem Zahlungsdatum', async () => {
		const { calls, result } = runAction(actions.markPaid, 's1');
		await result;

		expect(calls).toEqual([
			{ method: 'PUT', url: `${API}/status`, body: { status: 'paid', paidDate: today } }
		]);
	});
});

describe('Abrechnung als bezahlt markieren (Ablehnung)', () => {
	it('meldet einen Fehler mit dem nächsten Schritt, wenn das Backend ablehnt', async () => {
		const { result } = runAction(actions.markPaid, 's1', 409);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				actionError: 'Abrechnung konnte nicht als bezahlt markiert werden. Versuchen Sie es erneut.'
			}
		});
	});
});

// Die Zahlung kam vor einer Woche: das Datum aus dem Dialog, nicht der Tag des Erfassens
describe('Zahlungsdatum', () => {
	it('speichert das gewählte Zahlungsdatum', async () => {
		const { calls, result } = runAction(actions.markPaid, 's1', 200, { paidDate: '2026-01-05' });
		await result;

		expect(calls).toEqual([
			{ method: 'PUT', url: `${API}/status`, body: { status: 'paid', paidDate: '2026-01-05' } }
		]);
	});

	// Im Dialog «1.12» getippt: gesendet wird ein leeres Datum, nicht still das heutige
	it('lehnt ein leeres oder ungültiges Zahlungsdatum ab, ohne zu speichern', async () => {
		const { calls, result } = runAction(actions.markPaid, 's1', 200, { paidDate: '' });

		expect(await result).toMatchObject({
			status: 400,
			data: { actionError: 'Bitte geben Sie das Zahlungsdatum als TT.MM.JJJJ ein.' }
		});
		expect(calls).toEqual([]);
	});

	it('lehnt ein Zahlungsdatum in der Zukunft ab, ohne zu speichern', async () => {
		const { calls, result } = runAction(actions.markPaid, 's1', 200, { paidDate: '2999-01-01' });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				actionError:
					'Das Zahlungsdatum liegt in der Zukunft. Geben Sie den Tag ein, an dem das Geld eingegangen ist.'
			}
		});
		expect(calls).toEqual([]);
	});
});

// #138: frühestens das Abrechnungsdatum, das der Dialog mitsendet; das Backend prüft es noch einmal
describe('Zahlungsdatum und Abrechnungsdatum', () => {
	it('lehnt ein Zahlungsdatum vor dem Abrechnungsdatum ab, ohne zu speichern', async () => {
		const { calls, result } = runAction(actions.markPaid, 's1', 200, { paidDate: '2026-01-04', statementDate: '2026-01-05' });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				actionError:
					'Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 05.01.2026. Geben Sie frühestens dieses Datum ein.'
			}
		});
		expect(calls).toEqual([]);
	});

	it('zeigt die Ablehnung des Backends in Worten', async () => {
		const { result } = runAction(actions.markPaid, 's1', 200, { paidDate: '2026-01-04' }, {}, { status: 400, answer: paidDateRefused });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				actionError:
					'Das Zahlungsdatum liegt vor dem Abrechnungsdatum vom 05.01.2026. Geben Sie frühestens dieses Datum ein.'
			}
		});
	});
});

// #92: eine erfasste Zahlung zurücksetzen
describe('Zahlung zurücksetzen', () => {
	it('lässt das Backend die Zahlung zurücksetzen', async () => {
		const { calls, result } = runAction(actions.resetPayment, 's1');
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/payment-reset`, body: undefined }]);
	});

	it('meldet einen Fehler mit dem nächsten Schritt, wenn das Backend scheitert', async () => {
		const { result } = runAction(actions.resetPayment, 's1', 500);

		expect(await result).toMatchObject({
			status: 500,
			data: { actionError: 'Die Zahlung konnte nicht zurückgesetzt werden. Versuchen Sie es erneut.' }
		});
	});
});

describe('Abrechnung löschen', () => {
	it('löscht die Abrechnung und kehrt zur Abrechnungsliste zurück', async () => {
		const { calls, result } = runAction(actions.delete, 's1', 204);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/statements' });
		expect(calls).toEqual([{ method: 'DELETE', url: API, body: undefined }]);
	});

	it('meldet einen Fehler, wenn das Backend das Löschen ablehnt', async () => {
		const { result } = runAction(actions.delete, 's1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { actionError: 'Abrechnung konnte nicht gelöscht werden.' }
		});
	});
});

describe('Mahnung senden', () => {
	it('lässt das Backend die nächste Mahnung erstellen und versenden', async () => {
		const { calls, result } = runAction(actions.remind, 's1', 201);
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/reminders`, body: undefined }]);
	});

	it('zeigt die Begründung des Backends, wenn keine Mahnung möglich ist', async () => {
		const { result } = runAction(actions.remind, 's1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { actionError: 'Mahnung konnte nicht erstellt werden.' }
		});
	});
});

describe('Abrechnung laden', () => {
	// The statement carries no tenant address; the send confirmation needs it for a letter
	it('ergänzt die Postadresse des Mieters aus den Mieterdaten', async () => {
		const { load } = await import('../routes/statements/[id]/+page.server');
		const statementJson = (await import('../../tests/contracts/statement.json')).default;
		const tenantJson = (await import('../../tests/contracts/tenant.json')).default;
		const fetch = (async (url: string) => {
			if (url.endsWith('/statements/s1'))
				return Response.json({ ...statementJson, tenantId: 't1' });
			if (url.endsWith('/tenants/t1')) return Response.json(tenantJson);
			return Response.json({ data: [] });
		}) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 's1' }, fetch } as never)) as {
			statement: { tenantAddress: string };
		};
		expect(data.statement.tenantAddress).toBe('Seestrasse 12, 8002 Zürich');
	});

	// Eine Korrespondenzadresse im Ausland nennt ihr Land (#102)
	it('nennt das Land einer Postadresse im Ausland', async () => {
		const { load } = await import('../routes/statements/[id]/+page.server');
		const statementJson = (await import('../../tests/contracts/statement.json')).default;
		const tenantJson = (await import('../../tests/contracts/tenant.json')).default;
		const fetch = (async (url: string) => {
			if (url.endsWith('/statements/s1'))
				return Response.json({ ...statementJson, tenantId: 't1' });
			if (url.endsWith('/tenants/t1')) return Response.json({ ...tenantJson, country: 'DE' });
			if (url.includes('/invoices/for-statement/')) return Response.json([]);
			return Response.json({ data: [] });
		}) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 's1' }, fetch } as never)) as {
			statement: { tenantAddress: string; oldAddress: boolean };
		};
		expect(data.statement.tenantAddress).toBe('Seestrasse 12, 8002 Zürich, Deutschland');
		expect(data.statement.oldAddress).toBe(false);
	});

	// #96: die Abrechnung kennt die Rechnungen, die sie abrechnet; das Backend nennt die neuen, geänderten und gelöschten
	it('zählt die Rechnungen der Periode, die seit dem Erstellen der Abrechnung erfasst, geändert oder gelöscht wurden', async () => {
		const { load } = await import('../routes/statements/[id]/+page.server');
		const statementJson = (await import('../../tests/contracts/statement.json')).default;
		const changed = (await import('../../tests/contracts/statement-changed-invoices.json')).default;
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			if (url.endsWith('/statements/s1')) return Response.json(statementJson);
			if (url.endsWith('/statements/s1/changed-invoices')) return Response.json(changed);
			return Response.json({ data: [] });
		}) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 's1' }, fetch } as never)) as { laterInvoices: number };
		expect(data.laterInvoices).toBe(1);
		expect(urls).toContain('http://localhost:3001/api/v1/statements/s1/changed-invoices');
	});

	it('zählt keine Rechnungen, wenn das Backend sie nicht nennen kann', async () => {
		const { load } = await import('../routes/statements/[id]/+page.server');
		const statementJson = (await import('../../tests/contracts/statement.json')).default;
		const fetch = (async (url: string) => {
			if (url.endsWith('/statements/s1')) return Response.json(statementJson);
			if (url.endsWith('/changed-invoices')) return new Response(null, { status: 500 });
			return Response.json({ data: [] });
		}) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 's1' }, fetch } as never)) as { laterInvoices: number };
		expect(data.laterInvoices).toBe(0);
	});
});

// #120, #358: berichtigte Abrechnung
describe('Abrechnung berichtigen', () => {
	it('ersetzt die Abrechnung im Backend', async () => {
		const { calls, result } = runAction(actions.replace, 's1');
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/replace`, body: undefined }]);
	});

	it('meldet, wenn das Backend das Ersetzen ablehnt', async () => {
		const { result } = runAction(actions.replace, 's1', 409, {}, { code: 'STATEMENT_NOT_REPLACEABLE', params: {} });

		expect(await result).toMatchObject({
			status: 409,
			data: { actionError: 'Nur eine versendete oder bezahlte Abrechnung lässt sich berichtigen. Laden Sie die Seite neu.' }
		});
	});

	it('erstellt die berichtigte Abrechnung und öffnet sie', async () => {
		const { calls, result } = runAction(actions.correct, 's1', 201, {}, { id: 's2' });

		await expect(result).rejects.toMatchObject({ status: 303, location: '/statements/s2' });
		expect(calls).toEqual([{ method: 'POST', url: `${API}/correction`, body: undefined }]);
	});

	it('sagt ohne Mietstage in der Periode, was zu tun ist', async () => {
		const { result } = runAction(actions.correct, 's1', 409, {}, correctionRefused);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				actionError:
					'Der Mietvertrag hat in dieser Abrechnungsperiode keine Mietstage mehr. Darum gibt es keine berichtigte Abrechnung. Teilen Sie dem Mieter mit, dass die Abrechnung NK-AB12CD34-2024-0001 nicht mehr gilt.'
			}
		});
	});
});
