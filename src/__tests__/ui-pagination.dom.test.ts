import { describe, expect, it } from 'vitest';
import Pagination from '$lib/ui/Pagination.svelte';
import { byTestId, show } from './helpers/dom';

const url = new URL('http://localhost/apartments?building=b1&page=2');

describe('Seitenwechsel', () => {
	it('nennt die Seite und führt mit den Filtern zur vorherigen und nächsten', () => {
		show(Pagination, { url, page: 2, pageSize: 10, total: 25 });
		const nav = document.querySelector('nav')!;
		expect(nav.getAttribute('aria-label')).toBe('Seiten');
		expect(nav.textContent).toContain('Seite 2 von 3');
		expect(byTestId('pagination-prev')!.getAttribute('href')).toBe(
			'/apartments?building=b1&page=1'
		);
		expect(byTestId('pagination-next')!.getAttribute('href')).toBe(
			'/apartments?building=b1&page=3'
		);
	});

	it('bietet am Anfang und am Ende nur die mögliche Richtung an', () => {
		show(Pagination, { url, page: 1, pageSize: 10, total: 25 });
		expect(byTestId('pagination-prev')).toBeNull();
		expect(byTestId('pagination-next')).not.toBeNull();
	});

	it('zeigt nichts, wenn alles auf eine Seite passt', () => {
		show(Pagination, { url, page: 1, pageSize: 10, total: 10 });
		expect(document.querySelector('nav')).toBeNull();
	});
});
