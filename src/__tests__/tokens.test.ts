import { describe, expect, it } from 'vitest';
import { readFileSync } from 'fs';

// The colour tokens of the design system, light (:root) and dark, as written in tokens.css
const css = readFileSync('src/styles/tokens.css', 'utf8');
const block = (selector: string) => css.slice(css.indexOf(selector)).split('}')[0];
const colours = (source: string) =>
	Object.fromEntries(
		[...source.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(([, name, hex]) => [
			name,
			hex
		])
	);
const light = colours(block(':root {'));
const dark = { ...light, ...colours(block('[data-dark-ready]')) };

function luminance(hex: string) {
	const [r, g, b] = [1, 3, 5].map((i) => {
		const c = parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a: string, b: string) => {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
};

// [text, background, minimum ratio]: body text AAA, accent and status text at least 6:1, UI boundaries 3:1
const pairs: [string, string, number][] = [
	['ink', 'canvas', 7],
	['ink', 'surface', 7],
	['ink', 'sunken', 7],
	['ink-muted', 'surface', 7],
	['ink-muted', 'canvas', 7],
	['ink-muted', 'sunken', 7],
	['accent', 'surface', 6],
	['accent', 'canvas', 6],
	['accent-strong', 'accent-soft', 7],
	['on-accent', 'accent', 6],
	['on-accent', 'accent-strong', 7],
	['on-accent', 'critical', 7],
	['accent', 'accent-soft', 6],
	['ink-muted', 'accent-soft', 7],
	['ink', 'accent-soft', 7],
	['positive', 'positive-soft', 7],
	['caution', 'caution-soft', 7],
	['critical', 'critical-soft', 7],
	['critical', 'surface', 6],
	['line-strong', 'surface', 3],
	['line-strong', 'canvas', 3],
	['focus', 'surface', 3],
	['focus', 'canvas', 3]
];

describe.each([
	['hell', light],
	['dunkel', dark]
])('Farbtokens (%s)', (_, theme) => {
	it.each(pairs)('%s auf %s erreicht mindestens %d:1', (text, background, minimum) => {
		expect(theme[text], `--color-${text}`).toBeDefined();
		expect(theme[background], `--color-${background}`).toBeDefined();
		expect(contrast(theme[text], theme[background])).toBeGreaterThanOrEqual(minimum);
	});
});
