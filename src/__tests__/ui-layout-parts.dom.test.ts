import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushSync } from 'svelte';
import type { Writable } from 'svelte/store';
import { navigating as navigatingStore } from '$app/stores';
import Table from '$lib/ui/Table.svelte';
import ToastRegion from '$lib/ui/ToastRegion.svelte';
import PageHeader from '$lib/ui/PageHeader.svelte';
import Panel from '$lib/ui/Panel.svelte';
import IconButton from '$lib/ui/IconButton.svelte';
import NavList from '$lib/ui/NavList.svelte';
import { addToast, toasts } from '$lib/stores';
import { allByTestId, byTestId, click, show } from './helpers/dom';
import { markup } from './helpers/snippet';

vi.mock('$app/stores', async () => {
	const { readable, writable } = await import('svelte/store');
	return {
		page: readable({ url: new URL('http://localhost/tenants/42') }),
		navigating: writable(null)
	};
});

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
	const navigating = navigatingStore as unknown as Writable<object | null>;
	const status = () => document.querySelector('[role="status"]')!;
	afterEach(() => {
		vi.useRealTimers();
		navigating.set(null);
	});

	it('liest Erfolge höflich vor und lässt sie schliessen', () => {
		vi.useFakeTimers();
		toasts.set([]);
		show(ToastRegion, {});
		addToast('success', 'Mieter gespeichert');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();
		click(document.querySelector<HTMLElement>('[aria-label="Meldung schliessen"]')!);
		expect(document.body.textContent).not.toContain('Mieter gespeichert');
	});

	it('hat die Live-Region schon leer auf der Seite und füllt sie nach der neuen Seite', () => {
		vi.useFakeTimers();
		toasts.set([]);
		show(ToastRegion, {});
		const region = status();
		expect(region.textContent!.trim()).toBe('');

		navigating.set({}); // the save opens the saved record: its title is announced first
		addToast('success', 'Mieter gespeichert');
		flushSync();
		vi.advanceTimersByTime(2000);
		flushSync();
		expect(region.textContent).not.toContain('Mieter gespeichert');

		navigating.set(null);
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();
		expect(status()).toBe(region);
		expect(region.textContent).toContain('Mieter gespeichert');
	});

	it('zeigt Erfolge lange genug zum Lesen, Fehler bis sie geschlossen werden', () => {
		vi.useFakeTimers();
		toasts.set([]);
		show(ToastRegion, {});
		addToast('success', 'Mieter gespeichert');
		addToast('error', 'Speichern fehlgeschlagen');
		flushSync();
		vi.advanceTimersByTime(7000);
		flushSync();
		expect(document.body.textContent).toContain('Mieter gespeichert');

		vi.advanceTimersByTime(60_000);
		flushSync();
		expect(document.body.textContent).not.toContain('Mieter gespeichert');
		expect(byTestId('toast-error')!.textContent).toContain('Speichern fehlgeschlagen');
	});

	// #1096: two confirmations on top of each other covered half the page at 200 % (Helga P-3 in #1081)
	it('ersetzt eine Erfolgsmeldung durch die neue und lässt Fehler stehen', () => {
		vi.useFakeTimers();
		toasts.set([]);
		show(ToastRegion, {});
		addToast('error', 'Speichern fehlgeschlagen');
		addToast('success', 'Kategorie «Lift» gespeichert');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();
		addToast('success', 'Kategorie «Lift» gelöscht');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();

		expect(allByTestId('toast-success').map((toast) => toast.textContent!.trim())).toEqual([
			'Kategorie «Lift» gelöscht'
		]);
		expect(byTestId('toast-error')!.textContent).toContain('Speichern fehlgeschlagen');
	});

	// #1096: the page never moves; the confirmation stands at the top while the focus is where it would stand
	// fallback review on #1114: scrolling while the confirmation shows can bring the focused part under it
	it('stellt die Erfolgsmeldung neu hin, wenn der Fokus beim Scrollen oder einer neuen Fenstergrösse wandert', () => {
		vi.useFakeTimers();
		toasts.set([]);
		const part = document.body.appendChild(document.createElement('button'));
		let top = 100;
		part.getBoundingClientRect = () => ({ top, bottom: top + 20, left: 0, right: 100 }) as DOMRect;
		show(ToastRegion, {});
		const region = document.querySelector<HTMLElement>('[data-toast-region]')!;
		part.focus();
		addToast('success', 'Adresse kopiert');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();
		expect(region.className).toContain('bottom-4');

		top = 740;
		window.dispatchEvent(new Event('scroll'));
		flushSync();
		expect(region.className).toContain('top-4');

		top = 100; // code review 1096-6 C-1: a resize places it again too
		window.dispatchEvent(new Event('resize'));
		flushSync();
		expect(region.className).toContain('bottom-4');
		part.remove();
	});

	it('stellt die Erfolgsmeldung oben hin, sobald der Fokus unten steht, auch auf ihrem Schliessen-Knopf', () => {
		vi.useFakeTimers();
		toasts.set([]);
		const bottom = document.body.appendChild(document.createElement('button'));
		bottom.getBoundingClientRect = () =>
			({ top: 740, bottom: 760, left: 0, right: 100 }) as DOMRect;
		show(ToastRegion, {});
		const region = document.querySelector<HTMLElement>('[data-toast-region]')!;
		addToast('success', 'Adresse kopiert');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();
		expect(region.className).toContain('bottom-4');

		bottom.focus();
		flushSync();
		expect(region.className).toContain('top-4');

		region.querySelector<HTMLElement>('[aria-label="Meldung schliessen"]')!.focus();
		flushSync();
		expect(region.className).toContain('top-4');
		bottom.remove();
	});

	// #1113 (Marco P-1 in #1096): it covered «Löschen» of the row whose name had the focus
	it('stellt die Erfolgsmeldung oben hin, wenn die Zeile mit dem Fokus unten steht', () => {
		vi.useFakeTimers();
		toasts.set([]);
		const row = document.body.appendChild(document.createElement('li'));
		row.getBoundingClientRect = () => ({ top: 650, bottom: 760, left: 0, right: 390 }) as DOMRect;
		const name = row.appendChild(document.createElement('a'));
		name.href = '/config/categories/1';
		name.getBoundingClientRect = () => ({ top: 650, bottom: 680, left: 0, right: 200 }) as DOMRect;
		show(ToastRegion, {});
		const region = document.querySelector<HTMLElement>('[data-toast-region]')!;
		name.focus();
		addToast('success', 'Kategorie «Lift» gelöscht');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();

		expect(region.className).toContain('top-4');
		row.remove();
	});

	// code review 1113 C-1 (Helga P-2 in #1096): the buttons of a new access key form a group, not a row
	it('stellt die Erfolgsmeldung oben hin, wenn die Knopfgruppe mit dem Fokus unten steht', () => {
		vi.useFakeTimers();
		toasts.set([]);
		const group = document.body.appendChild(document.createElement('div'));
		group.dataset.focusRow = '';
		group.getBoundingClientRect = () => ({ top: 650, bottom: 760, left: 0, right: 390 }) as DOMRect;
		const copy = group.appendChild(document.createElement('button'));
		copy.getBoundingClientRect = () => ({ top: 650, bottom: 698, left: 0, right: 200 }) as DOMRect;
		show(ToastRegion, {});
		const region = document.querySelector<HTMLElement>('[data-toast-region]')!;
		copy.focus();
		addToast('success', 'Die Adresse ist kopiert.');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();

		expect(region.className).toContain('top-4');
		group.remove();
	});

	// code review 1113 C-2: at 200 % a card can be taller than the window; at the top it would cover the focus
	it('lässt die Erfolgsmeldung unten, wenn sie oben das Element mit dem Fokus einer hohen Zeile verdeckte', () => {
		vi.useFakeTimers();
		toasts.set([]);
		const row = document.body.appendChild(document.createElement('li'));
		row.getBoundingClientRect = () => ({ top: 0, bottom: 900, left: 0, right: 390 }) as DOMRect;
		const name = row.appendChild(document.createElement('a'));
		name.href = '/buildings/1';
		name.getBoundingClientRect = () => ({ top: 20, bottom: 68, left: 0, right: 200 }) as DOMRect;
		show(ToastRegion, {});
		const region = document.querySelector<HTMLElement>('[data-toast-region]')!;
		name.focus();
		addToast('success', 'Gebäude gespeichert');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();

		expect(region.className).toContain('bottom-4');
		row.remove();
	});

	// fallback review on #1125: at the top on the right it does not cover a focused link on the left of a tall row
	it('stellt die Erfolgsmeldung oben hin, wenn sie dort neben dem Element mit dem Fokus einer hohen Zeile steht', () => {
		vi.useFakeTimers();
		toasts.set([]);
		const row = document.body.appendChild(document.createElement('li'));
		row.getBoundingClientRect = () => ({ top: 0, bottom: 900, left: 0, right: 1440 }) as DOMRect;
		const name = row.appendChild(document.createElement('a'));
		name.href = '/buildings/1';
		name.getBoundingClientRect = () => ({ top: 20, bottom: 68, left: 0, right: 400 }) as DOMRect;
		show(ToastRegion, {});
		const region = document.querySelector<HTMLElement>('[data-toast-region]')!;
		region.getBoundingClientRect = () =>
			({ top: 0, bottom: 80, height: 80, left: 1000, right: 1424 }) as DOMRect;
		name.focus();
		addToast('success', 'Gebäude gespeichert');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();

		expect(region.className).toContain('top-4');
		row.remove();
	});

	// The reading time starts when the confirmation appears, not while the next page loads
	it('zählt die Lesezeit erst ab dem Erscheinen der Meldung', () => {
		vi.useFakeTimers();
		toasts.set([]);
		show(ToastRegion, {});
		navigating.set({});
		addToast('success', 'Mieter gespeichert');
		flushSync();
		vi.advanceTimersByTime(6000);
		navigating.set(null);
		flushSync();
		vi.advanceTimersByTime(500); // shown now
		flushSync();
		vi.advanceTimersByTime(7000);
		flushSync();
		expect(status().textContent).toContain('Mieter gespeichert');

		vi.advanceTimersByTime(1000);
		flushSync();
		expect(status().textContent).not.toContain('Mieter gespeichert');
	});

	it('setzt den Fokus auf den Seitentitel, wenn er nach der Aktion verloren ist', () => {
		vi.useFakeTimers();
		toasts.set([]);
		document.body.insertAdjacentHTML('beforeend', '<h1 tabindex="-1">Kategorien</h1>');
		show(ToastRegion, {});
		addToast('success', 'Kategorie «Lift» gelöscht');
		flushSync();
		vi.advanceTimersByTime(1000);
		flushSync();
		expect(document.activeElement!.textContent).toBe('Kategorien');
	});

	it('liest Fehler sofort vor', () => {
		toasts.set([]);
		show(ToastRegion, {});
		addToast('error', 'Speichern fehlgeschlagen');
		flushSync();
		expect(byTestId('toast-error')!.getAttribute('role')).toBe('alert');
		expect(byTestId('toast-error')!.closest('[aria-live], [role="status"]')).toBeNull(); // announced once, by its own role
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

	it('trennt einen langen Titel auf schmalen Bildschirmen, statt die Seite zu verbreitern', () => {
		show(PageHeader, { title: 'Nebenkostenabrechnungen' });
		const heading = document.querySelector('h1')!;
		expect(heading.className).toMatch(/(^| )break-words( |$)/);
		expect(heading.className).toMatch(/(^| )hyphens-auto( |$)/);
	});

	it('lässt die Aktionen unter den Titel umbrechen, statt den Titel zusammenzudrücken', () => {
		show(PageHeader, {
			title: 'Anna Keller',
			action: markup('<a href="/a">Bearbeiten</a><a href="/b">Löschen</a><a href="/c">PDF</a>')
		});
		const titleColumn = document.querySelector('h1')!.parentElement!;
		const row = titleColumn.parentElement!;
		const actions = row.lastElementChild!;
		const classes = (element: Element) => element.className.split(/\s+/);
		expect(classes(row)).toContain('md:flex-wrap');
		// the title keeps a usable width (18rem) and only the actions give way
		expect(classes(titleColumn)).toEqual(expect.arrayContaining(['md:grow', 'md:basis-72']));
		expect(classes(actions)).toContain('flex-wrap');
		expect(classes(actions)).not.toContain('shrink-0');
	});

	it('gibt den Brotkrümel-Links eine Trefferfläche von 48 px', () => {
		show(PageHeader, { title: 'Anna Keller', trail: [{ href: '/tenants', label: 'Mieter' }] });
		expect(byTestId('breadcrumb-link')!.className.split(/\s+/)).toContain('min-h-12');
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
