import { describe, expect, it } from 'vitest';
import CostReconciliation from '$lib/statement-wizard/CostReconciliation.svelte';
import type { Reconciliation } from '$lib/cost-reconciliation';
import { allByTestId, byTestId, show } from './helpers/dom';

// #1138 (PO 06.11.2026): the sentences under the Kostenabstimmung and the total card on phones
const text = (element: Element | null) => element?.textContent?.replace(/\s+/g, ' ').trim();
const amounts = { buildingCosts: 5178, tenants: 4000, landlord: 1178 };
const base: Reconciliation = {
	positions: [{ label: 'Heizung', ...amounts }],
	total: amounts,
	managementFee: 0,
	nonAllocable: 0,
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
		expect(document.querySelectorAll('[data-testid^="cost-reconciliation-fuel-stock"], [data-testid="cost-reconciliation-vacancy"]').length).toBe(0);
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
