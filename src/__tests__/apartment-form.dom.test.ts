import { describe, it, expect, vi } from 'vitest';
import { get } from 'svelte/store';
import { flushSync } from 'svelte';
import type { SubmitFunction } from '@sveltejs/kit';

let submit: SubmitFunction;
vi.mock('$app/forms', () => ({
	enhance: (_form: HTMLFormElement, run: SubmitFunction) => {
		submit = run;
		return { destroy() {} };
	}
}));

import { toasts } from '$lib/stores';
import NewApartmentPage from '../routes/apartments/new/+page.svelte';
import EditApartmentPage from '../routes/apartments/[id]/edit/+page.svelte';
import { byTestId, fireEvent, settle, show } from './helpers/dom';

const buildings = [
	{ id: 'b1', name: 'Birkenhof', address: 'Birkenweg 2, 8400 Winterthur' },
	{ id: 'b2', name: 'Ahornhof', address: 'Ahornweg 1, 8400 Winterthur' }
];
const apartment = (status = 'vacant') => ({
	id: 'a1',
	buildingId: 'b1',
	number: '4.01',
	floor: 1,
	area: '70.00',
	rooms: '3.5',
	status,
	currentContractId: null,
	nextContractStart: null,
	building: {
		id: 'b1',
		name: 'Erlenhof',
		address: 'Erlenweg 3',
		postalCode: '8400',
		city: 'Winterthur'
	}
});
const trail = () =>
	[...document.querySelectorAll('[data-testid="breadcrumb-link"]')].map((link) => [
		link.textContent,
		link.getAttribute('href')
	]);
const labelOf = (testid: string) =>
	document
		.querySelector(`label[for="${byTestId(testid)!.id}"]`)!
		.textContent!.replace(/\s+/g, ' ')
		.trim();
const helpOf = (testid: string) =>
	document.getElementById(byTestId(testid)!.getAttribute('aria-describedby')!.split(' ')[0])!
		.textContent;

// What the form does once the server has saved the apartment and opens it
async function saved() {
	const after = submit({} as never) as (opts: unknown) => Promise<void>;
	await after({ result: { type: 'redirect', location: '/apartments/a1' }, update: vi.fn() });
}

describe('Neue Wohnung', () => {
	const open = (presetBuildingId: string | null = null, form: unknown = null) =>
		show(NewApartmentPage, { data: { buildings, presetBuildingId }, form } as never);

	it('nennt die Felder wie das Glossar und erklärt sie', () => {
		open();
		expect(document.querySelector('h1')!.textContent).toBe('Neue Wohnung');
		expect(trail()).toEqual([['Wohnungen', '/apartments']]);
		expect(labelOf('apartment-building-select')).toBe('Gebäude');
		expect(labelOf('apartment-number-input')).toBe('Wohnungsnummer');
		expect(helpOf('apartment-number-input')).toContain('pro Gebäude eindeutig');
		expect(labelOf('apartment-floor-select')).toBe('Stockwerk');
		expect(labelOf('apartment-area-input')).toBe('Fläche (m²)');
		expect(helpOf('apartment-area-input')).toContain('Nettowohnfläche');
		expect(byTestId('apartment-area-input')!.getAttribute('step')).toBe('0.1');
		expect(labelOf('apartment-rooms-select')).toBe('Zimmeranzahl');
		expect(byTestId('apartment-submit')!.textContent).toContain('Wohnung erfassen');
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/apartments');
	});

	it('erfasst die Wohnung im Gebäude, aus dem sie kommt', () => {
		open('b1');
		expect(trail()).toEqual([
			['Gebäude', '/buildings'],
			['Birkenhof', '/buildings/b1']
		]);
		expect(byTestId('apartment-building')!.textContent).toContain('Birkenhof');
		expect(document.querySelector<HTMLInputElement>('input[name="buildingId"]')!.value).toBe('b1');
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/buildings/b1');
	});

	it('zeigt die Fehler beim Feld', () => {
		open(null, {
			errors: { buildingId: 'Bitte wählen Sie ein Gebäude aus.', area: 'Fläche ist erforderlich.' }
		});
		const errors = [...document.querySelectorAll('[data-testid="form-error"]')].map((error) =>
			error.textContent!.trim()
		);
		expect(errors).toEqual(['Bitte wählen Sie ein Gebäude aus.', 'Fläche ist erforderlich.']);
	});

	it('bestätigt das Speichern mit der Wohnungsnummer', async () => {
		open('b1');
		fireEvent(byTestId<HTMLInputElement>('apartment-number-input')!, 'input', '2.01');
		await saved();
		expect(get(toasts).map((toast) => toast.message)).toContain('Wohnung 2.01 gespeichert');
	});
});

describe('Wohnung bearbeiten', () => {
	const open = (status = 'vacant') =>
		show(EditApartmentPage, { data: { apartment: apartment(status) }, form: null } as never);

	// a Wohnung taken from the Gebäuderegister can lie outside the usual choices (#479, fach-review V-16)
	it('behält Zimmeranzahl und Stockwerk ausserhalb der üblichen Auswahl', () => {
		show(EditApartmentPage, {
			data: { apartment: { ...apartment(), floor: 9, rooms: '7.5' } },
			form: null
		} as never);
		expect(byTestId<HTMLSelectElement>('apartment-rooms-select')!.value).toBe('7.5');
		expect(byTestId<HTMLSelectElement>('apartment-floor-select')!.value).toBe('9');
	});

	it('führt zurück zur Wohnung und zeigt ihre Werte', () => {
		open();
		expect(document.querySelector('h1')!.textContent).toBe('Wohnung 4.01 bearbeiten');
		expect(trail()).toEqual([
			['Wohnungen', '/apartments'],
			['Wohnung 4.01', '/apartments/a1']
		]);
		expect(byTestId<HTMLInputElement>('apartment-number-input')!.value).toBe('4.01');
		expect(byTestId<HTMLSelectElement>('apartment-rooms-select')!.value).toBe('3.5');
		expect(byTestId('apartment-submit')!.textContent).toContain('Änderungen speichern');
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/apartments/a1');
	});

	it('erklärt die beiden Mietstatus, die man von Hand setzt', () => {
		open();
		expect(labelOf('apartment-status-select')).toBe('Mietstatus');
		const help = helpOf('apartment-status-select')!;
		expect(help).toContain('Leer');
		expect(help).toContain('Gesperrt');
		expect(help).toContain('Mietvertrag');
	});

	it('zeigt den Mietstatus aus den Mietverträgen, ohne ihn ändern zu lassen', () => {
		open('occupied');
		expect(byTestId('apartment-status-rented')!.textContent!.trim()).toBe('Vermietet');
		expect(byTestId('apartment-status-select')).toBeNull();
		expect(document.body.textContent).toContain('ergibt sich aus den Mietverträgen');
	});

	it('bestätigt das Speichern mit der Wohnungsnummer', async () => {
		open();
		await saved();
		expect(get(toasts).map((toast) => toast.message)).toContain('Wohnung 4.01 gespeichert');
	});
	// #1284 (Code-Review 1284-2 C-2, fallback review): a day typed wrong is not sent as «empty», which would clear the
	// saved one
	it('sendet kein «Aufgehoben ab», solange der eingegebene Tag ungültig ist', async () => {
		show(EditApartmentPage, {
			data: { apartment: { ...apartment(), discontinuedFrom: '2025-07-01' } },
			form: null
		} as never);
		const input = byTestId<HTMLInputElement>('apartment-discontinued-input')!;
		fireEvent(input, 'input', '31.13.2025');
		input.dispatchEvent(new Event('blur'));
		flushSync();
		const cancel = vi.fn();
		submit({ formElement: input.form!, cancel } as never);
		expect(cancel).toHaveBeenCalled();
		// Code-Review 1284-4 C-1: the field with its error takes the focus, so the refusal is announced
		await settle();
		expect(document.activeElement).toBe(input);
	});

	// #1284, wording of Fachreview 1284-1 (a); #1301: a larger apartment gets its new values from the day (Fachreview 1301-1)
	it('erklärt «Aufgehoben ab» am Feld, auch wo eine grössere Wohnung ihre neue Fläche ab dem Tag erhält', () => {
		show(EditApartmentPage, {
			data: { apartment: { ...apartment(), discontinuedFrom: '2025-07-01' } },
			form: null
		} as never);
		expect(labelOf('apartment-discontinued-input')).toBe('Aufgehoben ab (optional)');
		expect(byTestId<HTMLInputElement>('apartment-discontinued-input')!.value).toBe('01.07.2025');
		expect(document.body.textContent!.replace(/\s+/g, ' ')).toContain(
			'Nur ausfüllen, wenn es die Wohnung nach einem Umbau ab diesem Tag nicht mehr gibt. Bis zum Tag davor zählt sie in den Abrechnungen mit, und ihren Anteil tragen Sie. Abrechnungen ab diesem Tag rechnen ohne sie. Versendete Abrechnungen bleiben unverändert; eine berichtigte Abrechnung rechnet mit diesem Tag. Solange es die Wohnung gibt, lassen Sie das Feld leer. Wird eine andere Wohnung dadurch grösser, erfassen Sie bei ihr unter «Bearbeiten» die neue Fläche und Zimmeranzahl ab demselben Tag.'
		);
	});

	// #1301: a day typed wrong would go out empty and correct the values from the last change instead
	it('sendet keine neuen Werte, solange der Tag, ab dem sie gelten, ungültig ist', async () => {
		show(EditApartmentPage, { data: { apartment: apartment() }, form: null } as never);
		const input = byTestId<HTMLInputElement>('apartment-size-from-input')!;
		fireEvent(input, 'input', '31.13.2025');
		input.dispatchEvent(new Event('blur'));
		flushSync();
		const cancel = vi.fn();
		submit({ formElement: input.form!, cancel } as never);
		expect(cancel).toHaveBeenCalled();
		await settle();
		expect(document.activeElement).toBe(input);
	});

	// #1301, wording of Fachreview 1301-1; empty on every visit: the day belongs to one save
	it('bietet einen Tag an, ab dem neue Fläche und Zimmeranzahl gelten, und erklärt ihn am Feld', () => {
		show(EditApartmentPage, { data: { apartment: apartment() }, form: null } as never);
		expect(labelOf('apartment-size-from-input')).toBe('Neue Fläche und Zimmeranzahl gelten ab (optional)');
		expect(byTestId<HTMLInputElement>('apartment-size-from-input')!.value).toBe('');
		expect(document.body.textContent!.replace(/\s+/g, ' ')).toContain(
			'Nur ausfüllen, wenn die Wohnung nach einem Umbau ab diesem Tag eine andere Fläche oder Zimmeranzahl hat, zum Beispiel nach einer Zusammenlegung. Bis zum Tag davor rechnen die Abrechnungen mit den bisherigen Werten, ab diesem Tag mit den neuen. Wollen Sie nur einen Fehler korrigieren, lassen Sie das Feld leer: Die Werte gelten dann für alle Abrechnungen, und wenn schon ein Tag erfasst ist, ab diesem Tag. Entwürfe, die Sie schon erstellt haben, berechnen Sie danach neu. Versendete Abrechnungen bleiben unverändert; eine berichtigte Abrechnung rechnet mit den Werten, die Sie hier speichern. Den Mietvertrag ändert Dwello dadurch nicht: Ist die Wohnung vermietet, passen Sie Nettomiete und Akonto dort an.'
		);
	});
});
