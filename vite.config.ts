import { sveltekit } from '@sveltejs/kit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
	// The server code reads BACKEND_URL from process.env, as `node build` gets it; in dev it comes from .env.
	// Variables set in the shell win; a value copied here counts as such, so a changed .env needs `bun run dev`
	// restarted (Vite's own restart keeps the old value).
	Object.assign(process.env, { ...loadEnv(mode, process.cwd(), ''), ...process.env });

	return {
		plugins: [
			sveltekit(),
			// UI language from the cookie, German without one (no URL prefix, not the browser language)
			paraglideVitePlugin({
				project: './project.inlang',
				outdir: './src/lib/paraglide',
				strategy: ['cookie', 'baseLocale']
			})
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
