import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ci = readFileSync(fileURLToPath(new URL('../../.github/workflows/ci.yml', import.meta.url)), 'utf8');

describe('Job UI screenshots (#1245)', () => {
	// the screenshot spec reaches BFF code with $lib imports; the alias exists only after svelte-kit sync, else no test loads
	it('erzeugt die SvelteKit-Pfade, bevor Playwright die Screenshot-Tests lädt', () => {
		const run = ci.split('\n').find((line) => line.includes('playwright test -c playwright.screenshots.config.ts'));
		expect(run).toMatch(/svelte-kit sync && bunx playwright test -c playwright\.screenshots\.config\.ts/);
	});
});
