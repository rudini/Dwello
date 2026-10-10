import { describe, it, expect, vi } from 'vitest';
import { readable } from 'svelte/store';
import { flushSync } from 'svelte';
import Header from '$lib/components/Header.svelte';
import MobileNav from '$lib/components/MobileNav.svelte';
import Footer from '$lib/components/Footer.svelte';
import { closeMobileNav, mobileNavOpen } from '$lib/stores/navigation';
import { byTestId, click, show } from './helpers/dom';

vi.mock('$app/stores', () => ({
	page: readable({ url: new URL('http://localhost/tenants') })
}));
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));

const user = {
	id: 'u1',
	sub: 'u1',
	name: 'Vera Verwalter',
	email: 'vera@example.ch'
};
const press = (key: string) => {
	document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
	flushSync();
};

describe('Kopfzeile', () => {
	it('zeigt den angemeldeten Namen und öffnet das Benutzermenü', () => {
		show(Header, { user });
		const button = byTestId('user-menu-button')!;
		expect(byTestId('user-name')!.textContent).toContain('Vera Verwalter');
		expect(button.getAttribute('aria-expanded')).toBe('false');
		click(button);
		expect(button.getAttribute('aria-expanded')).toBe('true');
		expect(byTestId('user-menu-settings')!.getAttribute('href')).toBe('/config');
		expect(byTestId('logout-button')!.textContent).toContain('Abmelden');
	});

	it('schliesst das Benutzermenü mit Escape und gibt den Fokus zurück', () => {
		show(Header, { user });
		const button = byTestId('user-menu-button')!;
		button.focus();
		click(button);
		byTestId('user-menu-settings')!.focus();
		press('Escape');
		expect(byTestId('user-menu-settings')).toBeNull();
		expect(document.activeElement).toBe(button);
	});

	it('führt über das Logo zur Übersicht', () => {
		show(Header, { user });
		const logo = byTestId('header-logo')!;
		expect(logo.getAttribute('href')).toBe('/dashboard');
		expect(logo.textContent).toContain('Dwello');
	});

	it('öffnet das Menü für kleine Bildschirme', () => {
		show(Header, { user });
		const menu = byTestId('mobile-menu-button')!;
		expect(menu.getAttribute('aria-label')).toBe('Menü öffnen');
		click(menu);
		let open = false;
		mobileNavOpen.subscribe((value) => (open = value))();
		expect(open).toBe(true);
		closeMobileNav();
	});
});

describe('Menü für kleine Bildschirme', () => {
	it('ist ein Dialog mit der Hauptnavigation, der sich mit Escape schliesst', () => {
		show(MobileNav, {});
		mobileNavOpen.set(true);
		flushSync();
		const drawer = document.querySelector('[role="dialog"]')!;
		expect(drawer.getAttribute('aria-modal')).toBe('true');
		expect(drawer.getAttribute('aria-label')).toBe('Hauptnavigation');
		expect(drawer.querySelectorAll('[data-testid="main-nav-link"]').length).toBeGreaterThan(5);
		expect(drawer.contains(document.activeElement)).toBe(true);
		press('Escape');
		expect(document.querySelector('[role="dialog"]')).toBeNull();
	});
});

describe('Fusszeile', () => {
	it('führt zu Datenschutz und Nutzungsbedingungen', () => {
		show(Footer, {});
		const links = [...document.querySelectorAll('[data-testid="footer-link"]')].map((link) =>
			link.getAttribute('href')
		);
		expect(links).toEqual(['/privacy', '/terms']);
	});
});
