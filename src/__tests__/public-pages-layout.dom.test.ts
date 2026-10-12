import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet, flushSync } from 'svelte';
import { show } from './helpers/dom';

// The address the layout reads, set per test
const page = vi.hoisted(() => {
	let set = (_: { url: URL }) => {};
	const store = {
		subscribe(run: (value: { url: URL }) => void) {
			set = run;
			run({ url: new URL('http://localhost/terms') });
			return () => {};
		}
	};
	return { store, go: (path: string) => set({ url: new URL(`http://localhost${path}`) }) };
});
vi.mock('$app/stores', () => ({ page: page.store }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), afterNavigate: vi.fn() }));

async function signedOut(path: string) {
	const { default: Layout } = await import('../routes/+layout.svelte');
	const children = createRawSnippet(() => ({ render: () => '<h1>Seite</h1>' }));
	show(Layout, { data: { user: null }, children } as never);
	page.go(path);
	flushSync();
	return document.querySelector('main')!;
}

describe('Hilfe und Rechtliches ohne Anmeldung', () => {
	it.each(['/help', '/privacy', '/terms'])(
		'%s hat ohne Kopfzeile denselben Rand wie mit Kopfzeile',
		async (path) => {
			const main = await signedOut(path);
			expect(document.querySelector('header')).toBeNull();
			expect(main.className).toMatch(/(^| )px-4( |$)/);
			expect(main.querySelector('.mx-auto.max-w-6xl h1')).not.toBeNull();
		}
	);

	it.each(['/help', '/privacy', '/terms'])(
		'%s führt zur Anmeldung und zu den anderen Seiten',
		async (path) => {
			await signedOut(path);
			const links = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));
			expect(links).toEqual(expect.arrayContaining(['/login', '/privacy', '/terms']));
		}
	);

	it('die Anmeldeseite bleibt ohne Rand und führt zu Datenschutz und Nutzungsbedingungen', async () => {
		const main = await signedOut('/login');
		expect(main.className).not.toMatch(/px-4/);
		const links = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));
		expect(links).toEqual(expect.arrayContaining(['/privacy', '/terms']));
		expect(links).not.toContain('/login');
	});

	it.each(['/login', '/privacy', '/terms'])('%s führt ohne Anmeldung zur Hilfe', async (path) => {
		await signedOut(path);
		const links = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));
		expect(links).toContain('/help');
	});

	it('die Hilfe verweist nicht auf sich selbst', async () => {
		await signedOut('/help');
		const links = [...document.querySelectorAll('a')].map((a) => a.getAttribute('href'));
		expect(links).not.toContain('/help');
	});
});
