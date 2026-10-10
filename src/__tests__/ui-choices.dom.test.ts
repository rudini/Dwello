import { describe, expect, it } from 'vitest';
import Checkbox from '$lib/ui/Checkbox.svelte';
import RadioGroup from '$lib/ui/RadioGroup.svelte';
import { click, show } from './helpers/dom';

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
});
