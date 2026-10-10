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

import KeysPage from '../routes/config/distribution-keys/+page.svelte';
import NewKeyPage from '../routes/config/distribution-keys/new/+page.svelte';
import EditKeyPage from '../routes/config/distribution-keys/[id]/edit/+page.svelte';
import { toasts } from '$lib/stores';
import { allByTestId, byTestId, click, fireEvent, settle, show } from './helpers/dom';

const key = (id: string, name: string, type: 'predefined' | 'custom', usageCount = 0) => ({
	id,
	name,
	type,
	formula: '{area}',
	description: '',
	usageCount
});
const keys = [
	key('k1', 'Pro Fläche (m²)', 'predefined', 1),
	key('k2', 'Eigener', 'custom', 2),
	key('k3', 'Leer', 'custom')
];
const text = () => document.body.textContent!.replace(/\s+/g, ' ');
const toastTexts = () => get(toasts).map((toast) => toast.message);

beforeEach(() => toasts.set([]));

describe('Verteilschlüssel', () => {
	it('lässt nur eigene Verteilschlüssel bearbeiten und löschen, und nur ohne Rechnungen', () => {
		show(KeysPage, { data: { keys }, form: null } as never);

		expect(allByTestId('distribution-key-edit-button')).toHaveLength(2);
		const [used, unused] = allByTestId('distribution-key-delete-button') as HTMLButtonElement[];
		expect(used.disabled).toBe(true);
		expect(unused.disabled).toBe(false);
		expect(unused.getAttribute('aria-label')).toBe('Verteilschlüssel «Leer» löschen');
	});

	it('öffnet einen eigenen Verteilschlüssel über seinen Namen', () => {
		show(KeysPage, { data: { keys }, form: null } as never);

		const link = allByTestId('distribution-key-row')[1].querySelector('a')!;
		expect(link.textContent!.trim()).toBe('Eigener');
		expect(link.getAttribute('href')).toBe('/config/distribution-keys/k2/edit');
		expect(allByTestId('distribution-key-row')[0].querySelector('a')).toBeNull();
	});

	it('zählt die Rechnungen in Einzahl und Mehrzahl', () => {
		show(KeysPage, { data: { keys }, form: null } as never);

		expect(allByTestId('distribution-key-usage').map((usage) => usage.textContent!.trim())).toEqual(
			['1 Rechnung', '2 Rechnungen', '0 Rechnungen']
		);
	});

	it('erklärt Verteilschlüssel und Formeln in Alltagssprache', () => {
		show(KeysPage, { data: { keys }, form: null } as never);

		expect(text()).toContain('wie die Kosten eines Gebäudes auf die einzelnen Wohnungen');
		expect(text()).toContain('Jede Wohnung trägt den Teil der Kosten');
		expect(text()).toContain('* mal');
	});

	it('erklärt die Summen des Gebäudes an einem gemischten Schlüssel 70/30', () => {
		show(KeysPage, { data: { keys }, form: null } as never);

		expect(text()).toContain('0.7 * {area} / {area_total} + 0.3 * {units} / {units_total}');
		expect(text()).toContain('{area_total} Summe der Wohnflächen aller Wohnungen');
	});

	it('fragt vor dem Löschen nach', () => {
		show(KeysPage, {
			data: { keys: [key('k3', 'Leer', 'custom')] },
			form: { error: 'Löschen fehlgeschlagen' }
		} as never);

		click('distribution-key-delete-button');
		expect(text()).toContain('Verteilschlüssel «Leer» löschen?');
		expect(text()).toContain('Löschen fehlgeschlagen');
	});

	it('bestätigt das Löschen mit dem Namen des Verteilschlüssels', async () => {
		show(KeysPage, { data: { keys: [key('k3', 'Leer', 'custom')] }, form: null } as never);

		click('distribution-key-delete-button');
		click('distribution-key-delete-confirm');
		await answer({ type: 'redirect' });

		expect(toastTexts()).toEqual(['Verteilschlüssel «Leer» gelöscht']);
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

	it('bestätigt das Speichern mit dem Namen des Verteilschlüssels', async () => {
		show(NewKeyPage, { form: null } as never);
		fireEvent(byTestId<HTMLInputElement>('distribution-key-name-input')!, 'input', 'Nach Zimmern');

		await answer({ type: 'redirect' });

		expect(toastTexts()).toEqual(['Verteilschlüssel «Nach Zimmern» gespeichert']);
	});
});

describe('Verteilschlüssel bearbeiten', () => {
	it('füllt Name und Formel und meldet Fehler pro Feld', () => {
		const data = { key: { ...key('k2', 'Eigener', 'custom'), formula: '{rooms} * 2' } };
		show(EditKeyPage, { data, form: { errors: { formula: 'Formel ist ungültig' } } } as never);

		expect(byTestId<HTMLInputElement>('distribution-key-name-input')!.value).toBe('Eigener');
		expect(byTestId<HTMLInputElement>('distribution-key-formula-input')!.value).toBe('{rooms} * 2');
		expect(byTestId('form-error')!.textContent).toContain('Formel ist ungültig');
	});
});
