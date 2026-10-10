import { describe, expect, it } from 'vitest';
import Pager from '$lib/ui/Pager.svelte';
import { show } from './helpers/dom';

const href = (page: number) => `/tenants?page=${page}`;
const links = () =>
	[...document.querySelectorAll('nav a')].map((a) => [
		a.textContent!.trim(),
		a.getAttribute('href')
	]);

describe('Seitenwechsel', () => {
	it('nennt die Seite und führt zur vorherigen und zur nächsten', () => {
		show(Pager, { page: 2, pageSize: 12, total: 30, href });
		expect(document.querySelector('nav')!.getAttribute('aria-label')).toBe('Seiten');
		expect(document.querySelector('nav')!.textContent).toContain('Seite 2 von 3');
		expect(links()).toEqual([
			['Vorherige Seite', '/tenants?page=1'],
			['Nächste Seite', '/tenants?page=3']
		]);
	});

	it('bietet auf der ersten Seite nur die nächste an', () => {
		show(Pager, { page: 1, pageSize: 12, total: 30, href });
		expect(links()).toEqual([['Nächste Seite', '/tenants?page=2']]);
	});

	it('fehlt, wenn alles auf eine Seite passt', () => {
		show(Pager, { page: 1, pageSize: 12, total: 12, href });
		expect(document.querySelector('nav')).toBeNull();
	});
});
