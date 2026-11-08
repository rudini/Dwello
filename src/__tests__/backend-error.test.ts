import { afterEach, describe, expect, it } from 'vitest';
import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { backendMessage, deliveryErrorText, type BackendError } from '$lib/backend-error';

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

		expect(backendMessage(body, 'Repli')).toBe('Une catégorie nommée «\u00a0Lift\u00a0» existe déjà. Choisissez un autre nom.');
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
			error:
				'Für eine Wohnung ergibt die Formel keine Zahl, meist weil sie dort durch null teilt. Prüfen Sie, was nach «/» steht.',
			code: 'FORMULA_APARTMENT_FAILED',
			params: { reason: 'FORMULA_NOT_A_NUMBER' }
		};

		expect(backendMessage(body, 'Repli')).toBe(
			'Pour un appartement, la formule ne donne pas de nombre, généralement parce qu’elle y divise par zéro. Vérifiez ce qui se trouve après «\u00a0/\u00a0».'
		);
	});

	it('setzt auch verschachtelte Codes ein', () => {
		const body = {
			error: 'Die Formel ist ungültig: …',
			code: 'FORMULA_INVALID',
			params: {
				cause: 'FORMULA_APARTMENT_FAILED',
				reason: 'FORMULA_NOT_A_NUMBER'
			}
		};

		// #737: only the cause, without «Die Formel ist ungültig:» or «… für eine Wohnung …:» before it
		expect(backendMessage(body, 'Ersatz')).toBe(
			'Für eine Wohnung ergibt die Formel keine Zahl, meist weil sie dort durch null teilt. Prüfen Sie, was nach «/» steht.'
		);
	});

	it('nennt bei mehreren Formelfehlern jeden, auf Deutsch', () => {
		const body: BackendError = {
			error:
				'Unbekannter Baustein {persons}. Erlaubt sind {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}. Bei «{persons} + * 2» folgen zwei Rechenzeichen direkt aufeinander. Löschen Sie eines oder setzen Sie eine Zahl oder einen Baustein dazwischen.',
			code: 'FORMULA_INVALID',
			params: {},
			causes: [
				{ code: 'FORMULA_UNKNOWN_VARIABLE', params: { variable: 'persons' } },
				{ code: 'FORMULA_CONSECUTIVE_OPERATORS', params: { part: '{persons} + * 2' } } // #1200: with the place
			]
		};

		expect(backendMessage(body, 'Ersatz')).toBe(body.error);
	});

	// #852: nie der eigene Text des Backends, er ist englisch oder deutsch, nicht in der gewählten Sprache
	it('zeigt den Ersatz, wenn ein Teil keinen bekannten Code hat', () => {
		overwriteGetLocale(() => 'fr');
		const body = { error: 'Die Formel ist ungültig: Neu.', code: 'FORMULA_INVALID', params: {}, causes: [{ code: 'FORMULA_NEW_THING' }] };

		expect(backendMessage(body, 'Repli')).toBe('Repli');
	});

	it('setzt Benutzerdaten nie als Code ein', () => {
		const body = {
			error: 'Eine Kategorie mit dem Namen «KI_UNAVAILABLE» existiert bereits.',
			code: 'CATEGORY_NAME_TAKEN',
			params: { name: 'KI_UNAVAILABLE' }
		};

		expect(backendMessage(body, 'Ersatz')).toBe(`${body.error} Wählen Sie einen anderen Namen.`);
	});

	it('zeigt bei einem Fehler ohne Code den Ersatz', () => {
		french();

		expect(backendMessage({ error: 'Failed to create invoice' }, 'Repli')).toBe('Repli');
	});

	it('zeigt bei einem unbekannten Code den Ersatz', () => {
		expect(backendMessage({ error: 'Neu', code: 'SOMETHING_NEW' }, 'Ersatz')).toBe('Ersatz');
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
			'Die E-Mail wurde nicht zugestellt. Markieren Sie die Mahnung am Tag, an dem Sie sie zur Post bringen, als versendet: Erst dann trägt sie das Datum dieses Tages und eine neue Zahlungsfrist. Drucken Sie sie danach aus und schicken Sie sie per Post. Prüfen Sie für die nächste Mahnung die E-Mail-Adresse des Mieters.'
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
			'Die Formel kann nicht berechnet werden. Prüfen Sie die Rechenzeichen (+, -, *, /), die Klammern und die Bausteine {area}, {rooms}, {volume}, {units} und ihre Summen wie {area_total}.' // #737: no %, «Bausteine»
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
