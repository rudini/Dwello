import { describe, it, expect } from 'vitest';
import { render } from 'svelte/server';
import GenerationStep from '../routes/statements/generate/GenerationStep.svelte';

describe('GenerationStep', () => {
	it('restarts the wizard with a full page load after statements were created', () => {
		const { body } = render(GenerationStep, {
			props: { createdCount: 3, count: 3 }
		});

		// A client-side navigation to the same URL would keep the wizard on its last step
		expect(body).toMatch(/<a href="\/statements\/generate"[^>]*data-sveltekit-reload/);
	});
});
