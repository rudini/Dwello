import { describe, it, expect } from 'vitest';
import { toCategory } from '$lib/server/category';
import CategoryRow from '../routes/config/categories/CategoryRow.svelte';
import CategoryForm from '../routes/config/categories/CategoryForm.svelte';
import CategoriesPage from '../routes/config/categories/+page.svelte';
import EditCategoryPage from '../routes/config/categories/[id]/edit/+page.svelte';
import backendCategory from '../../tests/contracts/category.json';
import { byTestId, show } from './helpers/dom';

// An own category whose English name equals its German one, as recorded through the form
const own = toCategory(backendCategory);
// One of Dwello's seeded categories: English key, German name, English description
const seeded = toCategory({
	...backendCategory,
	name: 'Caretaker',
	nameDE: 'Hauswart',
	nameEN: 'Caretaker',
	type: 'predefined',
	description: 'Wages and services of the caretaker'
});
const pageText = () => document.body.textContent ?? '';
const PREDEFINED_HELP = 'Die Liste zeigt die Beschreibung vordefinierter Kategorien nicht.';

describe('Vordefinierte und eigene Kategorien', () => {
	it('liest die Herkunft aus dem Backend statt aus den Namen', () => {
		expect(own.predefined).toBe(false);
		expect(seeded.predefined).toBe(true);
	});

	it('zeigt die Beschreibung einer eigenen Kategorie mit gleichem englischem Namen in der Liste', () => {
		show(CategoryRow, { category: own, ondelete: () => {} });
		expect(pageText()).toContain('Glasfaseranschluss im Keller');
	});

	it('zeigt beim Bearbeiten einer eigenen Kategorie keinen Hinweis für vordefinierte', () => {
		show(CategoryForm, { category: own, submitLabel: 'Speichern' });
		expect(pageText()).not.toContain(PREDEFINED_HELP);
	});

	it('behält den Hinweis bei einer vordefinierten Kategorie', () => {
		show(CategoryForm, { category: seeded, submitLabel: 'Speichern' });
		expect(pageText()).toContain(PREDEFINED_HELP);
	});

	// Die Beschreibung nennt, was nicht dazugehört («ohne …», #204); ein einzeiliges Feld schnitt das auf dem Telefon ab
	it('zeigt die Beschreibung in einem mehrzeiligen Feld', () => {
		show(CategoryForm, { category: seeded, submitLabel: 'Speichern' });
		expect(byTestId('category-description-input')?.tagName).toBe('TEXTAREA');
	});
});

// #166: Dwello ordnet Rechnungen nach den vordefinierten Kategorien ein; sie sind gekennzeichnet und bleiben
describe('Kennzeichnung und Schutz vordefinierter Kategorien', () => {
	const kind = () => byTestId('category-kind')?.textContent?.trim();
	const deleteButton = () => byTestId<HTMLButtonElement>('category-delete-button')!;
	const description = (button: HTMLElement) =>
		(button.getAttribute('aria-describedby') ?? '')
			.split(' ')
			.map((id) => document.getElementById(id)?.textContent ?? '')
			.join(' ');

	it('kennzeichnet eine vordefinierte Kategorie mit «Von Dwello»', () => {
		show(CategoryRow, { category: seeded, ondelete: () => {} });
		expect(kind()).toBe('Von Dwello');
	});

	it('kennzeichnet eine eigene Kategorie mit «Eigene»', () => {
		show(CategoryRow, { category: own, ondelete: () => {} });
		expect(kind()).toBe('Eigene');
	});

	it('lässt eine vordefinierte Kategorie ohne Rechnungen nicht löschen und sagt warum', () => {
		show(CategoriesPage, {
			data: { categories: [{ ...seeded, usageCount: 0 }] },
			form: null
		} as never);

		expect(deleteButton().disabled).toBe(true);
		expect(description(deleteButton())).toContain(
			'Kategorien «Von Dwello» lassen sich nicht löschen, weil Dwello sie mitliefert.'
		);
	});

	it('lässt eine eigene Kategorie ohne Rechnungen weiterhin löschen', () => {
		show(CategoriesPage, {
			data: { categories: [{ ...own, usageCount: 0 }] },
			form: null
		} as never);

		expect(deleteButton().disabled).toBe(false);
	});

	const hint = () => byTestId('category-predefined-hint')!.textContent!.replace(/\s+/g, ' ');

	// Fachreview W5b V-1, M-1, V-3, V-8, V-9; Helga und Dr. Weber P-1: was eine Änderung wirklich bewirkt
	it('sagt beim Bearbeiten einer umlagefähigen vordefinierten Kategorie, was Änderungen bewirken', () => {
		show(EditCategoryPage, { data: { category: seeded, kiEnabled: true }, form: null } as never);

		expect(hint()).toContain('Kategorie «Von Dwello»');
		expect(hint()).toContain(
			'Dwello liefert diese Kategorie mit und hat ihre Umlagefähigkeit nach dem Mietrecht voreingestellt. Sie lässt sich nicht löschen.'
		);
		expect(hint()).toContain(
			'Stellen Sie die Kategorie auf nicht umlagefähig, fliessen ihre schon erfassten Rechnungen nicht mehr in neue Nebenkostenabrechnungen; schon erstellte bleiben, wie sie sind. Stellen Sie sie später zurück, müssen Sie diese Rechnungen einzeln wieder auf «Umlagefähig» stellen.'
		);
		expect(hint()).not.toContain('schuldet der Mieter');
		expect(hint()).toContain(
			'Ändern Sie den Namen oder die Beschreibung, schlägt die KI für neue Rechnungen womöglich eine andere Kategorie vor.'
		);
	});

	it('sagt bei einer nicht umlagefähigen vordefinierten Kategorie, dass der Mieter Kosten des Vermieters nicht schuldet', () => {
		show(EditCategoryPage, {
			data: { category: { ...seeded, isAllowedUtilityCost: false }, kiEnabled: true },
			form: null
		} as never);

		expect(hint()).toContain(
			'Wählen Sie «Umlagefähig», schuldet der Mieter Kosten, die das Gesetz dem Vermieter zuweist, trotzdem nicht. Die Wahl gilt nur für neue Rechnungen; schon erfasste bleiben nicht umlagefähig.'
		);
		expect(hint()).not.toContain('Stellen Sie die Kategorie auf nicht umlagefähig');
	});

	it('nennt die KI nicht, solange sie ausgeschaltet ist', () => {
		show(EditCategoryPage, { data: { category: seeded, kiEnabled: false }, form: null } as never);

		expect(hint()).toContain('Sie lässt sich nicht löschen.');
		expect(hint()).not.toContain('KI');
	});

	it('zeigt beim Bearbeiten einer eigenen Kategorie keinen solchen Hinweis', () => {
		show(EditCategoryPage, { data: { category: own }, form: null } as never);

		expect(byTestId('category-predefined-hint')).toBeNull();
	});
});
