import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		alias: {
			'$lib': resolve('./src/lib'),
			'$env/dynamic/private': resolve('./tests/mocks/env.ts')
		},
		projects: [
			{
				extends: true,
				test: {
					name: 'server',
					include: ['src/**/*.{test,spec}.{js,ts}', 'tests/unit/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.dom.test.ts'],
					environment: 'node'
				}
			},
			{
				// Components mounted in a DOM, so their event handlers run (e.g. clicks)
				extends: true,
				resolve: { conditions: ['browser'] },
				test: {
					name: 'dom',
					include: ['src/**/*.dom.test.ts'],
					environment: 'jsdom'
				}
			}
		],
		coverage: {
			provider: 'v8',
			// Every source file counts, also those no test loads; otherwise untested pages are left out
			include: ['src/**/*.{ts,svelte}'],
			reporter: ['text', 'html', 'lcov'],
			exclude: [
				'node_modules/',
				'src/**/*.spec.ts',
				'src/**/*.test.ts',
				'.svelte-kit/',
				'build/',
				'tests/mocks/**'
			]
		}
	}
});
