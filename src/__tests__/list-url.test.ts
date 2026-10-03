import { describe, it, expect } from 'vitest';
import { listPageUrl, listSearchUrl } from '../lib/list-url';

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
