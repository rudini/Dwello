import { describe, it, expect } from 'vitest';
import KeysPage from '../routes/config/distribution-keys/+page.svelte';
import NewKeyPage from '../routes/config/distribution-keys/new/+page.svelte';
import EditKeyPage from '../routes/config/distribution-keys/[id]/edit/+page.svelte';
import { allByTestId, byTestId, click, show } from './helpers/dom';

const key = (id: string, name: string, type: 'predefined' | 'custom', usageCount = 0) => ({
	id,
	name,
	type,
	formula: '{area}',
	description: '',
	usageCount
});

describe('Verteilschlüssel', () => {
	it('lässt nur eigene Verteilschlüssel bearbeiten und löschen, und nur ohne Rechnungen', () => {
		const keys = [
			key('k1', 'Nach Fläche', 'predefined'),
			key('k2', 'Eigener', 'custom', 2),
			key('k3', 'Leer', 'custom')
		];
		show(KeysPage, { data: { keys }, form: null } as never);

		expect(allByTestId('distribution-key-edit-button')).toHaveLength(2);
		const [used, unused] = allByTestId('distribution-key-delete-button') as HTMLButtonElement[];
		expect(used.disabled).toBe(true);
		expect(unused.disabled).toBe(false);
	});

	it('fragt vor dem Löschen nach', () => {
		show(KeysPage, {
			data: { keys: [key('k3', 'Leer', 'custom')] },
			form: { error: 'Löschen fehlgeschlagen' }
		} as never);

		click('distribution-key-delete-button');
		expect(document.body.textContent).toContain('«Leer»');
		expect(document.body.textContent).toContain('Löschen fehlgeschlagen');
	});
});

describe('Verteilschlüssel erfassen', () => {
	it('beginnt mit der Formel nach Fläche und fügt Variablen per Klick an', () => {
		show(NewKeyPage, { form: null } as never);
		const formula = byTestId<HTMLInputElement>('distribution-key-formula-input')!;
		expect(formula.value).toBe('{area}');

		click(
			[...document.querySelectorAll('button')].find((b) => b.textContent?.includes('{rooms}'))!
		);
		expect(formula.value).toBe('{area}{rooms}');
	});

	it('zeigt das Ergebnis des Formeltests mit Fehlern und Anteilen', () => {
		const test = {
			errors: ['Unbekannte Variable {persons}'],
			results: [{ apartment: 'Wohnung 1.01', share: '42.5%' }]
		};
		show(NewKeyPage, { form: { test } } as never);

		expect(byTestId('formula-test-error')!.textContent).toBe('Unbekannte Variable {persons}');
		expect(byTestId('formula-test-share')!.textContent).toBe('42.5%');
	});
});

describe('Verteilschlüssel bearbeiten', () => {
	it('füllt Name und Formel und meldet Fehler pro Feld', () => {
		const data = { key: { ...key('k2', 'Eigener', 'custom'), formula: '{rooms} * 2' } };
		show(EditKeyPage, { data, form: { errors: { formula: 'Formel ist ungültig' } } } as never);

		expect(byTestId<HTMLInputElement>('distribution-key-name-input')!.value).toBe('Eigener');
		expect(byTestId<HTMLInputElement>('distribution-key-formula-input')!.value).toBe('{rooms} * 2');
		expect(document.body.textContent).toContain('Formel ist ungültig');
	});
});
