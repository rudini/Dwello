import { describe, it, expect, vi } from 'vitest';
import { readable } from 'svelte/store';
import Navigation from '$lib/ui/Navigation.svelte';
import { activeHref, navGroups } from '$lib/navigation';
import { show } from './helpers/dom';

vi.mock('$app/stores', () => ({
	page: readable({ url: new URL('http://localhost/config/heating-profiles/42/edit') })
}));

describe('Hauptnavigation', () => {
	it('gruppiert die Bereiche nach Arbeitsablauf, in einer Ebene', () => {
		expect(navGroups.map((group) => group.label)).toEqual([
			'',
			'Verwalten',
			'Nebenkosten',
			'Einstellungen und Hilfe'
		]);
		expect(
			navGroups.flatMap((group) => group.items.map((item) => [item.label, item.href]))
		).toEqual([
			['Übersicht', '/dashboard'],
			['Gebäude', '/buildings'],
			['Wohnungen', '/apartments'],
			['Mieter', '/tenants'],
			['Mietverträge', '/contracts'],
			['Rechnungen', '/invoices'],
			['Nebenkostenabrechnungen', '/statements'],
			['Dokumente', '/documents'],
			['Einstellungen', '/config'],
			['Kategorien', '/config/categories'],
			['Verteilschlüssel', '/config/distribution-keys'],
			['Heizprofile', '/config/heating-profiles'],
			['Hilfe', '/help']
		]);
	});

	it('wählt den genauesten Bereich der Seite', () => {
		expect(activeHref('/')).toBe('/dashboard');
		expect(activeHref('/config')).toBe('/config');
		expect(activeHref('/config/categories/new')).toBe('/config/categories');
		expect(activeHref('/statements/generate')).toBe('/statements');
		expect(activeHref('/buildingsX')).toBeUndefined();
	});

	it('markiert nur diesen Bereich als aktuelle Seite', () => {
		show(Navigation, {});
		const active = [...document.querySelectorAll('a[aria-current="page"]')];
		expect(active.map((link) => link.getAttribute('href'))).toEqual(['/config/heating-profiles']);
	});
});
