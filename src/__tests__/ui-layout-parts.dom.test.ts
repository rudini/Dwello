import { describe, expect, it, vi } from 'vitest';
import { flushSync } from 'svelte';
import { readable } from 'svelte/store';
import Table from '$lib/ui/Table.svelte';
import ToastRegion from '$lib/ui/ToastRegion.svelte';
import PageHeader from '$lib/ui/PageHeader.svelte';
import Panel from '$lib/ui/Panel.svelte';
import IconButton from '$lib/ui/IconButton.svelte';
import NavList from '$lib/ui/NavList.svelte';
import { addToast, toasts } from '$lib/stores';
import { byTestId, click, show } from './helpers/dom';
import { markup } from './helpers/snippet';

vi.mock('$app/stores', () => ({
	page: readable({ url: new URL('http://localhost/tenants/42') })
}));

describe('Tabelle', () => {
	it('hat eine Beschriftung und Spaltenköpfe, Beträge rechtsbündig', () => {
		show(Table, {
			caption: 'Abrechnungspositionen',
			columns: [{ label: 'Kategorie' }, { label: 'Betrag', numeric: true }],
			children: markup('<tr><td>Wasser</td><td>CHF 120.00</td></tr>')
		});
		expect(document.querySelector('caption')!.textContent).toBe('Abrechnungspositionen');
		const heads = [...document.querySelectorAll('th')];
		expect(heads.map((th) => th.getAttribute('scope'))).toEqual(['col', 'col']);
		expect(heads[1].className).toContain('text-right');
	});

	it('benennt Spalten ohne sichtbaren Kopf für Screenreader', () => {
		show(Table, {
			caption: 'Mieter',
			columns: [{ label: 'Name' }, { label: 'Aktionen', hidden: true }],
			children: markup('<tr><td>Anna</td><td></td></tr>')
		});
		const actions = document.querySelectorAll('th')[1];
		expect(actions.textContent).toBe('Aktionen');
		expect(actions.querySelector('.sr-only')).not.toBeNull();
	});

	it('lässt sich auf schmalen Bildschirmen mit der Tastatur seitlich scrollen', () => {
		show(Table, {
			caption: 'Mieter',
			columns: [{ label: 'Name' }],
			children: markup('<tr><td>Anna</td></tr>')
		});
		const region = document.querySelector('[role=region]')!;
		expect(region.getAttribute('tabindex')).toBe('0');
		expect(region.getAttribute('aria-label')).toBe('Mieter');
	});
});

describe('Meldungen', () => {
	it('liest Erfolge höflich vor und lässt sie schliessen', () => {
		toasts.set([]);
		show(ToastRegion, {});
		addToast('success', 'Mieter gespeichert');
		flushSync();
		click(document.querySelector<HTMLElement>('[aria-label="Meldung schliessen"]')!);
		expect(document.body.textContent).not.toContain('Mieter gespeichert');
	});

	it('liest Fehler sofort vor', () => {
		toasts.set([]);
		show(ToastRegion, {});
		addToast('error', 'Speichern fehlgeschlagen');
		flushSync();
		expect(byTestId('toast-error')!.getAttribute('role')).toBe('alert');
		expect(byTestId('toast-error')!.closest('[aria-live]')).toBeNull(); // announced once, by its own role
	});
});

describe('Seitenkopf', () => {
	it('zeigt den Pfad zurück, den Titel, den Zweck und die eine Hauptaktion', () => {
		show(PageHeader, {
			title: 'Anna Keller',
			purpose: 'Kontaktdaten und Mietverhältnis.',
			trail: [{ href: '/tenants', label: 'Mieter' }],
			action: markup('<a href="/tenants/1/edit">Bearbeiten</a>')
		});
		expect(document.querySelector('h1')!.textContent).toBe('Anna Keller');
		const trail = document.querySelector('nav[aria-label="Brotkrümelnavigation"]')!;
		expect(trail.querySelector('a')!.getAttribute('href')).toBe('/tenants');
		expect(trail.querySelector('[aria-current=page]')!.textContent).toBe('Anna Keller');
		expect(document.body.textContent).toContain('Kontaktdaten und Mietverhältnis.');
	});
});

describe('Symbolschaltfläche', () => {
	it('wird mit ihrem Namen vorgelesen und handelt beim Klicken', () => {
		const onclick = vi.fn();
		show(IconButton, { icon: 'close', label: 'Menü schliessen', onclick, expanded: true });
		const button = document.querySelector('button')!;
		expect(button.getAttribute('aria-label')).toBe('Menü schliessen');
		expect(button.getAttribute('aria-expanded')).toBe('true');
		click(button);
		expect(onclick).toHaveBeenCalledOnce();
	});
});

describe('Bereich', () => {
	it('hat eine Überschrift der gewünschten Stufe', () => {
		show(Panel, { title: 'Mietverhältnis', level: 2, children: markup('<p>x</p>') });
		expect(document.querySelector('h2')!.textContent).toBe('Mietverhältnis');
	});
});

describe('Navigationsliste', () => {
	it('markiert die aktuelle Seite', () => {
		show(NavList, {
			groups: [
				{
					label: 'Verwalten',
					items: [
						{ label: 'Gebäude', href: '/buildings', icon: 'building' },
						{ label: 'Mieter', href: '/tenants', icon: 'building' }
					]
				}
			]
		});
		const current = document.querySelector('[aria-current=page]')!;
		expect(current.textContent).toContain('Mieter');
		expect(document.querySelectorAll('[aria-current]')).toHaveLength(1);
	});
});
