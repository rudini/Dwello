import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';

let url = new URL('http://localhost/buildings');
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => readable({ url }).subscribe(run) }
}));

import { goto } from '$app/navigation';
import BuildingsPage from '../routes/buildings/+page.svelte';
import { byTestId, click, fireEvent, show } from './helpers/dom';

const text = () => document.body.textContent?.replace(/\s+/g, ' ') ?? '';
const building = (overrides: Record<string, unknown> = {}) => ({
	id: 'b1',
	name: 'Lindenhof',
	address: 'Testweg 1',
	postalCode: '8400',
	city: 'Winterthur',
	canton: 'ZH',
	buildingType: 'Mehrfamilienhaus',
	yearBuilt: 1985,
	apartmentCount: 4,
	occupiedCount: 3,
	vacantCount: 1,
	...overrides
});
const list = (buildings: ReturnType<typeof building>[], total = buildings.length) =>
	show(BuildingsPage, { data: { buildings, total, page: 1, pageSize: 10 } } as never);

beforeEach(() => {
	url = new URL('http://localhost/buildings');
	vi.mocked(goto).mockClear();
});

describe('Gebäudeliste', () => {
	it('nennt Seite, Anzahl und den einen Hauptschritt', () => {
		list([building()]);
		expect(document.querySelector('h1')!.textContent).toBe('Gebäude');
		expect(text()).toContain('1 Gebäude in Ihrer Verwaltung');
		const add = byTestId('building-new-button')!;
		expect(add.getAttribute('href')).toBe('/buildings/new');
		expect(add.textContent).toContain('Gebäude erfassen');
	});

	it('macht die ganze Karte zum Link mit dem Namen als Linktext', () => {
		list([building()]);
		const card = byTestId('building-card-b1')!;
		const open = card.querySelector('h2 a')!;
		expect(open.textContent!.trim()).toBe('Lindenhof');
		expect(open.getAttribute('href')).toBe('/buildings/b1');
		const words = card.textContent!.replace(/\s+/g, ' ');
		expect(words).toContain('Testweg 1, 8400 Winterthur');
		expect(words).toContain('4 Wohnungen');
		expect(words).toContain('3 vermietet');
		expect(words).toContain('1 leer');
		expect(words).toContain('Baujahr 1985');
		expect(words).not.toContain('3/4');
	});

	it('plant die Route in Google Maps mit sichtbarer Beschriftung', () => {
		list([building()]);
		const route = byTestId('building-card-b1')!.querySelector<HTMLAnchorElement>(
			'[data-testid="building-route-link"]'
		)!;
		expect(route.textContent).toContain('Route planen');
		expect(route.getAttribute('target')).toBe('_blank');
		expect(route.getAttribute('href')).toBe(
			`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent('Testweg 1, 8400 Winterthur, Switzerland')}`
		);
	});

	it('sucht nach Name und Ort', () => {
		list([building()]);
		fireEvent(byTestId<HTMLInputElement>('building-search-input')!, 'input', 'Linden');
		const city = byTestId<HTMLInputElement>('building-city-filter')!;
		expect(document.querySelector(`label[for="${city.id}"]`)!.textContent).toContain('Ort');
		fireEvent(city, 'input', 'Winterthur');
		click('building-search-submit');
		expect(goto).toHaveBeenCalledWith('/buildings?search=Linden&city=Winterthur&page=1');
	});

	it('bietet ohne Gebäude das erste Gebäude an', () => {
		list([]);
		const empty = byTestId('buildings-empty')!;
		expect(empty.textContent).toContain('Noch keine Gebäude');
		expect(empty.querySelector('a')!.getAttribute('href')).toBe('/buildings/new');
	});

	it('meldet eine Suche ohne Treffer und setzt die Filter zurück', () => {
		url = new URL('http://localhost/buildings?search=Gibt%20es%20nicht');
		list([]);
		const empty = byTestId('buildings-empty')!;
		expect(empty.textContent).toContain('Keine Gebäude gefunden');
		expect(empty.querySelector('a')!.getAttribute('href')).toBe('/buildings');
	});

	it('blättert mit der Suche zur nächsten Seite', () => {
		url = new URL('http://localhost/buildings?city=Winterthur');
		list([building()], 25);
		expect(byTestId('pagination-next')!.getAttribute('href')).toBe(
			'/buildings?city=Winterthur&page=2'
		);
	});
});
