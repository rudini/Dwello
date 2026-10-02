import { describe, it, expect } from 'vitest';
import { runAction } from './helpers/action';
import { actions } from '../routes/statements/[id]/edit/+page.server';

const fields = { paymentDeadline: '2025-03-31', notes: 'Zahlung in zwei Raten vereinbart' };

describe('Abrechnung bearbeiten', () => {
	it('speichert Zahlungsfrist und Bemerkungen und kehrt zur Abrechnung zurück', async () => {
		const { calls, result } = runAction(actions.default, 's1', 200, fields);

		await expect(result).rejects.toMatchObject({ status: 303, location: '/statements/s1' });
		expect(calls).toEqual([
			{ method: 'PUT', url: 'http://localhost:3001/api/v1/statements/s1', body: fields }
		]);
	});

	it('meldet einen Fehler, wenn das Backend das Speichern ablehnt', async () => {
		const { result } = runAction(actions.default, 's1', 400, fields);

		expect(await result).toMatchObject({
			status: 400,
			data: { errors: { form: 'Abrechnung konnte nicht gespeichert werden.' } }
		});
	});
});
