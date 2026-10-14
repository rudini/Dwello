import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';

// enhance as SvelteKit wires it: the test plays the server's answer to the last submit
const server = vi.hoisted(() => ({
	submit: null as null | ((input: unknown) => unknown),
	form: null as HTMLFormElement | null
}));
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit?: (input: unknown) => unknown) => {
		if (submit) Object.assign(server, { submit, form });
		return { destroy() {} };
	}
}));
async function answer(result: { type: string }) {
	const after = server.submit!({ formData: new FormData(server.form!) }) as (
		input: unknown
	) => Promise<void>;
	await after({ update: async () => {}, result });
	await settle();
}

import CategoriesPage from '../routes/config/categories/+page.svelte';
import NewCategoryPage from '../routes/config/categories/new/+page.svelte';
import EditCategoryPage from '../routes/config/categories/[id]/edit/+page.svelte';
import { toasts } from '$lib/stores';
import { allByTestId, byTestId, click, fireEvent, settle, show } from './helpers/dom';

const category = (
	id: string,
	name: string,
	isAllowedUtilityCost: boolean,
	usageCount = 0,
	more = {}
) => ({
	id,
	name,
	description: '',
	isAllowedUtilityCost,
	usageCount,
	predefined: false,
	...more
});
const categories = [
	category('c1', 'Heizung', true, 3),
	category('c2', 'Reparaturen', false),
	category('c3', 'Lift', true, 1)
];
const names = () => allByTestId('category-name').map((cell) => cell.textContent);
const text = () => document.body.textContent!.replace(/\s+/g, ' ');
const toastTexts = () => get(toasts).map((toast) => toast.message);

beforeEach(() => toasts.set([]));

describe('Kategorien', () => {
	it('filtert nach umlagefähigen und nicht umlagefähigen Kategorien', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);
		expect(names()).toEqual(['Heizung', 'Reparaturen', 'Lift']);

		click('category-filter-allowed');
		expect(names()).toEqual(['Heizung', 'Lift']);
		expect(byTestId('category-filter-allowed')!.getAttribute('aria-pressed')).toBe('true');

		click('category-filter-disallowed');
		expect(names()).toEqual(['Reparaturen']);
		expect(byTestId('category-filter-disallowed')!.textContent).toContain('(1)');
	});

	it('öffnet eine Kategorie über ihren Namen und sagt, ob sie umlagefähig ist', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		const [heating, repairs] = allByTestId('category-row');
		expect(heating.querySelector('a')!.textContent!.trim()).toBe('Heizung');
		expect(heating.querySelector('a')!.getAttribute('href')).toBe('/config/categories/c1/edit');
		expect(allByTestId('category-allowed').map((badge) => badge.textContent!.trim())).toEqual([
			'Umlagefähig',
			'Nicht umlagefähig',
			'Umlagefähig'
		]);
		expect(repairs.textContent).toContain('0 Rechnungen');
	});

	it('zählt die Rechnungen in Einzahl und Mehrzahl', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		expect(allByTestId('category-usage').map((usage) => usage.textContent!.trim())).toEqual([
			'3 Rechnungen',
			'0 Rechnungen',
			'1 Rechnung'
		]);
	});

	// The descriptions of the predefined categories are English
	it('zeigt nur die Beschreibungen eigener Kategorien', () => {
		show(CategoriesPage, {
			data: {
				categories: [
					category('c1', 'Heizung', true, 0, {
						predefined: true,
						description: 'Costs for heating the building'
					}),
					category('c4', 'Treppenhausreinigung', true, 0, { description: 'Reinigung im Haus' })
				]
			},
			form: null
		} as never);

		expect(text()).not.toContain('Costs for heating the building');
		expect(text()).toContain('Reinigung im Haus');
	});

	it('hebt den gewählten Filter zurückhaltend hervor, nicht wie eine Hauptaktion', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);
		const active = byTestId('category-filter-all')!;

		expect(active.className).not.toMatch(/(^| )bg-accent( |$)/);
		expect(active.className).toMatch(/(^| )bg-accent-soft( |$)/);
	});

	it('erklärt, was eine Kategorie bestimmt', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		expect(text()).toContain('Nur Kosten aus umlagefähigen Kategorien');
	});

	it('lässt Kategorien mit Rechnungen nicht löschen', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		const [used, unused] = allByTestId('category-delete-button') as HTMLButtonElement[];
		expect(used.disabled).toBe(true);
		expect(unused.disabled).toBe(false);
		expect(unused.getAttribute('aria-label')).toBe('Kategorie «Reparaturen» löschen');
	});

	it('fragt vor dem Löschen nach und zeigt den Fehler des Backends', () => {
		show(CategoriesPage, {
			data: { categories },
			form: { error: 'Kategorie konnte nicht gelöscht werden' }
		} as never);

		click(allByTestId('category-delete-button')[1]);
		expect(text()).toContain('Kategorie «Reparaturen» löschen?');
		expect(text()).toContain('Kategorie konnte nicht gelöscht werden');
	});

	it('bestätigt das Löschen mit dem Namen der Kategorie', async () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		click(allByTestId('category-delete-button')[1]);
		click('category-delete-confirm');
		await answer({ type: 'redirect' });

		expect(toastTexts()).toEqual(['Kategorie «Reparaturen» gelöscht']);
	});
});

describe('Kategorie erfassen', () => {
	it('bestätigt das Speichern mit dem Namen der Kategorie', async () => {
		show(NewCategoryPage, { form: null } as never);
		fireEvent(byTestId<HTMLInputElement>('category-name-input')!, 'input', 'Gartenpflege');

		await answer({ type: 'redirect' });

		expect(toastTexts()).toEqual(['Kategorie «Gartenpflege» gespeichert']);
	});

	it('meldet, warum die Kategorie nicht gespeichert wurde', () => {
		show(NewCategoryPage, {
			form: { errors: { form: 'Eine Kategorie mit dem Namen "Lift" existiert bereits.' } }
		} as never);

		expect(byTestId('form-error')!.textContent).toContain(
			'Eine Kategorie mit dem Namen "Lift" existiert bereits.'
		);
	});
});

describe('Umlagefähigkeit einer neuen Kategorie', () => {
	const choice = (label: string) =>
		[...document.querySelectorAll<HTMLInputElement>('[data-testid="category-allowance"] input')].find(
			(input) => input.closest('label')!.textContent!.trim().startsWith(label)
		)!;

	it('wählt nichts vor und bietet die Prüfung durch die KI an', () => {
		show(NewCategoryPage, { form: null } as never);

		expect(choice('Umlagefähig').checked).toBe(false);
		expect(choice('Nicht umlagefähig').checked).toBe(false);
		expect(byTestId('category-propose-button')!.textContent).toContain('Von der KI prüfen lassen');
	});

	// Art. 257a Absatz 2 OR: umlagefähig heisst noch nicht, dass der Mieter sie schuldet
	it('erklärt, wann der Mieter umlagefähige Kosten bezahlt', () => {
		show(NewCategoryPage, { form: null } as never);

		expect(text()).toContain('wenn der Mietvertrag sie als Nebenkosten nennt (Art. 257a Absatz 2 OR)');
		expect(text()).toContain('Gebäudeversicherung');
	});

	it('übernimmt den Vorschlag der KI und zeigt ihre Begründung', () => {
		const reasoning = 'Erneuerung des Gebäudes (Art. 257a Abs. 1 OR).';
		show(NewCategoryPage, { form: { proposal: { isAllowedUtilityCost: false, reasoning } } } as never);

		expect(choice('Nicht umlagefähig').checked).toBe(true);
		expect(byTestId('category-proposal')!.textContent).toContain('Vorschlag der KI: Nicht umlagefähig');
		expect(byTestId('category-proposal')!.textContent).toContain(reasoning);
	});

	it('lässt ohne Antwort der KI nichts vorgewählt und sagt, dass Sie selbst wählen', () => {
		const error = 'Die KI ist nicht erreichbar oder ist sich nicht sicher. Wählen Sie selbst, ob die Kosten umlagefähig sind.';
		show(NewCategoryPage, { form: { proposal: { error } } } as never);

		expect(choice('Umlagefähig').checked).toBe(false);
		expect(choice('Nicht umlagefähig').checked).toBe(false);
		expect(byTestId('category-proposal')!.textContent).toContain(error);
	});

	it('meldet die fehlende Wahl an der Wahl', () => {
		show(NewCategoryPage, {
			form: { errors: { isAllowedUtilityCost: 'Wählen Sie, ob die Kosten umlagefähig sind.' } }
		} as never);

		expect(byTestId('category-allowance')!.textContent).toContain('Wählen Sie, ob die Kosten umlagefähig sind.');
	});

	it('zeigt beim Bearbeiten die gespeicherte Wahl, ohne die KI anzubieten', () => {
		show(EditCategoryPage, { data: { category: category('c2', 'Reparaturen', false) }, form: null } as never);

		expect(choice('Nicht umlagefähig').checked).toBe(true);
		expect(byTestId('category-propose-button')).toBeNull();
	});
});

describe('Kategorie bearbeiten', () => {
	// The list hides the (English) descriptions of the predefined categories
	it('sagt bei vordefinierten Kategorien, dass die Beschreibung nicht in der Liste steht', () => {
		const heating = category('c1', 'Heizung', true, 0, { predefined: true });
		show(EditCategoryPage, { data: { category: heating }, form: null } as never);

		expect(text()).toContain('Die Liste zeigt die Beschreibung vordefinierter Kategorien nicht.');
	});

	it('zeigt den Hinweis bei eigenen Kategorien nicht', () => {
		const own = category('c4', 'Treppenhausreinigung', true);
		show(EditCategoryPage, { data: { category: own }, form: null } as never);

		expect(text()).not.toContain('vordefinierter Kategorien');
	});

	// Heizkosten folgen beim Mieterwechsel dem Heizprofil statt den Tagen; separates Warmwasser nicht
	it('erfasst, ob eine Kategorie Heizkosten sind, und erklärt die Folge', () => {
		const pellets = { ...category('c5', 'Pellets', true), isHeatingCost: true };
		show(EditCategoryPage, { data: { category: pellets }, form: null } as never);

		const box = byTestId<HTMLInputElement>('category-heating-checkbox')!;
		expect(box.checked).toBe(true);
		expect(box.name).toBe('isHeatingCost');
		expect(text()).toContain('Heizkosten nach dem Heizprofil verteilen');
		expect(text()).toContain('nach dem Heizprofil');
		expect(text()).toContain('Separat abgerechnetes Warmwasser wird das ganze Jahr etwa gleich verbraucht');
	});
});
