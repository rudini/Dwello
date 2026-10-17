import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readable } from 'svelte/store';

let url = new URL('http://localhost/apartments');
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => readable({ url }).subscribe(run) }
}));

import { goto } from '$app/navigation';
import ApartmentsPage from '../routes/apartments/+page.svelte';
import ApartmentPage from '../routes/apartments/[id]/+page.svelte';
import { byTestId, click, fireEvent, show } from './helpers/dom';
import { icons } from '$lib/ui/icons';

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
	// After a search the focus moves here, so the number of results is read out
	it('nennt die Treffer in einer Überschrift, die den Fokus nach der Suche nimmt', () => {
		list([apartment(), apartment({ id: 'a2' })]);
		const results = document.querySelector<HTMLElement>('[data-results]')!;
		expect(results.textContent!.replace(/\s+/g, ' ').trim()).toBe('2 Wohnungen');
		expect(results.tabIndex).toBe(-1);
	});

	it('nennt eine einzelne Wohnung in der Einzahl', () => {
		list([apartment()]);
		expect(document.querySelector('[data-results]')!.textContent!.trim()).toBe('1 Wohnung');
	});
	it('nennt Seite, Anzahl und den einen Hauptschritt', () => {
		list([apartment()]);
		expect(document.querySelector('h1')!.textContent).toBe('Wohnungen');
		expect(text()).not.toContain('1 Wohnung in Ihren Gebäuden'); // the count is only in the results heading
		expect(text()).toContain('Alle Wohnungen Ihrer Gebäude mit Mietstatus');
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

	it('zeigt den Mietstatus als Wort, bei künftigem Vertrag mit dem Einzugstag', () => {
		list([
			apartment(),
			apartment({ id: 'a2', number: '2.02', status: 'relet', nextContractStart: '2099-11-01' })
		]);
		const status = (id: string) =>
			byTestId(`apartment-card-${id}`)!
				.querySelector('[data-testid="apartment-status"]')!
				.textContent!.trim();
		expect(status('a1')).toBe('Leer');
		expect(status('a2')).toBe('Vermietet ab 01.11.2099');
	});

	it('zeigt Leer mit einer offenen Tür statt einem Warndreieck', () => {
		list([apartment()]);
		const shape = (svg: Element) => svg.firstElementChild!.getAttribute('d');
		const door = icons['apartment-free'][0][1].d;
		const badge = byTestId('apartment-card-a1')!.querySelector('[data-testid="apartment-status"]')!;
		expect(shape(badge.querySelector('svg')!)).toBe(door);
		const legend = [...byTestId('apartment-status-legend')!.querySelectorAll('dt')].find((dt) =>
			dt.textContent!.includes('Leer')
		)!;
		expect(shape(legend.querySelector('svg')!)).toBe(door);
	});

	it('erklärt die vier Mietstatus', () => {
		list([apartment()]);
		const legend = byTestId('apartment-status-legend')!.textContent!;
		for (const words of [
			'Leer',
			'Vermietet',
			'Vermietet ab …',
			'Gesperrt',
			'Ein künftiger Mietvertrag ist abgeschlossen; die Wohnung ist ab seinem Vertragsbeginn vermietet'
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

	// #160: what the search finds stays visible while typing, not only in the placeholder
	it('sagt am Suchfeld, wonach es sucht', () => {
		list([apartment()]);
		const input = byTestId('apartments-search-input')!;
		const help = document.getElementById(input.getAttribute('aria-describedby')!)!;
		// a pattern, not a literal example: a typed example would find nothing in the landlord's data (persona Helga)
		expect(help.textContent!.trim()).toBe(
			'Suchen Sie nach Wohnungsnummer, Gebäudename, Strasse oder Ort. Mehrere Wörter grenzen die Suche ein, zum Beispiel Gebäudename und Wohnungsnummer.'
		);
		expect(input.getAttribute('placeholder')).toBeNull();
	});

	it('nennt ohne Treffer den Suchbegriff und wonach gesucht wird', () => {
		url = new URL('http://localhost/apartments?search=Seepark%20B9');
		list([]);
		expect(byTestId('apartments-empty')!.textContent).toContain(
			'Keine Wohnung passt zu «Seepark B9». Gesucht wird in Wohnungsnummer, Gebäudename, Strasse und Ort.'
		);
	});

	it('blättert mit den Filtern zur nächsten Seite', () => {
		url = new URL('http://localhost/apartments?building=b1');
		list([apartment()], 30);
		expect(byTestId('pagination-next')!.getAttribute('href')).toBe(
			'/apartments?building=b1&page=2'
		);
	});
});

describe('Wohnungsdetail', () => {
	const history = [
		{
			id: 'c2',
			tenantName: 'Beat Huber',
			monthlyTotal: 1430,
			status: 'active',
			startDate: '2022-04-01',
			endDate: null
		},
		{
			id: 'c1',
			tenantName: 'Eva Graf',
			monthlyTotal: 750,
			status: 'ended',
			startDate: '2018-01-01',
			endDate: '2022-03-31'
		}
	];
	const details = (rented = true) => ({
		apartment: {
			id: 'a1',
			buildingId: 'b1',
			number: '3.01',
			floor: 3,
			area: '82.50',
			rooms: '3.5',
			status: rented ? 'occupied' : 'vacant',
			currentContractId: rented ? 'c2' : null,
			nextContractStart: null,
			building: {
				id: 'b1',
				name: 'Lindenhof',
				address: 'Lindenweg 4',
				postalCode: '8400',
				city: 'Winterthur'
			}
		},
		currentContract: rented
			? {
					id: 'c2',
					tenantId: 't2',
					tenantName: 'Beat Huber',
					tenantEmail: 'beat.huber@example.com',
					startDate: '2022-04-01'
				}
			: null,
		monthlyCosts: rented
			? { baseRent: 1200, additionalRent: 50, advancePayment: 180, monthlyTotal: 1430 }
			: { baseRent: 0, additionalRent: 0, advancePayment: 0, monthlyTotal: 0 },
		nextContract: null as null | { tenantId: string; tenantName: string; startDate: string },
		contractHistory: rented ? history : []
	});
	const open = (rented = true) => show(ApartmentPage, { data: details(rented) } as never);
	const trail = () =>
		[...document.querySelectorAll('[data-testid="breadcrumb-link"]')].map((link) => [
			link.textContent,
			link.getAttribute('href')
		]);

	it('nennt Wohnung, Gebäude und Adresse', () => {
		open();
		expect(document.querySelector('h1')!.textContent).toBe('Wohnung 3.01');
		expect(document.title).toBe('Wohnung 3.01, Lindenhof - Dwello');
		expect(trail()).toEqual([
			['Wohnungen', '/apartments'],
			['Lindenhof', '/buildings/b1']
		]);
		expect(text()).toContain('Lindenweg 4, 8400 Winterthur');
		expect(byTestId('apartment-edit-button')!.getAttribute('href')).toBe('/apartments/a1/edit');
	});

	it('zeigt die Angaben und erklärt den Mietstatus', () => {
		open();
		expect(byTestId('apartment-info-status')!.textContent).toContain('Vermietet');
		expect(byTestId('apartment-info-status')!.textContent).toContain('Ein Mietvertrag läuft.');
		expect(byTestId('apartment-info-rooms')!.textContent).toContain('3.5');
		expect(byTestId('apartment-info-floor')!.textContent).toContain('3. OG');
		expect(byTestId('apartment-info-area')!.textContent).toContain('82.5 m²');
	});

	it('zeigt den Mieter und die Miete mit den Begriffen des Glossars', () => {
		open();
		expect(byTestId('current-tenant-name')!.textContent!.trim()).toBe('Beat Huber');
		expect(byTestId('tenant-email-link')!.getAttribute('href')).toBe(
			'mailto:beat.huber@example.com'
		);
		const profile = byTestId('current-tenant-profile')!;
		expect(profile.getAttribute('href')).toBe('/tenants/t2');
		expect(profile.textContent).toContain('Beat Huber');
		const words = text();
		for (const term of ['Nettomiete', 'Akonto', 'Zusatzmiete', 'Monatlich total']) {
			expect(words).toContain(term);
		}
		expect(byTestId('monthly-costs-total')!.textContent!.replace(/\s+/g, ' ').trim()).toBe(
			'CHF 1’430.00'
		);
	});

	it('listet alle Mietverträge, jeder Link nennt den Mietvertrag und seinen Mieter', () => {
		open();
		const rows = [...document.querySelectorAll('[data-testid="contract-history-row"]')];
		expect(rows).toHaveLength(2);
		const link = rows[1].querySelector('[data-testid="contract-history-link"]')!;
		expect(link.textContent!.trim()).toBe('Mietvertrag von Eva Graf');
		expect(link.getAttribute('href')).toBe('/contracts/c1');
		const words = rows.map((row) => row.textContent!.replace(/\s+/g, ' '));
		expect(words[0]).toContain('Laufend');
		expect(words[0]).toContain('seit 01.04.2022, unbefristet');
		expect(words[1]).toContain('Beendet');
		expect(words[1]).toContain('01.01.2018 – 31.03.2022');
		expect(words[1]).toContain('CHF 750.00 monatlich total');
		expect(text()).not.toContain('heute');
	});

	// A-8 (#117): der beendete Mietvertrag ist Historie, kein Duplikat
	it('listet beendete Mietverträge unter «Frühere Mietverträge» mit dem Grund, warum sie bleiben', () => {
		open();
		const current = byTestId('contract-history-current')!.textContent!;
		expect(current).toContain('Beat Huber');
		expect(current).not.toContain('Eva Graf');
		const earlier = byTestId('contract-history-earlier')!;
		expect(earlier.querySelector('h3')!.textContent).toBe('Frühere Mietverträge');
		expect(earlier.textContent!.replace(/\s+/g, ' ')).toContain(
			'Mietvertrag von Eva Graf 01.01.2018 – 31.03.2022, befristet CHF 750.00 monatlich total Beendet Bleibt als Historie erhalten: Nebenkostenabrechnungen brauchen seine Mietstage.'
		);
	});

	// P-18 (#145): seit wann leer und wer die Nebenkosten trägt
	it('nennt bei einer leeren Wohnung, seit wann sie leer ist und wer ihre Nebenkosten trägt', () => {
		const data = details(false);
		Object.assign(data.apartment, { lastContractEnd: '2024-03-31' });
		show(ApartmentPage, { data } as never);

		const status = byTestId('apartment-info-status')!.textContent!;
		expect(status).toContain('Leer seit 01.04.2024');
		expect(status).toContain('Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.');
	});

	it('nennt bei einer wiedervermieteten Wohnung, wer ab wann einzieht', () => {
		const data = details(false);
		data.apartment.status = 'relet';
		data.apartment.nextContractStart = '2099-11-01' as never;
		data.nextContract = { tenantId: 't3', tenantName: 'Ruth Meier', startDate: '2099-11-01' };
		data.contractHistory = [
			{
				id: 'c3',
				tenantName: 'Ruth Meier',
				monthlyTotal: 1630,
				status: 'future',
				startDate: '2099-11-01',
				endDate: null
			}
		];
		show(ApartmentPage, { data } as never);

		expect(byTestId('apartment-info-status')!.textContent).toContain('Vermietet ab 01.11.2099');
		expect(byTestId('apartment-vacant')).toBeNull();
		const next = byTestId('apartment-next-tenant')!;
		expect(next.textContent!.replace(/\s+/g, ' ').trim()).toBe(
			'Ab 01.11.2099 vermietet an Ruth Meier.'
		);
		expect(next.querySelector('a')!.getAttribute('href')).toBe('/tenants/t3');
		expect(byTestId('contract-history-row')!.textContent).toContain('ab 01.11.2099, unbefristet');
		// a later contract can still be recorded, but it is no longer the next step
		expect(byTestId('apartment-new-contract')!.className).not.toContain('bg-accent ');
	});

	it('bietet bei einer leeren Wohnung den Mietvertrag als nächsten Schritt an', () => {
		open(false);
		// Persona Anna P-3: auch nie vermietet trägt der Vermieter die Nebenkosten
		expect(byTestId('apartment-info-status')!.textContent).toContain(
			'Die Nebenkosten einer leeren Wohnung tragen Sie als Vermieter.'
		);
		expect(byTestId('apartment-vacant')).not.toBeNull();
		expect(byTestId('current-tenant-name')).toBeNull();
		expect(byTestId('contract-history-empty')).not.toBeNull();
		const contract = byTestId('apartment-new-contract')!;
		expect(contract.getAttribute('href')).toBe('/contracts/new?apartment=a1');
		expect(contract.className).toContain('bg-accent ');
		expect(contract.textContent).toContain('Mietvertrag erfassen');
	});
});
