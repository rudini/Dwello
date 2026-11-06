import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { afterNavigate } from '$app/navigation';
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

// After a search on a list the focus goes to its results; a filter select that applies on change keeps it (#677, S-1)
describe('Fokus nach der Suche in einer Liste', () => {
	async function navigate(focused: 'select' | 'body') {
		const { default: Layout } = await import('../routes/+layout.svelte');
		const children = createRawSnippet(() => ({
			render: () =>
				'<div><select><option>Alle</option></select><p data-results tabindex="-1">2 Ergebnisse</p></div>'
		}));
		show(Layout, { data: { user: null }, children } as never);
		const [callback] = vi.mocked(afterNavigate).mock.lastCall!;
		if (focused === 'select') document.querySelector('select')!.focus();
		const url = new URL('http://localhost/buildings');
		callback({ type: 'form', from: { url }, to: { url } } as never);
	}

	it('behält den Fokus auf einem Filter, der beim Ändern sucht', async () => {
		await navigate('select');
		expect(document.activeElement).toBe(document.querySelector('select'));
	});

	it('setzt den Fokus sonst auf die Ergebnisse', async () => {
		await navigate('body');
		expect(document.activeElement).toBe(document.querySelector('main [data-results]'));
	});
});
