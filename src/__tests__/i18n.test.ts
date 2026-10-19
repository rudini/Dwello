import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { handle } from '../hooks.server';
import { m } from '$lib/paraglide/messages';

const languages = ['de', 'fr', 'it', 'en'] as const;
const keys = (language: string) =>
	Object.keys(JSON.parse(readFileSync(`messages/${language}.json`, 'utf8')))
		.filter((key) => key !== '$schema')
		.sort();

// 461-review-2, C-6: the formula variables are literal braces, escaped once as in German
describe('Formelvariablen in den Meldungen', () => {
	it.each(languages)('%s nennt die Variablen mit geschweiften Klammern', (locale) => {
		expect(m.backend_formula_unknown_variable({ variable: 'persons' }, { locale })).toContain('{persons}');
		expect(m.backend_formula_not_computable({}, { locale })).toContain('{area}');
		expect(m.backend_formula_not_computable({}, { locale })).not.toContain('\\');
	});
});

describe('Sprachdateien', () => {
	it.each(languages.slice(1))('%s hat dieselben Texte wie Deutsch', (language) => {
		expect(keys(language)).toEqual(keys('de'));
	});

	it.each(languages)('%s hat keine leeren Texte', (language) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		const empty = Object.entries(messages).filter(([, text]) => text === '');
		expect(empty).toEqual([]);
	});

	// Style from docs/design/i18n-begriffe.md
	it('Französisch setzt Guillemets mit geschütztem Leerzeichen innen', () => {
		const messages = JSON.parse(readFileSync('messages/fr.json', 'utf8'));
		const wrong = Object.entries(messages).filter(
			([, text]) => typeof text === 'string' && /«(?!\u00a0)|(?<!\u00a0)»/.test(text)
		);
		expect(wrong).toEqual([]);
	});

	// «de« Saisir» once lost its space before « (review #57, C-1)
	it('Französisch setzt vor « ein Leerzeichen', () => {
		const messages = JSON.parse(readFileSync('messages/fr.json', 'utf8'));
		const wrong = Object.entries(messages).filter(
			([, text]) => typeof text === 'string' && /[\p{L}\d]«/u.test(text)
		);
		expect(wrong).toEqual([]);
	});

	// #348: names in «», as everywhere else
	it.each(languages)('%s setzt Guillemets, keine geraden Anführungszeichen', (language) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		const wrong = Object.entries(messages).filter(
			([, text]) => typeof text === 'string' && text.includes('"')
		);
		expect(wrong).toEqual([]);
	});

	it.each(languages)('%s schliesst jede Fehlermeldung eines Felds mit einem Punkt', (language) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		const wrong = Object.entries(messages).filter(
			([key, text]) => key.includes('_error_') && !/[.?!]$/.test(String(text))
		);
		expect(wrong).toEqual([]);
	});

	it('Italienisch sagt «immobile», nicht «stabile»', () => {
		const messages = JSON.parse(readFileSync('messages/it.json', 'utf8'));
		const wrong = Object.entries(messages).filter(
			// Also flags the adjective («connessione stabile»); none is used today
			([, text]) => typeof text === 'string' && /\bstabil[ei]\b/i.test(text)
		);
		expect(wrong).toEqual([]);
	});

	// #83: Kündigungsfrist and Kündigungstermin as in Art. 266a–266c OR
	it('Französisch sagt «délai de congé» und «terme de congé», nicht «… de résiliation»', () => {
		const messages = JSON.parse(readFileSync('messages/fr.json', 'utf8'));
		const wrong = Object.entries(messages).filter(
			([, text]) => typeof text === 'string' && /(délai|terme)s? de résiliation/i.test(text)
		);
		expect(wrong).toEqual([]);
	});

	// #405, #461: words that mean something else in the law (Art. 259a CO, Art. 4 al. 3 OBLF, Art. 34 CO)
	it.each([
		['fr', '«répercutable», nicht «imputable»', /imputab/i],
		['fr', '«frais d’administration», nicht «frais de gestion»', /frais de gestion/i],
		['it', '«spese amministrative», nicht «spese di gestione»', /spese di gestione/i],
		['it', '«annullare la disdetta», nicht «revocare»', /\brevoca/i],
		['fr', '«degré de confiance» für die Konfidenz', /fiabilité de l’IA/i],
		['it', '«grado di certezza» für die Konfidenz', /affidabilità dell’IA/i],
		// the categories renamed in migration 0027 (#345)
		['fr', '«assurance du bâtiment», nicht «assurance bâtiment»', /assurance bâtiment/i],
		['it', '«assicurazione dell’immobile», nicht «assicurazione edificio»', /assicurazione edificio/i],
		['en', '«Lift», nicht «Elevator»', /elevator/i]
	])('%s sagt %s', (language, _description, word) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		const wrong = Object.entries(messages).filter(([, text]) => typeof text === 'string' && word.test(text));
		expect(wrong).toEqual([]);
	});

	// #461: «nuovo inquilino» is the Nachmieter; the Ersatzmieter of Art. 264 CO is «inquilino sostitutivo»
	it('Italienisch nennt den Ersatzmieter «inquilino sostitutivo»', () => {
		const messages = JSON.parse(readFileSync('messages/it.json', 'utf8'));
		expect(messages.glossary_notice_period_text).toContain('inquilino sostitutivo');
		expect(messages.contracts_notice_period_short).toContain('inquilino sostitutivo');
	});

	// Art. 264 Abs. 1 OR: the tenant is freed once he proposes a reasonable replacement tenant (461-fachreview-1, M-1)
	it.each([
		['de', 'wenn er Ihnen einen zumutbaren Ersatzmieter vorschlägt.'],
		['fr', 's’il vous présente un locataire de remplacement que vous ne pouvez raisonnablement refuser.'],
		['it', 'se l’inquilino le propone un inquilino sostitutivo che Lei non possa ragionevolmente rifiutare.'],
		['en', 'if the tenant proposes a replacement tenant you cannot reasonably refuse.']
	])('%s: der Ersatzmieter muss nur vorgeschlagen sein, damit der Mietvertrag früher endet', (language, end) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		expect(messages.glossary_notice_period_text.endsWith(end)).toBe(true);
	});

	// #501: the hint at a short Kündigungsfrist says the same as the glossary
	it.each([
		['de', 'Ausnahme: Der Mieter schlägt Ihnen einen zumutbaren Ersatzmieter vor, oder Sie haben das Ende mit dem Mieter vereinbart.'],
		['fr', 'Exception : le locataire vous présente un locataire de remplacement que vous ne pouvez raisonnablement refuser, ou vous avez convenu de la fin avec le locataire.'],
		['it', 'Eccezione: l’inquilino le propone un inquilino sostitutivo che Lei non possa ragionevolmente rifiutare, oppure Lei ha concordato la fine con l’inquilino.'],
		['en', 'Exception: the tenant proposes a replacement tenant you cannot reasonably refuse, or you agreed on the end with the tenant.']
	])('%s: der Hinweis zur kurzen Kündigungsfrist nennt den vorgeschlagenen Ersatzmieter', (language, end) => {
		const messages = JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
		expect(messages.contracts_notice_period_short.endsWith(end)).toBe(true);
	});

	it('Italienisch sagt «termine di preavviso» und «ricevimento della disdetta»', () => {
		const messages = JSON.parse(readFileSync('messages/it.json', 'utf8'));
		const wrong = Object.entries(messages).filter(
			([, text]) => typeof text === 'string' && /termin[ei] di disdetta|\bricezione\b/i.test(text)
		);
		expect(wrong).toEqual([]);
	});
});

// Renders a page through the server hook; the page template carries %lang%
async function renderLogin(acceptLanguage: string, cookie?: string) {
	const url = new URL('http://localhost:3000/login');
	const event = {
		url,
		request: new Request(url, {
			headers: { 'accept-language': acceptLanguage, ...(cookie ? { cookie } : {}) }
		}),
		cookies: { get: () => undefined },
		locals: {} as App.Locals
	};
	const resolve = vi.fn(
		async (_event, options) =>
			new Response(await options.transformPageChunk({ html: '<html lang="%lang%">', done: true }), {
				headers: { 'content-type': 'text/html' }
			})
	);
	return (await handle({ event, resolve } as never)) as Response;
}
const htmlLang = async (acceptLanguage: string, cookie?: string) =>
	(await renderLogin(acceptLanguage, cookie)).text();

describe('Sprache der Seite', () => {
	it.each([
		['fr-CH,fr;q=0.9', 'fr'],
		['it-CH', 'it'],
		['en-GB,en;q=0.9', 'en'],
		['de-CH', 'de']
	])('folgt ohne Wahl der Sprache des Browsers (%s)', async (acceptLanguage, language) => {
		expect(await htmlLang(acceptLanguage)).toBe(`<html lang="${language}">`);
	});

	it('ist ohne Wahl Deutsch, wenn der Browser keine der vier Sprachen will', async () => {
		expect(await htmlLang('es-ES,es;q=0.9')).toBe('<html lang="de">');
	});

	it.each(['fr', 'it', 'en'])(
		'folgt der gewählten Sprache %s, auch wenn der Browser Deutsch will',
		async (language) => {
			expect(await htmlLang('de-CH', `PARAGLIDE_LOCALE=${language}`)).toBe(
				`<html lang="${language}">`
			);
		}
	);

	// A cache in between must not hand a French page to a German browser
	it('sagt Zwischenspeichern, dass die Seite von der Browsersprache abhängt', async () => {
		expect((await renderLogin('fr-CH')).headers.get('vary')).toContain('Accept-Language');
	});
});
