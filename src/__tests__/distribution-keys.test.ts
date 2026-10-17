import { describe, it, expect } from 'vitest';
import { actions as listActions, load } from '../routes/config/distribution-keys/+page.server';
import { actions as newActions } from '../routes/config/distribution-keys/new/+page.server';
import { actions as editActions } from '../routes/config/distribution-keys/[id]/edit/+page.server';
import { runAction } from './helpers/action';

const API = 'http://localhost:3001/api/v1/distribution-keys';

const form = {
	name: ' Fläche und Zimmer ',
	description: 'Gemischt',
	formula: ' {area} * 0.7 + {rooms} * 0.3 '
};

describe('Verteilschlüssel anzeigen', () => {
	it('zeigt den deutschen Namen und wie viele Rechnungen danach verteilt werden', async () => {
		const fetch = (async () =>
			Response.json({
				data: [
					{
						id: 'k1',
						name: 'Per Area (m²)',
						nameDE: 'Pro Fläche (m²)',
						type: 'predefined',
						formula: '{area}',
						invoiceCount: '4'
					}
				],
				total: 1
			})) as typeof globalThis.fetch;

		const data = (await load({ fetch } as never)) as { keys: unknown[] };

		expect(data.keys).toEqual([
			{
				id: 'k1',
				name: 'Pro Fläche (m²)',
				type: 'predefined',
				formula: '{area}',
				description: '',
				usageCount: 4
			}
		]);
	});

	it('zeigt eine Fehlerseite, wenn das Backend die Verteilschlüssel nicht liefert', async () => {
		const fetch = (async () => Response.json({}, { status: 503 })) as typeof globalThis.fetch;

		await expect(load({ fetch } as never)).rejects.toMatchObject({
			status: 503,
			body: { message: 'Fehler beim Laden der Verteilschlüssel' }
		});
	});
});

describe('Neuer Verteilschlüssel', () => {
	it('erfasst den Schlüssel unter seinem deutschen Namen und zeigt die Verteilschlüssel', async () => {
		const { calls, result } = runAction(newActions.save, '', 201, form, { id: 'k9' });

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/config/distribution-keys'
		});
		expect(calls).toEqual([
			{
				method: 'POST',
				url: API,
				body: {
					name: 'Fläche und Zimmer',
					nameDE: 'Fläche und Zimmer',
					type: 'custom',
					description: 'Gemischt',
					formula: '{area} * 0.7 + {rooms} * 0.3'
				}
			}
		]);
	});

	it('verlangt Name und Formel', async () => {
		const { calls, result } = runAction(newActions.save, '', 201, { name: '', formula: '' });

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: { name: 'Name ist erforderlich.', formula: 'Bitte geben Sie eine Formel ein.' }
			}
		});
		expect(calls).toEqual([]);
	});

	it('zeigt, warum das Backend die Formel ablehnt', async () => {
		const message = 'Die Formel ist ungültig: Unbekannte Variable {persons}.';
		const { result } = runAction(
			newActions.save,
			'',
			400,
			{ ...form, formula: '{persons}' },
			{ error: message }
		);

		expect(await result).toMatchObject({ status: 400, data: { errors: { form: message } } });
	});

	it('testet die Formel mit Beispielwohnungen', async () => {
		const answer = {
			isValid: true,
			results: [
				{ apartment: { area: 50, rooms: 2 }, value: 2000, share: '20.00%' },
				{ apartment: { area: 100, rooms: 4 }, value: 8000, share: '80.00%' }
			],
			errors: []
		};
		const { calls, result } = runAction(newActions.test, '', 200, form, answer);

		expect(await result).toEqual({
			test: {
				errors: [],
				results: [
					{ apartment: '50 m², 2 Zimmer', share: '20.00%' },
					{ apartment: '100 m², 4 Zimmer', share: '80.00%' }
				]
			}
		});
		expect(calls).toEqual([
			{
				method: 'POST',
				url: `${API}/test-formula`,
				body: { formula: '{area} * 0.7 + {rooms} * 0.3' }
			}
		]);
	});
});

describe('Verteilschlüssel bearbeiten', () => {
	it('ändert den deutschen Namen und behält den Namen für Rechnungen', async () => {
		const { calls, result } = runAction(editActions.save, 'k1', 200, form);

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/config/distribution-keys'
		});
		expect(calls).toEqual([
			{
				method: 'PUT',
				url: `${API}/k1`,
				body: {
					nameDE: 'Fläche und Zimmer',
					description: 'Gemischt',
					formula: '{area} * 0.7 + {rooms} * 0.3'
				}
			}
		]);
	});
});

describe('Verteilschlüssel löschen', () => {
	it('löscht den Schlüssel', async () => {
		const { calls, result } = runAction(listActions.delete, '', 204, { id: 'k1' });

		await expect(result).rejects.toMatchObject({
			status: 303,
			location: '/config/distribution-keys'
		});
		expect(calls).toEqual([{ method: 'DELETE', url: `${API}/k1`, body: undefined }]);
	});

	it('erklärt, warum der Standard-Verteilschlüssel bleibt', async () => {
		const message = 'Der Verteilschlüssel ist in den Einstellungen als Standard hinterlegt.';
		const { result } = runAction(listActions.delete, '', 409, { id: 'k1' }, { error: message });

		expect(await result).toMatchObject({ status: 409, data: { error: message } });
	});
});
