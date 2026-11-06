import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet, flushSync } from 'svelte';
import { byTestId, show } from './helpers/dom';

// The address the layout reads, set per test
// every subscriber hears it: the layout and, since #656, the footer
const page = vi.hoisted(() => {
	const runs = new Set<(value: { url: URL }) => void>();
	const store = {
		subscribe(run: (value: { url: URL }) => void) {
			runs.add(run);
			run({ url: new URL('http://localhost/terms') });
			return () => runs.delete(run);
		}
	};
	return {
		store,
		go: (path: string) => runs.forEach((run) => run({ url: new URL(`http://localhost${path}`) }))
	};
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
			// without the app's header; the page's own header holds only the links and the language choice (#656)
			expect(byTestId('header-logo')).toBeNull();
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

async function shown(path: string, data: { user: object | null; demo: boolean }) {
	const { default: Layout } = await import('../routes/+layout.svelte');
	const children = createRawSnippet(() => ({ render: () => '<h1>Seite</h1>' }));
	show(Layout, { data, children } as never);
	page.go(path);
	flushSync();
	return document.querySelector('[data-testid="demo-notice"]');
}

const user = { id: 'u1', sub: 'u1', name: 'Vera Verwalter', email: 'vera@example.ch' };

describe('Öffentliche Demo', () => {
	// #675: the sign-in page shows the full notice itself (login-view.test.ts), so not twice
	it('zeigt auf der Anmeldeseite keine zweite Zeile', async () => {
		expect(await shown('/login', { user: null, demo: true })).toBeNull();
	});

	it('warnt nach der Anmeldung auf jeder Seite der App', async () => {
		const notice = await shown('/tenants', { user, demo: true });
		expect(notice?.textContent).toContain('Jede Nacht werden alle Änderungen gelöscht');
	});

	// #675 F4: the same line with its link, also without a session
	it.each(['/help', '/privacy', '/terms'])(
		'warnt auch auf %s ohne Anmeldung mit derselben Zeile',
		async (path) => {
			const notice = await shown(path, { user: null, demo: true });
			expect(notice?.textContent).toContain('Jede Nacht werden alle Änderungen gelöscht.');
			expect(notice?.querySelector('a')?.getAttribute('href')).toBe('/help#demo');
		}
	);

	// #675: inside the app one line, outside the main area, so «Zum Inhalt springen» leads straight to the h1 (Sven P-1)
	it('steht in der App ausserhalb des Hauptbereichs, damit «Zum Inhalt springen» zur Überschrift führt', async () => {
		await shown('/tenants', { user, demo: true });
		const notice = document.querySelector('[data-testid="demo-notice"]');
		expect(notice?.textContent).toContain('Alle Besucher sehen und ändern dieselben Daten.');
		expect(document.querySelector('main')!.contains(notice)).toBe(false);
	});

	// #675 (review b162-2 C-11): no region and title of the same name, so «Öffentliche Demo» is read once
	it('nennt «Öffentliche Demo» in der App nur einmal', async () => {
		await shown('/tenants', { user, demo: true });
		const names = [...document.querySelectorAll('[aria-label]')].map((e) =>
			e.getAttribute('aria-label')
		);
		const texts = document.body.textContent!.split('Öffentliche Demo').length - 1;
		expect(names.filter((name) => name?.includes('Öffentliche Demo')).length + texts).toBe(1);
	});

	it('führt in der App mit «Mehr zur Demo» zum Abschnitt der Hilfe', async () => {
		await shown('/tenants', { user, demo: true });
		const link = document.querySelector<HTMLAnchorElement>('[data-testid="demo-notice"] a');
		expect(link?.textContent).toBe('Mehr zur Demo');
		expect(link?.getAttribute('href')).toBe('/help#demo');
	});

	it('zeigt in einer eigenen Installation keinen Demo-Hinweis', async () => {
		expect(await shown('/tenants', { user, demo: false })).toBeNull();
		expect(document.querySelector('main h1')).not.toBeNull();
	});
});
