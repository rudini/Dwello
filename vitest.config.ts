import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}', 'tests/unit/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'node',
		alias: {
			'$lib': resolve('./src/lib'),
			'$env/dynamic/private': resolve('./tests/mocks/env.ts')
		},
		coverage: {
			provider: 'v8',
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
