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
		csrf: {
			checkOrigin: true
		},
		alias: {
			$lib: 'src/lib'
		}
	}
};

export default config;
