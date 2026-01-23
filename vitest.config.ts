import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			exclude: [
				'node_modules/',
				'src/**/*.spec.ts',
				'src/**/*.test.ts',
				'.svelte-kit/',
				'build/'
			]
		}
	}
});
