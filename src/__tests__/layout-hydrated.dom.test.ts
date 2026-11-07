import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet, tick } from 'svelte';
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
	async function navigate(focused: 'select' | 'tile' | 'body') {
		const { default: Layout } = await import('../routes/+layout.svelte');
		const children = createRawSnippet(() => ({
			render: () =>
				'<div><select><option>Alle</option></select><a href="?status=draft" data-sveltekit-keepfocus>Entwurf</a><p data-results tabindex="-1">2 Ergebnisse</p></div>'
		}));
		show(Layout, { data: { user: null }, children } as never);
		const [callback] = vi.mocked(afterNavigate).mock.lastCall!;
		if (focused === 'select') document.querySelector('select')!.focus();
		if (focused === 'tile') document.querySelector<HTMLElement>('[data-sveltekit-keepfocus]')!.focus();
		const url = new URL('http://localhost/buildings');
		callback({ type: 'form', from: { url }, to: { url } } as never);
	}

	it('behält den Fokus auf einem Filter, der beim Ändern sucht', async () => {
		await navigate('select');
		expect(document.activeElement).toBe(document.querySelector('select'));
	});

	// #1162: the chosen status tile keeps the focus, so the page does not scroll it out of view
	it('behält den Fokus auf einem Filter, der ihn behalten will', async () => {
		await navigate('tile');
		expect(document.activeElement).toBe(document.querySelector('[data-sveltekit-keepfocus]'));
	});

	// #662 (persona Sven S-1): with the focus in the filter, the result is read out in a polite status
	it('sagt das Ergebnis an, wenn der Fokus im Filter bleibt', async () => {
		await navigate('select');
		await tick();

		const status = document.querySelector('[data-testid="list-result-status"]')!;
		expect([status.getAttribute('role'), status.textContent]).toEqual(['status', '2 Ergebnisse']);
	});

	it('setzt den Fokus sonst auf die Ergebnisse', async () => {
		await navigate('body');
		expect(document.activeElement).toBe(document.querySelector('main [data-results]'));
	});
});
