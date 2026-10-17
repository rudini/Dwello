import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions, load } from '../routes/contracts/[id]/+page.server';
import { load as listLoad } from '../routes/contracts/+page.server';
import { localToday } from '../lib/contract-status';
import refused from '../../tests/contracts/contract-end-refused.json';
import contractList from '../../tests/contracts/contracts.json';
import contractDetail from '../../tests/contracts/contract.json';
import category from '../../tests/contracts/category.json';
import periodStatements from '../../tests/contracts/period-statements.json';
import contractHasStatements from '../../tests/contracts/contract-delete-refused.json';

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
				nextSteps: { successor: boolean; ended: boolean } | null;
			}
		).nextSteps;
	const notice = { endDate: '2099-03-31', terminated: true };

	it('nennt sie bei einer laufenden Kündigung ohne Nachmieter', async () => {
		expect(await nextSteps(notice)).toEqual({ successor: false, ended: false });
	});

	// Haiku-Review R2: die neue Adresse braucht es auch, wenn der Nachmieter schon erfasst ist
	it('nennt mit erfasstem Nachmieter nur noch die neue Adresse', async () => {
		const successor = { id: 'c2', startDate: '2099-04-01', endDate: null };
		expect(await nextSteps(notice, [successor])).toEqual({ successor: true, ended: false });
	});

	it('nennt sie nicht nach dem Auszug und nicht ohne Kündigung', async () => {
		expect(await nextSteps({ endDate: '2021-02-28', terminated: true })).toBeNull();
		expect(await nextSteps({ endDate: '2099-03-31', terminated: false })).toBeNull();
	});

	// A-5 (#114): nach dem Auszug geht die Abrechnung sonst an die verlassene Wohnung
	it('nennt nach dem Vertragsende nur noch die neue Adresse, solange es die Adresse der Wohnung ist', async () => {
		expect(await nextSteps({ endDate: '2021-02-28', terminated: true, oldAddress: true })).toEqual({
			successor: false,
			ended: true
		});
	});

	// Haiku-Review R6: lieber kein Hinweis als ein falscher
	it('nennt sie nicht, wenn die Mietverträge der Wohnung nicht geladen werden können', async () => {
		expect(await nextSteps(notice, null)).toBeNull();
	});
});

// A-10, #142: Mietstage in abgelaufenen Abrechnungsperioden ohne Abrechnung
describe('Fehlende Abrechnungen am Mietvertrag', () => {
	const lastYear = new Date().getFullYear() - 1;
	const year = (y: number) => ({ start: `${y}-01-01`, end: `${y}-12-31` });
	// a whole period leads into the wizard; each range to the building's invoices of its year (#211)
	const missingYear = (y: number) => ({
		...year(y),
		href: `/statements/generate?building=b1&start=${y}-01-01&end=${y}-12-31`,
		invoices: { href: `/invoices?building=b1&year=${y}`, label: `Rechnungen ${y} ansehen` }
	});
	// backend answers as checked against the real API (tests/contracts); the statements filter by contractId as the
	// backend does: a previous tenant's statement in the same apartment comes back only without that filter
	const statementOf = (contractId: string, y: number) => ({
		...periodStatements.data[0],
		contractId,
		periodStart: `${y}-01-01`,
		periodEnd: `${y}-12-31`
	});
	const backend = (
		statements: ReturnType<typeof statementOf>[],
		startDate = `${lastYear - 2}-04-01`,
		billedUntil: string | null = null
	) =>
		(async (url: string) => {
			if (url.endsWith('/config'))
				return Response.json({ data: { accounting_period: 'calendar' } });
			if (url.includes('/statements?')) {
				const contractId = new URL(url).searchParams.get('contractId');
				const data = statements.filter((s) => !contractId || s.contractId === contractId);
				return Response.json({ data, total: data.length });
			}
			return Response.json({
				...contractDetail,
				startDate,
				endDate: null,
				terminated: false,
				billedUntil
			});
		}) as typeof globalThis.fetch;
	const missingOf = async (fetch: typeof globalThis.fetch) =>
		((await load({ params: { id: 'c1' }, fetch } as never)) as { missingStatements: unknown })
			.missingStatements;

	it('nennt jede abgelaufene Periode ohne Abrechnung ab Vertragsbeginn, die neueste zuerst', async () => {
		// three ended years with rent days; the middle one has its statement, the previous tenant's of the last year
		// does not count
		const statements = [statementOf('c1', lastYear - 1), statementOf('c0', lastYear)];
		expect(await missingOf(backend(statements))).toEqual([lastYear, lastYear - 2].map(missingYear));
	});

	// #116: the delete dialog names them, a Mietvertrag they bill is not deleted
	it('nennt die Abrechnungen des Mietvertrags', async () => {
		const statements = [statementOf('c1', lastYear - 1), statementOf('c0', lastYear)];
		const data = (await load({ params: { id: 'c1' }, fetch: backend(statements) } as never)) as {
			billedBy: unknown;
		};
		expect(data.billedBy).toEqual([
			{
				id: periodStatements.data[0].id,
				statementNumber: periodStatements.data[0].statementNumber,
				status: 'paid'
			}
		]);
	});

	// Review C-1: unbekannt ist nicht «keine»
	it('lässt die Abrechnungen offen, wenn sie nicht geladen werden können', async () => {
		const answer = backend([]);
		const fetch = (async (url: string) =>
			url.includes('/statements?')
				? new Response(null, { status: 500 })
				: answer(url)) as typeof globalThis.fetch;
		const data = (await load({ params: { id: 'c1' }, fetch } as never)) as { billedBy: unknown };
		expect(data.billedBy).toBeNull();
	});

	// #133: bis «Abgerechnet bis» ausserhalb von Dwello abgerechnet; eine Periode, die darüber hinausreicht, fehlt noch
	it('übergeht Perioden, die bis «Abgerechnet bis» enden', async () => {
		const missing = await missingOf(backend([], `${lastYear - 2}-04-01`, `${lastYear - 1}-06-30`));
		expect(missing).toEqual([lastYear, lastYear - 1].map(missingYear));
	});

	// #120, Fachreview W2e: eine ersetzte Abrechnung zählt nicht als Abrechnung der Periode
	it('nennt die Periode einer ersetzten Abrechnung ohne berichtigte', async () => {
		const replaced = { ...statementOf('c1', lastYear), status: 'replaced' };
		expect(await missingOf(backend([replaced], `${lastYear}-03-01`))).toEqual([
			missingYear(lastYear)
		]);
	});

	// #199: an overlapping statement counts; the days it leaves have no way into the wizard until #281 decides one
	it('nennt nur die Tage, die keine Abrechnung abdeckt, ohne Weg in den Assistenten', async () => {
		const overlapping = {
			...statementOf('c1', lastYear),
			periodStart: `${lastYear - 1}-07-01`,
			periodEnd: `${lastYear}-06-30`
		};
		expect(await missingOf(backend([overlapping], `${lastYear}-01-01`))).toEqual([
			{
				start: `${lastYear}-07-01`,
				end: `${lastYear}-12-31`,
				href: null,
				invoices: {
					href: `/invoices?building=b1&year=${lastYear}`,
					label: `Rechnungen ${lastYear} ansehen`
				}
			}
		]);
	});

	// #211: the list marks each contract with the same rule, without opening it
	const listed = async (statements: unknown[] | null) => {
		const fetch = (async (url: string) => {
			if (url.endsWith('/config'))
				return Response.json({ data: { accounting_period: 'calendar' } });
			if (url.includes('/statements?'))
				return statements
					? Response.json({ data: statements })
					: new Response(null, { status: 500 });
			return Response.json(contractList);
		}) as typeof globalThis.fetch;
		const list = (await listLoad({
			url: new URL('http://localhost/contracts'),
			fetch
		} as never)) as {
			contracts: { missingStatement?: boolean }[];
		};
		return list.contracts[0].missingStatement;
	};

	it('kennzeichnet in der Liste einen Mietvertrag mit fehlender Abrechnung', async () => {
		expect(await listed([statementOf('c1', lastYear)])).toBe(true);
	});

	it('kennzeichnet in der Liste keinen Mietvertrag, dessen Abrechnungen jeden Mietstag abdecken', async () => {
		const all = {
			...statementOf('c1', lastYear),
			periodStart: '2024-04-01',
			periodEnd: `${lastYear}-12-31`
		};
		expect(await listed([all, statementOf('c0', lastYear)])).toBe(false);
	});

	// better no mark than a wrong one
	it('kennzeichnet nichts, wenn die Abrechnungen nicht geladen werden können', async () => {
		expect(await listed(null)).toBe(false);
	});

	it('schweigt für Perioden vor dem Vertragsbeginn und wenn jede ihre Abrechnung hat', async () => {
		expect(await missingOf(backend([statementOf('c1', lastYear)], `${lastYear}-03-01`))).toEqual(
			[]
		);
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

	// A-3 (#112): der Tag, an dem die Kündigung eingegangen ist, wird mit dem Vertragsende gespeichert
	it('speichert den Eingang der Kündigung mit dem Vertragsende', async () => {
		const { calls, result } = runAction(
			actions.end,
			'c1',
			200,
			{ endDate: '2099-12-31', noticeReceivedOn: '2099-09-15' },
			{ startDate: '2024-04-01' }
		);
		await result;

		expect(calls.filter((call) => call.method === 'PUT')).toEqual([
			{
				method: 'PUT',
				url: 'http://localhost:3001/api/v1/contracts/c1',
				body: { endDate: '2099-12-31', terminated: true, noticeReceivedOn: '2099-09-15' }
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

	// #141: one request, so the backend keeps the draft when it refuses the end
	it('löscht den Entwurf mit dem Beenden in einem Schritt und öffnet den Assistenten', async () => {
		const { calls, result } = run(fields, draft);

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/statements/generate?building=b1&start=2025-01-01&end=2025-12-31'
		});
		expect(calls.filter((call) => call.method).map((c) => [c.method, c.url, c.body])).toEqual([
			[
				'PUT',
				'http://localhost:3001/api/v1/contracts/c1',
				{ endDate: '2025-03-31', terminated: true, deleteDraft: 's1' }
			]
		]);
	});

	// der Mietvertrag ist nicht beendet: kein Assistent, die Ablehnung bleibt im Dialog
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

	// A-7 (#116): auch ohne JavaScript nur mit Bestätigung, dass er irrtümlich erfasst wurde
	it('löscht keinen begonnenen Mietvertrag ohne Bestätigung des Irrtums', async () => {
		const { calls, result } = runAction(
			actions.delete,
			'c1',
			200,
			{},
			{ startDate: '2024-01-01', endDate: '2024-12-31' }
		);

		expect(await result).toMatchObject({
			status: 400,
			data: {
				deleteError:
					'Bitte bestätigen Sie, dass dieser Mietvertrag irrtümlich erfasst wurde, oder brechen Sie ab.'
			}
		});
		expect(calls.filter((call) => call.method === 'DELETE')).toEqual([]);
	});

	it('löscht einen begonnenen Mietvertrag mit Bestätigung des Irrtums', async () => {
		const { calls, result } = runAction(
			actions.delete,
			'c1',
			200,
			{ mistakeConfirmed: 'on' },
			{ startDate: '2024-01-01' }
		);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/contracts' });
		expect(calls.filter((call) => call.method === 'DELETE').map((call) => call.url)).toEqual([
			'http://localhost:3001/api/v1/contracts/c1?confirmMistake=true'
		]);
	});

	// eine Abrechnung kam nach dem Laden der Seite dazu: die Meldung zum Code des Backends
	it('nennt den Grund, wenn das Backend einen Mietvertrag mit Abrechnung ablehnt', async () => {
		const fetch = (async (_url: string, init?: RequestInit) =>
			init?.method === 'DELETE'
				? Response.json(contractHasStatements, { status: 409 })
				: Response.json({ startDate: '2024-01-01' })) as typeof globalThis.fetch;
		const form = new FormData();
		form.set('mistakeConfirmed', 'on');
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const result = (actions.delete as (event: never) => Promise<unknown>)({
			params: { id: 'c1' },
			fetch,
			request
		} as never);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				deleteError:
					'Dieser Mietvertrag kann nicht gelöscht werden, weil eine Nebenkostenabrechnung seine Mietstage abrechnet. Laden Sie die Seite neu, um sie zu sehen.'
			}
		});
	});

	it('meldet einen Fehler, wenn das Backend das Löschen ablehnt', async () => {
		const { result } = runAction(actions.delete, 'c1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { deleteError: 'Mietvertrag konnte nicht gelöscht werden.' }
		});
	});
});

// A-6 (#115): nach einem abgelaufenen befristeten Mietvertrag fragt die Seite, ob der Mieter noch in der Wohnung wohnt
describe('Abgelaufener befristeter Mietvertrag', () => {
	const backend = (contract: Record<string, unknown>, others: unknown[] | null = []) =>
		(async (url: string) => {
			if (url.includes('/contracts?apartmentId='))
				return others
					? Response.json({ contracts: others })
					: new Response('down', { status: 500 });
			if (url.includes('/config') || url.includes('/statements?'))
				return Response.json({ data: [] });
			return Response.json({ ...contractDetail, ...contract });
		}) as typeof globalThis.fetch;
	const asked = async (contract: Record<string, unknown>, others: unknown[] | null = []) =>
		(
			(await load({ params: { id: 'c1' }, fetch: backend(contract, others) } as never)) as {
				fixedTermCheck: boolean;
			}
		).fixedTermCheck;
	const expired = { endDate: '2025-12-31', terminated: false, movedOut: false };

	it('fragt nach einem vereinbarten Vertragsende vor heute ohne späteren Mietvertrag', async () => {
		expect(await asked(expired)).toBe(true);
	});

	it('fragt nicht nach einer Kündigung, einem bestätigten Auszug, einem späteren Mietvertrag oder vor dem Ende', async () => {
		expect(await asked({ ...expired, terminated: true })).toBe(false);
		expect(await asked({ ...expired, movedOut: true })).toBe(false);
		expect(await asked(expired, [{ id: 'c2', startDate: '2026-01-01', endDate: null }])).toBe(
			false
		);
		expect(await asked({ ...expired, endDate: '2099-12-31' })).toBe(false);
		// Fachreview A-6 V-6: am letzten Tag läuft der Mietvertrag noch
		expect(await asked({ ...expired, endDate: localToday() })).toBe(false);
		expect(await asked({ ...expired, endDate: null })).toBe(false);
	});

	it('fragt nicht, wenn die Mietverträge der Wohnung nicht geladen werden können', async () => {
		expect(await asked(expired, null)).toBe(false);
	});

	it('führt den Mietvertrag unbefristet weiter, indem es das Vertragsende entfernt', async () => {
		const { calls, result } = runAction(actions.continueOpenEnded, 'c1');
		await result;

		expect(calls).toEqual([
			{ method: 'PUT', url: 'http://localhost:3001/api/v1/contracts/c1', body: { endDate: null } }
		]);
	});

	// die Abrechnung rechnet die Zeit nach dem Vertragsende als Leerstand ab (A-10)
	it('sagt, welche Abrechnung das Weiterführen sperrt, und bietet den Entwurf an', async () => {
		const { result } = runAction(
			actions.continueOpenEnded,
			'c1',
			200,
			{},
			{},
			{
				status: 409,
				answer: refused
			}
		);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				fixedTermError:
					'Die Nebenkostenabrechnung NK-2025-0003 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Sie können den Entwurf unten löschen und die Nebenkostenabrechnung danach neu erstellen.',
				fixedTermRefused: refused.statements
			}
		});
	});

	// Fachreview A-6 V-2: eine versendete Abrechnung ändert Dwello nicht; die Meldung spricht von keinem Datum, und
	// der Mietvertrag läuft rechtlich trotzdem weiter (M-3)
	it('sagt bei einer versendeten Abrechnung, dass Dwello das Vertragsende nicht entfernen kann', async () => {
		const sent = { statements: [{ ...refused.statements[0], status: 'sent' }] };
		const { result } = runAction(
			actions.continueOpenEnded,
			'c1',
			200,
			{},
			{},
			{
				status: 409,
				answer: sent
			}
		);

		expect(await result).toMatchObject({
			status: 409,
			data: {
				fixedTermError:
					'Die Nebenkostenabrechnung NK-2025-0003 (versendet) wurde mit den bisherigen Vertragsdaten berechnet. Dwello ändert sie nicht, darum kann Dwello das Vertragsende noch nicht entfernen. Für Sie und den Mieter läuft der Mietvertrag trotzdem unbefristet weiter. Berichtigen Sie zuerst jede dieser Abrechnungen. Öffnen Sie sie dazu und wählen Sie «Abrechnung berichtigen».'
			}
		});
	});

	it('meldet eine andere Ablehnung beim Weiterführen', async () => {
		const { result } = runAction(actions.continueOpenEnded, 'c1', 500);

		expect(await result).toMatchObject({
			status: 500,
			data: {
				fixedTermError: 'Beim Speichern ist ein Fehler aufgetreten. Versuchen Sie es später erneut.'
			}
		});
	});

	it('speichert am Mietvertrag, dass der Mieter ausgezogen ist', async () => {
		const { calls, result } = runAction(actions.movedOut, 'c1');
		await result;

		expect(calls).toEqual([
			{ method: 'PUT', url: 'http://localhost:3001/api/v1/contracts/c1', body: { movedOut: true } }
		]);
	});

	// im Dialog, der den Auszug bestätigt (personas a6 P-1)
	it('meldet im Dialog, wenn sich der Auszug nicht speichern lässt', async () => {
		const { result } = runAction(actions.movedOut, 'c1', 500);

		expect(await result).toMatchObject({
			status: 500,
			data: {
				movedOutError: 'Beim Speichern ist ein Fehler aufgetreten. Versuchen Sie es später erneut.'
			}
		});
	});
});

describe('Entwurf löschen und Mietvertrag unbefristet weiterführen', () => {
	type Call = { method?: string; url: string; body?: unknown };
	function run(statement: Record<string, unknown>) {
		const calls: Call[] = [];
		const fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
			return url.includes('/statements/') ? Response.json(statement) : Response.json({});
		}) as typeof globalThis.fetch;
		const form = new FormData();
		form.append('statementId', 's1');
		const request = new Request('http://localhost:3000', { method: 'POST', body: form });
		const result = (actions.continueDeletingDraft as (event: never) => Promise<unknown>)({
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

	// #141: in einem Schritt, damit das Backend den Entwurf behält, wenn es ablehnt
	it('löscht den Entwurf mit dem Weiterführen und öffnet den Assistenten', async () => {
		const { calls, result } = run(draft);

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/statements/generate?building=b1&start=2025-01-01&end=2025-12-31'
		});
		expect(calls.filter((call) => call.method).map((c) => [c.method, c.url, c.body])).toEqual([
			['PUT', 'http://localhost:3001/api/v1/contracts/c1', { endDate: null, deleteDraft: 's1' }]
		]);
	});

	it('löscht keine Abrechnung eines anderen Mietvertrags und keine versendete', async () => {
		for (const statement of [
			{ ...draft, contractId: 'c2' },
			{ ...draft, status: 'sent' }
		]) {
			const { calls, result } = run(statement);
			expect(await result).toMatchObject({ status: 409 });
			expect(calls.filter((call) => call.method)).toEqual([]);
		}
	});
});

// #91: the contract's page names its agreed Nebenkosten; without the categories it still shows the rest
describe('Vereinbarte Nebenkosten am Mietvertrag', () => {
	const backend = (categories: Response) =>
		(async (url: string) =>
			url.endsWith('/categories?limit=100')
				? categories
				: url.endsWith('/contracts/c1')
					? Response.json(contractDetail)
					: Response.json({ data: [], contracts: [] })) as typeof globalThis.fetch;
	const agreedCosts = async (categories: Response) =>
		(
			(await load({ params: { id: 'c1' }, fetch: backend(categories) } as never)) as {
				agreedCosts: unknown;
			}
		).agreedCosts;

	it('nennt die vereinbarten Kategorien beim Namen', async () => {
		const listed = Response.json({
			categories: [
				{ ...category, id: contractDetail.agreedCategoryIds[0], nameDE: 'Internet' },
				{ ...category, id: 'other', nameDE: 'Lift' }
			]
		});
		expect(await agreedCosts(listed)).toEqual(['Internet']);
	});

	it('zeigt den Mietvertrag ohne sie, wenn die Kategorien nicht geladen werden können', async () => {
		expect(await agreedCosts(new Response(null, { status: 500 }))).toBeNull();
	});
});
