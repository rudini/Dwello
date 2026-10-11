import { describe, it, expect, vi } from 'vitest';

// enhance as SvelteKit wires it: the test plays the server's answer to an action of the page
const actions = vi.hoisted(() => new Map<string, (input: { formData: FormData }) => unknown>());
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit: (input: { formData: FormData }) => unknown) => {
		actions.set(form.getAttribute('action')!, submit);
		return { destroy() {} };
	}
}));
async function redirectAfter(action: string) {
	const after = actions.get(action)!({ formData: new FormData() }) as (
		input: unknown
	) => Promise<void>;
	await after({ update: async () => {}, result: { type: 'redirect' } });
}

import ContractPage from '../routes/contracts/[id]/+page.svelte';
import { get } from 'svelte/store';
import { toasts } from '$lib/stores';
import { byTestId, click, fireEvent, settle, show } from './helpers/dom';

const contract = (startDate: string, endDate: string | null) => ({
	id: 'c1',
	apartmentId: 'a1',
	tenantId: 't1',
	startDate,
	endDate,
	baseRent: '950.00',
	additionalRent: '50.00',
	monthlyAdvancePayment: '180.00',
	tenant: {
		id: 't1',
		firstName: 'Anna',
		lastName: 'Keller',
		email: null,
		phone: '+41 52 123 45 67',
		language: 'de'
	},
	apartment: { id: 'a1', buildingId: 'b1', number: '2.01', floor: 2, area: '70', rooms: '3.5' },
	building: {
		id: 'b1',
		name: 'Ahornhof',
		address: 'Ahornweg 1',
		postalCode: '8400',
		city: 'Winterthur'
	}
});

function open(
	startDate = '2024-04-01',
	endDate: string | null = null,
	form: unknown = null,
	today = '2026-10-10'
) {
	show(ContractPage, {
		data: {
			today,
			contract: contract(startDate, endDate),
			rentBreakdown: { baseRent: 950, additionalRent: 50, advancePayment: 180, total: 1180 }
		},
		form
	} as never);
}

const text = (testid: string) => byTestId(testid)!.textContent!.replace(/\s+/g, ' ').trim();
const amountOf = (label: string) =>
	[...document.querySelectorAll('dt')]
		.find((dt) => dt.textContent!.trim() === label)!
		.nextElementSibling!.textContent!.replace(/\s+/g, ' ')
		.trim();

describe('Mietvertragsdetail', () => {
	it('zeigt einen künftigen Mietvertrag als künftig, mit seinem Vertragsbeginn', () => {
		open('2099-11-01');
		expect(text('contract-status')).toBe('Künftig');
		expect(document.body.textContent).toContain('1.11.2099');
		expect(document.body.textContent).not.toMatch(/AKTIV|heute/);
	});

	it('bestimmt den Vertragsstatus mit dem Tag des Servers', () => {
		open('2099-11-01', null, null, '2099-11-01');
		expect(text('contract-status')).toBe('Laufend');
	});

	it('zeigt einen laufenden Mietvertrag ohne Ende als laufend und unbefristet', () => {
		open();
		expect(text('contract-status')).toBe('Laufend');
		expect(text('contract-end-date')).toBe('Unbefristet');
	});

	it('nennt Nettomiete, Akonto, Zusatzmiete und das monatliche Total', () => {
		open();
		expect(amountOf('Nettomiete')).toBe('CHF 950.00');
		expect(amountOf('Akonto')).toBe('CHF 180.00');
		expect(amountOf('Zusatzmiete')).toBe('CHF 50.00');
		expect(amountOf('Monatlich total')).toBe('CHF 1’180.00');
		expect(text('contract-total-rent')).toBe('CHF 1’180.00');
	});

	it('führt über die Namen zum Mieter und zur Wohnung', () => {
		open();
		expect(byTestId('contract-tenant-link')!.getAttribute('href')).toBe('/tenants/t1');
		expect(text('contract-tenant-link')).toBe('Anna Keller');
		expect(byTestId('contract-apartment-link')!.getAttribute('href')).toBe('/apartments/a1');
		expect(text('contract-apartment-link')).toBe('Wohnung 2.01');
		expect(byTestId('tenant-phone-link')!.getAttribute('href')).toBe('tel:+41 52 123 45 67');
	});

	// kein Vorschlag: ein schnelles Bestätigen soll den Mietvertrag nicht aus Versehen heute beenden
	it('fragt beim Beenden nach dem Vertragsende, ohne einen Tag vorzuschlagen', async () => {
		open();
		click('contract-end-button');
		const dialog = document.querySelector('[role=dialog]')!;
		expect(dialog.textContent).toContain('Mietvertrag beenden');
		expect(byTestId<HTMLInputElement>('contract-end-date-input')!.value).toBe('');
		click('contract-end-confirm');
		await settle();
		expect(dialog.textContent).toContain(
			'Bitte geben Sie das Vertragsende ein, zum Beispiel 31.03.2027.'
		);
		expect(dialog.textContent).toContain(
			'Der letzte Tag des Mietverhältnisses, zum Beispiel der Tag, auf den gekündigt ist.'
		);
		expect(byTestId('contract-end-confirm')!.textContent).toContain('Mietvertrag beenden');
	});

	it('sagt am Feld, wenn das Vertragsende vor heute liegt, und sendet nichts', async () => {
		open();
		click('contract-end-button');
		const submitted = vi.fn();
		document.querySelector('form[action="?/end"]')!.addEventListener('submit', submitted);
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.01.2024');
		click('contract-end-confirm');
		await settle();
		expect(document.querySelector('[role=dialog]')!.textContent).toContain(
			'Das Vertragsende kann nicht vor heute liegen.'
		);
		expect(submitted).not.toHaveBeenCalled();
	});

	// der Tag geht mit dem Formular an die Aktion; die Meldung nennt ihn
	it('sendet das Vertragsende und meldet den Tag, an dem der Mietvertrag endet', async () => {
		toasts.set([]);
		open();
		click('contract-end-button');
		fireEvent(byTestId<HTMLInputElement>('contract-end-date-input')!, 'input', '31.03.2027');
		await settle();
		const formData = new FormData();
		const after = actions.get('?/end')!({ formData }) as (input: unknown) => Promise<void>;
		expect(formData.get('endDate')).toBe('2027-03-31');
		await after({ update: async () => {}, result: { type: 'success' } });
		expect(get(toasts).map((toast) => toast.message)).toEqual([
			'Der Mietvertrag von Anna Keller endet am 31.03.2027'
		]);
	});

	// irrtümlich erfasst und noch nicht begonnen: er soll die Wohnung nicht blockieren
	it('lässt einen künftigen Mietvertrag löschen', () => {
		open('2099-11-01');
		click('contract-delete-button');
		expect(byTestId<HTMLButtonElement>('contract-delete-confirm')!.disabled).toBe(false);
	});

	// gekündigt, aber laufend; auch danach wird er für die Nebenkostenabrechnung gebraucht
	it('lässt einen laufenden Mietvertrag mit künftigem Vertragsende nicht löschen und sagt, wofür er bleibt', () => {
		open('2024-04-01', '2027-03-31');
		click('contract-delete-button');
		expect(byTestId<HTMLButtonElement>('contract-delete-confirm')!.disabled).toBe(true);
		const words = document.querySelector('[role=dialog]')!.textContent!.replace(/\s+/g, ' ');
		expect(words).toContain(
			'Der Mietvertrag läuft bis am 31.03.2027 und kann bis dahin nicht gelöscht werden.'
		);
		expect(words).toContain(
			'Behalten Sie ihn auch danach: Die Nebenkostenabrechnung braucht seine Mietstage.'
		);
	});

	it('lässt einen Mietvertrag ohne Vertragsende nicht löschen und sagt warum', () => {
		open();
		click('contract-delete-button');
		expect(byTestId<HTMLButtonElement>('contract-delete-confirm')!.disabled).toBe(true);
		expect(document.querySelector('[role=dialog]')!.textContent!.replace(/\s+/g, ' ')).toContain(
			'Ein laufender Mietvertrag kann nicht gelöscht werden. Wurde er gekündigt, tragen Sie unter «Beenden» das Vertragsende ein.'
		);
	});

	it('sagt vor dem Löschen, dass ein Mietvertrag mit Abrechnungen bleibt und wann Löschen passt', () => {
		open('2024-01-01', '2024-12-31');
		click('contract-delete-button');
		const words = document.querySelector('[role=dialog]')!.textContent!.replace(/\s+/g, ' ');
		expect(words).toContain(
			'Ein Mietvertrag mit Nebenkostenabrechnungen kann nicht gelöscht werden.'
		);
		expect(words).toContain('Löschen Sie einen Mietvertrag nur, wenn er irrtümlich erfasst wurde.');
		expect(words).not.toContain('bleiben erhalten');
	});

	it('bestätigt das Löschen mit dem Namen des Mieters', async () => {
		toasts.set([]);
		open('2024-01-01', '2024-12-31');
		click('contract-delete-button');
		await redirectAfter('?/delete');
		expect(get(toasts).map((toast) => toast.message)).toEqual([
			'Mietvertrag von Anna Keller gelöscht'
		]);
	});

	it('zeigt im Löschdialog, warum das Backend das Löschen ablehnt', () => {
		open('2024-01-01', '2024-12-31', {
			deleteError: 'Mietvertrag konnte nicht gelöscht werden.'
		});
		expect(document.querySelector('[role=dialog]')!.textContent).toContain(
			'Mietvertrag konnte nicht gelöscht werden.'
		);
		expect(byTestId<HTMLButtonElement>('contract-delete-confirm')!.disabled).toBe(false);
	});
});
