import { existsSync, readFileSync } from 'node:fs';
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
});
