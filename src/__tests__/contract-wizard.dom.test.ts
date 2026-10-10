import { describe, it, expect, vi, beforeEach } from 'vitest';

const location = vi.hoisted(() => ({ url: new URL('http://localhost/contracts/new') }));
vi.mock('$app/environment', () => ({ browser: true }));
vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/stores', () => ({
	page: { subscribe: (run: (value: unknown) => void) => (run({ url: location.url }), () => {}) }
}));

import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import NewContractPage from '../routes/contracts/new/+page.svelte';
import { toasts } from '$lib/stores';
import { writeDraft } from '$lib/wizard-draft';
import { byTestId, click, fakeBff, fireEvent, settle, show, submit } from './helpers/dom';

const data = {
	tenants: [
		{ id: 't1', name: 'Anna Keller' },
		{ id: 't2', name: 'Bruno Meier' }
	],
	apartments: [
		{ id: 'a1', unit: '2.01', building: 'Ahornhof' },
		{ id: 'a2', unit: '2.02', building: 'Ahornhof' },
		{ id: 'a3', unit: '2.03', building: 'Ahornhof' }
	]
};
// As the contract list answers: a2 is rented without end, a1's last contract ended long ago
const contractsOf: Record<string, unknown[]> = {
	a1: [{ id: 'c8', startDate: '2015-01-01', endDate: '2019-12-31', tenantName: 'Ueli Graf' }],
	a2: [{ id: 'c9', startDate: '2024-04-01', endDate: null, tenantName: 'Eva Frei' }],
	a3: [{ id: 'c7', startDate: '2015-01-01', endDate: '2099-12-31', tenantName: 'Ida Roth' }] // free from 2100
};

function backend() {
	return fakeBff(({ method, path }) => {
		if (method === 'POST') return [201, { id: 'c1' }];
		return [200, { contracts: contractsOf[path.split('=')[1]] ?? [] }];
	});
}

// The step heading, without the position that only screen readers hear ("Schritt 2 von 5:")
const heading = () => document.querySelector('h2 [data-step-label]')!.textContent!.trim();
const select = (testid: string, value: string) =>
	fireEvent(byTestId<HTMLSelectElement>(testid)!, 'change', value);
const type = (testid: string, value: string) =>
	fireEvent(byTestId<HTMLInputElement>(testid)!, 'input', value);
const next = () => submit('wizard-next');

async function open() {
	show(NewContractPage, { data } as never);
	await settle();
}

async function untilReview() {
	await open();
	select('contract-tenant-select', 't1');
	next();
	select('apartment-select', 'a1');
	next();
	type('start-date-input', '2027-01-01');
	next();
	type('contract-base-rent-input', '950');
	type('contract-advance-payment-input', '180');
	next();
}

beforeEach(() => {
	localStorage.clear();
	location.url = new URL('http://localhost/contracts/new');
	vi.mocked(goto).mockClear();
	toasts.set([]);
	backend();
});

describe('Mietvertrag erfassen', () => {
	it('beginnt beim Mieter und geht ohne Mieter nicht weiter', async () => {
		await open();
		expect(heading()).toBe('Mieter');
		expect(document.querySelector('h2')!.textContent).toMatch(/Schritt 1 von 5:\s*Mieter/);
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain('Bitte wählen Sie einen Mieter aus');
		expect(heading()).toBe('Mieter');
		// the field with the error gets the focus, so its error is read out
		expect(document.activeElement).toBe(byTestId('contract-tenant-select'));
		select('contract-tenant-select', 't1');
		expect(byTestId('form-error')).toBeNull();
	});

	it('führt Schritt für Schritt weiter und setzt den Fokus auf den neuen Schritt', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		expect(heading()).toBe('Wohnung');
		expect(document.activeElement).toBe(document.querySelector('h2'));
	});

	it('verliert beim Zurückgehen keine Angaben', async () => {
		await open();
		select('contract-tenant-select', 't2');
		next();
		click('wizard-back');
		expect(byTestId<HTMLSelectElement>('contract-tenant-select')!.value).toBe('t2');
	});

	it('bietet vermietete Wohnungen nicht an, wohl aber solche mit beendetem Vertrag', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		const options = [...byTestId<HTMLSelectElement>('apartment-select')!.options].slice(1);
		expect(options.map((o) => [o.value, o.disabled])).toEqual([
			['a1', false],
			['a3', false],
			['a2', true]
		]);
	});

	it('wiederholt das gewählte Datum in Worten', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		select('apartment-select', 'a1');
		next();
		type('start-date-input', '2026-11-01');
		expect(document.body.textContent).toContain('Sonntag, 1. November 2026');
	});

	it('erklärt die Miete, rechnet das Total und weist auf fehlendes Akonto hin', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		select('apartment-select', 'a1');
		next();
		type('start-date-input', '2027-01-01');
		next();
		expect(document.body.textContent).toContain(
			'Monatlicher Vorschuss des Mieters für Nebenkosten'
		);
		type('contract-base-rent-input', '950');
		expect(byTestId('advance-payment-notice')).not.toBeNull();
		type('contract-advance-payment-input', '180');
		expect(byTestId('advance-payment-notice')).toBeNull();
		expect(byTestId('contract-monthly-total')!.textContent).toContain('1’130.00');
	});

	it('zeigt vor dem Speichern alles in Worten und speichert Akonto als Akonto', async () => {
		await untilReview();
		expect(heading()).toBe('Prüfen');
		const items = [...document.querySelectorAll('[data-testid="contract-review-item"]')];
		expect(items.map((item) => item.textContent!.replace(/\s+/g, ' ').trim())).toContain(
			'Akonto CHF 180.00 Ändern'
		);
		const calls = backend();
		submit('submit-button');
		await settle();
		expect(calls.at(-1)).toMatchObject({
			method: 'POST',
			path: '/contracts',
			body: { tenantId: 't1', apartmentId: 'a1', monthlyAdvancePayment: '180', additionalRent: '0' }
		});
		expect(get(toasts)[0].message).toBe('Mietvertrag von Anna Keller gespeichert');
		expect(goto).toHaveBeenCalledWith('/contracts');
		expect(localStorage.length).toBe(0); // the draft is gone once saved
	});

	it('führt aus der Prüfung zum Schritt zurück, der etwas ändert', async () => {
		await untilReview();
		const rent = [...document.querySelectorAll('[data-testid="contract-review-item"]')].find(
			(item) => item.textContent!.includes('Nettomiete')
		)!;
		click(rent.querySelector('button')!);
		expect(heading()).toBe('Miete');
	});

	it('setzt beim Ändern aus der Prüfung den Fokus auf das Feld, das geändert wird', async () => {
		await untilReview();
		const advance = [...document.querySelectorAll('[data-testid="contract-review-item"]')].find(
			(item) => item.textContent!.includes('Akonto')
		)!;
		click(advance.querySelector('button')!);
		await settle();
		expect(document.activeElement!.id).toBe('advancePayment');
	});

	it('meldet einen Fehler beim Speichern und bleibt bei der Prüfung', async () => {
		await untilReview();
		// as the backend answers an overlap: English, with the other contract's id
		fakeBff(() => [
			400,
			{ error: 'Contract overlaps with existing contract 3f2a0000-0000-4000-8000-000000000000' }
		]);
		submit('submit-button');
		await settle();
		const error = byTestId('form-error')!.textContent!;
		expect(error).toContain('überschneidet sich mit einem anderen Mietvertrag');
		expect(error).not.toContain('Contract');
		expect(goto).not.toHaveBeenCalled();
	});
});

describe('Prüfungen im Mietvertrag', () => {
	it('versteht Beträge mit Tausendertrennzeichen', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		select('apartment-select', 'a1');
		next();
		type('start-date-input', '2027-01-01');
		next();
		type('contract-base-rent-input', "1'450");
		expect(byTestId('contract-monthly-total')!.textContent).toContain('1’450.00');
		next();
		const rent = [...document.querySelectorAll('[data-testid="contract-review-item"]')].find((i) =>
			i.textContent!.includes('Nettomiete')
		)!;
		expect(rent.textContent).toContain('1’450.00');
	});

	async function toPeriod(apartment = 'a1') {
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		select('apartment-select', apartment);
		next();
		await settle();
	}

	it('fragt nach, wenn der Vertragsbeginn in der Vergangenheit liegt, und geht erst beim zweiten Mal weiter', async () => {
		await toPeriod();
		type('start-date-input', '2020-01-11');
		expect(byTestId('start-date-notice')!.getAttribute('role')).toBe('status'); // read out while typing
		next();
		await settle();
		expect(heading()).toBe('Vertragsdauer');
		expect(byTestId('form-error')!.textContent).toContain('nochmals auf «Weiter»');
		expect(document.activeElement).toBe(byTestId('start-date-input'));
		next();
		await settle();
		expect(heading()).toBe('Miete');
	});

	it('lehnt ein unmögliches Datum ab', async () => {
		await toPeriod();
		type('start-date-input', '12026-01-12');
		next();
		await settle();
		expect(byTestId('form-error')!.textContent).toContain('Bitte prüfen Sie das Datum');
	});

	it('füllt einen geleerten Vertragsbeginn nicht wieder aus', async () => {
		await toPeriod('a3');
		expect(byTestId<HTMLInputElement>('start-date-input')!.value).toBe('2100-01-01'); // suggested
		type('start-date-input', '');
		next();
		await settle();
		expect(byTestId<HTMLInputElement>('start-date-input')!.value).toBe('');
		expect(byTestId('form-error')!.textContent).toContain('Vertragsbeginn ist erforderlich');
	});

	it('geht bei einer Überschneidung nicht weiter', async () => {
		await open();
		select('contract-tenant-select', 't1');
		next();
		await settle();
		select('apartment-select', 'a1'); // its last contract ran 2015–2019
		next();
		await settle();
		type('start-date-input', '2016-01-01');
		next();
		expect(byTestId('overlap-warning')).not.toBeNull();
		expect(heading()).toBe('Vertragsdauer');
		// fixed by a limited contract that ends before the old one began: the error goes
		click(byTestId('contract-duration')!.querySelectorAll('input')[1]);
		type('end-date-input', '2014-12-31');
		type('start-date-input', '2014-01-01');
		await settle();
		expect(byTestId('overlap-warning')).toBeNull();
		expect(byTestId('form-error')).toBeNull();
	});
});

describe('Entwurf des Mietvertrags', () => {
	it('legt erst einen Entwurf an, wenn der Benutzer etwas eingibt', async () => {
		location.url = new URL('http://localhost/contracts/new?tenant=t2');
		await open();
		await settle();
		expect(localStorage.length).toBe(0);
		select('contract-tenant-select', 't1');
		await settle();
		expect(localStorage.length).toBe(1);
	});

	it('speichert die Angaben im Browser und sagt es', async () => {
		await open();
		select('contract-tenant-select', 't1');
		await settle();
		expect(byTestId('save-status')!.textContent).toContain('Entwurf gespeichert');
	});

	it('setzt einen Entwurf fort und lässt ihn verwerfen', async () => {
		writeDraft(localStorage, 'contract', { tenantId: 't2', baseRent: '900' }, new Date());
		await open();
		expect(byTestId('draft-restored')).not.toBeNull();
		await settle();
		expect(document.activeElement).toBe(byTestId('draft-restored')); // read out right away
		expect(byTestId<HTMLSelectElement>('contract-tenant-select')!.value).toBe('t2');
		click('draft-discard');
		await settle();
		expect(byTestId('draft-restored')).toBeNull();
		expect(document.activeElement).toBe(document.querySelector('h2'));
		expect(byTestId<HTMLSelectElement>('contract-tenant-select')!.value).toBe('');
		expect(localStorage.length).toBe(0);
	});

	it('übernimmt einen eben erfassten Mieter und bestätigt ihn', async () => {
		location.url = new URL('http://localhost/contracts/new?tenant=t2&created=1');
		await open();
		expect(byTestId<HTMLSelectElement>('contract-tenant-select')!.value).toBe('t2');
		expect(byTestId('tenant-created')!.textContent).toContain('Bruno Meier');
		await settle();
		expect(document.activeElement).toBe(byTestId('tenant-created')); // read out right away
		expect(byTestId('contract-new-tenant')!.getAttribute('href')).toBe('/tenants/new?for=contract');
		select('contract-tenant-select', 't1'); // the confirmation is about Bruno, not the new choice
		expect(byTestId('tenant-created')).toBeNull();
	});
});
