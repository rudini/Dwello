import type { Page } from '@playwright/test';
import { readFileSync } from 'fs';

// German left on a screen in another language: words that occur in German UI texts (messages/de.json) but in no text
// of the shown language, and words with umlauts or ß. User data is masked first: scenario records carry a UUID, seeded places and addresses are fixed.
const messages = (language: string): Record<string, string> =>
	JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
const words = (text: string) => text.toLowerCase().match(/\p{L}{3,}/gu) ?? [];
const vocabulary = (language: string) => new Set(Object.values(messages(language)).flatMap(words));

const german = vocabulary('de');
const germanOnly = Object.fromEntries(
	['fr', 'it', 'en'].map((language) => {
		const own = vocabulary(language);
		return [language, new Set([...german].filter((word) => !own.has(word)))];
	})
);

// Names and places, the same in every language
const sameEverywhere = ['Dwello', 'Google', 'Microsoft', 'Resend', 'PostgreSQL', 'IBAN', 'CHF', 'PDF', 'XSRF', 'SMTP'];
// A record named by a scenario: up to three words, then a UUID (fixtures/backend.ts)
const scenarioRecord = /(?:[\p{L}\d.,'’&-]+ ){0,3}[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gu;
// Fixed values that are user data: seeds (fixtures/backend.ts, the axe seeds) and the operator (playwright.config.ts)
const seedValues = [
	'Testweg 1',
	'Ahornweg 3',
	'Winterthur',
	'Treppenhausreinigung Q1',
	'Muster Hosting AG',
	'Bahnhofstrasse 1, 8001 Zürich',
	'betrieb@muster-hosting.ch'
];

/** Everything the page says to a reader: text, also hidden for screen readers, and labelling attributes */
async function pageTexts(page: Page): Promise<string[]> {
	return page.evaluate(() => {
		const found: string[] = [document.title];
		const skip = (node: Node) => node.parentElement?.closest('script, style, noscript, #language-menu');
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		for (let node = walker.nextNode(); node; node = walker.nextNode())
			if (!skip(node) && node.textContent?.trim()) found.push(node.textContent.trim());
		for (const element of document.body.querySelectorAll('[aria-label], [title], [placeholder], [alt]'))
			for (const name of ['aria-label', 'title', 'placeholder', 'alt'])
				if (element.getAttribute(name)) found.push(element.getAttribute(name)!);
		for (const input of document.body.querySelectorAll<HTMLInputElement>('input[type=submit], input[type=button]'))
			found.push(input.value);
		return found;
	});
}

/** The texts on the page that still contain German, with the German words; [] when there are none */
export async function germanOnScreen(page: Page, language: string, userData: string[] = []) {
	const masked = (text: string) =>
		[...userData, ...seedValues, ...sameEverywhere]
			.reduce((rest, value) => rest.split(value).join(' '), text)
			.replace(scenarioRecord, ' ');
	return (await pageTexts(page)).flatMap((text) => {
		// a German word, or one with ä, ö, ü or ß, which French, Italian and English never use
		const left = words(masked(text)).filter((word) => germanOnly[language].has(word) || /[äöüß]/.test(word));
		return left.length ? [`«${text}» (${[...new Set(left)].join(', ')})`] : [];
	});
}

/** Sideways scrolling of the page, or text cut off by its box; [] when everything fits */
export async function cutOff(page: Page): Promise<string[]> {
	return page.evaluate(() => {
		const found: string[] = [];
		const root = document.documentElement;
		if (root.scrollWidth > root.clientWidth + 1) found.push(`page ${root.scrollWidth} px wide in ${root.clientWidth} px`);
		for (const element of document.body.querySelectorAll<HTMLElement>('*')) {
			const style = getComputedStyle(element);
			const clips = ['hidden', 'clip'].includes(style.overflowX) && style.textOverflow !== 'ellipsis';
			const ownText = [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent!.trim());
			// sr-only boxes are 1 px on purpose; tables and lists scroll inside their own region (Table.svelte)
			if (!clips || !ownText || element.closest('.sr-only, [role="region"]')) continue;
			if (element.scrollWidth > element.clientWidth + 1)
				found.push(`«${element.textContent!.trim().slice(0, 60)}» cut off (${element.scrollWidth} > ${element.clientWidth} px)`);
		}
		return found;
	});
}
