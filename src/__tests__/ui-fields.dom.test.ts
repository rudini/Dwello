import { describe, expect, it } from 'vitest';
import { flushSync, mount, unmount } from 'svelte';
import TextInput from '$lib/ui/TextInput.svelte';
import MoneyInput from '$lib/ui/MoneyInput.svelte';
import Select from '$lib/ui/Select.svelte';
import Textarea from '$lib/ui/Textarea.svelte';
import { fireEvent, show } from './helpers/dom';

const input = () => document.querySelector('input')!;
const describedBy = (field: HTMLElement) =>
	(field.getAttribute('aria-describedby') ?? '')
		.split(' ')
		.filter(Boolean)
		.map((id) => document.getElementById(id)?.textContent?.trim());

describe('Eingabefeld', () => {
	it('hat eine Beschriftung über dem Feld, die zum Feld gehört', () => {
		show(TextInput, { id: 'lastName', label: 'Nachname', value: '' });
		const label = document.querySelector('label')!;
		expect(label.textContent).toContain('Nachname');
		expect(label.getAttribute('for')).toBe(input().id);
		expect(label.compareDocumentPosition(input()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
	});

	it('zeigt die Hilfe mit Beispiel sichtbar und verknüpft sie mit dem Feld', () => {
		show(TextInput, {
			id: 'number',
			label: 'Wohnungsnummer',
			help: 'Bezeichnung der Wohnung im Gebäude.',
			example: '3.01',
			value: ''
		});
		expect(describedBy(input())).toEqual(['Bezeichnung der Wohnung im Gebäude. Beispiel: 3.01']);
	});

	it('zeigt ein Beispiel auch ohne Hilfetext', () => {
		show(TextInput, { id: 'zip', label: 'PLZ', example: '8400', value: '' });
		expect(describedBy(input())).toEqual(['Beispiel: 8400']);
	});

	it('meldet einen Fehler am Feld und kennzeichnet es als ungültig', () => {
		show(TextInput, {
			id: 'lastName',
			label: 'Nachname',
			error: 'Bitte geben Sie den Nachnamen ein.',
			value: ''
		});
		expect(input().getAttribute('aria-invalid')).toBe('true');
		expect(describedBy(input())).toContain('Bitte geben Sie den Nachnamen ein.');
		expect(document.querySelector('[data-testid="form-error"]')?.textContent).toContain(
			'Bitte geben Sie den Nachnamen ein.'
		);
	});

	// The error belongs to what was sent: once corrected it is gone, the next submit checks again
	it('nimmt den Fehler weg, sobald das Feld geändert wird, und zeigt ihn beim Senden wieder', () => {
		const form = document.body.appendChild(document.createElement('form'));
		form.addEventListener('submit', (event) => event.preventDefault());
		const field = mount(TextInput, {
			target: form,
			props: { id: 'firstName', label: 'Vorname', error: 'Vorname ist erforderlich.', value: '' }
		});
		flushSync();

		fireEvent(input(), 'input', 'Anna');
		expect(input().getAttribute('aria-invalid')).toBeNull();
		expect(document.body.textContent).not.toContain('Vorname ist erforderlich.');

		form.dispatchEvent(new Event('submit', { cancelable: true }));
		flushSync();
		expect(input().getAttribute('aria-invalid')).toBe('true');
		unmount(field);
	});

	// Persona Helga P-2 (#450): an empty field that another field's error names is marked too, and read with that error
	it('kennzeichnet ein Feld als ungültig, das der Fehler eines anderen Felds nennt, bis es geändert wird', () => {
		const error = document.body.appendChild(document.createElement('p'));
		error.id = 'iban-error';
		error.textContent = 'Mit einer IBAN braucht es die Firmenadresse.';
		const field = mount(TextInput, {
			target: document.body,
			props: { id: 'companyCity', label: 'Ort', invalidBy: 'iban-error', value: '' }
		});
		flushSync();

		expect(input().getAttribute('aria-invalid')).toBe('true');
		expect(describedBy(input())).toContain('Mit einer IBAN braucht es die Firmenadresse.');
		fireEvent(input(), 'input', 'Zürich');
		expect(input().getAttribute('aria-invalid')).toBeNull();
		unmount(field);
		error.remove();
	});

	it('nennt freiwillige Felder in Worten', () => {
		show(TextInput, { id: 'phone', label: 'Telefon', optional: true, value: '' });
		expect(document.querySelector('label')!.textContent).toContain('(optional)');
	});

	it('gibt die Eingabe zurück und trägt den Namen für Formular-Aktionen', () => {
		let city = '';
		show(TextInput, {
			id: 'city',
			name: 'city',
			label: 'Ort',
			get value() {
				return city;
			},
			set value(next: string) {
				city = next;
			}
		});
		fireEvent(input(), 'input', 'Winterthur');
		expect(city).toBe('Winterthur');
		expect(input().name).toBe('city');
	});
});

describe('Betragsfeld', () => {
	it('zeigt die Währung CHF und tabellarische Ziffern', () => {
		show(MoneyInput, { id: 'baseRent', label: 'Nettomiete', value: '1650.00' });
		expect(document.body.textContent).toContain('CHF');
		expect(input().inputMode).toBe('decimal');
		expect(input().className).toContain('tabular-nums');
	});
});

describe('Auswahlfeld', () => {
	it('bietet die Optionen und einen Platzhalter an', () => {
		show(Select, {
			id: 'channel',
			label: 'Korrespondenzkanal',
			placeholder: 'Bitte wählen',
			options: [
				{ value: 'letter', label: 'Brief' },
				{ value: 'email', label: 'E-Mail' }
			],
			value: ''
		});
		const options = [...document.querySelectorAll('option')].map((o) => o.textContent?.trim());
		expect(options).toEqual(['Bitte wählen', 'Brief', 'E-Mail']);
		expect(document.querySelector('label')!.getAttribute('for')).toBe(
			document.querySelector('select')!.id
		);
	});
});

describe('Textfeld', () => {
	it('ist ein beschriftetes mehrzeiliges Feld', () => {
		show(Textarea, { id: 'notes', label: 'Bemerkungen', optional: true, value: '' });
		expect(document.querySelector('label')!.getAttribute('for')).toBe(
			document.querySelector('textarea')!.id
		);
	});
});
