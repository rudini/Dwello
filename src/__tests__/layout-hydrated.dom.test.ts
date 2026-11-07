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

	it('setzt den Fokus sonst auf die Ergebnisse', async () => {
		await navigate('body');
		expect(document.activeElement).toBe(document.querySelector('main [data-results]'));
	});
});

// #1173 (Sven 2 P-4): a screen reader hears the title when another page opens, not after a form action that stays
describe('Ansage des Seitentitels', () => {
	async function navigate(from: string, to: string) {
		const { default: Layout } = await import('../routes/+layout.svelte');
		const children = createRawSnippet(() => ({ render: () => '<h1>Seite</h1>' }));
		show(Layout, { data: { user: null }, children } as never);
		document.title = 'Lea Frei - Dwello';
		const [callback] = vi.mocked(afterNavigate).mock.lastCall!;
		callback({ type: 'goto', from: { url: new URL(from) }, to: { url: new URL(to) } } as never);
		await tick();
		return document.querySelector('[data-testid="page-title-announcer"]')!;
	}

	it('sagt nach dem Wechsel auf eine andere Seite deren Titel an', async () => {
		const announcer = await navigate('http://localhost/tenants', 'http://localhost/tenants/7');
		expect([announcer.getAttribute('aria-live'), announcer.textContent]).toEqual([
			'assertive',
			'Lea Frei - Dwello'
		]);
	});

	// SvelteKit's announcer reads the title also after a form action, when the page store changes
	// Sven 1173: muted, its copy of the title would still be read a second time in browse mode
	it('stellt die Ansage von SvelteKit stumm und verbirgt sie', async () => {
		document.body.innerHTML = '<div id="svelte-announcer" aria-live="assertive"></div>';
		const { default: Layout } = await import('../routes/+layout.svelte');
		show(Layout, {
			data: { user: null },
			children: createRawSnippet(() => ({ render: () => '<h1>Seite</h1>' }))
		} as never);
		await new Promise((resolve) => setTimeout(resolve));
		const announcer = document.getElementById('svelte-announcer')!;
		expect([announcer.getAttribute('aria-live'), announcer.getAttribute('aria-hidden')]).toEqual([
			'off',
			'true'
		]);
	});

	// a form action that sends the page to itself (a redirect) or a list search stays on the page
	it('sagt den Titel nicht an, wenn die Seite dieselbe bleibt', async () => {
		const announcer = await navigate(
			'http://localhost/tenants/7',
			'http://localhost/tenants/7?tab=documents'
		);
		expect(announcer.textContent).toBe('');
	});
});
