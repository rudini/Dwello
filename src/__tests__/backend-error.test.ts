import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { backendMessage, deliveryErrorText } from '$lib/backend-error';

afterEach(() => overwriteGetLocale(() => baseLocale));

const french = () => overwriteGetLocale(() => 'fr');

describe('Fehler des Backends in der gewählten Sprache', () => {
	it('zeigt einen Fehler mit Code in der gewählten Sprache', () => {
		french();
		const body = {
			error: 'Eine Kategorie mit dem Namen «Lift» existiert bereits.',
			code: 'CATEGORY_NAME_TAKEN',
			params: { name: 'Lift' }
		};

		expect(backendMessage(body, 'Repli')).toBe('Une catégorie nommée «\u00a0Lift\u00a0» existe déjà.');
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
			'Petit appartement (50 m², 2 pièces)\u00a0: La formule ne donne pas de nombre valable.'
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

	it('nennt bei mehreren Formelfehlern jeden, auf Deutsch wie das Backend', () => {
		const body = {
			error:
				'Die Formel ist ungültig: Unbekannte Variable {persons}. Erlaubt sind {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}. Zwei Rechenzeichen folgen direkt aufeinander.',
			code: 'FORMULA_INVALID',
			params: {},
			causes: [
				{ code: 'FORMULA_UNKNOWN_VARIABLE', params: { variable: 'persons' } },
				{ code: 'FORMULA_CONSECUTIVE_OPERATORS' }
			]
		};

		expect(backendMessage(body, 'Ersatz')).toBe(body.error);
	});

	it('zeigt den Text des Backends, wenn ein Teil keinen bekannten Code hat', () => {
		overwriteGetLocale(() => 'fr');
		const body = { error: 'Die Formel ist ungültig: Neu.', code: 'FORMULA_INVALID', params: {}, causes: [{ code: 'FORMULA_NEW_THING' }] };

		expect(backendMessage(body, 'Repli')).toBe(body.error);
	});

	it('setzt Benutzerdaten nie als Code ein', () => {
		const body = {
			error: 'Eine Kategorie mit dem Namen «KI_UNAVAILABLE» existiert bereits.',
			code: 'CATEGORY_NAME_TAKEN',
			params: { name: 'KI_UNAVAILABLE' }
		};

		expect(backendMessage(body, 'Ersatz')).toBe(body.error);
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

describe('Zustellfehler einer Mahnung', () => {
	// #126: the mail server's own text («550 5.1.1 User unknown») reached the documents list
	it('zeigt statt des Texts des Mailservers die Meldung, dass die E-Mail nicht zugestellt wurde', () => {
		const text = deliveryErrorText({
			deliveryError: '550 5.1.1 User unknown',
			deliveryErrorCode: null
		});

		expect(text).toBe(
			'Die E-Mail wurde nicht zugestellt. Markieren Sie die Mahnung unter «Dokumente» am Tag, an dem Sie sie zur Post bringen, als versendet: Erst dann trägt sie das Datum dieses Tages und eine neue Zahlungsfrist. Drucken Sie sie danach aus und schicken Sie sie per Post. Prüfen Sie für die nächste Mahnung die E-Mail-Adresse des Mieters.'
		);
	});
});

describe('Mahnung vor Ablauf der Zahlungsfrist der letzten', () => {
	// #107: the backend names its dates as YYYY-MM-DD
	it('nennt die Tage im Schweizer Format', () => {
		const body = {
			error: 'Die nächste Mahnung ist erst ab 27.10.2026 möglich.',
			code: 'REMINDER_TOO_EARLY',
			params: { date: '2026-10-27', deadline: '2026-10-26' }
		};

		expect(backendMessage(body, '')).toBe(
			'Die nächste Mahnung ist erst ab 27.10.2026 möglich: Die Zahlungsfrist der letzten Mahnung läuft bis 26.10.2026.'
		);
	});
});

describe('Formel, die sich nicht berechnen lässt', () => {
	// #128: an older backend still sends the engine's English text as detail
	it('sagt, was zu prüfen ist, ohne den englischen Text der Rechenmaschine', () => {
		const body = {
			error: 'Die Formel kann nicht berechnet werden: Unexpected number',
			code: 'FORMULA_NOT_COMPUTABLE',
			params: { detail: "Unexpected number '2'" }
		};

		expect(backendMessage(body, '')).toBe(
			'Die Formel kann nicht berechnet werden. Prüfen Sie die Rechenzeichen (+, -, *, /, %), die Klammern und die Variablen {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}.'
		);
	});

	// #449 (Entscheid in #404, Punkt 2): the refusal names the previous Mahnstufe in the UI language
	it('nennt die vorige Mahnstufe beim Namen', () => {
		expect(backendMessage({ code: 'REMINDER_PREVIOUS_NOT_SENT', params: { reminderLevel: 1 } }, '')).toBe(
			'Die Zahlungserinnerung ist noch nicht versendet. Markieren Sie sie unter «Dokumente» als versendet. Die nächste Mahnstufe ist nach ihrer Zahlungsfrist möglich.'
		);
		expect(backendMessage({ code: 'REMINDER_PREVIOUS_NOT_SENT', params: { reminderLevel: 2 } }, '')).toContain('Die 2. Mahnung ist noch nicht versendet.');
	});
});
