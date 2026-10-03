import { describe, it, expect } from 'vitest';
import CategoriesPage from '../routes/config/categories/+page.svelte';
import { allByTestId, byTestId, click, show } from './helpers/dom';

const category = (id: string, name: string, isAllowedUtilityCost: boolean, usageCount = 0) => ({
	id,
	name,
	description: '',
	isAllowedUtilityCost,
	usageCount
});
const categories = [category('c1', 'Heizung', true, 3), category('c2', 'Reparaturen', false)];
const names = () => allByTestId('category-name').map((cell) => cell.textContent);

describe('Kategorien', () => {
	it('filtert nach umlagefähigen und nicht umlagefähigen Kategorien', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);
		expect(names()).toEqual(['Heizung', 'Reparaturen']);

		click('category-filter-allowed');
		expect(names()).toEqual(['Heizung']);

		click('category-filter-disallowed');
		expect(names()).toEqual(['Reparaturen']);
		expect(byTestId('category-filter-disallowed')!.textContent).toContain('(1)');
	});

	it('lässt Kategorien mit Rechnungen nicht löschen', () => {
		show(CategoriesPage, { data: { categories }, form: null } as never);

		const [used, unused] = allByTestId('category-delete-button') as HTMLButtonElement[];
		expect(used.disabled).toBe(true);
		expect(unused.disabled).toBe(false);
	});

	it('fragt vor dem Löschen nach und zeigt den Fehler des Backends', () => {
		show(CategoriesPage, { data: { categories }, form: { error: 'Kategorie konnte nicht gelöscht werden' } } as never);

		click(allByTestId('category-delete-button')[1]);
		expect(document.body.textContent).toContain('«Reparaturen»');
		expect(document.body.textContent).toContain('Kategorie konnte nicht gelöscht werden');
	});
});
