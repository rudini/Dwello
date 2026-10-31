import { describe, expect, it } from 'vitest';
import config from '../../svelte.config.js';

// #721: a Content-Security-Policy that runs only Dwello's own scripts (SvelteKit adds a nonce to its own inline one)
const csp = config.kit?.csp;
const directives = (csp?.directives ?? {}) as Record<string, string[] | undefined>;

describe('Content-Security-Policy', () => {
	it('lässt nur eigene Skripte mit der Nonce von SvelteKit zu, keine eingeschleusten', () => {
		expect(csp?.mode).toBe('auto');
		expect(directives['script-src']).toEqual(['self']);
		expect(directives['default-src']).toEqual(['self']);
	});

	it('verbietet Plugins, fremde Rahmen und fremde Formularziele', () => {
		expect(directives['object-src']).toEqual(['none']);
		expect(directives['frame-ancestors']).toEqual(['none']);
		expect(directives['base-uri']).toEqual(['self']);
		expect(directives['form-action']).toEqual(['self']);
	});

	// the app needs both: style attributes Svelte writes (ProgressBar) and the data: JPEG preview of an upload (file-pages.ts)
	it('lässt Stil-Attribute von Svelte und die Vorschau eines Uploads als data:-Bild zu', () => {
		expect(directives['style-src']).toEqual(['self', 'unsafe-inline']);
		expect(directives['img-src']).toEqual(['self', 'data:', 'blob:']);
	});
});
