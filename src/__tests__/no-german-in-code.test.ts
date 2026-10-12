import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import de from '../../messages/de.json';
import en from '../../messages/en.json';

/** Every UI text comes from messages/de.json: no German text may be written into the code itself */
const words = (text: string) => text.toLowerCase().match(/\p{L}{3,}/gu) ?? [];
const vocabulary = (messages: Record<string, string>) =>
	new Set(Object.values(messages).flatMap(words));
const english = vocabulary(en);
const german = vocabulary(de);
// Words only German UI texts use, and anything with ä, ö, ü or ß
const germanWords = (text: string) =>
	words(text).filter((word) => /[äöüß]/.test(word) || (german.has(word) && !english.has(word)));

/** Texts a reader could see: markup text and every quoted string, also in attributes, props and {…} expressions */
function texts(source: string, svelte: boolean) {
	const plain = source
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/(^|\s)\/\/.*$/gm, '$1')
		.replace(/<style[\s\S]*?<\/style>/g, '');
	const markup = svelte
		? plain.replace(/<script[\s\S]*?<\/script>/g, '').replace(/\{[^{}]*\}/g, '')
		: '';
	return [
		...[...markup.matchAll(/>([^<>]+)</g)].map((match) => match[1]),
		...[...plain.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g)].map((match) => match[2])
	];
}

// German words in the code that are identifiers, not texts: each is mapped to a message where it is shown
const identifiers: Record<string, string[]> = {
	'src/lib/overview.ts': ['Zahlungsfrist', 'Vertragsende'], // deadline kinds (DeadlineList.svelte)
	'src/lib/utils/contract-availability.ts': ['Aktiv', 'Beendet'], // contract status of the API
	'src/routes/gallery/+page.svelte': ['laufend', 'beendet', 'unbefristet', 'befristet'], // tab and option values
	// query parameter; the download's file name stays German in every language (offene-punkte.md)
	'src/routes/statements/[id]/pdf/+server.ts': ['ansehen', 'abrechnung'],
	'src/routes/statements/[id]/SendDialog.svelte': ['ansehen'], // query parameter
	'src/routes/statements/generate/PreviewChecks.svelte': ['schritt'], // query parameter
	'src/routes/statements/generate/StatementWizard.svelte': ['schritt'],
	'src/lib/statement-wizard.ts': ['akonto'], // a message's name
	'src/routes/statements/generate/PreviewStep.svelte': ['akonto'], // test id
	'src/lib/invoice.ts': ['null'], // code between the quotes of a regular expression
	'src/lib/wizard-draft.ts': ['null'], // JSON
	'src/lib/ui/LanguageSwitcher.svelte': ['Deutsch'] // each language in its own words
};

const sources = (readdirSync('src', { recursive: true }) as string[])
	.map((path) => `src/${path}`)
	.filter((path) => /\.(ts|svelte)$/.test(path) && !path.endsWith('.d.ts'))
	.filter((path) => !/__tests__|\/paraglide\//.test(path));

describe('Keine deutschen Texte im Code', () => {
	it('erkennt deutschen Text in Markup, Attributen und Zeichenketten', () => {
		const found = texts(
			`<script>const a = 'Gespeichert';</script><p>Mieter erfassen</p><button aria-label="Schliessen">{x}</button>`,
			true
		).flatMap(germanWords);
		expect(found.sort()).toEqual(['erfassen', 'gespeichert', 'mieter', 'schliessen']);
	});

	it('erkennt deutschen Text in Ausdrücken, Komponenten und mehrzeiligen Zeichenketten', () => {
		const found = texts(
			`<p>{ok ? 'Gespeichert' : 'Fehler'}</p><TextInput label='Mieter' help="Bitte" />\n<script>const a = \`Ja\nWohnung\`;</script>`,
			true
		).flatMap(germanWords);
		expect(found.sort()).toEqual(['bitte', 'fehler', 'gespeichert', 'mieter', 'wohnung']);
	});

	it('übersieht Kommentare und Ausdrücke', () => {
		const found = texts(`<!-- Mieter --><p>{m.tenants_title()}</p>// Mieter\n`, true);
		expect(found.flatMap(germanWords)).toEqual([]);
	});

	it.each(sources)('%s', (path) => {
		const allowed = (identifiers[path] ?? []).map((word) => word.toLowerCase());
		const left = texts(readFileSync(path, 'utf8'), path.endsWith('.svelte'))
			.flatMap(germanWords)
			.filter((word) => !allowed.includes(word));
		expect(left).toEqual([]);
	});
});
