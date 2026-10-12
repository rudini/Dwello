import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { backendMessage } from '$lib/backend-error';

afterEach(() => overwriteGetLocale(() => baseLocale));

const french = () => overwriteGetLocale(() => 'fr');

describe('Fehler des Backends in der gewählten Sprache', () => {
	it('zeigt einen Fehler mit Code in der gewählten Sprache', () => {
		french();
		const body = {
			error: 'Eine Kategorie mit dem Namen "Lift" existiert bereits.',
			code: 'CATEGORY_NAME_TAKEN',
			params: { name: 'Lift' }
		};

		expect(backendMessage(body, 'Repli')).toBe('Une catégorie nommée « Lift » existe déjà.');
	});

	it('zeigt auf Deutsch denselben Text wie das Backend', () => {
		const body = {
			error: 'Die Monatsanteile müssen zusammen 100 % ergeben (aktuell 90 %).',
			code: 'HEATING_PROFILE_SHARES_SUM',
			params: { sum: 90 }
		};

		expect(backendMessage(body, 'Ersatz')).toBe(body.error);
	});

	it('setzt Teile, die selbst Codes sind, in der gewählten Sprache ein', () => {
		french();
		const body = {
			error: 'Kleine Wohnung (50 m², 2 Zimmer): Die Formel ergibt keine gültige Zahl.',
			code: 'FORMULA_SAMPLE_FAILED',
			params: { sample: 'FORMULA_SAMPLE_SMALL', reason: 'FORMULA_NOT_A_NUMBER' }
		};

		expect(backendMessage(body, 'Repli')).toBe(
			'Petit appartement (50 m², 2 pièces) : La formule ne donne pas de nombre valable.'
		);
	});

	it('setzt auch verschachtelte Codes ein', () => {
		const body = {
			error: 'Die Formel ist ungültig: …',
			code: 'FORMULA_INVALID',
			params: {
				cause: 'FORMULA_SAMPLE_FAILED',
				sample: 'FORMULA_SAMPLE_SMALL',
				reason: 'FORMULA_NOT_A_NUMBER'
			}
		};

		expect(backendMessage(body, 'Ersatz')).toBe(
			'Die Formel ist ungültig: Kleine Wohnung (50 m², 2 Zimmer): Die Formel ergibt keine gültige Zahl.'
		);
	});

	it('zeigt einen Fehler ohne Code mit seinem Text', () => {
		french();

		expect(backendMessage({ error: 'Failed to create invoice' }, 'Repli')).toBe(
			'Failed to create invoice'
		);
	});

	it('zeigt einen unbekannten Code mit seinem Text', () => {
		expect(backendMessage({ error: 'Neu', code: 'SOMETHING_NEW' }, 'Ersatz')).toBe('Neu');
	});

	it('zeigt ohne Text den Ersatz', () => {
		expect(backendMessage({}, 'Ersatz')).toBe('Ersatz');
		expect(backendMessage(undefined, 'Ersatz')).toBe('Ersatz');
	});

	it('liest auch den Fehler von apiCall mit Code und Text', () => {
		french();

		expect(
			backendMessage({ code: 'KI_UNAVAILABLE', message: 'Die KI ist nicht erreichbar.' }, 'Repli')
		).toBe('L’IA n’est pas joignable ou n’a pas proposé de catégorie adaptée.');
	});
});
