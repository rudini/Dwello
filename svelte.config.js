import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		// BUILD_DIR: persona-stack.sh builds into its own directory, so an E2E run can build and serve build/ meanwhile
		adapter: adapter({ out: process.env.BUILD_DIR ?? 'build' }),
		outDir: process.env.BUILD_DIR ? '.svelte-kit/persona' : '.svelte-kit',
		alias: {
			$lib: 'src/lib'
		},
		// #721: only Dwello's own scripts run; SvelteKit adds a nonce (hash when prerendered) to its own inline script.
		// Styles stay inline-capable: Svelte writes style attributes and the <style> of transitions at runtime.
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'style-src': ['self', 'unsafe-inline'],
				'img-src': ['self', 'data:', 'blob:'],
				// blob:: the acceptance test reads a file chosen for upload in the page (OpenInNewTab in
				// tests/e2e/screenplay/interactions.ts), as headless Chromium shows no PDF in a tab; the app itself only links to it
				'connect-src': ['self', 'blob:'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['none']
			}
		}
	}
};

export default config;
