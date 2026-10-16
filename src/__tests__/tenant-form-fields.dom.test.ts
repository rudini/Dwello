import { describe, expect, it } from 'vitest';
import TenantFormFields from '../routes/tenants/TenantFormFields.svelte';
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

// Das PDF gibt es noch nicht auf Rätoromanisch: wer es wählt, soll wissen, was der Mieter erhält
it('sagt bei der Sprache, dass Rätoromanisch vorerst deutsch erstellt wird', () => {
	show(TenantFormFields, {});

	expect(document.body.textContent).toContain('Auf Rätoromanisch erstellt Dwello die Abrechnung vorerst auf Deutsch.');
});

// #68: die Hilfe gehört zur ganzen Korrespondenzadresse, das Beispiel der Strasse bleibt bei der Strasse (Review C-1)
it('beschreibt die Korrespondenzadresse mit ihrer Hilfe, ohne die Beschreibung der Strasse zu verdecken', () => {
	show(TenantFormFields, {});

	const fieldset = byTestId('tenant-address-help')!.closest('fieldset')!;
	const help = document.getElementById(fieldset.getAttribute('aria-describedby')!)!;
	expect(help.textContent).toContain('Hierhin gehen Abrechnungen und Mahnungen');
	const street = byTestId('tenant-address-input')!;
	for (const id of street.getAttribute('aria-describedby')!.split(' '))
		expect(document.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
	expect(byTestId('tenant-country-select')!.getAttribute('aria-required')).toBe('false');
});
