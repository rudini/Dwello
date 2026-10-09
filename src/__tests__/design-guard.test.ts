import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'fs';
import legacy from './design-guard-legacy.json';

/**
 * Keeps the design system clean: only tokens and the new components, none of the forbidden patterns.
 * Files not yet migrated are listed in design-guard-legacy.json; the list only shrinks and is empty after stage 8.
 */
const palette =
	'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white';
const end = `(?=[\\s"'\`}:=]|$)`;
const rules: [string, RegExp][] = [
	[
		'Farbe der alten Tailwind-Palette',
		new RegExp(`\\b[a-z-]*-(?:${palette})(?:-\\d{2,3})?(?:/\\d+)?${end}`, 'm')
	],
	[
		'Token des alten Designsystems',
		/\b(?:bg|text|border|ring|from|to|via|outline|divide|fill|stroke|placeholder|decoration|shadow)-(?:primary|success|text-dark|text-secondary|border-light)\b/
	],
	[
		'fest codierte Farbe',
		/#[0-9a-fA-F]{3,8}\b(?![-\w])|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/
	],
	['Farbe im style-Attribut', /style="[^"]*\b(?:color|background(?:-color)?|border-color)\s*:/],
	['SVG-Farbe ausserhalb der Tokens', /\b(?:fill|stroke)="(?!none"|currentColor"|var\()[^"]+"/],
	['beliebiger Wert statt Token', /\b[a-z][a-z-]*-\[[^\]]+\]/],
	['Schrift unter 14 px', /\btext-xs\b/],
	[
		'Abstand ausserhalb des 8-px-Rasters',
		new RegExp(
			`\\b-?(?:p|px|py|pt|pb|pl|pr|ps|pe|m|mx|my|mt|mb|ml|mr|ms|me|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|bottom|left|right|start|end)-(?:0\\.5|1\\.5|2\\.5|3\\.5|3|5|7|9|11)${end}`
		)
	],
	[
		'Radius ausserhalb der zwei Tokens',
		new RegExp(
			`\\brounded(?:-(?:t|b|l|r|s|e|tl|tr|bl|br|ss|se|es|ee))?(?:-(?:none|sm|md|lg|xl|2xl|3xl|full))?${end}`
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

function findingsIn(source: string, smallTextOk = false) {
	const small = smallTextOk ? [] : [['Schrift 14 px', /\btext-sm\b/] as const];
	return [...rules, ...small].filter(([, pattern]) => pattern.test(source)).map(([name]) => name);
}
const findings = (file: string) =>
	findingsIn(readFileSync(file, 'utf8'), smallTextAllowed.includes(file));

describe('Wächter des Designsystems', () => {
	it.each([
		'class="text-gray-500"',
		'class:text-gray-500={muted}',
		'class:rounded-lg={x}',
		'class="rounded-[4px]"',
		'class="rounded-s-lg"',
		'class="shadow-[0_0_4px_red]"',
		'class="ms-3"',
		'class="pe-5"',
		'class="w-[37px]"',
		'class="leading-[13px]"',
		'style="color: red"',
		'style="color: oklch(50% 0.1 200)"',
		'<path fill="white" />',
		'class="outline-primary"',
		'class="divide-gray-200"',
		'class="bg-gradient-to-r"',
		'class="text-xs"',
		'class="p-3"',
		'class="material-symbols-outlined"'
	])('meldet %s', (sample) => {
		expect(findingsIn(sample)).not.toEqual([]);
	});

	it.each([
		'class="bg-surface text-ink border-line-strong rounded-control shadow-raised p-4 gap-6"',
		'<Button variant="primary">',
		'class="text-ink-muted min-h-12 size-12 rounded-panel shadow-overlay"',
		'href="#main-content"'
	])('lässt %s zu', (sample) => {
		expect(findingsIn(sample)).toEqual([]);
	});
});

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
