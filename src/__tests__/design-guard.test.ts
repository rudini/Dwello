import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'fs';
import legacy from './design-guard-legacy.json';

/**
 * Keeps the design system clean: only tokens and the new components, none of the forbidden patterns.
 * Files not yet migrated are listed in design-guard-legacy.json; the list only shrinks and is empty after stage 8.
 */
const palette =
	'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white';
const end = `(?=[\\s"'\`}:]|$)`;
const rules: [string, RegExp][] = [
	[
		'Farbe der alten Tailwind-Palette',
		new RegExp(`\\b[a-z-]*-(?:${palette})(?:-\\d{2,3})?(?:/\\d+)?${end}`, 'm')
	],
	[
		'Token des alten Designsystems',
		/\b(?:bg|text|border|ring|from|to)-(?:primary|success|text-dark|text-secondary|border-light)\b/
	],
	['fest codierte Farbe', /#[0-9a-fA-F]{3,8}\b(?![-\w])|\b(?:rgba?|hsla?)\(/],
	['Schrift unter 14 px', /\btext-(?:xs|\[\d+px\])/],
	[
		'Abstand ausserhalb des 8-px-Rasters',
		new RegExp(
			`\\b-?(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|bottom|left|right)-(?:0\\.5|1\\.5|2\\.5|3\\.5|3|5|7|9|11|\\[[^\\]]+\\])${end}`
		)
	],
	[
		'Radius ausserhalb der zwei Tokens',
		new RegExp(
			`\\brounded(?:-(?:t|b|l|r|tl|tr|bl|br))?(?:-(?:none|sm|md|lg|xl|2xl|3xl|full))?${end}`
		)
	],
	[
		'Schatten ausserhalb der zwei Tokens',
		new RegExp(`\\bshadow(?:-(?:sm|md|lg|xl|2xl|inner))?${end}`)
	],
	['Verlauf, Unschärfe oder Glühen', /gradient|\bblur\b|backdrop-blur|drop-shadow|glow/],
	['Material Symbols oder externe Schrift', /material-symbols|fonts\.googleapis|fonts\.gstatic/],
	['Emoji als Symbol', /(?![©®™])\p{Extended_Pictographic}/u],
	[
		'altes Basis-Bauteil',
		/\$lib\/components\/(?:Button|Card|Modal|Badge|StatusBadge|Icon|TextField|FieldError|FormActions|Toast|ToastContainer|InfoCard|StatCard|Pagination|PageTrail)\.svelte/
	]
];

// Badges and navigation group labels may use 14 px; nothing a user must read to act does
const smallTextAllowed = ['src/lib/ui/Badge.svelte', 'src/lib/ui/NavList.svelte'];

const sources = readdirSync('src', { recursive: true, encoding: 'utf8' })
	.map((file) => `src/${file.replaceAll('\\', '/')}`)
	.filter((file) => /\.(svelte|ts|css|html)$/.test(file))
	.filter((file) => !file.includes('__tests__') && !file.endsWith('src/styles/tokens.css'));

function findings(file: string) {
	const source = readFileSync(file, 'utf8');
	const small = smallTextAllowed.includes(file) ? [] : [['Schrift 14 px', /\btext-sm\b/] as const];
	return [...rules, ...small].filter(([, pattern]) => pattern.test(source)).map(([name]) => name);
}

describe('Designsystem', () => {
	it.each(sources.filter((file) => !legacy.includes(file)))(
		'%s nutzt nur Tokens und neue Bauteile',
		(file) => {
			expect(findings(file)).toEqual([]);
		}
	);

	it('führt in der Altlasten-Liste nur Dateien, die noch umzubauen sind', () => {
		const done = legacy.filter((file) => !existsSync(file) || findings(file).length === 0);
		expect(done, 'aus design-guard-legacy.json entfernen').toEqual([]);
	});
});
