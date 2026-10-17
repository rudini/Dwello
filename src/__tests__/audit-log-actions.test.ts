import { describe, expect, it } from 'vitest';
import { actions } from '../routes/config/audit-log/+page.server';
import { runAction } from './helpers/action';

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
		const { result } = runAction(
			actions.delete,
			'',
			404,
			{ id: 'a1' },
			{ error: 'Audit log entry not found' }
		);

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
