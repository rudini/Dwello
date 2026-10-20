import { describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import type { Writable } from 'svelte/store';

// The address changes while the list stays mounted, as after a link, back or forward within the list
vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn(), invalidateAll: vi.fn() }));
vi.mock('$app/stores', async () => {
	const { writable } = await import('svelte/store');
	return { page: writable({ url: new URL('http://localhost/') }) };
});

import ApartmentsPage from '../routes/apartments/+page.svelte';
import BuildingsPage from '../routes/buildings/+page.svelte';
import TenantsPage from '../routes/tenants/+page.svelte';
import ContractsPage from '../routes/contracts/+page.svelte';
import InvoicesPage from '../routes/invoices/+page.svelte';
import { page } from '$app/stores';
import { byTestId, fireEvent, show } from './helpers/dom';

const empty = { total: 0, page: 1, pageSize: 10, buildings: [], categories: [], years: [] };
const lists = [
	{
		path: '/apartments',
		page: ApartmentsPage,
		data: { apartments: [] },
		search: 'apartments-search-input'
	},
	{
		path: '/buildings',
		page: BuildingsPage,
		data: { buildings: [] },
		search: 'building-search-input'
	},
	{ path: '/tenants', page: TenantsPage, data: { tenants: [] }, search: 'tenants-search-input' },
	{
		path: '/contracts',
		page: ContractsPage,
		data: { contracts: [], apartments: [], today: '2026-10-15' },
		search: 'contract-search-input'
	},
	{ path: '/invoices', page: InvoicesPage, data: { invoices: [] }, search: 'invoice-search-input' }
];

const goTo = (address: string) => {
	(page as unknown as Writable<{ url: URL }>).set({ url: new URL(address, 'http://localhost') });
	flushSync();
};
const valueOf = (testid: string) => byTestId<HTMLInputElement>(testid)!.value;

// B-16 (#159): the filter form shows the filters of the list shown, not those of an earlier one
describe.each(lists)('Filter der Liste $path', (list) => {
	it('ist leer, wenn die ungefilterte Liste wieder gezeigt wird', () => {
		goTo(`${list.path}?search=Ahorn`);
		show(list.page as never, { data: { ...empty, ...list.data } });
		fireEvent(byTestId<HTMLInputElement>(list.search)!, 'input', 'Ahornh');

		goTo(list.path);

		expect(valueOf(list.search)).toBe('');
	});

	// O-41 (PR #514): the page store also reports changes without a new address (e.g. new data); a term typed
	// meanwhile stayed in the field only on some lists, on the others «Suchen» searched for nothing
	it('behält die Eingabe, wenn sich die Seite ohne neue Adresse ändert', () => {
		goTo(list.path);
		show(list.page as never, { data: { ...empty, ...list.data } });
		fireEvent(byTestId<HTMLInputElement>(list.search)!, 'input', 'Gibt es nicht');

		goTo(list.path);

		expect(valueOf(list.search)).toBe('Gibt es nicht');
	});

	it('zeigt nach «Zurück» die Suche der früheren Liste', () => {
		goTo(`${list.path}?search=Linde`);
		show(list.page as never, { data: { ...empty, ...list.data } });

		goTo(`${list.path}?search=Ahorn`);

		expect(valueOf(list.search)).toBe('Ahorn');
	});
});

describe('Filter der Wohnungsliste', () => {
	it('zeigt nach «Filter zurücksetzen» wieder alle Status', () => {
		goTo('/apartments?status=reserved');
		show(ApartmentsPage, { data: { ...empty, apartments: [] } } as never);

		goTo('/apartments');

		expect(byTestId<HTMLSelectElement>('apartments-status-filter')!.value).toBe('');
	});
});
