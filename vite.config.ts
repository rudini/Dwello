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

export default defineConfig(({ mode }) => {
	// The server code reads BACKEND_URL from process.env, as `node build` gets it; in dev it comes from .env.
	// Variables set in the shell win; a value copied here counts as such, so a changed .env needs `bun run dev`
	// restarted (Vite's own restart keeps the old value).
	Object.assign(process.env, { ...loadEnv(mode, process.cwd(), ''), ...process.env });

	return {
		define: { __APP_VERSION__: JSON.stringify(versionFrom(describeVersion()) ?? null) },
		plugins: [
			tailwindcss(),
			sveltekit(),
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
