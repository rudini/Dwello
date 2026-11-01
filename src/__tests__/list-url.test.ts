import { describe, it, expect } from 'vitest';
import { isListNavigation, listPageUrl, listSearchUrl } from '../lib/list-url';

describe('listSearchUrl', () => {
	it('keeps only filled filters and starts at page 1', () => {
		expect(listSearchUrl('/contracts', { search: 'Keller', building: '', status: 'ended' })).toBe(
			'/contracts?search=Keller&status=ended&page=1'
		);
	});

	it('opens the first page without filters', () => {
		expect(listSearchUrl('/tenants', { search: '', status: '' })).toBe('/tenants?page=1');
	});
});

describe('listPageUrl', () => {
	it('changes the page and keeps the filters', () => {
		expect(listPageUrl(new URL('http://localhost/invoices?buildingId=b1&page=1'), 3)).toBe(
			'/invoices?buildingId=b1&page=3'
		);
	});
});

describe('Suche in einer Liste', () => {
	const nav = (type: string, from: string | null, to: string) => ({
		type,
		from: from ? { url: new URL(from, 'http://localhost') } : null,
		to: { url: new URL(to, 'http://localhost') }
	});

	it('erkennt das Absenden der Filter, auch mit unveränderten Filtern', () => {
		expect(isListNavigation(nav('form', '/contracts', '/contracts?status=future'))).toBe(true);
		expect(
			isListNavigation(nav('form', '/contracts?status=future', '/contracts?status=future'))
		).toBe(true);
		expect(isListNavigation(nav('goto', '/invoices', '/invoices?search=Hauswart&page=1'))).toBe(
			true
		);
		expect(isListNavigation(nav('goto', '/apartments?status=vacant&page=1', '/apartments'))).toBe(
			true
		);
	});

	// #681: a page of the list, the reset link of an empty list, the browser's back and forward buttons
	it('erkennt jede andere Bewegung innerhalb der Liste', () => {
		expect(isListNavigation(nav('link', '/contracts', '/contracts?page=2'))).toBe(true);
		expect(isListNavigation(nav('link', '/apartments?search=x&page=1', '/apartments'))).toBe(true);
		expect(isListNavigation(nav('popstate', '/apartments', '/apartments?search=x&page=1'))).toBe(
			true
		);
	});

	it('lässt den Fokus beim ersten Laden und bei anderen Seiten', () => {
		expect(isListNavigation(nav('link', '/contracts/c1', '/contracts'))).toBe(false);
		expect(isListNavigation(nav('enter', null, '/contracts?status=future'))).toBe(false);
		expect(isListNavigation(nav('goto', '/invoices/i1', '/invoices'))).toBe(false);
		// a form action that leads back to its own page, e.g. after deleting
		expect(isListNavigation(nav('goto', '/config/categories', '/config/categories'))).toBe(false);
	});
});
