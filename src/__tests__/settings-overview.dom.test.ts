import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import OverviewPage from '../routes/config/+page.svelte';
import { show } from './helpers/dom';

// #1456: the switch of #1453 has no «Speichern»
describe('Suche nach neuen Versionen auf der Übersicht der Einstellungen', () => {
	it('sendet das Formular des Schalters, sobald er umgeschaltet wird', () => {
		const submitted: (string | null)[] = [];
		vi.spyOn(HTMLFormElement.prototype, 'requestSubmit').mockImplementation(function (
			this: HTMLFormElement
		) {
			submitted.push(this.getAttribute('action'));
		});
		show(OverviewPage, {
			data: { missing: { company: false, holder: false }, backup: 'off', updateCheck: true },
			form: null
		} as never);

		document.querySelector<HTMLInputElement>('[data-testid="setting-updateCheck"]')!.click();

		expect(submitted).toEqual(['?/updateCheck']);
	});

	// code review settings-overview-1 C-2: a save the backend refused says so at the switch
	it('meldet am Schalter, wenn die Änderung nicht gespeichert wurde', () => {
		show(OverviewPage, {
			data: { missing: { company: false, holder: false }, backup: 'off', updateCheck: true },
			form: { error: 'Die Einstellungen konnten nicht gespeichert werden.' }
		} as never);

		const box = document.querySelector('[data-testid="setting-updateCheck"]')!;
		expect(
			document.getElementById(box.getAttribute('aria-describedby')!.split(' ')[0])?.textContent
		).toContain('Die Einstellungen konnten nicht gespeichert werden.');
	});
});
