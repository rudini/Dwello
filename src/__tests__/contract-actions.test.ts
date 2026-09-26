import { describe, it, expect } from 'vitest';
import { actions } from '../routes/contracts/[id]/+page.server';

type Action = (event: never) => Promise<unknown>;
type Call = { method?: string; url: string; body?: unknown };

function run(action: Action, status = 200) {
	const calls: Call[] = [];
	const fetch = async (url: string, init?: RequestInit) => {
		calls.push({ method: init?.method, url, body: init?.body && JSON.parse(String(init.body)) });
		return new Response(status === 204 ? null : '{}', { status });
	};
	return { calls, result: action({ params: { id: 'c1' }, fetch } as never) };
}

describe('Mietvertrag beenden', () => {
	it('setzt das Vertragsende im Backend auf heute', async () => {
		const { calls, result } = run(actions.end as Action);
		await result;

		const today = new Date().toISOString().split('T')[0];
		expect(calls).toEqual([
			{ method: 'PUT', url: 'http://localhost:3001/api/v1/contracts/c1', body: { endDate: today } }
		]);
	});
});

describe('Mietvertrag löschen', () => {
	it('löscht den Mietvertrag und kehrt zur Mietvertragsliste zurück', async () => {
		const { calls, result } = run(actions.delete as Action, 204);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/contracts' });
		expect(calls).toEqual([{ method: 'DELETE', url: 'http://localhost:3001/api/v1/contracts/c1', body: undefined }]);
	});

	it('meldet einen Fehler, wenn das Backend das Löschen ablehnt', async () => {
		const { result } = run(actions.delete as Action, 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { deleteError: 'Mietvertrag konnte nicht gelöscht werden.' }
		});
	});
});
