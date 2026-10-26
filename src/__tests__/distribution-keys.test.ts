import { describe, it, expect, onTestFinished } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { actions as listActions, load } from '../routes/config/distribution-keys/+page.server';
import { actions as newActions } from '../routes/config/distribution-keys/new/+page.server';
import { actions as editActions } from '../routes/config/distribution-keys/[id]/edit/+page.server';
import { runAction } from './helpers/action';
import formulaRefused from '../../tests/contracts/formula-refused.json';
import keyDefault from '../../tests/contracts/distribution-key-default-refused.json';

const API = 'http://localhost:3001/api/v1/distribution-keys';

const form = {
	name: ' Fläche und Zimmer ',
	description: 'Gemischt',
	formula: ' {area} * 0.7 + {rooms} * 0.3 ',
	// #461: the names in the other languages are optional, an empty one stays empty (null)
	nameFR: ' Surface et pièces ',
	nameIT: '',
	nameEN: ''
};
const translations = { nameFR: 'Surface et pièces', nameIT: null, nameEN: null };

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
	it('erfasst den Schlüssel unter seinem deutschen Namen mit seinen Übersetzungen und zeigt die Verteilschlüssel', async () => {
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
					formula: '{area} * 0.7 + {rooms} * 0.3',
					...translations
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

	// in French, so the message can only come from the codes, not from the backend's German text (#852)
	it('zeigt, warum das Backend die Formel ablehnt, in der gewählten Sprache', async () => {
		overwriteGetLocale(() => 'fr');
		onTestFinished(() => overwriteGetLocale(() => baseLocale));
		const { result } = runAction(
			newActions.save,
			'',
			400,
			{ ...form, formula: '{persons}' },
			formulaRefused
		);

		expect(await result).toMatchObject({
			status: 400,
			data: {
				errors: {
					form: 'La formule n’est pas valable\u00a0: Variable inconnue {persons}. Sont autorisées {area}, {rooms}, {volume}, {units} et leurs sommes comme {area_total}.'
				}
			}
		});
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

	// #852: a code the UI does not know yet shows the page's sentence, never the backend's text
	it('nennt beim Testen einen Fehler mit unbekanntem Code mit dem Satz der Seite', async () => {
		const answer = {
			isValid: false,
			errors: ['Neue Prüfung'],
			errorCodes: [{ code: 'FORMULA_SOMETHING_NEW', params: {} }]
		};
		const { result } = runAction(newActions.test, '', 200, form, answer);

		expect(await result).toMatchObject({
			test: { errors: ['Die Formel lässt sich nicht rechnen'] }
		});
	});
});

describe('Verteilschlüssel bearbeiten', () => {
	it('ändert den deutschen Namen und die Übersetzungen und behält den Namen für Rechnungen', async () => {
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
					formula: '{area} * 0.7 + {rooms} * 0.3',
					...translations
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
		const { result } = runAction(listActions.delete, '', 409, { id: 'k1' }, keyDefault);

		expect(await result).toMatchObject({
			status: 409,
			data: { error: 'Der Verteilschlüssel ist in den Einstellungen als Standard hinterlegt.' }
		});
	});
});
