import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions } from '../routes/statements/[id]/+page.server';
import { localToday } from '$lib/contract-status';
import paidDateRefused from '../../tests/contracts/statement-paid-date-refused.json';
import correctionNotDue from '../../tests/contracts/statement-correction-not-due.json';
import correctionRefused from '../../tests/contracts/statement-correction-refused.json';
import sendRefused from '../../tests/contracts/statement-send-refused.json';

const API = 'http://localhost:3001/api/v1/statements/s1';
const today = localToday(); // the day in Switzerland, as the app takes it

// #86: das Backend sendet sie per E-Mail oder markiert sie als versendet, je nach Korrespondenzkanal des Mieters
describe('Abrechnung versenden', () => {
	it('lässt das Backend die Abrechnung versenden', async () => {
		const { calls, result } = runAction(actions.send, 's1');
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/send`, body: {} }]);
	});

	it('stellt sie nach einer gescheiterten E-Mail per Brief zu', async () => {
		const { calls, result } = runAction(actions.send, 's1', 200, { byLetter: 'true' });
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/send`, body: { byLetter: true } }]);
	});

	it('sagt, was schiefging und was zu tun ist, wenn die E-Mail nicht hinausgeht', async () => {
		const { result } = runAction(actions.send, 's1', 400, {}, sendRefused);

		expect(await result).toMatchObject({
			status: 400,
			data: {
				sendError:
					'Der Mieter hat keine E-Mail-Adresse. Erfassen Sie sie beim Mieter und senden Sie die Abrechnung erneut, oder stellen Sie sie per Brief zu.'
			}
		});
	});

	it('meldet einen Fehler, wenn das Backend den Versand ohne Grund ablehnt', async () => {
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

	// #959: der Betrag geht mit; ein leeres Feld ist kein Betrag, nicht still die ganze Zahlung (code review 959b-1 C-9)
	it('sendet den bezahlten Betrag mit und lehnt ein leeres Betragsfeld ab', async () => {
		const sent = runAction(actions.markPaid, 's1', 200, { paidDate: '2026-01-05', paidAmount: '-30.00' });
		await sent.result;
		const empty = runAction(actions.markPaid, 's1', 200, { paidDate: '2026-01-05', paidAmount: '' });

		expect(sent.calls).toEqual([
			{ method: 'PUT', url: `${API}/status`, body: { status: 'paid', paidDate: '2026-01-05', paidAmount: '-30.00' } }
		]);
		expect(await empty.result).toMatchObject({ status: 400 });
		expect(empty.calls).toEqual([]);
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

// #138, #448: frühestens das Ende der Abrechnungsperiode, das der Dialog mitsendet; das Backend prüft es noch einmal
describe('Zahlungsdatum und Ende der Abrechnungsperiode', () => {
	it('lehnt ein Zahlungsdatum vor dem Ende der Abrechnungsperiode ab, ohne zu speichern', async () => {
		const { calls, result } = runAction(actions.markPaid, 's1', 200, { paidDate: '2024-12-30', periodEnd: '2024-12-31' });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				actionError:
					'Das Zahlungsdatum liegt vor dem Ende der Abrechnungsperiode am 31.12.2024. Geben Sie frühestens dieses Datum ein.'
			}
		});
		expect(calls).toEqual([]);
	});

	it('zeigt die Ablehnung des Backends in Worten', async () => {
		const { result } = runAction(actions.markPaid, 's1', 200, { paidDate: '2024-12-30' }, {}, { status: 400, answer: paidDateRefused });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				actionError:
					'Das Zahlungsdatum liegt vor dem Ende der Abrechnungsperiode am 31.12.2024. Geben Sie frühestens dieses Datum ein.'
			}
		});
	});
});

// #506 (code review 506-1 C-4): einen offenen Übertrag von Hand ausgleichen
describe('Übertrag als ausgeglichen markieren', () => {
	it('lässt das Backend den Übertrag als ausgeglichen markieren', async () => {
		const { calls, result } = runAction(actions.settleCarry, 's1');
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/carry-settled`, body: undefined }]);
	});

	it('meldet einen Fehler mit dem nächsten Schritt, wenn das Backend scheitert', async () => {
		const { result } = runAction(actions.settleCarry, 's1', 500);

		expect(await result).toMatchObject({
			status: 500,
			data: { actionError: 'Der Übertrag wurde nicht als ausgeglichen markiert. Versuchen Sie es noch einmal.' }
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

// #454 (Fachreview 454-1 E-6): «Nicht berichtigen»
describe('Abrechnung nicht berichtigen', () => {
	it('lässt das Backend festhalten, dass die Abrechnung nicht berichtigt wird', async () => {
		const { calls, result } = runAction(actions.declineCorrection, 's1');
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/decline-correction`, body: undefined }]);
	});

	it('zeigt die Ablehnung des Backends in Worten', async () => {
		const { result } = runAction(actions.declineCorrection, 's1', 409, {}, correctionNotDue);

		expect(await result).toMatchObject({
			status: 409,
			data: { actionError: 'Diese Abrechnung muss nicht mehr berichtigt werden. Laden Sie die Seite neu.' }
		});
	});
});

describe('Abrechnung löschen', () => {
	it('löscht die Abrechnung und kehrt zur Abrechnungsliste zurück', async () => {
		const { calls, result } = runAction(actions.delete, 's1', 204);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/statements' });
		expect(calls).toEqual([{ method: 'DELETE', url: API, body: undefined }]);
	});

	it('kehrt zur Abrechnungsliste mit dem Filter zurück, von dem sie kam (#679)', async () => {
		const list = '/statements?building=b1&status=draft';
		const { result } = runAction(actions.delete, 's1', 204, { list });

		await expect(result).rejects.toMatchObject({ status: 303, location: list });
	});

	it.each(['https://example.com/statements', '//example.com', '/invoices?status=draft'])(
		'kehrt nach %s nicht zurück, nur zur Abrechnungsliste (#679)',
		async (list) => {
			const { result } = runAction(actions.delete, 's1', 204, { list });

			await expect(result).rejects.toMatchObject({ status: 303, location: '/statements' });
		}
	);

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
	// #86: die per E-Mail versendete Abrechnung liegt unter «Dokumente», ist aber keine Mahnung (die nächste Mahnstufe zählt die Mahnungen)
	it('führt nur die Mahnungen der Abrechnung als Mahnungen', async () => {
		const { load } = await import('../routes/statements/[id]/+page.server');
		const statementJson = (await import('../../tests/contracts/statement.json')).default;
		const [upload] = (await import('../../tests/contracts/documents.json')).default.data;
		const reminder = { ...upload, id: 'd1', type: 'reminder', reminderLevel: 1 };
		const sent = { ...upload, id: 'd2', type: 'statement', title: 'Nebenkostenabrechnung' };
		const fetch = (async (url: string) => {
			if (url.endsWith('/statements/s1')) return Response.json(statementJson);
			if (url.includes('/documents?')) return Response.json({ data: [sent, reminder] });
			return Response.json({ data: [] });
		}) as typeof globalThis.fetch;

		const data = (await load({ params: { id: 's1' }, fetch, url: new URL('http://localhost/statements/s1') } as never)) as { reminders: { id: string }[] };
		expect(data.reminders.map((document) => document.id)).toEqual(['d1']);
	});

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

		const data = (await load({ params: { id: 's1' }, fetch, url: new URL('http://localhost/statements/s1') } as never)) as {
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

		const data = (await load({ params: { id: 's1' }, fetch, url: new URL('http://localhost/statements/s1') } as never)) as {
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

		const data = (await load({ params: { id: 's1' }, fetch, url: new URL('http://localhost/statements/s1') } as never)) as { later: unknown };
		// #454: and whether the Tankbestand changed, and whether a correction is due (Fachreview 454-1 E-3)
		expect(data.later).toEqual({ invoices: 1, fuelStock: false, correctionDue: false, correctionDeclinable: false, correctionLowers: false, recalculated: null, carryOver: false, splitKeys: [] });
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

		const data = (await load({ params: { id: 's1' }, fetch, url: new URL('http://localhost/statements/s1') } as never)) as { later: unknown };
		expect(data.later).toEqual({ invoices: 0, fuelStock: false, correctionDue: false, correctionDeclinable: false, correctionLowers: false, recalculated: null, carryOver: false, splitKeys: [] });
	});
});

// #120, #358: berichtigte Abrechnung
describe('Abrechnung berichtigen', () => {
	it('ersetzt die Abrechnung im Backend', async () => {
		const { calls, result } = runAction(actions.replace, 's1');
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/replace`, body: undefined }]);
	});

	// #448 (5): was auf eine versendete oder überfällige Abrechnung schon bezahlt ist, rechnet die berichtigte an
	it('sendet mit, was schon bezahlt ist', async () => {
		const { calls, result } = runAction(actions.replace, 's1', 200, { paidAmount: '40.00' });
		await result;

		expect(calls).toEqual([{ method: 'POST', url: `${API}/replace`, body: { paidAmount: '40.00' } }]);
	});

	it('meldet einen ungültigen Betrag, ohne zu ersetzen', async () => {
		const { calls, result } = runAction(actions.replace, 's1', 200, { paidAmount: '-1' });

		expect(await result).toMatchObject({
			status: 400,
			data: { actionError: 'Der Betrag «-1» ist ungültig. Geben Sie einen Betrag in Franken ein, zum Beispiel 40.00.' }
		});
		expect(calls).toEqual([]);
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

// #528 (Code-Review 528-1 C-7): the hint names Kategorie and keys in the UI language; an invoice without key as its
// line, «Pro Einheit» (Fachreview 528-1 V-8)
describe('Verschiedene Verteilschlüssel in der Sprache der Oberfläche', () => {
	it('nennt Kategorie und Verteilschlüssel beim Namen und eine Rechnung ohne Verteilschlüssel «Pro Einheit»', async () => {
		const { localSplitKeys } = await import('$lib/server/statement');
		const split = { categoryId: 'c1', keyId: null, mainKeyId: 'k1', invoices: [{ id: 'i1', description: 'Hauswart Q4' }] };
		expect(localSplitKeys([split], new Map([['c1', 'Hauswart']]), new Map([['k1', 'Pro Fläche (m²)']]))).toEqual([
			{ ...split, categoryName: 'Hauswart', keyName: 'Pro Einheit', mainKeyName: 'Pro Fläche (m²)' }
		]);
	});
});
