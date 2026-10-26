import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { show } from './helpers/dom';

vi.mock('$app/stores', () => ({
	page: {
		subscribe: (run: (value: { url: URL }) => void) => (
			run({ url: new URL('http://localhost/buildings') }),
			() => {}
		)
	}
}));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), afterNavigate: vi.fn() }));

// E2E steps type and click once body[data-hydrated] is set (tests/e2e/screenplay/interactions.ts). SvelteKit starts
// its router after the root layout has mounted, in the same task: a submit before that is lost in Firefox (#869)
describe('Markierung «hydriert» für die Abnahmetests', () => {
	it('setzt data-hydrated erst eine Aufgabe nach dem Einhängen, wenn der Router zuhört', async () => {
		delete document.body.dataset.hydrated;
		const { default: Layout } = await import('../routes/+layout.svelte');
		const children = createRawSnippet(() => ({ render: () => '<h1>Seite</h1>' }));
		show(Layout, { data: { user: null }, children } as never);
		expect(document.body.dataset.hydrated).toBeUndefined();
		await new Promise((resolve) => setTimeout(resolve));
		expect(document.body.dataset.hydrated).toBe('true');
	});
});
