import { describe, it, expect, afterEach } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import WizardNavigation from '../routes/statements/generate/WizardNavigation.svelte';

let component: ReturnType<typeof mount> | undefined;
afterEach(() => {
	if (component) unmount(component);
	document.body.innerHTML = '';
});

const button = (testid: string) =>
	document.querySelector<HTMLButtonElement>(`[data-testid="${testid}"]`);

describe('WizardNavigation', () => {
	it('geht mit Weiter einen Schritt vor und mit Zurück wieder zurück', () => {
		component = mount(WizardNavigation, {
			target: document.body,
			props: { currentStep: 1, canProceed: true, submitStep: 3, lastStep: 4 }
		});
		expect(button('wizard-back')).toBeNull();

		button('wizard-next')!.click();
		flushSync();
		expect(button('wizard-back')).not.toBeNull();

		button('wizard-back')!.click();
		flushSync();
		expect(button('wizard-back')).toBeNull();
	});
});
