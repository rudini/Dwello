import { describe, it, expect } from 'vitest';
import { toCategory } from '$lib/server/category';
import CategoryRow from '../routes/config/categories/CategoryRow.svelte';
import CategoryForm from '../routes/config/categories/CategoryForm.svelte';
import backendCategory from '../../tests/contracts/category.json';
import { show } from './helpers/dom';

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
		expect(document.querySelector('#description')?.tagName).toBe('TEXTAREA');
	});
});
