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
});

// Renders a page through the server hook; the page template carries %lang%
async function htmlLang(cookie?: string) {
	const url = new URL('http://localhost:3000/login');
	const event = {
		url,
		// A browser that prefers French; only the chosen language counts
		request: new Request(url, {
			headers: { 'accept-language': 'fr-CH', ...(cookie ? { cookie } : {}) }
		}),
		cookies: { get: () => undefined },
		locals: {} as App.Locals
	};
	const resolve = vi.fn(
		async (_event, options) =>
			new Response(await options.transformPageChunk({ html: '<html lang="%lang%">', done: true }))
	);
	const response = await handle({ event, resolve } as never);
	return response.text();
}

describe('Sprache der Seite', () => {
	it('ist ohne Wahl Deutsch, auch wenn der Browser eine andere Sprache will', async () => {
		expect(await htmlLang()).toBe('<html lang="de">');
	});

	it.each(['fr', 'it', 'en'])('folgt der gewählten Sprache %s', async (language) => {
		expect(await htmlLang(`PARAGLIDE_LOCALE=${language}`)).toBe(`<html lang="${language}">`);
	});
});
