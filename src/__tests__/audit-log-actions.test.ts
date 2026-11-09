import { describe, expect, it } from 'vitest';
import { actions, load } from '../routes/config/audit-log/+page.server';
import { runAction } from './helpers/action';
import auditLog from '../../tests/contracts/audit-log.json';

const API = 'http://localhost:3001/api/v1/audit-log';

// Protokoll (#357): Eintrag löschen
describe('Eintrag im Protokoll löschen', () => {
	it('löscht den Eintrag und zeigt das Protokoll', async () => {
		const { calls, result } = runAction(actions.delete, '', 204, { id: 'a1' });

		await expect(result).rejects.toMatchObject({ status: 303, location: '/config/audit-log' });
		expect(calls).toEqual([{ method: 'DELETE', url: `${API}/a1`, body: undefined }]);
	});

	// Code-Review C-1: in einem anderen Tab schon gelöscht
	it('zeigt das Protokoll ohne den Eintrag, den es nicht mehr gibt', async () => {
		const { result } = runAction(actions.delete, '', 404, { id: 'a1' });

		await expect(result).rejects.toMatchObject({ status: 303, location: '/config/audit-log' });
	});

	it('meldet einen anderen Fehler in der Sprache der Oberfläche', async () => {
		const { result } = runAction(actions.delete, '', 500, { id: 'a1' });

		expect(await result).toMatchObject({
			status: 500,
			data: { error: 'Der Eintrag konnte nicht gelöscht werden. Versuchen Sie es erneut.' }
		});
	});

	// Code-Review C-19
	it('setzt die Kennung kodiert in die Adresse', async () => {
		const { calls, result } = runAction(actions.delete, '', 204, { id: 'a/1' });

		await result.catch(() => {});
		expect(calls[0].url).toBe(`${API}/a%2F1`);
	});
});

// Code-Review C-24: jede Ablehnung beim Laden zeigt die übersetzte Meldung
describe('Protokoll laden', () => {
	it('meldet, dass das Protokoll nicht geladen werden konnte', async () => {
		const fetch = async () => new Response(JSON.stringify({}), { status: 404 });

		await expect(
			load({ fetch, url: new URL('http://localhost/config/audit-log') } as never)
		).rejects.toMatchObject({
			status: 404,
			body: { message: 'Protokoll konnte nicht geladen werden' }
		});
	});

	// #746: 50 entries a page, the newest first; the page in the address
	it('lädt die Einträge der Seite aus der Adresse und nennt, wie viele es gibt', async () => {
		const asked: string[] = [];
		const fetch = (async (url: string) => {
			asked.push(url);
			return Response.json(auditLog);
		}) as typeof globalThis.fetch;

		const data = (await load({
			fetch,
			url: new URL('http://localhost/config/audit-log?page=2')
		} as never)) as {
			entries: unknown[];
			page: number;
			pageSize: number;
			total: number;
		};

		expect(asked).toEqual([`${API}?limit=50&offset=50`]);
		expect([data.entries.length, data.page, data.pageSize, data.total]).toEqual([6, 2, 50, 6]);
	});

	// Code review 746-1 C-3: past the last page, e.g. after deleting its only entry in another tab
	it('zeigt die erste Seite statt einer Seite nach der letzten', async () => {
		const fetch = (async () => Response.json({ data: [], total: 6 })) as typeof globalThis.fetch;

		await expect(
			load({ fetch, url: new URL('http://localhost/config/audit-log?page=3') } as never)
		).rejects.toMatchObject({ status: 303, location: '/config/audit-log' });
	});
});
