import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import de from '../../messages/de.json';
import en from '../../messages/en.json';

/** Every UI text comes from messages/de.json: no German text may be written into the code itself */
const words = (text: string) => text.toLowerCase().match(/\p{L}{3,}/gu) ?? [];
// a short word before «. <digit>» is read as an abbreviation of a legal citation («Art. 257a Abs. 2 OR»), so «abs»
// stays free for Math.abs; a sentence like «… im Jahr. 2025» loses that one word from the vocabulary
const vocabulary = (messages: Record<string, string>) =>
	new Set(Object.values(messages).flatMap((text) => words(text.replace(/(?<!\p{L})\p{L}{2,4}\.(?=\s*\d)/gu, ''))));
const english = vocabulary(en);
const german = vocabulary(de);
// Words only German UI texts use, and anything with ä, ö, ü or ß
// and a whole German message copied into the code, even when its words also occur in English («Name», «Status»)
const germanOnlyMessages = new Set(
	Object.values(de).filter((text) => !Object.values(en).includes(text))
);
const germanWords = (text: string) => [
	...words(text).filter((word) => /[äöüß]/.test(word) || (german.has(word) && !english.has(word))),
	...(germanOnlyMessages.has(text.trim()) ? [text.trim().toLowerCase()] : [])
];

// A regular expression literal in code: its quotes are no strings
const regexLiteral =
	/(^|[=(,:[!&|?{;]|return)(\s*)\/(?![/*])(?:\\.|\[(?:\\.|[^\]\\\n])*\]|[^/\\\n[])+\/[a-z]*/gm;
const quoted = (code: string) =>
	[...code.matchAll(/(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g)].map((match) => match[2]);

/** Texts a reader could see: markup text and the quoted strings of code, attributes, props and {…} expressions */
function texts(source: string, svelte: boolean) {
	const plain = source
		.replace(/<!--[\s\S]*?-->/g, '')
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/(^|\s)\/\/.*$/gm, '$1')
		.replace(/<style[\s\S]*?<\/style>/g, '');
	const code = svelte ? (plain.match(/<script[\s\S]*?<\/script>/g) ?? []).join('\n') : plain;
	const markup = svelte ? plain.replace(/<script[\s\S]*?<\/script>/g, '') : '';
	// plain text between tags is read as text, so an apostrophe in it cannot pair with a later quote
	const textNode = />([^<>{}]+)</g;
	return [
		...[...markup.replace(/\{[^{}]*\}/g, '').matchAll(/>([^<>]+)</g)].map((match) => match[1]),
		...quoted(code.replace(regexLiteral, '$1$2')),
		...quoted(markup.replace(textNode, '><'))
	];
}

// German words in the code that are identifiers, not texts: each is mapped to a message where it is shown
const identifiers: Record<string, string[]> = {
	'src/lib/overview.ts': ['Zahlungsfrist', 'Vertragsende'], // deadline kinds (DeadlineList.svelte)
	'src/lib/utils/contract-availability.ts': ['Aktiv', 'Beendet'], // contract status of the API
	'src/routes/gallery/+page.svelte': ['laufend', 'beendet', 'unbefristet', 'befristet'], // tab and option values
	// query parameter; the download's file name stays German in every language (issue #101)
	'src/routes/statements/[id]/pdf/+server.ts': ['ansehen', 'abrechnung'],
	'src/routes/statements/[id]/SendDialog.svelte': ['ansehen'], // query parameter
	'src/routes/statements/generate/PreviewChecks.svelte': ['schritt'], // query parameter
	'src/routes/statements/generate/StatementWizard.svelte': ['schritt'],
	'src/lib/statement-wizard.ts': ['akonto'], // a message's name
	'src/routes/statements/generate/PreviewStep.svelte': ['akonto'], // test id
	'src/lib/wizard-draft.ts': ['null'], // JSON
	// the stored Gebäudetyp the register's building class maps to (src/lib/building-type.ts)
	'src/lib/server/building-register.ts': ['Einfamilienhaus', 'Mehrfamilienhaus', 'Geschäftshaus', 'Gewerbegebäude', 'Mischnutzung'],
	'src/lib/ui/LanguageSwitcher.svelte': ['Deutsch'] // each language in its own words
};

const sources = (readdirSync('src', { recursive: true }) as string[])
	.map((path) => `src/${path}`)
	.filter((path) => /\.(ts|svelte)$/.test(path) && !path.endsWith('.d.ts'))
	.filter((path) => !/__tests__|\/paraglide\//.test(path));

describe('Keine deutschen Texte im Code', () => {
	it('zählt Abkürzungen einer Rechtsangabe nicht als deutsche Wörter (Art. 257a Abs. 2 OR)', () => {
		const words = vocabulary({ a: 'Nach Art. 257a Abs. 2 OR gespeichert.' });
		expect(words.has('abs')).toBe(false);
		expect(words.has('art')).toBe(false);
		expect(words.has('gespeichert')).toBe(true);
	});

	it('erkennt deutschen Text in Markup, Attributen und Zeichenketten', () => {
		const found = texts(
			`<script>const a = 'Gespeichert';</script><p>Mieter erfassen</p><button aria-label="Schliessen">{x}</button>`,
			true
		).flatMap(germanWords);
		expect(found).toEqual(
			expect.arrayContaining(['erfassen', 'gespeichert', 'mieter', 'schliessen'])
		);
	});

	it('erkennt deutschen Text in Ausdrücken, Komponenten und mehrzeiligen Zeichenketten', () => {
		const found = texts(
			`<p>{ok ? 'Gespeichert' : 'Fehler'}</p><TextInput label='Mieter' help="Bitte" />\n<script>const a = \`Ja\nWohnung\`;</script>`,
			true
		).flatMap(germanWords);
		expect(found).toEqual(
			expect.arrayContaining(['bitte', 'fehler', 'gespeichert', 'mieter', 'wohnung'])
		);
	});

	it('kommt mit Anführungszeichen in regulären Ausdrücken und Apostrophen im Text zurecht', () => {
		const code = texts(
			`const r = /["']/g;\nconst s = x.replace(/'/g, '');\nconst t = 'Gespeichert';`,
			false
		);
		const markup = texts(`<p>Don't</p><p>{x ? 'Mieter' : y}</p>`, true);
		const path = texts("const u = `${a}/${b}`, 'x');\nconst v = 'Wohnung';", false);
		expect([...code, ...markup, ...path].flatMap(germanWords)).toEqual(
			expect.arrayContaining(['gespeichert', 'mieter', 'wohnung'])
		);
	});

	it('erkennt eine ganze deutsche Meldung, auch wenn ihre Wörter englisch vorkommen', () => {
		expect(texts(`<p>Per E-Mail</p>`, true).flatMap(germanWords)).toEqual(['per e-mail']);
	});

	it('übersieht Kommentare und Ausdrücke', () => {
		const found = texts(`<!-- Mieter --><p>{m.tenants_title()}</p>// Mieter\n`, true);
		expect(found.flatMap(germanWords)).toEqual([]);
	});

	it.each(sources)('%s', (path) => {
		const source = readFileSync(path, 'utf8');
		const svelte = path.endsWith('.svelte');
		// a string planted at the end of the code and of the markup is found: no quote pairing went out of step
		const end = source.lastIndexOf('</script>');
		const planted = svelte
			? `${end < 0 ? source : `${source.slice(0, end)}'Prüfung';${source.slice(end)}`}{x ? 'Änderung' : y}`
			: `${source}\n'Prüfung';`;
		const found = texts(planted, svelte).flatMap(germanWords);
		expect(found).toContain(end < 0 && svelte ? 'änderung' : 'prüfung');
		if (svelte) expect(found).toContain('änderung');
		const allowed = (identifiers[path] ?? []).map((word) => word.toLowerCase());
		const left = texts(source, svelte)
			.flatMap(germanWords)
			.filter((word) => !allowed.includes(word));
		expect(left).toEqual([]);
	});
});
