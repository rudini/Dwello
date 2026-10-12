import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions, load } from '../routes/contracts/[id]/+page.server';
import { load as listLoad } from '../routes/contracts/+page.server';
import { localToday } from '../lib/contract-status';
import refused from '../../tests/contracts/contract-end-refused.json';
import contractList from '../../tests/contracts/contracts.json';

describe('Vertragsstatus', () => {
	it('gibt Liste und Detail den Tag des Servers mit', async () => {
		const urls: string[] = [];
		const fetch = (async (url: string) => {
			urls.push(url);
			return Response.json({ id: 'c1', contracts: [], buildings: [], apartments: [] });
		}) as typeof globalThis.fetch;

		const list = (await listLoad({
			url: new URL('http://localhost/contracts?status=future'),
			fetch
		} as never)) as { today: string };
		const detail = (await load({ params: { id: 'c1' }, fetch } as never)) as { today: string };

		expect(list.today).toBe(localToday());
		expect(detail.today).toBe(localToday());
		expect(urls[0]).toContain('status=future');
	});

	// J-1: die Liste nennt eine Kündigung wie die Detailseite, nicht «befristet»
	it('gibt der Liste weiter, ob ein Mietvertrag gekündigt ist', async () => {
		const fetch = (async () => Response.json(contractList)) as unknown as typeof globalThis.fetch;

		const list = (await listLoad({
			url: new URL('http://localhost/contracts'),
			fetch
		} as never)) as {
			contracts: { terminated?: boolean }[];
		};

		expect(list.contracts[0].terminated).toBe(true);
	});
});

// Review K-1: «Nächste Schritte» nur, solange die Kündigung läuft und kein Nachmieter erfasst ist
describe('Nächste Schritte nach einer Kündigung', () => {
	const backend = (contract: Record<string, unknown>, others: unknown[] | null = []) =>
		(async (url: string) => {
			if (url.includes('/contracts?apartmentId='))
				return others
					? Response.json({ contracts: others })
					: new Response('down', { status: 500 });
			if (url.includes('/config') || url.includes('/statements?'))
				return Response.json({ data: [] });
			return Response.json({ id: 'c1', apartmentId: 'a1', startDate: '2024-04-01', ...contract });
		}) as typeof globalThis.fetch;
	const nextSteps = async (contract: Record<string, unknown>, others: unknown[] | null = []) =>
		(
			(await load({ params: { id: 'c1' }, fetch: backend(contract, others) } as never)) as {
				nextSteps: { successor: boolean } | null;
			}
		).nextSteps;
	const notice = { endDate: '2099-03-31', terminated: true };

	it('nennt sie bei einer laufenden Kündigung ohne Nachmieter', async () => {
		expect(await nextSteps(notice)).toEqual({ successor: false });
	});

	// Haiku-Review R2: die neue Adresse braucht es auch, wenn der Nachmieter schon erfasst ist
	it('nennt mit erfasstem Nachmieter nur noch die neue Adresse', async () => {
		const successor = { id: 'c2', startDate: '2099-04-01', endDate: null };
		expect(await nextSteps(notice, [successor])).toEqual({ successor: true });
	});

	it('nennt sie nicht nach dem Auszug und nicht ohne Kündigung', async () => {
		expect(await nextSteps({ endDate: '2021-02-28', terminated: true })).toBeNull();
		expect(await nextSteps({ endDate: '2099-03-31', terminated: false })).toBeNull();
	});

	// Haiku-Review R6: lieber kein Hinweis als ein falscher
	it('nennt sie nicht, wenn die Mietverträge der Wohnung nicht geladen werden können', async () => {
		expect(await nextSteps(notice, null)).toBeNull();
	});
});

// A-10: Mietstage in der letzten Abrechnungsperiode ohne Abrechnung
describe('Fehlende Abrechnung am Mietvertrag', () => {
	const backend = (statements: unknown[]) =>
		(async (url: string) => {
			if (url.endsWith('/config'))
				return Response.json({ data: { accounting_period: 'calendar' } });
			if (url.includes('/statements?'))
				return Response.json({ data: statements, total: statements.length });
			return Response.json({
				id: 'c1',
				startDate: '2024-04-01',
				endDate: null,
				apartmentId: 'a1',
				apartment: { id: 'a1', buildingId: 'b1' },
				building: { id: 'b1' }
			});
		}) as typeof globalThis.fetch;
	const lastYear = new Date().getFullYear() - 1;

	it('nennt die Periode und führt zum Assistenten für dieses Gebäude', async () => {
		const data = (await load({ params: { id: 'c1' }, fetch: backend([]) } as never)) as {
			missingStatement: { start: string; end: string; href: string } | null;
		};
		expect(data.missingStatement).toEqual({
			start: `${lastYear}-01-01`,
			end: `${lastYear}-12-31`,
			href: `/statements/generate?building=b1&start=${lastYear}-01-01&end=${lastYear}-12-31`
		});
	});

	it('schweigt, wenn der Mietvertrag seine Abrechnung hat', async () => {
		const data = (await load({
			params: { id: 'c1' },
			fetch: backend([{ contractId: 'c1' }])
		} as never)) as { missingStatement: unknown };
		expect(data.missingStatement).toBeNull();
	});
});

describe('Mietvertrag beenden', () => {
	// den Vertragsbeginn liest die Aktion beim Backend, nicht aus dem Formular
	it('setzt das Vertragsende im Backend auf den eingegebenen Tag', async () => {
		const { calls, result } = runAction(
			actions.end,
			'c1',
			200,
			{ endDate: '2099-12-31' },
			{ startDate: '2024-04-01' }
		);
		await result;

		expect(calls).toEqual([
			{ method: undefined, url: 'http://localhost:3001/api/v1/contracts/c1', body: undefined },
			{
				method: 'PUT',
				url: 'http://localhost:3001/api/v1/contracts/c1',
				body: { endDate: '2099-12-31', terminated: true }
			}
		]);
	});

	// die Aktion prüft selbst (ein Formular ohne JavaScript): ein nachträglich erfasster Kündigungstermin braucht die Bestätigung seiner Folge
	it('lehnt ein Vertragsende vor heute ohne Bestätigung ab, ohne den Mietvertrag zu ändern', async () => {
		const { calls, result } = runAction(
			actions.end,
			'c1',
			200,
			{ endDate: '2025-03-31' },
			{ startDate: '2024-04-01' }
		);

		expect(await result).toMatchObject({
			status: 400,
			data: {
				endError:
					'Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende.'
			}
		});
		expect(calls.filter((call) => call.method === 'PUT')).toEqual([]);
	});

	it('setzt ein bestätigtes Vertragsende vor heute', async () => {
		const { calls, result } = runAction(
			actions.end,
			'c1',
			200,
			{ endDate: '2025-03-31', pastConfirmed: 'on' },
			{ startDate: '2024-04-01' }
		);
		await result;

		expect(calls.filter((call) => call.method === 'PUT')).toEqual([
			{
				method: 'PUT',
				url: 'http://localhost:3001/api/v1/contracts/c1',
				body: { endDate: '2025-03-31', terminated: true }
			}
		]);
	});

	// eine gespeicherte Nebenkostenabrechnung enthält schon Mietstage nach dem neuen Ende: das Backend lehnt ab
	it('sagt bei einem Entwurf, der schon Mietstage nach dem Tag enthält, was zu tun ist', async () => {
		const { result } = runAction(
			actions.end,
			'c1',
			200,
			{ endDate: '2025-03-31', pastConfirmed: 'on' },
			{ startDate: '2024-04-01' },
			{ status: 409, answer: refused }
		);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				endError:
					'Die Nebenkostenabrechnung NK-2025-0003 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.',
				// A-10: der Dialog verlinkt die genannten Abrechnungen, für den abgelehnten Tag
				refused: refused.statements,
				refusedDay: '2025-03-31'
			}
		});
	});

	// eine andere Ablehnung ohne Abrechnungen zeigt eine Meldung, keine Fehlerseite
	it('meldet eine Ablehnung ohne Abrechnungen im Dialog', async () => {
		const { result } = runAction(
			actions.end,
			'c1',
			200,
			{ endDate: '2099-12-31' },
			{ startDate: '2024-04-01' },
			{ status: 409, answer: 'kein JSON' }
		);

		expect(await result).toMatchObject({
			status: 409,
			data: { endError: 'Mietvertrag konnte nicht beendet werden.' }
		});
	});

	// aus einem alten Fenster: ein schon gesetztes Vertragsende ändert man unter «Bearbeiten»
	it('überschreibt kein schon gesetztes Vertragsende', async () => {
		const { calls, result } = runAction(
			actions.end,
			'c1',
			200,
			{ endDate: '2099-12-31' },
			{ startDate: '2024-04-01', endDate: '2026-12-31' }
		);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				endError: 'Der Mietvertrag hat schon ein Vertragsende. Ändern Sie es unter «Bearbeiten».'
			}
		});
		expect(calls.filter((call) => call.method === 'PUT')).toEqual([]);
	});

	it('meldet, wenn der Mietvertrag nicht geladen werden kann', async () => {
		const { calls, result } = runAction(actions.end, 'c1', 404, { endDate: '2099-12-31' });

		expect(await result).toMatchObject({
			status: 404,
			data: { endError: 'Mietvertrag konnte nicht beendet werden.' }
		});
		expect(calls.filter((call) => call.method === 'PUT')).toEqual([]);
	});

	it('lehnt ein Vertragsende vor dem Vertragsbeginn eines künftigen Mietvertrags ab', async () => {
		const { calls, result } = runAction(
			actions.end,
			'c1',
			200,
			{ endDate: '2099-10-31' },
			{ startDate: '2099-11-01' }
		);

		expect(await result).toMatchObject({
			status: 400,
			data: { endError: 'Das Vertragsende kann nicht vor dem Vertragsbeginn am 01.11.2099 liegen.' }
		});
		expect(calls.filter((call) => call.method === 'PUT')).toEqual([]);
	});
});

// A-10: der einzige Entwurf wird gelöscht, der Mietvertrag beendet, danach geht es in den Assistenten
describe('Entwurf löschen und Mietvertrag beenden', () => {
	type Call = { method?: string; url: string; body?: unknown };
	function run(fields: Record<string, string>, statement: Record<string, unknown>, put = 200) {
		const calls: Call[] = [];
		const fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
			if (url.includes('/statements/')) {
				return init?.method === 'DELETE'
					? new Response(null, { status: 204 })
					: Response.json(statement);
			}
			if (init?.method === 'PUT') return Response.json({}, { status: put });
			return Response.json({ startDate: '2024-04-01', endDate: null });
		}) as typeof globalThis.fetch;
		const form = new FormData();
		for (const [name, value] of Object.entries(fields)) form.append(name, value);
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const result = (actions.endDeletingDraft as (event: never) => Promise<unknown>)({
			params: { id: 'c1' },
			fetch,
			request
		} as never);
		return { calls, result };
	}
	const draft = {
		id: 's1',
		contractId: 'c1',
		status: 'draft',
		periodStart: '2025-01-01',
		periodEnd: '2025-12-31',
		building: { id: 'b1' }
	};
	const fields = { endDate: '2025-03-31', pastConfirmed: 'on', statementId: 's1' };

	it('löscht den Entwurf, beendet den Mietvertrag und öffnet den Assistenten', async () => {
		const { calls, result } = run(fields, draft);

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/statements/generate?building=b1&start=2025-01-01&end=2025-12-31'
		});
		expect(calls.filter((call) => call.method).map((c) => [c.method, c.url, c.body])).toEqual([
			['DELETE', 'http://localhost:3001/api/v1/statements/s1', undefined],
			[
				'PUT',
				'http://localhost:3001/api/v1/contracts/c1',
				{ endDate: '2025-03-31', terminated: true }
			]
		]);
	});

	// der Entwurf ist gelöscht, der Mietvertrag nicht beendet: kein Assistent, die Ablehnung bleibt im Dialog
	it('öffnet den Assistenten nicht, wenn das Beenden danach abgelehnt wird', async () => {
		const { result } = run(fields, draft, 500);

		expect(await result).toMatchObject({
			status: 500,
			data: { endError: 'Mietvertrag konnte nicht beendet werden.' }
		});
	});

	// aus einem alten Fenster oder einem fremden Formular: nur ein Entwurf dieses Mietvertrags
	it('löscht keine Abrechnung eines anderen Mietvertrags und keine versendete', async () => {
		for (const statement of [
			{ ...draft, contractId: 'c2' },
			{ ...draft, status: 'sent' }
		]) {
			const { calls, result } = run(fields, statement);
			expect(await result).toMatchObject({ status: 409 });
			expect(calls.filter((call) => call.method)).toEqual([]);
		}
	});

	it('verlangt auch hier die Bestätigung eines vergangenen Vertragsendes', async () => {
		const { calls, result } = run({ endDate: '2025-03-31', statementId: 's1' }, draft);
		expect(await result).toMatchObject({ status: 400 });
		expect(calls.filter((call) => call.method)).toEqual([]);
	});
});

describe('Mietvertrag löschen', () => {
	// noch nicht begonnen: er hat keine Mietstage
	it('löscht einen künftigen Mietvertrag und kehrt zur Mietvertragsliste zurück', async () => {
		const { calls, result } = runAction(actions.delete, 'c1', 200, {}, { startDate: '2099-11-01' });

		await expect(result).rejects.toMatchObject({ status: 303, location: '/contracts' });
		expect(calls.filter((call) => call.method === 'DELETE')).toEqual([
			{ method: 'DELETE', url: 'http://localhost:3001/api/v1/contracts/c1', body: undefined }
		]);
	});

	// auch ohne JavaScript: die Nebenkostenabrechnung braucht seine Mietstage
	it('löscht keinen Mietvertrag, der begonnen hat', async () => {
		const { calls, result } = runAction(
			actions.delete,
			'c1',
			200,
			{},
			{ startDate: '2024-01-01', endDate: '2024-12-31' }
		);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				deleteError:
					'Ein Mietvertrag, der begonnen hat, kann nicht gelöscht werden: Die Nebenkostenabrechnung braucht seine Mietstage, also die Tage, an denen er gilt.'
			}
		});
		expect(calls.filter((call) => call.method === 'DELETE')).toEqual([]);
	});

	it('meldet einen Fehler, wenn das Backend das Löschen ablehnt', async () => {
		const { result } = runAction(actions.delete, 'c1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { deleteError: 'Mietvertrag konnte nicht gelöscht werden.' }
		});
	});
});
