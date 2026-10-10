import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import WizardNav from '$lib/ui/WizardNav.svelte';
import { byTestId, click, show } from './helpers/dom';

// The statement wizard's navigation (formerly its own WizardNavigation) is the shared WizardNav
describe('Navigation der Assistenten', () => {
	it('geht mit Zurück einen Schritt zurück und bietet im ersten Schritt Abbrechen', () => {
		let step = 2;
		show(WizardNav, {
			step,
			last: 5,
			onback: () => step--,
			finalLabel: 'Entwürfe erstellen',
			finalTestid: 'generate-statements-button',
			cancelHref: '/statements'
		});
		click('wizard-back');
		expect(step).toBe(1);
	});

	it('nennt im letzten Schritt die Aktion des Assistenten', () => {
		show(WizardNav, {
			step: 5,
			last: 5,
			onback: () => {},
			finalLabel: 'Entwürfe erstellen',
			finalTestid: 'generate-statements-button',
			cancelHref: '/statements'
		});
		expect(byTestId('generate-statements-button')!.textContent).toContain('Entwürfe erstellen');
		expect(byTestId('wizard-next')).toBeNull();
	});
});
