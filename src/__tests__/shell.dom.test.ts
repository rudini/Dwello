import { describe, it, expect, vi } from 'vitest';
import { readable } from 'svelte/store';
import { flushSync } from 'svelte';
import Header from '$lib/ui/Header.svelte';
import MobileNav from '$lib/ui/MobileNav.svelte';
import Footer from '$lib/ui/Footer.svelte';
import { closeMobileNav, mobileNavOpen } from '$lib/stores/navigation';
import { writeDraft } from '$lib/wizard-draft';
import { byTestId, click, fakeBff, settle, show } from './helpers/dom';

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

	it('nennt das Benutzermenü und bietet eine Fläche von mindestens 48 Pixeln', () => {
		show(Header, { user });
		const button = byTestId('user-menu-button')!;
		expect(button.textContent).toContain('Benutzermenü');
		expect(button.className).toMatch(/(^| )min-w-12( |$)/);
		expect(button.className).toMatch(/(^| )min-h-12( |$)/);
	});

	it('schliesst das Benutzermenü, wenn der Fokus es verlässt', () => {
		show(Header, { user });
		const button = byTestId('user-menu-button')!;
		click(button);
		const outside = byTestId('header-logo')!;
		byTestId('logout-button')!.dispatchEvent(
			new FocusEvent('focusout', { bubbles: true, relatedTarget: outside })
		);
		flushSync();
		expect(byTestId('user-menu-settings')).toBeNull();
		expect(button.getAttribute('aria-expanded')).toBe('false');
	});

	it('löscht beim Abmelden die Entwürfe in diesem Browser', async () => {
		writeDraft(localStorage, 'contract', { tenantId: 't1' }, new Date());
		fakeBff();
		show(Header, { user });
		click('user-menu-button');
		click('logout-button');
		await settle();
		expect(localStorage.length).toBe(0);
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
		expect(menu.getAttribute('aria-expanded')).toBe('false');
		click(menu);
		let open = false;
		mobileNavOpen.subscribe((value) => (open = value))();
		expect(open).toBe(true);
		expect(menu.getAttribute('aria-expanded')).toBe('true');
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

	it('zeigt die Version der App', () => {
		show(Footer, {});
		expect(byTestId('footer-version')!.textContent).toBe('Version 1.4.0');
	});

	it('lässt den Trennpunkt vor der Version nicht vorlesen', () => {
		show(Footer, {});
		expect(document.querySelector('footer p [aria-hidden="true"]')?.textContent).toBe('·');
	});
});
