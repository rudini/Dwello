import { describe, expect, it, onTestFinished } from 'vitest';
import Checkbox from '$lib/ui/Checkbox.svelte';
import RadioGroup from '$lib/ui/RadioGroup.svelte';
import { click, settle, show } from './helpers/dom';

describe('Kontrollkästchen', () => {
	it('lässt sich über seine Beschriftung umschalten und erklärt sich', () => {
		let checked = false;
		show(Checkbox, {
			id: 'allocable',
			label: 'Umlagefähig',
			help: 'Die Rechnung fliesst in die Nebenkostenabrechnung ein.',
			get checked() {
				return checked;
			},
			set checked(next: boolean) {
				checked = next;
			}
		});
		const box = document.querySelector<HTMLInputElement>('input[type=checkbox]')!;
		click(document.querySelector('label')!);
		expect(checked).toBe(true);
		const help = document.getElementById(box.getAttribute('aria-describedby')!)!;
		expect(help.textContent).toContain('fliesst in die Nebenkostenabrechnung');
	});
});

// #654: the error belongs to the choice that was sent; changing it takes the error away until the next check
describe('Fehler am Kontrollkästchen', () => {
	it('verschwindet, sobald das Kästchen umgeschaltet wird', async () => {
		show(Checkbox, { id: 'mistake', label: 'Irrtümlich erfasst', error: 'Bitte bestätigen Sie den Irrtum.' });
		const box = document.querySelector<HTMLInputElement>('input[type=checkbox]')!;
		click(box);
		await settle();
		expect(document.querySelector('[data-testid="form-error"]')).toBeNull();
		expect(box.getAttribute('aria-invalid')).toBeNull();
	});

	// the dialog checks again on submit and sets the same text: unticked again, the error must not stay hidden
	it('erscheint beim nächsten Abschicken wieder', async () => {
		const form = document.body.appendChild(document.createElement('form'));
		onTestFinished(() => form.remove());
		show(Checkbox, { id: 'mistake', label: 'Irrtümlich erfasst', error: 'Bitte bestätigen Sie den Irrtum.' }, form);
		click(document.querySelector<HTMLInputElement>('input[type=checkbox]')!);
		await settle();
		form.dispatchEvent(new Event('submit', { cancelable: true }));
		await settle();
		expect(document.querySelector('[data-testid="form-error"]')?.textContent).toContain('Bitte bestätigen Sie den Irrtum.');
	});
});

describe('Auswahlgruppe', () => {
	const options = [
		{
			value: 'unlimited',
			label: 'Unbefristet',
			description: 'Der Mietvertrag hat kein Vertragsende.'
		},
		{
			value: 'limited',
			label: 'Befristet',
			description: 'Der Mietvertrag endet an einem festen Datum.'
		}
	];

	it('fasst die Optionen unter einer Frage zusammen', () => {
		show(RadioGroup, {
			name: 'duration',
			legend: 'Wie lange läuft der Mietvertrag?',
			options,
			value: 'unlimited'
		});
		expect(document.querySelector('fieldset legend')!.textContent).toContain(
			'Wie lange läuft der Mietvertrag?'
		);
		const radios = document.querySelectorAll<HTMLInputElement>('input[type=radio]');
		expect(radios).toHaveLength(2);
		expect(radios[0].checked).toBe(true);
		expect(radios[0].name).toBe('duration');
	});

	it('beschreibt jede Option und übernimmt die Wahl', () => {
		let value = 'unlimited';
		show(RadioGroup, {
			name: 'duration',
			legend: 'Wie lange läuft der Mietvertrag?',
			options,
			get value() {
				return value;
			},
			set value(next: string) {
				value = next;
			}
		});
		const limited = document.querySelectorAll<HTMLInputElement>('input[type=radio]')[1];
		expect(
			document.getElementById(limited.getAttribute('aria-describedby')!)!.textContent
		).toContain('festen Datum');
		click(limited);
		expect(value).toBe('limited');
	});

	// #654: the label wraps the explanation, so a name taken from the whole label read it a second time
	it('liest die Erklärung einer Option nur als Beschreibung, nicht im Namen', () => {
		show(RadioGroup, { name: 'duration', legend: 'Dauer', options, value: '' });
		const limited = document.querySelectorAll<HTMLInputElement>('input[type=radio]')[1];
		const names = (attribute: string) =>
			(limited.getAttribute(attribute) ?? '')
				.split(' ')
				.map((id) => document.getElementById(id)?.textContent?.trim())
				.join(' ');
		expect(names('aria-labelledby')).toBe('Befristet');
		expect(names('aria-describedby')).toBe('Der Mietvertrag endet an einem festen Datum.');
	});

	it('meldet einen Fehler an der Gruppe', () => {
		show(RadioGroup, {
			name: 'duration',
			legend: 'Dauer',
			options,
			value: '',
			error: 'Bitte wählen Sie die Dauer.'
		});
		const fieldset = document.querySelector('fieldset')!;
		expect(fieldset.getAttribute('role')).toBe('radiogroup');
		expect(fieldset.getAttribute('aria-invalid')).toBe('true');
		expect(
			document.getElementById(fieldset.getAttribute('aria-describedby')!)!.textContent
		).toContain('Bitte wählen Sie die Dauer.');
	});

	// #654: the error belongs to the choice that was sent
	it('nimmt den Fehler weg, sobald eine Option gewählt wird', async () => {
		show(RadioGroup, { name: 'duration', legend: 'Dauer', options, value: '', error: 'Bitte wählen Sie die Dauer.' });
		click(document.querySelectorAll<HTMLInputElement>('input[type=radio]')[1]);
		await settle();
		expect(document.querySelector('[data-testid="form-error"]')).toBeNull();
		expect(document.querySelector('fieldset')!.getAttribute('aria-invalid')).toBeNull();
	});

	// Ein Screenreader liest die Fehlermeldung vor der Hilfe (G-6, Sven P-6 auf #176)
	it('nennt die Fehlermeldung vor Hilfe und Beschreibung', () => {
		show(RadioGroup, {
			name: 'duration',
			legend: 'Dauer',
			help: 'Befristet endet von selbst.',
			options,
			value: '',
			error: 'Bitte wählen Sie die Dauer.'
		});
		const first = (element: Element) => element.getAttribute('aria-describedby')!.split(' ')[0];
		expect(first(document.querySelector('fieldset')!)).toBe('duration-error');
		expect(first(document.querySelector('input[type="radio"]')!)).toBe('duration-error');
	});

	// Tests wählen eine Option über ihren Wert, in jeder Sprache (G-9 auf #176)
	it('gibt jeder Option eine Test-ID aus Gruppe und Wert', () => {
		show(RadioGroup, { name: 'duration', legend: 'Dauer', options, value: '', testid: 'contract-duration' });
		expect(document.querySelector('[data-testid="contract-duration-limited"]')).not.toBeNull();
	});
});
