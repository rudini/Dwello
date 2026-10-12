import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions, load } from '../routes/contracts/[id]/+page.server';
import { load as listLoad } from '../routes/contracts/+page.server';
import { localToday } from '../lib/contract-status';
import refused from '../../tests/contracts/contract-end-refused.json';

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
					'Die Nebenkostenabrechnung NK-2025-0003 (Entwurf) wurde mit den bisherigen Vertragsdaten berechnet. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.'
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
