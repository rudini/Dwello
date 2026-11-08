import { describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import type { Writable } from 'svelte/store';

// The address changes while the list stays mounted, as after a link, back or forward within the list
vi.mock('$app/environment', () => ({ browser: true }));
// #680: the lists' callbacks after a navigation, called by the tests
const navigated = vi.hoisted(() => [] as ((navigation: { type: string }) => void)[]);
vi.mock('$app/navigation', () => ({
	goto: vi.fn(),
	invalidateAll: vi.fn(),
	afterNavigate: (callback: (navigation: { type: string }) => void) => navigated.push(callback)
}));
vi.mock('$app/stores', async () => {
	const { writable } = await import('svelte/store');
	return { page: writable({ url: new URL('http://localhost/') }) };
});

import ApartmentsPage from '../routes/apartments/+page.svelte';
import BuildingsPage from '../routes/buildings/+page.svelte';
import TenantsPage from '../routes/tenants/+page.svelte';
import ContractsPage from '../routes/contracts/+page.svelte';
import InvoicesPage from '../routes/invoices/+page.svelte';
import StatementsPage from '../routes/statements/+page.svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
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

// #682 (Sven): the same search and filters on every list
const statusCounts = { draft: 0, sent: 0, paid: 0, settled: 0, overdue: 0 };
const statements = {
	path: '/statements',
	page: StatementsPage,
	data: { statements: [], statusCounts, scope: null },
	search: 'statement-search-input'
};
describe.each([...lists, statements])('Suche und Filter der Liste $path', (list) => {
	const form = () => byTestId(list.search)!.closest('form')!;
	const resets = (within: Element) =>
		[...within.querySelectorAll('a, button')].filter(
			(control) => control.textContent!.trim() === 'Filter zurücksetzen'
		);
	const open = (address: string) => {
		goTo(address);
		show(list.page as never, { data: { ...empty, ...list.data } });
	};

	it('ist eine Suche namens «Suche und Filter» in einem Rahmen', () => {
		open(list.path);

		expect(form().getAttribute('role')).toBe('search');
		expect(form().getAttribute('aria-label')).toBe('Suche und Filter');
		expect(form().classList).toContain('rounded-panel');
	});

	// a filter is never required: no «(optional)», and not announced as required either
	it('nennt kein Feld optional und keines als Pflichtfeld', () => {
		open(list.path);

		expect(form().textContent).not.toContain('(optional)');
		expect(form().querySelectorAll('[aria-required="true"]')).toHaveLength(0);
	});

	it('bietet ohne Treffer nur im Hinweis an, die Filter zurückzusetzen', () => {
		open(`${list.path}?search=Gibt+es+nicht`);

		expect(resets(form())).toHaveLength(0);
		expect(resets(document.body)).toHaveLength(1);
	});
});

// #754: a search sent before the router is ready (Firefox on CI) was lost; as a plain GET form the browser sends it itself
describe('Suche der Gebäudeliste', () => {
	it('schickt Suche und Ort als Adresse der Liste, auch ohne die Navigation der App', () => {
		goTo('/buildings');
		show(BuildingsPage, { data: { ...empty, buildings: [] } } as never);
		const form = byTestId('building-search-input')!.closest('form')!;

		expect([form.method, new URL(form.action).pathname]).toEqual(['get', '/buildings']);
		expect(byTestId<HTMLInputElement>('building-search-input')!.name).toBe('search');
		expect(byTestId<HTMLInputElement>('building-city-filter')!.name).toBe('city');
	});
});

// persona Sven S-4 (#662): a year without invoices is reached with one choice now, and the way back is the same
describe('Rechnungsliste eines Jahres ohne Rechnungen', () => {
	it('bietet im Hinweis an, die Filter zurückzusetzen', () => {
		goTo('/invoices?year=2024');
		show(InvoicesPage, { data: { ...empty, invoices: [], years: ['2024'] } } as never);

		const reset = [...document.querySelectorAll('a')].filter(
			(link) => link.textContent!.trim() === 'Filter zurücksetzen'
		);
		expect(reset.map((link) => link.getAttribute('href'))).toEqual(['/invoices']);
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

// #662: a filter's choice applies at once with the other choices and the search already made; the focus stays in the filter,
// and each choice replaces the address, so «Zurück» leads to the page before the filtering (persona Sven S-2)
describe.each([
	{ list: lists[0], select: 'apartments-status-filter', choice: 'status=vacant' },
	{ list: lists[2], select: 'tenants-status-filter', choice: 'status=future' },
	{ list: lists[3], select: 'contract-status-filter', choice: 'status=ended' },
	{ list: lists[4], select: 'invoice-validity-filter', choice: 'validity=invalid' },
	{
		list: {
			...statements,
			data: { ...statements.data, buildings: [{ id: 'b1', name: 'Ahornhof' }] }
		},
		select: 'statement-building-filter',
		choice: 'building=b1'
	}
])('Wahl im Filter der Liste $list.path', ({ list, select, choice }) => {
	// #662 (product owner after persona Helga H-1): a text not searched yet is not sent and gives way to the search
	it('zeigt die Liste sofort mit der Wahl und der gesuchten Suche, ohne «Suchen»', () => {
		history.replaceState(null, '', `${list.path}?search=Linde`);
		goTo(`${list.path}?search=Linde`);
		show(list.page as never, { data: { ...empty, ...list.data } });
		fireEvent(byTestId<HTMLInputElement>(list.search)!, 'input', 'Huber');
		vi.mocked(goto).mockClear();

		fireEvent(byTestId<HTMLSelectElement>(select)!, 'change', choice.split('=')[1]);

		expect(goto).toHaveBeenCalledWith(`${list.path}?search=Linde&${choice}`, {
			keepFocus: true,
			noScroll: true,
			replaceState: true
		});
		expect(valueOf(list.search)).toBe('Linde');
	});

	// persona Helga H-2: a choice made without focusing the select (a mouse in some browsers) must not let the
	// layout move the focus to the result, which scrolled the filters out of view
	it('gibt dem Filter den Fokus, auch wenn er ihn bei der Wahl nicht hatte', () => {
		goTo(list.path);
		show(list.page as never, { data: { ...empty, ...list.data } });
		(document.activeElement as HTMLElement | null)?.blur();

		fireEvent(byTestId<HTMLSelectElement>(select)!, 'change', choice.split('=')[1]);

		expect(document.activeElement).toBe(byTestId(select));
	});

	// a new form for the new address would take the focus away from the filter (#677)
	it('behält den Filter mit dem Fokus, wenn die Liste die Wahl zeigt', () => {
		goTo(list.path);
		show(list.page as never, { data: { ...empty, ...list.data } });
		const filter = byTestId<HTMLSelectElement>(select)!;

		goTo(`${list.path}?${choice}`);

		expect(byTestId(select)).toBe(filter);
	});

	// without the app's navigation «Suchen» sends the form itself
	it('gibt jedem Feld einen Namen in der Adresse', () => {
		goTo(list.path);
		show(list.page as never, { data: { ...empty, ...list.data } });
		const fields = [...byTestId(list.search)!.closest('form')!.querySelectorAll('input, select')];

		expect(fields.filter((field) => !field.getAttribute('name'))).toEqual([]);
	});
});

// #680 (product owner): the form shows exactly the filter the list applies; a text typed but not searched is dropped
describe.each([...lists, statements])('Suche der Liste $path nach einer Navigation', (list) => {
	const typeUnsent = () => {
		navigated.length = 0;
		history.replaceState(null, '', `${list.path}?search=Ahorn`);
		goTo(`${list.path}?search=Ahorn`);
		show(list.page as never, { data: { ...empty, ...list.data } });
		fireEvent(byTestId<HTMLInputElement>(list.search)!, 'input', 'Gibt es nicht');
	};

	it('zeigt nach einer Navigation zur selben Adresse die angewandte Suche', () => {
		typeUnsent();

		for (const callback of navigated) callback({ type: 'link' });
		flushSync();

		expect(valueOf(list.search)).toBe('Ahorn');
	});

	// #754: the first view keeps what was typed before the app reacted; a reload or back and forward restored it
	it.each([
		['navigate', 'Gibt es nicht'],
		['reload', 'Ahorn'],
		['back_forward', 'Ahorn']
	])('zeigt beim ersten Aufbau nach «%s» die Suche %s', (kind, shown) => {
		typeUnsent();
		// jsdom has no navigation timing: the browser's entry of this page load
		Object.defineProperty(performance, 'getEntriesByType', {
			value: () => [{ type: kind }],
			configurable: true
		});

		for (const callback of navigated) callback({ type: 'enter' });
		flushSync();
		Reflect.deleteProperty(performance, 'getEntriesByType');

		expect(valueOf(list.search)).toBe(shown);
	});

	it('zeigt die angewandte Suche, wenn der Browser die Seite wieder zeigt', () => {
		typeUnsent();

		window.dispatchEvent(Object.assign(new Event('pageshow'), { persisted: true }));
		flushSync();

		expect(valueOf(list.search)).toBe('Ahorn');
	});
});
