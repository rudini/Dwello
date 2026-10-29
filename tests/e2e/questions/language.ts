import { readFileSync } from 'fs';
import { question } from '../screenplay/actor';
import { Attribute, Text, ThePage } from '../screenplay/questions';
import { documentRoot, languageButton } from '../targets/language';

const codes: Record<string, string> = { Deutsch: 'de', Français: 'fr', Italiano: 'it', English: 'en' };
export const languageCode = (language: string) => codes[language];

export const pageLanguage = Attribute.named('lang').of(documentRoot);
export const shownLanguage = Text.of(languageButton);

const messagesOf = (language: string): Record<string, string> =>
	JSON.parse(readFileSync(`messages/${language}.json`, 'utf8'));
const german = messagesOf('de');

const keyOf = (text: string) =>
	Object.keys(german).find((key) => german[key] === text) ??
	Object.keys(german).find((key) => german[key].startsWith(text));

const translated = (text: string, language: string) => {
	const key = keyOf(text);
	if (language === 'de' || !key) return text;
	const shown = messagesOf(language)[key];
	return german[key] === text ? shown : shown.split('{')[0].replace(/[,:\s]+$/, '');
};

/** A German text as the page shows it in its current language (messages/<lang>.json); a text not moved there yet,
 * or a German page, gives the text itself. A text with a placeholder matches up to the placeholder. */
export const inPageLanguage = (text: string) =>
	question(`«${text}» in the language of the page`, async (actor) =>
		translated(text, (await actor.answer(pageLanguage)) ?? 'de')
	);

// German left on a screen in another language: words that occur in German UI texts (messages/de.json) but in no text
// of the shown language, and words with umlauts or ß. User data is masked first: scenario records carry 12 hex digits, seeded places and addresses are fixed.
const words = (text: string) => text.toLowerCase().match(/\p{L}{3,}/gu) ?? [];
const vocabulary = (language: string) => new Set(Object.values(messagesOf(language)).flatMap(words));

const germanWords = vocabulary('de');
const germanOnly = Object.fromEntries(
	['fr', 'it', 'en'].map((language) => {
		const own = vocabulary(language);
		return [language, new Set([...germanWords].filter((word) => !own.has(word)))];
	})
);

// Names and places, the same in every language; the German leaflet the reasons cite by its title (#292)
const sameEverywhere = [
	'Dwello',
	'Google',
	'Microsoft',
	'Resend',
	'PostgreSQL',
	'IBAN',
	'CHF',
	'PDF',
	'XSRF',
	'SMTP',
	'STÜBER SYSTEMS GmbH',
	'Mieterinnen- und Mieterverband',
	'Zulässige und unzulässige Nebenkosten'
];
// A record named by a scenario: up to three words, then 12 hex digits (fixtures/backend.ts) or a UUID (the file names of
// tasks/accessibility.ts)
const scenarioRecord = /(?:[\p{L}\d.,'’&-]+ ){0,3}(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-)?[0-9a-f]{12}\b/gu;
// Invoice descriptions the seeds write (fixtures/backend.ts): «Heizöl 2025», «<category> 2025-01-31»
const seededDescription = /\b(?:Heizöl \d{4}|\p{L}+ \d{4}-\d{2}-\d{2})\b/gu;
// A Wiederherstellungscode (#718): 6 random groups of 4 characters, which can spell a German word («6ZUR»)
const recoveryCode = /\b(?:[A-HJ-NP-Z2-9]{4}-){5}[A-HJ-NP-Z2-9]{4}\b/g;
// Fixed values that are user data: seeds (fixtures/backend.ts, the axe seeds) and the operator (playwright.config.ts)
const seedValues = [
	'Testweg 1',
	'Ahornweg 3',
	'Winterthur',
	'Treppenhausreinigung Q1',
	'Muster AG',
	'Muster Hosting AG',
	'Muster Mail AG',
	'Bahnhofstrasse 1, 8001 Zürich',
	'betrieb@muster-hosting.ch'
];

// Country names come from the browser's language data (Intl), not from messages: «Wallis-et-Futuna» is French. Only a
// text that is a country name and nothing else, an option of the country select (#102, review C-4)
const letters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const countryNames = (language: string) => {
	const names = new Intl.DisplayNames([language], { type: 'region', fallback: 'none' });
	return new Set(letters.flatMap((a) => letters.map((b) => names.of(a + b) ?? '')));
};

/** The texts on the page that still contain German, with the German words; [] when there are none */
const germanIn = (texts: string[], language: string, userData: string[]) => {
	const masked = (text: string) =>
		[...userData, ...seedValues, ...sameEverywhere]
			.reduce((rest, value) => rest.split(value).join(' '), text)
			.replace(scenarioRecord, ' ')
			.replace(seededDescription, ' ')
			.replace(recoveryCode, ' ');
	const countries = countryNames(language);
	return texts.flatMap((text) => {
		if (countries.has(text.trim())) return [];
		// a German word, or one with ä, ö, ü or ß, which French, Italian and English never use
		// English names the canton Graubünden as German does
		const left = words(masked(language === 'en' ? text.split('Graubünden').join(' ') : text)).filter(
			(word) => germanOnly[language].has(word) || /[äöüß]/.test(word)
		);
		return left.length ? [`«${text}» (${[...new Set(left)].join(', ')})`] : [];
	});
};

/** German left on the page, and text that does not fit, for a page asked for in `language`; [] when there is none */
export const languageFindings = (language: string, userData: string[]) =>
	question(`German or cut-off text on the page in ${language}`, async (actor) => {
		const shown = (await actor.answer(pageLanguage))!;
		const found =
			shown === 'de'
				? ['page shown in German']
				: germanIn(await actor.answer(ThePage.texts), shown, userData);
		return [...found, ...(await actor.answer(ThePage.cutOffText))].map((finding) => `${language}: ${finding}`);
	});
