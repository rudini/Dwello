import { describe, it, expect, vi, beforeEach } from 'vitest';

// enhance as SvelteKit wires it: the test sends the form the way the browser would
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

import { baseLocale, overwriteGetLocale } from '$lib/paraglide/runtime';
import { toCategory } from '$lib/server/category';
import CategoryForm from '../routes/config/categories/CategoryForm.svelte';
import backendCategory from '../../tests/contracts/category.json';
import { byTestId, click, settle, show } from './helpers/dom';

// The save as the user starts it: whether the form went on to the server or stopped before
function save() {
	const cancel = vi.fn();
	server.submit!({
		formData: new FormData(server.form!),
		submitter: byTestId('category-submit'),
		cancel
	});
	return { sent: !cancel.mock.calls.length };
}
const choose = (value: 'true' | 'false') =>
	click(
		document.querySelector<HTMLInputElement>(
			`input[name="isAllowedUtilityCost"][value="${value}"]`
		)!
	);
const dialogText = () =>
	document.querySelector('[role="dialog"]')?.textContent?.replace(/\s+/g, ' ') ?? '';
const own = (count: number) => ({ ...toCategory(backendCategory), allocableInvoiceCount: count });
const predefined = (allocable: boolean) => ({
	...toCategory({
		...backendCategory,
		name: 'Property Tax',
		nameDE: 'Liegenschaftssteuer',
		type: 'predefined'
	}),
	isAllowedUtilityCost: allocable
});

let resubmitted = 0;
beforeEach(() => {
	resubmitted = 0;
	HTMLFormElement.prototype.requestSubmit = function () {
		resubmitted++;
	};
});

// #452 Punkt 2 (#309): Zurückstellen holt die Rechnungen nicht zurück
describe('Kategorie auf nicht umlagefähig stellen', () => {
	it('fragt mit der Zahl der umlagefähigen Rechnungen, bevor sie speichert', async () => {
		show(CategoryForm, { category: own(2), submitLabel: 'Speichern' });
		choose('false');

		expect(save().sent).toBe(false);
		await settle();

		expect(dialogText()).toContain('Kategorie «Internet» auf nicht umlagefähig stellen?');
		expect(dialogText()).toContain(
			'2 erfasste Rechnungen dieser Kategorie fliessen dann nicht mehr in neue Nebenkostenabrechnungen. Schon erstellte Abrechnungen bleiben, wie sie sind. Stellen Sie die Kategorie später zurück, bleiben diese Rechnungen nicht umlagefähig: Sie müssen sie einzeln wieder auf «Umlagefähig» stellen.'
		);
	});

	it('nennt eine einzelne Rechnung in der Einzahl', async () => {
		show(CategoryForm, { category: own(1), submitLabel: 'Speichern' });
		choose('false');
		save();
		await settle();

		expect(dialogText()).toContain(
			'1 erfasste Rechnung dieser Kategorie fliesst dann nicht mehr in neue Nebenkostenabrechnungen. Schon erstellte Abrechnungen bleiben, wie sie sind. Stellen Sie die Kategorie später zurück, bleibt diese Rechnung nicht umlagefähig: Sie müssen sie wieder auf «Umlagefähig» stellen.'
		);
	});

	it('speichert nach der Bestätigung', async () => {
		show(CategoryForm, { category: own(2), submitLabel: 'Speichern' });
		choose('false');
		save();
		await settle();

		click('category-allocability-confirm');

		expect(resubmitted).toBe(1);
		expect(save().sent).toBe(true);
	});

	it('speichert nach «Abbrechen» nichts', async () => {
		show(CategoryForm, { category: own(2), submitLabel: 'Speichern' });
		choose('false');
		save();
		await settle();

		click('dialog-cancel');

		expect(resubmitted).toBe(0);
		expect(dialogText()).toBe('');
	});

	it('fragt nicht ohne umlagefähige Rechnungen', () => {
		show(CategoryForm, { category: own(0), submitLabel: 'Speichern' });
		choose('false');

		expect(save().sent).toBe(true);
	});
});

// #452 Punkt 2 (#309): Kosten, die das Gesetz dem Vermieter zuweist (Art. 256b OR)
describe('Vordefinierte Kategorie auf umlagefähig stellen', () => {
	it('fragt, bevor eine nicht umlagefähige Kategorie von Dwello umlagefähig wird', async () => {
		show(CategoryForm, { category: predefined(false), submitLabel: 'Speichern' });
		choose('true');

		expect(save().sent).toBe(false);
		await settle();

		expect(dialogText()).toContain('Kategorie «Liegenschaftssteuer» auf umlagefähig stellen?');
		expect(dialogText()).toContain(
			'Dwello hat diese Kategorie nach dem Mietrecht als nicht umlagefähig voreingestellt. Kosten, die das Gesetz dem Vermieter zuweist, schuldet der Mieter auch dann nicht, wenn Sie die Kategorie umstellen. Die Wahl gilt für Rechnungen, die Sie dieser Kategorie ab jetzt zuordnen; schon erfasste bleiben nicht umlagefähig.'
		);
		click('category-allocability-confirm');
		expect(resubmitted).toBe(1);
	});

	it('fragt nicht bei einer eigenen Kategorie', () => {
		show(CategoryForm, {
			category: { ...own(0), isAllowedUtilityCost: false },
			submitLabel: 'Speichern'
		});
		choose('true');

		expect(save().sent).toBe(true);
	});
});

// #405 (decided), code review 452-2 C-12: the French choice reads as the texts that send the landlord to it
describe('Umlagefähigkeit auf Französisch', () => {
	// language check of the E2E stack: the question named Dwello's category in German
	it('nennt die Kategorie in der Rückfrage in der Sprache der Oberfläche', async () => {
		overwriteGetLocale(() => 'fr');
		try {
			show(CategoryForm, {
				category: { ...predefined(false), nameFR: 'Impôt foncier' },
				submitLabel: 'Enregistrer'
			});
			choose('true');
			save();
			await settle();

			expect(dialogText()).toContain('Impôt foncier');
			expect(dialogText()).not.toContain('Liegenschaftssteuer');
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
	});

	it('nennt die Wahl «Répercutable» und «Non répercutable»', () => {
		overwriteGetLocale(() => 'fr');
		try {
			show(CategoryForm, { category: own(0), submitLabel: 'Enregistrer' });
			const group = byTestId('category-allowance')!.textContent!.replace(/\s+/g, ' ');

			expect(group).toContain('Frais accessoires répercutables');
			expect(group).toContain('Répercutable');
			expect(group).toContain('Non répercutable');
			expect(group).not.toContain('mputable');
		} finally {
			overwriteGetLocale(() => baseLocale);
		}
	});
});
