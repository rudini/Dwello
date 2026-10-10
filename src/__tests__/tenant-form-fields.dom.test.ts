import { describe, expect, it } from 'vitest';
import TenantFormFields from '$lib/components/TenantFormFields.svelte';
import { byTestId, fireEvent, show } from './helpers/dom';

describe('Mieterformular nach einem abgelehnten Speichern', () => {
	// The address was only needed for letters
	it('nimmt die Fehler der Adresse weg, wenn der Korrespondenzkanal wechselt', () => {
		show(TenantFormFields, {
			errors: {
				firstName: 'Vorname ist erforderlich',
				address: 'Für Briefe ist eine Adresse erforderlich',
				city: 'Für Briefe ist ein Ort erforderlich'
			}
		});

		fireEvent(byTestId<HTMLSelectElement>('tenant-channel-select')!, 'change', 'email');

		expect(byTestId('tenant-address-input')!.getAttribute('aria-invalid')).toBeNull();
		expect(byTestId('tenant-city-input')!.getAttribute('aria-invalid')).toBeNull();
		expect(document.body.textContent).not.toContain('Für Briefe');
		expect(byTestId('tenant-first-name-input')!.getAttribute('aria-invalid')).toBe('true');
	});
});
