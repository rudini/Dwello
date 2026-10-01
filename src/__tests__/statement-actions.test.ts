import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions } from '../routes/statements/[id]/+page.server';

const API = 'http://localhost:3001/api/v1/statements/s1';
const today = new Date().toISOString().split('T')[0];

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
