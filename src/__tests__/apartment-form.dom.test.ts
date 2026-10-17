import { describe, it, expect, vi } from 'vitest';
import { get } from 'svelte/store';
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
import { byTestId, fireEvent, show } from './helpers/dom';

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
});
