import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';

let url = new URL('http://localhost/apartments');
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => readable({ url }).subscribe(run) }
}));

import { goto } from '$app/navigation';
import ApartmentsPage from '../routes/apartments/+page.svelte';
import { byTestId, click, fireEvent, show } from './helpers/dom';

const text = () => document.body.textContent?.replace(/\s+/g, ' ') ?? '';
const apartment = (overrides: Record<string, unknown> = {}) => ({
	id: 'a1',
	buildingId: 'b1',
	number: '2.01',
	floor: 2,
	area: '70.00',
	rooms: '3.5',
	status: 'vacant',
	buildingName: 'Ahornhof',
	buildingAddress: 'Ahornweg 1',
	buildingCity: 'Winterthur',
	nextContractStart: null,
	...overrides
});
const list = (apartments: ReturnType<typeof apartment>[], total = apartments.length) =>
	show(ApartmentsPage, {
		data: {
			apartments,
			total,
			page: 1,
			pageSize: 12,
			buildings: [{ id: 'b1', name: 'Ahornhof', address: 'Ahornweg 1' }]
		}
	} as never);

beforeEach(() => {
	url = new URL('http://localhost/apartments');
	vi.mocked(goto).mockClear();
});

describe('Wohnungsliste', () => {
	it('nennt Seite, Anzahl und den einen Hauptschritt', () => {
		list([apartment()]);
		expect(document.querySelector('h1')!.textContent).toBe('Wohnungen');
		expect(text()).toContain('1 Wohnung in Ihren Gebäuden');
		const add = byTestId('apartments-new-button')!;
		expect(add.getAttribute('href')).toBe('/apartments/new');
		expect(add.textContent).toContain('Wohnung erfassen');
	});

	it('macht die ganze Karte zum Link mit der Wohnung als Linktext', () => {
		list([apartment()]);
		const card = byTestId('apartment-card-a1')!;
		const links = card.querySelectorAll('a');
		expect(links).toHaveLength(1);
		expect(links[0].textContent!.trim()).toBe('Wohnung 2.01');
		expect(links[0].getAttribute('href')).toBe('/apartments/a1');
		expect(card.textContent).toContain('Ahornhof');
		expect(card.textContent).toContain('2. OG');
		expect(card.textContent).toContain('3.5 Zimmer');
		expect(card.textContent).toContain('70 m²');
		expect(card.textContent).not.toContain('·');
	});

	it('zeigt den Mietstatus als Wort, bei Wiedervermietung mit dem Einzugstag', () => {
		list([
			apartment(),
			apartment({ id: 'a2', number: '2.02', status: 'relet', nextContractStart: '2099-11-01' })
		]);
		const status = (id: string) =>
			byTestId(`apartment-card-${id}`)!
				.querySelector('[data-testid="apartment-status"]')!
				.textContent!.trim();
		expect(status('a1')).toBe('Leer');
		expect(status('a2')).toBe('Vermietet ab 1.11.2099');
	});

	it('erklärt die vier Mietstatus', () => {
		list([apartment()]);
		const legend = byTestId('apartment-status-legend')!.textContent!;
		for (const words of [
			'Leer',
			'Vermietet',
			'Wiedervermietet',
			'Gesperrt',
			'Ein künftiger Mietvertrag ist abgeschlossen.'
		]) {
			expect(legend).toContain(words);
		}
	});

	it('sucht mit dem gewählten Gebäude und Mietstatus', () => {
		list([apartment()]);
		const building = byTestId<HTMLSelectElement>('apartments-building-filter')!;
		expect(document.querySelector(`label[for="${building.id}"]`)!.textContent).toContain('Gebäude');
		fireEvent(building, 'change', 'b1');
		fireEvent(byTestId<HTMLSelectElement>('apartments-status-filter')!, 'change', 'vacant');
		click('apartments-search-submit');
		expect(goto).toHaveBeenCalledWith('/apartments?building=b1&status=vacant&page=1');
	});

	it('bietet ohne Wohnungen die erste Erfassung an', () => {
		list([]);
		const empty = byTestId('apartments-empty')!;
		expect(empty.textContent).toContain('Noch keine Wohnungen');
		expect(empty.querySelector('a')!.getAttribute('href')).toBe('/apartments/new');
	});

	it('bietet ohne Treffer an, die Filter zurückzusetzen', () => {
		url = new URL('http://localhost/apartments?building=b1');
		list([]);
		const empty = byTestId('apartments-empty')!;
		expect(empty.textContent).toContain('Keine Wohnungen gefunden');
		const reset = empty.querySelector('a')!;
		expect(reset.textContent).toContain('Filter zurücksetzen');
		expect(reset.getAttribute('href')).toBe('/apartments');
	});

	it('blättert mit den Filtern zur nächsten Seite', () => {
		url = new URL('http://localhost/apartments?building=b1');
		list([apartment()], 30);
		expect(byTestId('pagination-next')!.getAttribute('href')).toBe(
			'/apartments?building=b1&page=2'
		);
	});
});
