import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { paraglideOptions } from './paraglide.config.ts';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import { execSync } from 'node:child_process';
import { versionFrom } from './src/lib/version.ts';

// APP_VERSION from the Docker build or the E2E run, else the checkout's own tags; none without git
function describeVersion(): string {
	if (process.env.APP_VERSION) return process.env.APP_VERSION;
	try {
		return execSync('git describe --tags --match "v*"', { stdio: ['ignore', 'pipe', 'ignore'] }).toString();
	} catch {
		return '';
	}
}

// #721: only Dwello's own scripts run; SvelteKit adds a nonce (hash when prerendered) to its own inline script.
// Styles stay inline-capable: Svelte writes style attributes and the <style> of transitions at runtime.
export const csp: NonNullable<Parameters<typeof sveltekit>[0]>['csp'] = {
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
};

export default defineConfig(({ mode }) => {
	// The server code reads BACKEND_URL from process.env, as `node build` gets it; in dev it comes from .env.
	// Variables set in the shell win; a value copied here counts as such, so a changed .env needs `bun run dev`
	// restarted (Vite's own restart keeps the old value).
	Object.assign(process.env, { ...loadEnv(mode, process.cwd(), ''), ...process.env });

	return {
		define: { __APP_VERSION__: JSON.stringify(versionFrom(describeVersion()) ?? null) },
		plugins: [
			tailwindcss(),
			sveltekit({
				// Consult https://svelte.dev/docs/kit/integrations
				// for more information about preprocessors
				preprocess: vitePreprocess(),

				// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
				// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
				// See https://svelte.dev/docs/kit/adapters for more information about adapters.
				// BUILD_DIR: persona-stack.sh builds into its own directory, so an E2E run can build and serve build/ meanwhile
				adapter: adapter({ out: process.env.BUILD_DIR ?? 'build' }),
				outDir: process.env.BUILD_DIR ? '.svelte-kit/persona' : '.svelte-kit',
				alias: { $lib: 'src/lib' },
				csp
			}),
			// UI language from the cookie, else the browser's (de, fr, it, en), else German; no URL prefix
			paraglideVitePlugin(paraglideOptions)
		],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}'],
			globals: true,
			environment: 'jsdom'
		},
		server: {
			port: 3000,
			strictPort: false
		},
		build: {
			target: 'esnext'
		}
	};
});
