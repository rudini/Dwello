import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions } from '../routes/contracts/[id]/+page.server';

describe('Mietvertrag beenden', () => {
	it('setzt das Vertragsende im Backend auf heute', async () => {
		const { calls, result } = runAction(actions.end, 'c1');
		await result;

		const today = new Date().toISOString().split('T')[0];
		expect(calls).toEqual([
			{ method: 'PUT', url: 'http://localhost:3001/api/v1/contracts/c1', body: { endDate: today } }
		]);
	});
});

describe('Mietvertrag löschen', () => {
	it('löscht den Mietvertrag und kehrt zur Mietvertragsliste zurück', async () => {
		const { calls, result } = runAction(actions.delete, 'c1', 204);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/contracts' });
		expect(calls).toEqual([{ method: 'DELETE', url: 'http://localhost:3001/api/v1/contracts/c1', body: undefined }]);
	});

	it('meldet einen Fehler, wenn das Backend das Löschen ablehnt', async () => {
		const { result } = runAction(actions.delete, 'c1', 400);

		expect(await result).toMatchObject({
			status: 400,
			data: { deleteError: 'Mietvertrag konnte nicht gelöscht werden.' }
		});
	});
});
