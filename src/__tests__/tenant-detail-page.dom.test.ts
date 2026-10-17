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
	const after = actions.get(action)!({ formData: new FormData() }) as (input: unknown) => Promise<void>;
	await after({ update: async () => {}, result: { type: 'redirect' } });
}

import TenantPage from '../routes/tenants/[id]/+page.svelte';
import { flushSync } from 'svelte';
import { get } from 'svelte/store';
import { toasts } from '$lib/stores';
import { allByTestId, byTestId, click, show } from './helpers/dom';
import documentList from '../../tests/contracts/documents.json';

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
	monthlyTotal: 950,
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

// as the backend lists it (00:30 on 14.10. in Switzerland)
const [upload] = documentList.data;

function open(contracts: unknown[] = [], form: unknown = null, documents: unknown[] = [document_], demo = false) {
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
			documents,
			demo
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
		expect(byTestId('document-pdf-link')!.getAttribute('aria-label')).toContain('Zahlungserinnerung');
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

	it('nennt ein hochgeladenes Dokument mit Datum, ohne Versandstatus', () => {
		open([], null, [upload]);
		const row = byTestId('document-row')!.textContent!.replace(/\s+/g, ' ');
		expect(row).toContain('Ausweiskopie');
		expect(row).toContain('Hochgeladen am 14.10.2026');
		expect(byTestId('document-status')).toBeNull();
		expect(byTestId('document-delete-button')!.getAttribute('aria-label')).toBe('Löschen: Ausweiskopie');
	});

	it('bietet bei einer Mahnung kein Löschen an', () => {
		open();
		expect(byTestId('document-row')).not.toBeNull();
		expect(byTestId('document-delete-button')).toBeNull();
	});

	it('sagt am Feld, welche Dateien Dwello annimmt und dass Kopien von Ausweisen gelöscht werden sollen', () => {
		open([], null, []);
		expect(text('tenant-documents-empty')).toBe('Noch keine Dokumente.');
		const form = byTestId('tenant-document-upload')!.textContent!;
		expect(form).toContain('PDF, JPG oder PNG, höchstens 10 MB.');
		expect(form).toContain('Löschen Sie Ausweiskopien und Betreibungsauszüge');
		expect(form).toContain('Ohne Titel heisst das Dokument wie die Datei, ohne Endung.');
		expect(byTestId('tenant-document-demo')).toBeNull();
	});

	it('warnt in der öffentlichen Demo, dass alle Besucher die Dateien sehen', () => {
		open([], null, [], true);
		expect(text('tenant-document-demo')).toContain('Alle Besucher sehen die Dateien');
	});

	it('zeigt eine Ablehnung am Feld und behält den Titel', () => {
		open([], { title: 'Scan', uploadError: 'Die Datei ist grösser als 10 MB.' }, []);
		expect(text('form-error')).toBe('Die Datei ist grösser als 10 MB.');
		expect(byTestId<HTMLInputElement>('tenant-document-title-input')!.value).toBe('Scan');
	});

	it('meldet ein gescheitertes Hochladen und behält den Titel', async () => {
		open([], null, []);
		const title = byTestId<HTMLInputElement>('tenant-document-title-input')!;
		title.value = 'Betreibungsauszug';
		title.dispatchEvent(new Event('input', { bubbles: true }));
		const after = actions.get('?/upload')!({ formData: new FormData() }) as (input: unknown) => Promise<void>;
		const update = vi.fn();
		await after({ update, result: { type: 'error', error: new Error('500') } });
		flushSync();
		expect(text('form-error')).toContain(
			'Das Dokument wurde nicht gespeichert, weil Dwello nicht geantwortet hat. Wählen Sie noch einmal «Dokument hochladen».'
		);
		expect(title.value).toBe('Betreibungsauszug');
		expect(update).not.toHaveBeenCalled();
		// not the file's fault: announced as an alert, the focus on the button that sends again; the file stays valid
		expect(byTestId('form-error')!.getAttribute('role')).toBe('alert');
		expect(byTestId('tenant-document-file-input')!.getAttribute('aria-invalid')).toBeNull();
		await vi.waitFor(() => expect(document.activeElement).toBe(byTestId('tenant-document-upload-button')));
	});

	it('meldet ein hochgeladenes Dokument', async () => {
		toasts.set([]);
		open([], null, []);
		const after = actions.get('?/upload')!({ formData: new FormData() }) as (input: unknown) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'success', data: { uploaded: 'Ausweiskopie' } } });
		expect(get(toasts).map((toast) => toast.message)).toEqual(['Dokument «Ausweiskopie» hochgeladen']);
		// stays where it was: at the form, below the new document
		await vi.waitFor(() => expect(document.activeElement).toBe(byTestId('tenant-document-file-input')));
	});

	it('nennt beim Löschen eines Dokuments seine Folge und meldet es danach', async () => {
		toasts.set([]);
		open([], null, [upload]);
		click('document-delete-button');
		expect(text('document-delete-message')).toBe(
			'Dokument «Ausweiskopie» wird endgültig gelöscht. Das lässt sich nicht rückgängig machen.'
		);
		const after = actions.get('?/deleteDocument')!({ formData: new FormData() }) as (input: unknown) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'success' } });
		flushSync();
		expect(get(toasts).map((toast) => toast.message)).toEqual(['Dokument «Ausweiskopie» gelöscht']);
		await vi.waitFor(() => expect(document.activeElement).toBe(byTestId('tenant-documents')));
	});

	it('sagt, dass hochgeladene Dokumente mit dem Mieter gelöscht werden', () => {
		open([], null, [upload]);
		click('tenant-delete-button');
		expect(text('delete-dialog-message')).toBe(
			'Lea Frei wird endgültig gelöscht, zusammen mit den hochgeladenen Dokumenten. Das lässt sich nicht rückgängig machen.'
		);
	});

	it('lehnt eine Datei über 10 MB ab, bevor sie gesendet wird', async () => {
		open([], null, []);
		const formData = new FormData();
		formData.set('file', new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'scan.pdf'));
		const cancel = vi.fn();
		actions.get('?/upload')!({ formData, cancel } as never);
		flushSync();
		expect(cancel).toHaveBeenCalled();
		expect(text('form-error')).toBe(
			'Die Datei ist grösser als 10 MB. Wählen Sie eine kleinere Datei oder verkleinern Sie den Scan.'
		);
		await vi.waitFor(() => expect(document.activeElement).toBe(byTestId('tenant-document-file-input')));
	});

	it('sendet eine Datei bis 10 MB', () => {
		open([], null, []);
		const formData = new FormData();
		formData.set('file', new File([new Uint8Array(10 * 1024 * 1024)], 'scan.pdf'));
		const cancel = vi.fn();
		actions.get('?/upload')!({ formData, cancel } as never);
		expect(cancel).not.toHaveBeenCalled();
	});

	it('bietet jede Datei mit einem Knopf zum Herunterladen an, der das Dokument nennt', () => {
		open([], null, [document_, upload]);
		const [letter, file] = allByTestId('document-pdf-link');
		expect(letter.textContent!.trim()).toBe('PDF herunterladen');
		expect(letter.getAttribute('aria-label')).toBe('PDF herunterladen: Zahlungserinnerung · NK-2024-001');
		expect(file.textContent!.trim()).toBe('Datei herunterladen');
		expect(file.getAttribute('aria-label')).toBe('Datei herunterladen: Ausweiskopie');
	});

	it('sagt bei einem Mieter mit Mietverträgen, dass hochgeladene Dokumente einzeln gelöscht werden', () => {
		open([history('c1', 'Wohnung 1.01', '2015-01-01', '2019-12-31', 'ended')], null, [upload]);
		click('tenant-delete-button');
		expect(text('delete-dialog-message')).toContain(
			'Auch die Dokumente, die Sie zu diesem Mieter hochgeladen haben, bleiben gespeichert. Löschen Sie sie einzeln unter «Dokumente» auf dieser Seite, sobald Sie sie nicht mehr brauchen.'
		);
	});

	it('zeigt einen zu langen Titel am Feld «Titel» und setzt den Fokus dorthin', async () => {
		open([], { title: 'T', titleError: 'Der Titel ist länger als 255 Zeichen. Kürzen Sie ihn.' }, []);
		const title = byTestId<HTMLInputElement>('tenant-document-title-input')!;
		expect(title.getAttribute('aria-invalid')).toBe('true');
		expect(byTestId<HTMLInputElement>('tenant-document-file-input')!.getAttribute('aria-invalid')).toBeNull();
		const after = actions.get('?/upload')!({ formData: new FormData() }) as (input: unknown) => Promise<void>;
		await after({ update: async () => {}, result: { type: 'failure', status: 400, data: {} } });
		await vi.waitFor(() => expect(document.activeElement).toBe(title));
	});
});
