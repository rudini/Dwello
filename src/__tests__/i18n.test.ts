import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { handle } from '../hooks.server';

const languages = ['de', 'fr', 'it', 'en'] as const;
const keys = (language: string) =>
	Object.keys(JSON.parse(readFileSync(`messages/${language}.json`, 'utf8')))
		.filter((key) => key !== '$schema')
		.sort();

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

	it('Italienisch sagt «immobile», nicht «stabile»', () => {
		const messages = JSON.parse(readFileSync('messages/it.json', 'utf8'));
		const wrong = Object.entries(messages).filter(
			// Also flags the adjective («connessione stabile»); none is used today
			([, text]) => typeof text === 'string' && /\bstabil[ei]\b/i.test(text)
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
