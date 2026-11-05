import { describe, it, expect, vi } from 'vitest';
import { readable } from 'svelte/store';
import { flushSync } from 'svelte';
import LanguageSwitcher from '$lib/ui/LanguageSwitcher.svelte';
import Header from '$lib/ui/Header.svelte';
import { setLocale } from '$lib/paraglide/runtime';
import { allByTestId, byTestId, click, show } from './helpers/dom';
import { get } from 'svelte/store';
import { toasts } from '$lib/stores';

vi.mock('$app/stores', () => ({ page: readable({ url: new URL('http://localhost/tenants') }) }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), afterNavigate: vi.fn() }));
vi.mock('$lib/paraglide/runtime', async (original) => ({
	...(await original<object>()),
	setLocale: vi.fn() // sets the cookie and reloads the page
}));

const button = () => byTestId<HTMLButtonElement>('language-button')!;
const press = (key: string) => {
	document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
	flushSync();
};

describe('Sprachwahl', () => {
	it('zeigt die aktuelle Sprache als Text und heisst für Screenreader «Sprache: Deutsch»', () => {
		show(LanguageSwitcher, {});
		expect(button().textContent!.replace(/\s+/g, ' ').trim()).toBe('Sprache: Deutsch');
		expect(button().querySelector('.sr-only')!.textContent).toBe('Sprache: ');
		expect(button().getAttribute('aria-expanded')).toBe('false');
		expect(button().className).toMatch(/(^| )min-h-12( |$)/);
	});

	it('bietet alle vier Sprachen in ihrer eigenen Sprache an, die aktuelle markiert', () => {
		show(LanguageSwitcher, {});
		click(button());
		expect(button().getAttribute('aria-expanded')).toBe('true');
		expect(
			allByTestId('language-option').map((option) => [
				option.textContent!.trim(),
				option.lang,
				option.getAttribute('aria-current')
			])
		).toEqual([
			['Deutsch', 'de', 'true'],
			['Français', 'fr', null],
			['Italiano', 'it', null],
			['English', 'en', null]
		]);
		expect(allByTestId('language-option').every((option) => /min-h-12/.test(option.className))).toBe(true);
	});

	it('wechselt die Sprache und bleibt auf der Seite', () => {
		show(LanguageSwitcher, {});
		click(button());
		click(allByTestId('language-option')[1]);
		expect(setLocale).toHaveBeenCalledWith('fr');
	});

	// #656 (Decided): the page reloads in the new language; then the focus is back on the switcher and a message names the language
	it('steht nach dem Wechsel wieder auf der Sprachwahl und nennt die Sprache', () => {
		toasts.set([]);
		show(LanguageSwitcher, {});
		click(button());
		click(allByTestId('language-option')[1]);
		document.body.innerHTML = ''; // the reload
		show(LanguageSwitcher, {});
		expect(document.activeElement).toBe(button());
		expect(get(toasts).map((toast) => toast.message)).toEqual(['Sprache: Deutsch']);
	});

	// persona Sven 656 P-1: the language already shown changes nothing, so the list closes like with Escape, and no reload names it
	it('schliesst bei der Wahl der aktuellen Sprache und nennt sie beim nächsten Laden nicht', () => {
		sessionStorage.clear();
		vi.mocked(setLocale).mockClear();
		toasts.set([]);
		show(LanguageSwitcher, {});
		click(button());
		click(allByTestId('language-option')[0]);
		expect(setLocale).not.toHaveBeenCalled();
		expect(button().getAttribute('aria-expanded')).toBe('false');
		expect(document.activeElement).toBe(button());
		document.body.innerHTML = ''; // a later reload
		show(LanguageSwitcher, {});
		expect(get(toasts)).toEqual([]);
	});

	it('nennt die Sprache beim Laden einer Seite ohne Wechsel nicht', () => {
		sessionStorage.clear();
		toasts.set([]);
		show(LanguageSwitcher, {});
		expect(document.activeElement).not.toBe(button());
		expect(get(toasts)).toEqual([]);
	});

	it('schliesst mit Escape und gibt den Fokus zurück', () => {
		show(LanguageSwitcher, {});
		button().focus();
		click(button());
		allByTestId('language-option')[2].focus();
		press('Escape');
		expect(allByTestId('language-option')).toHaveLength(0);
		expect(document.activeElement).toBe(button());
	});

	it('wechselt mit den Pfeiltasten zwischen den Sprachen, auch von der Schaltfläche aus', () => {
		show(LanguageSwitcher, {});
		button().focus();
		press('ArrowDown'); // opens the menu on the current language
		expect(document.activeElement).toBe(allByTestId('language-option')[0]);
		press('ArrowDown');
		expect(document.activeElement).toBe(allByTestId('language-option')[1]);
		press('End');
		expect(document.activeElement).toBe(allByTestId('language-option')[3]);
		press('ArrowDown'); // wraps around
		expect(document.activeElement).toBe(allByTestId('language-option')[0]);
		press('ArrowUp');
		expect(document.activeElement).toBe(allByTestId('language-option')[3]);
		press('Home');
		expect(document.activeElement).toBe(allByTestId('language-option')[0]);
	});

	it('schliesst bei einem Klick daneben', () => {
		show(LanguageSwitcher, {});
		click(button());
		click(document.querySelector<HTMLElement>('button[aria-hidden="true"]')!);
		expect(allByTestId('language-option')).toHaveLength(0);
	});

	it('steht in der Kopfzeile, ohne ein weiteres Auswahlfeld', () => {
		show(Header, {
			user: { id: 'u1', sub: 'u1', name: 'Vera Verwalter', email: 'vera@example.ch' }
		});
		expect(document.querySelector('header [data-testid="language-button"]')).not.toBeNull();
		expect(document.querySelectorAll('header select')).toHaveLength(0);
	});
});

describe('Sprachwahl ohne Kopfzeile', () => {
	it('steht auch auf Seiten ohne Kopfzeile, etwa der Anmeldung', async () => {
		const { default: Layout } = await import('../routes/+layout.svelte');
		const { createRawSnippet } = await import('svelte');
		const children = createRawSnippet(() => ({ render: () => '<p>Anmelden</p>' }));
		show(Layout, { data: { user: null }, children } as never);
		// without the app's header (its own header since #656 holds only the links and the language choice)
		expect(byTestId('user-menu-button')).toBeNull();
		expect(byTestId('header-logo')).toBeNull();
		expect(allByTestId('language-button')).toHaveLength(1);
		expect(document.querySelector('nav[aria-label="Sprachwahl"] [data-testid="language-button"]')).not.toBeNull();
	});
});
