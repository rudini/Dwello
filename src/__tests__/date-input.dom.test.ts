import { describe, expect, it, vi } from 'vitest';
import { flushSync } from 'svelte';
import DateInput from '$lib/ui/DateInput.svelte';
import { byTestId, fireEvent, show } from './helpers/dom';

const field = () => byTestId<HTMLInputElement>('date-input')!;
const describedBy = () =>
	(field().getAttribute('aria-describedby') ?? '')
		.split(' ')
		.map((id) => document.getElementById(id)?.textContent?.trim());

/** The field with its value bound, as a page binds it */
function date(value = '', props: Record<string, unknown> = {}) {
	const bound = { value };
	show(DateInput, {
		id: 'invoiceDate',
		label: 'Rechnungsdatum',
		testid: 'date-input',
		...props,
		get value() {
			return bound.value;
		},
		set value(v: string) {
			bound.value = v;
		}
	});
	return bound;
}

function type(text: string) {
	fireEvent(field(), 'input', text);
}

describe('Datumsfeld TT.MM.JJJJ', () => {
	it('zeigt das Datum als TT.MM.JJJJ in einem Textfeld mit Zifferntastatur, unabhängig von der Sprache des Browsers', () => {
		date('2024-12-31');

		expect(field().type).toBe('text');
		expect(field().inputMode).toBe('numeric');
		expect(field().value).toBe('31.12.2024');
		expect(describedBy()).toContain('Format TT.MM.JJJJ. Beispiel: 31.12.2025');
	});

	it('nennt das Datum in Worten unter dem Feld', () => {
		date('2024-12-31');

		expect(byTestId('date-input-words')!.textContent).toContain('Dienstag, 31. Dezember 2024');
	});

	// Fehler behoben: wer die Punkte selbst tippt, bekam nach dem automatischen Punkt «31..12.2024»
	it('nimmt einen selbst getippten Punkt nach dem automatischen nicht doppelt', () => {
		const bound = date();

		type('31');
		type('31..');
		expect(field().value).toBe('31.');
		type('31.12..');
		expect(field().value).toBe('31.12.');
		type('31.12.2024');
		expect(bound.value).toBe('2024-12-31');
	});

	// Fehler behoben: nach dem Speichern leert das Formular die Felder, das Datum blieb versteckt stehen
	it('leert sich mit dem Formular, auch das gesendete Datum und die Worte', () => {
		const form = document.createElement('form');
		document.body.append(form);
		show(
			DateInput,
			{
				id: 'stockDate',
				label: 'Stichtag',
				name: 'readingDate',
				value: '2001-06-15',
				testid: 'date-input'
			},
			form
		);

		form.reset();
		flushSync();

		expect(field().value).toBe('');
		expect(form.querySelector<HTMLInputElement>('input[name=readingDate]')!.value).toBe('');
		expect(byTestId('date-input-words')!.textContent!.trim()).toBe('');
	});

	// Nach einer Fehlermeldung beim Speichern prüft das Feld ein neu getipptes Datum beim Verlassen
	it('meldet ein unmögliches Datum auch nach einer Fehlermeldung beim Speichern', () => {
		date('', { error: 'Bitte geben Sie ein Datum ein.' });

		type('30022025');
		field().dispatchEvent(new Event('blur'));
		flushSync();

		expect(describedBy()).toContain(
			'Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein, zum Beispiel 31.12.2025.'
		);
	});

	// Screenreader: das Datum in Worten gehört zum Feld, der Fehler beim Verlassen wird angesagt
	it('verbindet das Datum in Worten mit dem Feld und sagt einen Fehler beim Verlassen an', () => {
		date('2024-12-31');
		expect(describedBy()).toContain('Dienstag, 31. Dezember 2024');

		type('30.02.2025');
		field().dispatchEvent(new Event('blur'));
		flushSync();
		expect(document.querySelector('[aria-live="assertive"]')!.textContent).toContain(
			'Dieses Datum gibt es nicht.'
		);
	});

	it('übernimmt ein eingetipptes Datum und setzt die Punkte selbst', () => {
		const bound = date();

		type('31');
		expect(field().value).toBe('31.');
		type('31.12');
		expect(field().value).toBe('31.12.');
		type('31.12.2024');

		expect(bound.value).toBe('2024-12-31');
	});

	it('ergänzt beim Verlassen führende Nullen', () => {
		const bound = date();

		type('1.1.2025');
		field().dispatchEvent(new Event('blur'));
		flushSync();
		flushSync();

		expect(field().value).toBe('01.01.2025');
		expect(bound.value).toBe('2025-01-01');
	});

	it('meldet ein Datum, das es nicht gibt, beim Verlassen des Felds', () => {
		const bound = date();

		type('30.02.2025');
		field().dispatchEvent(new Event('blur'));
		flushSync();
		flushSync();

		expect(bound.value).toBe('');
		expect(field().getAttribute('aria-invalid')).toBe('true');
		expect(describedBy()).toContain(
			'Dieses Datum gibt es nicht. Bitte geben Sie es als TT.MM.JJJJ ein, zum Beispiel 31.12.2025.'
		);
	});

	it('sendet in einem Formular das Datum als JJJJ-MM-TT', () => {
		date('2024-12-31', { name: 'paymentDeadline' });

		expect(document.querySelector<HTMLInputElement>('input[name="paymentDeadline"]')!.value).toBe(
			'2024-12-31'
		);
		expect(field().name).toBe('');
	});

	it('öffnet auf Wunsch einen Kalender und übernimmt das gewählte Datum', () => {
		const bound = date();
		const calendar = document.querySelector<HTMLInputElement>('input[type="date"]')!;
		calendar.showPicker = vi.fn();

		byTestId('date-input-calendar')!.click();
		expect(calendar.showPicker).toHaveBeenCalled();
		expect(byTestId('date-input-calendar')!.getAttribute('aria-label')).toBe(
			'Kalender für Rechnungsdatum öffnen'
		);

		fireEvent(calendar, 'change', '2025-03-15');
		expect(bound.value).toBe('2025-03-15');
		expect(field().value).toBe('15.03.2025');
	});
});
