import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$app/navigation', () => ({ goto: vi.fn() }));
vi.mock('$app/stores', () => ({
	page: {
		subscribe: (run: (value: unknown) => void) => (
			run({ url: new URL('http://localhost/contracts/c1/edit') }),
			() => {}
		)
	}
}));

import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import EditPage from '../routes/contracts/[id]/edit/+page.svelte';
import { toasts } from '$lib/stores';
import { byTestId, click, fakeBff, fireEvent, settle, show, submit } from './helpers/dom';
import refused from '../../tests/contracts/contract-end-refused.json';

const contract = (endDate: string | null = null) => ({
	id: 'c1',
	tenantId: 't1',
	apartmentId: 'a1',
	startDate: '2024-04-01',
	endDate,
	baseRent: '950.00',
	additionalRent: null,
	monthlyAdvancePayment: '150.00'
});
const data = (endDate: string | null = null) => ({
	contract: contract(endDate),
	tenants: [{ id: 't1', name: 'Anna Keller' }],
	apartments: [{ id: 'a1', unit: '2.01', building: 'Ahornhof', status: 'Vermietet' }]
});

let calls: ReturnType<typeof fakeBff>;

beforeEach(() => {
	vi.mocked(goto).mockClear();
	toasts.set([]);
	calls = fakeBff(({ method }) =>
		method === 'PUT'
			? [200, {}]
			: [200, { contracts: [{ id: 'c1', startDate: '2024-04-01', endDate: null }] }]
	);
});

async function open(endDate: string | null = null) {
	show(EditPage, { data: data(endDate) } as never);
	await settle();
}

const type = (testid: string, value: string) =>
	fireEvent(byTestId<HTMLInputElement>(testid)!, 'input', value);
const save = async () => {
	submit('submit-button');
	await settle();
};
const puts = () => calls.filter((c) => c.method === 'PUT');

describe('Mietvertrag bearbeiten', () => {
	it('erklärt die Beträge wie der Assistent', async () => {
		await open();
		const help = document.getElementById('baseRent-help')!.textContent!;
		expect(help).toContain('Monatliche Grundmiete ohne Nebenkosten.');
		expect(document.querySelector('label[for="advancePayment"]')!.textContent).toContain('Akonto');
		expect(document.querySelector('label[for="additionalRent"]')!.textContent).toContain(
			'Zusatzmiete'
		);
		expect(byTestId('contract-monthly-total')!.textContent).toContain('1’100.00');
	});

	it('wiederholt den Vertragsbeginn in Worten und fragt bei unverändertem Beginn nicht nach', async () => {
		await open();
		expect(byTestId('start-date-input-words')!.textContent).toContain('Montag, 1. April 2024');
		expect(byTestId('start-date-notice')!.textContent!.trim()).toBe('');
	});

	it('nimmt Beträge in Schweizer Schreibweise an und nennt den Mieter beim Speichern', async () => {
		await open();
		type('contract-base-rent-input', "1'450");
		await save();

		expect(puts()).toEqual([
			expect.objectContaining({
				path: '/contracts/c1',
				body: expect.objectContaining({ baseRent: '1450', monthlyAdvancePayment: '150.00' })
			})
		]);
		expect(get(toasts).map((t) => t.message)).toEqual(['Mietvertrag von Anna Keller gespeichert']);
		expect(goto).toHaveBeenCalledWith('/contracts/c1');
	});

	it('speichert ohne Nettomiete nicht und nennt den Fehler beim Feld', async () => {
		await open();
		type('contract-base-rent-input', '');
		await save();

		expect(puts()).toEqual([]);
		expect(byTestId('form-error')!.textContent).toContain('Nettomiete ist erforderlich');
		expect(document.activeElement).toBe(byTestId('contract-base-rent-input'));
	});

	it('weist bei einem laufenden Mietvertrag darauf hin, dass Änderungen sofort gelten', async () => {
		await open();
		expect(document.body.textContent).toContain('Laufender Mietvertrag');
	});

	it('kehrt beim Abbrechen zum Mietvertrag zurück', async () => {
		await open();
		expect(byTestId('form-cancel')!.getAttribute('href')).toBe('/contracts/c1');
	});

	// wie beim Beenden: ein Tippfehler im Jahr soll den Mietvertrag nicht rückwirkend beenden
	describe('Vertragsende in der Vergangenheit', () => {
		async function endOn(day: string) {
			document.querySelector<HTMLInputElement>('input[value="limited"]')!.click();
			await settle();
			type('end-date-input', day);
			await settle();
		}

		it('speichert ohne Bestätigung nicht und sagt am Kästchen, was zu tun ist', async () => {
			await open();
			await endOn('31.03.2025');
			await save();

			expect(puts()).toEqual([]);
			expect(document.body.textContent!.replace(/\s+/g, ' ')).toContain(
				'Bitte bestätigen Sie, dass der Mietvertrag am 31.03.2025 endete, oder korrigieren Sie das Vertragsende.'
			);
			expect(document.activeElement).toBe(byTestId('contract-end-past-confirm'));
		});

		it('speichert ein bestätigtes Vertragsende in der Vergangenheit', async () => {
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();

			expect(puts()[0].body).toMatchObject({ endDate: '2025-03-31' });
		});

		// beim Ändern des Mietzinses eines beendeten Mietvertrags wird das Ende nicht nochmals bestätigt
		it('fragt bei einem unveränderten Vertragsende nicht nach', async () => {
			await open('2024-12-31');
			expect(byTestId('contract-end-past-confirm')).toBeNull();
			type('contract-base-rent-input', '980');
			await save();

			expect(puts()).toHaveLength(1);
		});

		it('sagt bei einem Entwurf, der schon Mietstage nach dem Tag enthält, was zu tun ist', async () => {
			calls = fakeBff(({ method }) =>
				method === 'PUT' ? [409, refused] : [200, { contracts: [] }]
			);
			await open();
			await endOn('31.03.2025');
			click('contract-end-past-confirm');
			await settle();
			await save();

			expect(byTestId('form-error')!.textContent).toContain(
				'Der Entwurf NK-2025-0003 enthält schon Mietstage nach diesem Tag. Löschen Sie zuerst den Entwurf und erstellen Sie die Nebenkostenabrechnung danach neu.'
			);
		});
	});
});
