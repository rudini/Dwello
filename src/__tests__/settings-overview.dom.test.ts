import { describe, it, expect, vi, beforeEach } from 'vitest';
import { flushSync } from 'svelte';

// the page's enhance callback, started as SvelteKit starts it when the form is sent
type Done = (opts: {
	update: () => Promise<void>;
	result: object;
	formElement: HTMLFormElement;
}) => Promise<void>;
let onSubmit: () => Done;
vi.mock('$app/forms', () => ({
	enhance: (_form: HTMLFormElement, submit: () => Done) => {
		onSubmit = submit;
		return { destroy() {} };
	}
}));

import OverviewPage from '../routes/config/+page.svelte';
import { show } from './helpers/dom';

const submitted: (string | null)[] = [];
beforeEach(() => {
	submitted.length = 0;
	vi.spyOn(HTMLFormElement.prototype, 'requestSubmit').mockImplementation(function (
		this: HTMLFormElement
	) {
		submitted.push(this.getAttribute('action'));
	});
});

const open = (form: object | null = null) => {
	show(OverviewPage, {
		data: { missing: { company: false, holder: false }, backup: 'off', updateCheck: true },
		form
	} as never);
	return document.querySelector<HTMLInputElement>('[data-testid="setting-updateCheck"]')!;
};
/** The answer to a sent form, as SvelteKit hands it to the page */
const answer = (done: Done, result: object) =>
	done({
		update: async () => {},
		result,
		formElement: document.querySelector<HTMLFormElement>('form[action="?/updateCheck"]')!
	});

// #1456: the switch of #1453 has no «Speichern»
describe('Suche nach neuen Versionen auf der Übersicht der Einstellungen', () => {
	it('sendet das Formular des Schalters, sobald er umgeschaltet wird', () => {
		open().click();

		expect(submitted).toEqual(['?/updateCheck']);
	});

	// Fallback review of #1460: two saves at once could store the older click last
	it('sendet beim zweiten Umschalten erst, wenn das erste Speichern beantwortet ist, und dann den letzten Stand', async () => {
		const box = open();
		box.click(); // off
		const done = onSubmit();
		box.click(); // on again, while the first save runs
		expect(submitted).toHaveLength(1);

		await answer(done, { type: 'success', data: { updateCheck: false } });

		expect(submitted).toHaveLength(2);
		expect(box.checked).toBe(true);
	});

	it('sendet nach dem Speichern nichts mehr, wenn der Schalter steht, wie gespeichert', async () => {
		const box = open();
		box.click();

		await answer(onSubmit(), { type: 'success', data: { updateCheck: false } });

		expect(submitted).toHaveLength(1);
	});

	// code review settings-overview-1 C-2: a save the backend refused says so at the switch
	it('meldet am Schalter, wenn die Änderung nicht gespeichert wurde', () => {
		const box = open({ error: 'Die Einstellungen konnten nicht gespeichert werden.' });

		expect(
			document.getElementById(box.getAttribute('aria-describedby')!.split(' ')[0])?.textContent
		).toContain('Die Einstellungen konnten nicht gespeichert werden.');
	});

	// Fallback review of #1460: the switch shows what is stored, not the click that was refused
	it('stellt den Schalter nach einem abgelehnten Speichern auf den gespeicherten Stand zurück', async () => {
		const box = open();
		box.click();
		expect(box.checked).toBe(false);

		await answer(onSubmit(), { type: 'failure', status: 502, data: { error: 'x' } });
		flushSync();

		expect(box.checked).toBe(true);
		expect(submitted).toHaveLength(1);
	});
});
