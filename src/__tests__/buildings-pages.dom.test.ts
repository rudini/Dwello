import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';

let url = new URL('http://localhost/buildings');
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => readable({ url }).subscribe(run) }
}));

import { goto } from '$app/navigation';
import BuildingsPage from '../routes/buildings/+page.svelte';
import BuildingPage from '../routes/buildings/[id]/+page.svelte';
import NewBuildingPage from '../routes/buildings/new/+page.svelte';
import EditBuildingPage from '../routes/buildings/[id]/edit/+page.svelte';
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
	// After a search the focus moves here, so the number of results is read out
	it('nennt die Treffer in einer Überschrift, die den Fokus nach der Suche nimmt', () => {
		list([building()]);
		const results = document.querySelector<HTMLElement>('[data-results]')!;
		expect(results.textContent!.replace(/\s+/g, ' ').trim()).toBe('1 Gebäude');
		expect(results.tabIndex).toBe(-1);
	});
	it('nennt Seite, Anzahl und den einen Hauptschritt', () => {
		list([building()]);
		expect(document.querySelector('h1')!.textContent).toBe('Gebäude');
		expect(text()).not.toContain('1 Gebäude in Ihrer Verwaltung'); // the count is only in the results heading
		expect(text()).toContain('Ihre Gebäude mit Adresse und Wohnungen');
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
		expect(words).not.toContain('wiedervermietet');
		expect(words).toContain('Baujahr 1985');
		expect(words).not.toContain('3/4');
	});

	it('zählt alle Wohnungen, auch wiedervermietete und gesperrte', () => {
		list([building({ apartmentCount: 6, occupiedCount: 3, reletCount: 1, reservedCount: 1 })]);
		const words = byTestId('building-card-b1')!.textContent!.replace(/\s+/g, ' ');
		expect(words).toContain('3 vermietet');
		expect(words).toContain('1 wiedervermietet');
		expect(words).toContain('1 leer');
		expect(words).toContain('1 gesperrt');
	});

	it('plant die Route in Google Maps mit sichtbarer Beschriftung', () => {
		list([building()]);
		const route = byTestId('building-card-b1')!.querySelector<HTMLAnchorElement>(
			'[data-testid="building-route-link"]'
		)!;
		expect(route.textContent!.replace(/\s+/g, ' ')).toContain(
			'Route planen zu Lindenhof (öffnet in neuem Tab)'
		);
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

describe('Gebäudedetail', () => {
	const flat = (id: string, number: string, floor: number, status = 'vacant') => ({
		id,
		buildingId: 'b1',
		number,
		floor,
		area: '70.00',
		rooms: '3.5',
		status
	});
	const detail = (apartments: ReturnType<typeof flat>[], counts = {}) =>
		show(BuildingPage, {
			data: {
				building: building({ apartmentCount: apartments.length, ...counts }),
				apartments,
				fuelStocks: [],
				heatingCategories: []
			},
			form: null
		} as never);

	it('nennt Gebäude, Adresse und Baujahr mit dem Weg zurück zur Liste', () => {
		detail([]);
		expect(document.querySelector('h1')!.textContent).toBe('Lindenhof');
		expect(byTestId('breadcrumb-link')!.getAttribute('href')).toBe('/buildings');
		expect(byTestId('building-address')!.textContent).toContain('Testweg 1, 8400 Winterthur');
		expect(byTestId('building-year-built')!.textContent).toBe('1985');
	});

	it('fasst die Belegung so zusammen, dass sie aufgeht', () => {
		detail([flat('a1', '1.01', 1)], {
			apartmentCount: 6,
			occupiedCount: 4,
			reletCount: 1,
			vacantCount: 1,
			reservedCount: 0
		});
		expect(text()).toContain('6, davon 4 vermietet, 1 wiedervermietet und 1 leer');
	});

	it('listet die Wohnungen nach Stockwerk, von unten nach oben', () => {
		detail([
			flat('a3', '10.01', 10, 'occupied'),
			flat('a1', '1.01', 1),
			flat('a0', '0.01', 0),
			flat('a2', '2.01', 2)
		]);
		const floors = [...document.querySelectorAll('[data-testid="apartment-floor"]')].map(
			(heading) => heading.textContent!.trim()
		);
		expect(floors).toEqual(['EG', '1. OG', '2. OG', '10. OG']);
	});

	it('macht die ganze Zeile zum Link mit der Wohnung als Linktext', () => {
		detail([flat('a1', '1.01', 1)]);
		const row = byTestId('apartment-row-a1')!;
		const links = row.querySelectorAll('a');
		expect(links).toHaveLength(1);
		expect(links[0].textContent!.trim()).toBe('Wohnung 1.01');
		expect(links[0].getAttribute('href')).toBe('/apartments/a1');
		const words = row.textContent!.replace(/\s+/g, ' ');
		expect(words).toContain('Leer');
		expect(words).toContain('3.5 Zimmer');
		expect(words).toContain('70 m²');
		expect(words).not.toContain('·');
		expect(byTestId('apartment-status-legend')).not.toBeNull();
	});

	it('erfasst Wohnungen im Gebäude als nächsten Schritt', () => {
		detail([flat('a1', '1.01', 1)]);
		const add = byTestId('apartment-add-button')!;
		expect(add.getAttribute('href')).toBe('/apartments/new?building=b1');
		expect(add.textContent).toContain('Wohnung erfassen');
	});

	it('bietet ohne Wohnungen die erste Wohnung an', () => {
		detail([]);
		expect(byTestId('apartment-add-button')).toBeNull();
		expect(byTestId('apartment-first-create-button')!.getAttribute('href')).toBe(
			'/apartments/new?building=b1'
		);
	});

	it('nennt vor dem Löschen die Folgen', () => {
		detail([]);
		click('building-delete-button');
		const dialog = document.querySelector('[role=dialog]')!;
		expect(dialog.textContent).toContain('Gebäude löschen?');
		expect(dialog.textContent).toContain('Rechnungen');
		expect(byTestId('building-delete-confirm')!.textContent).toContain('Gebäude löschen');
	});

	it('sagt vor dem Bestätigen, warum ein Gebäude mit Wohnungen nicht gelöscht werden kann', () => {
		detail([flat('a1', '1.01', 1)]);
		click('building-delete-button');
		expect(byTestId('form-error')!.textContent).toContain(
			'Dieses Gebäude kann nicht gelöscht werden'
		);
		expect(byTestId<HTMLButtonElement>('building-delete-confirm')!.disabled).toBe(true);
	});
});

describe('Tankbestand', () => {
	const heatingCategories = [
		{ id: 'c1', name: 'Heizung' },
		{ id: 'c3', name: 'Pellets' }
	];
	const detail = (fuelStocks: unknown[] | null, form: unknown = null) =>
		show(BuildingPage, {
			data: { building: building(), apartments: [], fuelStocks, heatingCategories },
			form
		} as never);
	const section = () => byTestId('fuel-stocks')!.textContent!.replace(/\s+/g, ' ');

	it('listet die Stichtage mit Wert und Kategorie und erklärt, wozu sie dienen und wie man bewertet', () => {
		detail([{ id: 'f1', readingDate: '2024-12-31', amount: 2650, categoryId: 'c1' }]);

		expect(section()).toContain('Heizöl oder Pellets im Tank');
		expect(section()).toContain('Anfangsbestand + Einkauf − Endbestand');
		expect(section()).toContain('Liter im Tank mal Preis pro Liter der letzten Lieferung');
		expect(section()).toContain('Ist mehr im Tank als die letzte Lieferung, rechnen Sie den Rest zum Preis der Lieferung davor.');
		expect(section()).toContain('Lesen Sie erst Anfang Januar ab, erfassen Sie den Wert trotzdem per 31.12.');
		expect(byTestId('fuel-stock-f1')!.textContent).toMatch(/31\.12\.2024.*Heizung.*CHF\s2’650\.00/);
		expect(byTestId('fuel-stock-delete-f1')!.getAttribute('aria-label')).toBe(
			'Bestand vom 31.12.2024 löschen'
		);
	});

	it('erfasst einen Stichtag mit Datum, Wert und Kategorie der Heizkosten', () => {
		detail([]);

		// typed as TT.MM.JJJJ, sent as JJJJ-MM-TT
		expect(document.querySelector('input[type="hidden"][name="readingDate"]')).not.toBeNull();
		expect(byTestId<HTMLInputElement>('fuel-stock-amount-input')!.name).toBe('amount');
		const category = byTestId<HTMLSelectElement>('fuel-stock-category-select')!;
		expect(category.name).toBe('categoryId');
		expect([...category.options].map((o) => o.textContent)).toEqual(['Heizung', 'Pellets']);
		expect(category.value).toBe('c1');
		expect(byTestId('fuel-stock-save-button')!.textContent).toContain('Bestand speichern');
	});

	it('zeigt die Fehler beim Erfassen am Feld', () => {
		detail([], { fuelStockErrors: { readingDate: 'Bitte geben Sie den Stichtag ein.' } });

		expect(section()).toContain('Bitte geben Sie den Stichtag ein.');
	});

	it('wählt die Kategorie der bisherigen Stände vor', () => {
		detail([{ id: 'f1', readingDate: '2024-12-31', amount: 900, categoryId: 'c3' }]);

		expect(byTestId<HTMLSelectElement>('fuel-stock-category-select')!.value).toBe('c3');
	});

	it('sagt ohne Kategorie der Heizkosten, wo man eine anlegt', () => {
		show(BuildingPage, {
			data: { building: building(), apartments: [], fuelStocks: [], heatingCategories: [] },
			form: null
		} as never);

		expect(section()).toContain('Es gibt keine Kategorie, die Heizkosten nach dem Heizprofil verteilt.');
		expect(byTestId('fuel-stock-categories-link')!.getAttribute('href')).toBe('/config/categories');
	});

	it('meldet ein misslungenes Löschen beim Bestand, nicht beim Formular zum Speichern', () => {
		detail([{ id: 'f1', readingDate: '2024-12-31', amount: 2650, categoryId: 'c1' }], {
			fuelStockDeleteError: 'Der Bestand konnte nicht gelöscht werden. Laden Sie die Seite neu.'
		});

		expect(byTestId('fuel-stock-delete-error')!.textContent).toContain('Nicht gelöscht');
		expect(byTestId('fuel-stock-error')).toBeNull();
	});

	it('bestätigt das Speichern', () => {
		detail([], { fuelStockSaved: true });

		expect(byTestId('fuel-stock-status')!.textContent).toContain('Bestand gespeichert.');
	});

	it('sagt, wenn die Stichtage nicht geladen werden konnten', () => {
		detail(null);

		expect(section()).toContain('Die Tankbestände konnten nicht geladen werden. Laden Sie die Seite neu.');
	});

	it('löscht einen Stichtag erst nach Bestätigung mit der Folge', () => {
		detail([{ id: 'f1', readingDate: '2024-12-31', amount: 2650, categoryId: 'c1' }]);

		click('fuel-stock-delete-f1');

		const dialog = document.querySelector('[role=dialog]')!;
		expect(dialog.textContent).toContain('Bestand vom 31.12.2024 löschen?');
		expect(dialog.textContent!.replace(/\s+/g, ' ')).toContain(
			'Abrechnungen, die am Tag danach beginnen oder an diesem Tag enden, rechnen dann den Einkauf ab, nicht den Verbrauch.'
		);
		expect(byTestId('fuel-stock-delete-confirm')!.textContent).toContain('Bestand löschen');
	});
});

describe('Gebäude erfassen und bearbeiten', () => {
	const trail = () =>
		[...document.querySelectorAll('[data-testid="breadcrumb-link"]')].map((link) => [
			link.textContent,
			link.getAttribute('href')
		]);

	it('erfasst ein neues Gebäude mit dem Weg zurück zur Liste', () => {
		show(NewBuildingPage, { form: null } as never);
		expect(document.querySelector('h1')!.textContent).toBe('Neues Gebäude');
		expect(trail()).toEqual([['Gebäude', '/buildings']]);
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/buildings');
	});

	it('bearbeitet das Gebäude mit dem Weg zurück zum Gebäude', () => {
		show(EditBuildingPage, { data: { building: building() }, form: null } as never);
		expect(document.querySelector('h1')!.textContent).toBe('Gebäude bearbeiten');
		expect(trail()).toEqual([
			['Gebäude', '/buildings'],
			['Lindenhof', '/buildings/b1']
		]);
		expect(byTestId<HTMLInputElement>('building-name-input')!.value).toBe('Lindenhof');
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/buildings/b1');
	});
});
