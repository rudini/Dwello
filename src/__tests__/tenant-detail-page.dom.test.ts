import { describe, it, expect, vi } from 'vitest';

// enhance as SvelteKit wires it: the test plays the server's answer to an action of the page
const actions = vi.hoisted(() => new Map<string, () => unknown>());
vi.mock('$app/forms', () => ({
	enhance: (form: HTMLFormElement, submit: () => unknown) => {
		actions.set(form.getAttribute('action')!, submit);
		return { destroy() {} };
	}
}));
async function redirectAfter(action: string) {
	const after = actions.get(action)!() as (input: unknown) => Promise<void>;
	await after({ update: async () => {}, result: { type: 'redirect' } });
}

import TenantPage from '../routes/tenants/[id]/+page.svelte';
import { get } from 'svelte/store';
import { toasts } from '$lib/stores';
import { allByTestId, byTestId, click, show } from './helpers/dom';

const tenant = {
	id: 't1',
	firstName: 'Lea',
	lastName: 'Frei',
	email: 'lea@example.ch',
	phone: null,
	language: 'fr',
	address: 'Ahornweg 3',
	postalCode: '8400',
	city: 'Winterthur',
	correspondenceChannel: 'letter'
};
const history = (
	id: string,
	apartment: string,
	startDate: string,
	endDate: string | null,
	status: string
) => ({
	id,
	tenantName: 'Lea Frei',
	apartment,
	period: 'alt',
	rentBrutto: 950,
	status,
	startDate,
	endDate
});
const document_ = {
	id: 'd1',
	title: 'Zahlungserinnerung',
	statementNumber: 'NK-2024-001',
	createdAt: '2025-03-01',
	channel: 'letter',
	status: 'to_send',
	deliveryError: null
};

function open(contracts: unknown[] = [], form: unknown = null) {
	show(TenantPage, {
		data: {
			tenant,
			rental: {
				contractId: 'c2',
				apartmentId: 'a2',
				apartment: 'Wohnung 2.01',
				building: 'Ulmenhof',
				rent: 950,
				startDate: '2099-11-01',
				upcoming: true
			},
			contractHistory: contracts,
			documents: [document_]
		},
		form
	} as never);
}

const text = (testid: string) => byTestId(testid)!.textContent!.replace(/\s+/g, ' ').trim();

describe('Mieterdetail', () => {
	it('nennt die künftige Wohnung mit Einzug und Miete', () => {
		open();
		expect(text('tenant-rental-apartment')).toBe('Wohnung 2.01');
		expect(byTestId('tenant-rental-apartment-link')!.getAttribute('href')).toBe('/apartments/a2');
		expect(text('tenant-rental-start')).toBe('01.11.2099');
		expect(text('tenant-rental-rent')).toBe('CHF 950.00');
		expect(document.body.textContent).toContain('Einzug am');
	});

	it('zeigt Korrespondenzkanal und Sprache', () => {
		open();
		expect(text('tenant-channel')).toBe('Per Brief');
		expect(text('tenant-language')).toBe('Französisch');
	});

	it('führt die Mietverträge mit Status aus den Daten, einen künftigen ab seinem Beginn', () => {
		open([
			history('c2', 'Wohnung 2.01', '2099-11-01', null, 'future'),
			history('c1', 'Wohnung 1.01', '2015-01-01', '2019-12-31', 'ended')
		]);
		const rows = allByTestId('contract-history-row').map((row) =>
			row.textContent!.replace(/\s+/g, ' ')
		);
		expect(rows[0]).toMatch(/Wohnung 2\.01.*Künftig.*ab 01\.11\.2099, unbefristet/);
		expect(rows[1]).toMatch(/Wohnung 1\.01.*Beendet.*01\.01\.2015 – 31\.12\.2019/);
		expect(rows.join()).not.toContain('heute');
		const link = allByTestId('contract-history-link')[1];
		expect(link.getAttribute('href')).toBe('/contracts/c1');
		// the apartment link above says "Wohnung 1.01" too: this one names the contract
		expect(link.textContent!.trim()).toBe('Mietvertrag Wohnung 1.01');
	});

	it('nennt Dokumente mit Versandstatus und einem PDF-Link, der das Dokument nennt', () => {
		open();
		expect(text('tenant-documents')).toContain('Zahlungserinnerung · NK-2024-001');
		expect(text('document-status')).toBe('Zu versenden');
		expect(byTestId('document-pdf-link')!.textContent).toContain('Zahlungserinnerung');
	});

	it('lässt einen Mieter mit Mietverträgen nicht löschen und sagt warum', () => {
		open([history('c1', 'Wohnung 1.01', '2015-01-01', '2019-12-31', 'ended')]);
		click('tenant-delete-button');
		expect(byTestId<HTMLButtonElement>('tenant-delete-confirm')!.disabled).toBe(true);
		expect(document.querySelector('[role=dialog]')!.textContent).toContain(
			'Abrechnungen und Dokumente auf sie verweisen'
		);
	});

	it('bestätigt das Löschen mit dem Namen des Mieters', async () => {
		toasts.set([]);
		open();
		click('tenant-delete-button');
		await redirectAfter('?/delete');
		expect(get(toasts).map((toast) => toast.message)).toEqual(['Mieter «Lea Frei» gelöscht']);
	});

	it('zeigt den Grund, wenn das Löschen abgelehnt wurde', () => {
		open([], { error: 'Mieter mit Mietverträgen können nicht gelöscht werden.' });
		expect(document.querySelector('[role=dialog]')!.textContent).toContain(
			'Mieter mit Mietverträgen können nicht gelöscht werden.'
		);
	});
});
