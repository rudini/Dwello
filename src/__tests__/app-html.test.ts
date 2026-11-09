import { existsSync, readFileSync } from 'node:fs';
import { House } from 'lucide';
import { describe, expect, it } from 'vitest';

const appHtml = readFileSync('src/app.html', 'utf8');

describe('app.html', () => {
	it('verlinkt nur Dateien, die unter static/ liegen', () => {
		const assets = [...appHtml.matchAll(/%sveltekit\.assets%\/([^"']+)/g)].map((match) => match[1]);
		expect(assets.filter((file) => !existsSync(`static/${file}`))).toEqual([]);
	});

	it('verlinkt das Seitensymbol als SVG', () => {
		expect(appHtml).toContain('<link rel="icon" type="image/svg+xml" href="%sveltekit.assets%/favicon.svg" />');
	});

	it('verlinkt Symbol und Manifest für den Startbildschirm', () => {
		expect(appHtml).toContain(
			'<link rel="apple-touch-icon" href="%sveltekit.assets%/apple-touch-icon.png" />'
		);
		expect(appHtml).toContain(
			'<link rel="manifest" href="%sveltekit.assets%/manifest.webmanifest" />'
		);
	});

	it('nennt im Manifest Dwello und Symbole als PNG in der angegebenen Grösse', () => {
		const manifest = JSON.parse(readFileSync('static/manifest.webmanifest', 'utf8'));
		expect(manifest.name).toBe('Dwello');
		const pngSize = (file: string) => {
			const png = readFileSync(`static/${file}`);
			return `${png.readUInt32BE(16)}x${png.readUInt32BE(20)}`;
		};
		const icons = [
			{ src: 'apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
			...manifest.icons
		];
		expect(icons.map((icon) => `${icon.type} ${pngSize(icon.src)}`)).toEqual(
			icons.map((icon) => `image/png ${icon.sizes}`)
		);
	});

	it('zeigt im Seitensymbol das Haus aus dem Header', () => {
		const icon = readFileSync('static/favicon.svg', 'utf8');
		for (const [, attributes] of House) expect(icon).toContain(`d="${attributes.d}"`);
	});

	it('zeigt das Haus weiss auf einer Fläche in der Akzentfarbe, in hellem und dunklem Modus gleich', () => {
		const icon = readFileSync('static/favicon.svg', 'utf8');
		expect(icon).toContain('fill="#1B5873"');
		expect(icon).toContain('stroke="#FFFFFF"');
		expect(icon).not.toContain('prefers-color-scheme');
	});
});
