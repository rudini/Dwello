import { describe, expect, it } from 'vitest';
import CostReconciliation from '$lib/statement-wizard/CostReconciliation.svelte';
import type { Reconciliation } from '$lib/cost-reconciliation';
import { flushSync } from 'svelte';
import { allByTestId, byTestId, show } from './helpers/dom';

// #1138 (PO 06.11.2026): the sentences under the Kostenabstimmung and the total card on phones
const text = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();
const amounts = { buildingCosts: 5178, tenants: 4000, landlord: 1178 };
const base: Reconciliation = {
	positions: [{ label: 'Heizung', ...amounts, rows: [] }],
	total: amounts,
	managementFee: 0,
	nonAllocable: 0,
	nonAllocableRows: [],
	withoutStatement: 0,
	drafts: [],
	notUpToDate: [],
	fuelStocks: [],
	vacancies: []
};
const render = (changes: Partial<Reconciliation> = {}) =>
	show(CostReconciliation, {
		reconciliation: { ...base, ...changes },
		caption: 'Kostenabstimmung',
		testid: 'reconciliation'
	});

describe('Kostenabstimmung: Tankbestand', () => {
	it('nennt jede Position mit Tankbestand mit ihrem Anfangs- und Endbestand in einem eigenen Satz', () => {
		render({
			fuelStocks: [
				{ position: 'Heizung', opening: 1792, closing: 1494 },
				{ position: 'Warmwasser', opening: 300, closing: 0 }
			]
		});
		expect(allByTestId('cost-reconciliation-fuel-stock').map(text)).toEqual([
			'In «Heizung» ist die Veränderung des Tankbestands enthalten: Anfangsbestand CHF 1’792.00, Endbestand CHF 1’494.00.',
			'In «Warmwasser» ist die Veränderung des Tankbestands enthalten: Anfangsbestand CHF 300.00, Endbestand CHF 0.00.'
		]);
	});

	it('nennt ohne Tankbestand keinen', () => {
		render();
		expect(allByTestId('cost-reconciliation-fuel-stock')).toEqual([]);
	});
});

describe('Kostenabstimmung: Leerstand', () => {
	it('nennt jede Wohnung mit Leerstand mit ihren Tagen, einen Tag in der Einzahl', () => {
		render({
			vacancies: [
				{ apartmentNumber: 'OG2', days: 30 },
				{ apartmentNumber: '3.01', days: 1 }
			]
		});
		expect(text(byTestId('cost-reconciliation-vacancy'))).toBe(
			'Leerstand in dieser Abrechnungsperiode: Wohnung OG2 (30 Tage), Wohnung 3.01 (1 Tag).'
		);
	});

	it('nennt ohne Leerstand keinen', () => {
		render();
		expect(allByTestId('cost-reconciliation-vacancy')).toEqual([]);
	});
});

// Fachreview 1138-1 V-3: like the help text, only beside a table of positions
describe('Kostenabstimmung ohne Positionen', () => {
	it('nennt weder Tankbestand noch Leerstand', () => {
		render({
			positions: [],
			nonAllocable: 500,
			fuelStocks: [{ position: 'Heizung', opening: 600, closing: 100 }],
			vacancies: [{ apartmentNumber: 'OG2', days: 30 }]
		});
		expect(
			document.querySelectorAll(
				'[data-testid^="cost-reconciliation-fuel-stock"], [data-testid="cost-reconciliation-vacancy"]'
			).length
		).toBe(0);
	});
});

describe('Kostenabstimmung auf dem Telefon', () => {
	it('hebt die Karte «Total» mit gedämpftem Hintergrund und fetter Überschrift hervor', () => {
		render();
		const cards = [...document.querySelectorAll('[data-testid="reconciliation"] ul > li')];
		const looks = cards.map((card) => [
			card.classList.contains('bg-sunken'),
			card.querySelector('.font-bold')?.textContent?.trim() ?? null
		]);
		expect(looks).toEqual([
			[false, null],
			[true, 'Total']
		]);
	});
});

// #1464 (PO 22.11.2026): each position expands to its Rechnungen; in the table and in the cards for phones
const whole = { kind: 'invoice', id: 'i1', billingEntityName: 'Muster AG', invoiceDate: '2024-06-15', amount: 1000, inPeriod: 1000, beyond: null } as const;
const part = { ...whole, id: 'i2', invoiceDate: '2024-03-15', amount: 800, inPeriod: 200.41, beyond: { start: '2024-01-01', end: '2027-12-31', days: 366, ofDays: 1461 } };
const tank = [{ kind: 'opening', date: '2023-12-31', amount: 600 }, whole, part, { kind: 'closing', date: '2024-12-31', amount: 100 }] as const;
const places = [
	['in der Tabelle', '[data-testid="cost-reconciliation-table"]'],
	['in den Karten für Telefone', '[data-testid="reconciliation"] > ul']
] as const;
const toggles = (place: string) => [...document.querySelectorAll<HTMLElement>(`${place} [data-testid="cost-reconciliation-invoices"] button`)];
const press = (button: HTMLElement) => flushSync(() => button.click());
const cells = (place: string) => [...document.querySelectorAll(`${place} [data-testid="cost-reconciliation-invoice-cell"]`)].map(text);

describe.each(places)('Rechnungen einer Position %s', (_, place) => {
	it('bietet bei jeder Position «Rechnungen anzeigen» mit ihrem Namen an, zugeklappt, und bei «Total» nichts', () => {
		render({ positions: [{ label: 'Heizung', ...amounts, rows: [whole] }, { label: 'Hauswart', ...amounts, rows: [whole] }] });
		expect(toggles(place).map((button) => [text(button), button.getAttribute('aria-label'), button.getAttribute('aria-expanded')])).toEqual([
			['Rechnungen anzeigen', 'Rechnungen anzeigen: Heizung', 'false'],
			['Rechnungen anzeigen', 'Rechnungen anzeigen: Hauswart', 'false']
		]);
		expect(cells(place)).toEqual([]);
	});

	it('zeigt nach «Rechnungen anzeigen» den Anfangsbestand, jede Rechnung mit ihrem Anteil in der Periode und den Endbestand', () => {
		render({ positions: [{ label: 'Heizung', ...amounts, rows: [...tank] }] });
		press(toggles(place)[0]);
		expect(cells(place)).toEqual([
			'Anfangsbestand', 'Stichtag 31.12.2023', 'CHF 600.00',
			'Muster AG, Rechnung vom 15.06.2024', 'ganz in dieser Periode', 'CHF 1’000.00',
			'Muster AG, Rechnung vom 15.03.2024', 'Rechnungsbetrag CHF 800.00, Leistungszeitraum 01.01.2024 – 31.12.2027, 366 von 1461 Tagen in dieser Periode', 'CHF 200.41',
			'minus Endbestand', 'Stichtag 31.12.2024', 'CHF 100.00'
		]);
	});

	it('nennt die aufgeklappte Schaltfläche «Rechnungen ausblenden» und blendet die Rechnungen damit wieder aus', () => {
		render({ positions: [{ label: 'Heizung', ...amounts, rows: [whole] }] });
		press(toggles(place)[0]);
		const [open] = toggles(place);
		const shown = [text(open), open.getAttribute('aria-label'), open.getAttribute('aria-expanded'), cells(place).length];
		press(open);
		expect([shown, text(toggles(place)[0]), cells(place)]).toEqual([['Rechnungen ausblenden', 'Rechnungen ausblenden: Heizung', 'true', 3], 'Rechnungen anzeigen', []]);
	});

	it('verlinkt jede Rechnung mit ihrer Detailseite, den Tankbestand nicht', () => {
		render({ positions: [{ label: 'Heizung', ...amounts, rows: [...tank] }] });
		press(toggles(place)[0]);
		const links = [...document.querySelectorAll(`${place} [data-testid="cost-reconciliation-invoices"] a`)];
		expect(links.map((link) => [text(link), link.getAttribute('href')])).toEqual([
			['Muster AG, Rechnung vom 15.06.2024', '/invoices/i1'],
			['Muster AG, Rechnung vom 15.03.2024', '/invoices/i2']
		]);
	});

	// persona Sven 1464 P-2: with Tab a screen reader hears the link only; its description adds detail and amount
	it('beschreibt den Link jeder Rechnung mit ihrem Detail und ihrem Anteil', () => {
		render({ positions: [{ label: 'Heizung', ...amounts, rows: [whole, part] }] });
		press(toggles(place)[0]);
		const links = [...document.querySelectorAll(`${place} [data-testid="cost-reconciliation-invoices"] a`)];
		const described = links.map((link) =>
			(link.getAttribute('aria-describedby') ?? '').split(' ').map((id) => text(document.getElementById(id)))
		);
		expect(described).toEqual([
			['ganz in dieser Periode', 'CHF 1’000.00'],
			['Rechnungsbetrag CHF 800.00, Leistungszeitraum 01.01.2024 – 31.12.2027, 366 von 1461 Tagen in dieser Periode', 'CHF 200.41']
		]);
	});

	it('sagt bei einer Position ohne Zeile, dass es keine Rechnung mehr gibt', () => {
		render();
		press(toggles(place)[0]);
		expect(text(document.querySelector(`${place} [data-testid="cost-reconciliation-no-invoice"]`))).toBe(
			'Für diese Position gibt es keine Rechnung mehr. Die Abrechnungen verrechnen sie noch.'
		);
	});
});

describe('Rechnungen neben der Kostenabstimmung', () => {
	const extras = () =>
		allByTestId('cost-reconciliation-extra').map((extra) => [
			text(extra.querySelector('[data-testid="cost-reconciliation-label"]')),
			extra.querySelector('button')?.getAttribute('aria-label') ?? null
		]);

	it('bietet bei den nicht umlagefähigen Rechnungen «Rechnungen anzeigen» an, bei der Verwaltungspauschale nicht', () => {
		render({ managementFee: 33.05, nonAllocable: 500, nonAllocableRows: [whole] });
		expect(extras()).toEqual([
			['Verwaltungspauschale (bezahlen die Mieter zusätzlich zu «davon Mieter», sie steht Ihnen zu)', null],
			['Nicht umlagefähige Rechnungen (tragen Sie ganz)', 'Rechnungen anzeigen: Nicht umlagefähige Rechnungen (tragen Sie ganz)']
		]);
	});

	it('zeigt die nicht umlagefähigen Rechnungen nach «Rechnungen anzeigen»', () => {
		render({ positions: [], nonAllocable: 500, nonAllocableRows: [{ ...whole, amount: 500, inPeriod: 500 }] });
		press(byTestId('cost-reconciliation-extra')!.querySelector('button')!);
		expect(allByTestId('cost-reconciliation-invoice-cell').map(text)).toEqual(['Muster AG, Rechnung vom 15.06.2024', 'ganz in dieser Periode', 'CHF 500.00']);
	});
});
