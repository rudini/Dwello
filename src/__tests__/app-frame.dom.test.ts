import { describe, it, expect, vi } from 'vitest';
import { readable } from 'svelte/store';
import Icon from '$lib/components/Icon.svelte';
import Navigation from '$lib/components/Navigation.svelte';
import { navGroups } from '$lib/navigation';
import { show } from './helpers/dom';

vi.mock('$app/stores', () => ({
	page: readable({ url: new URL('http://localhost/tenants/42') })
}));

describe('Icon', () => {
	it('versteckt den Ligatur-Namen des Symbols vor Screenreadern', () => {
		show(Icon, { name: 'add' });
		expect(document.querySelector('.material-symbols-outlined')?.getAttribute('aria-hidden')).toBe(
			'true'
		);
	});
});

describe('Hauptnavigation', () => {
	it('gruppiert die Bereiche nach Arbeitsablauf', () => {
		expect(navGroups.map((group) => group.label)).toEqual([
			'',
			'Liegenschaften',
			'Nebenkosten',
			'System'
		]);
		expect(navGroups.flatMap((group) => group.items.map((item) => item.href))).toEqual([
			'/dashboard',
			'/buildings',
			'/apartments',
			'/tenants',
			'/contracts',
			'/invoices',
			'/statements',
			'/documents',
			'/config',
			'/help'
		]);
	});

	it('markiert nur den Bereich der aktuellen Seite als aktiv', () => {
		show(Navigation, {});
		const active = [...document.querySelectorAll('a[aria-current="page"]')];
		expect(active.map((link) => link.getAttribute('href'))).toEqual(['/tenants']);
	});
});
