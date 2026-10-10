import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		globals: true,
		alias: {
			'$lib': resolve('./src/lib'),
			'$env/dynamic/private': resolve('./tests/mocks/env.ts'),
			'$env/dynamic/public': resolve('./tests/mocks/env.ts')
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
			// Coverage of today as the floor (`npm run test:coverage`, CI); raise as it grows, the goal is 80 %
			thresholds: { statements: 71, branches: 60, functions: 76, lines: 66 },
			exclude: [
				'node_modules/',
				'src/**/*.spec.ts',
				'src/**/*.test.ts',
				'src/__tests__/**',
				'.svelte-kit/',
				'build/',
				'tests/mocks/**'
			]
		}
	}
});
