import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import DocumentsPage from '../routes/documents/+page.svelte';
import { allByTestId, byTestId, show } from './helpers/dom';
import documentList from '../../tests/contracts/documents.json';

const letter = (overrides = {}) => ({
	id: 'd1',
	tenantId: 't1',
	statementId: 's1',
	type: 'reminder',
	reminderLevel: 1,
	title: 'Zahlungserinnerung',
	fileName: 'zahlungserinnerung.pdf',
	channel: 'letter',
	status: 'to_send',
	sentAt: null,
	deliveryError: null,
	createdAt: '2025-03-01T00:00:00Z',
	tenantName: 'Anna Keller',
	statementNumber: 'NK-2024-0001',
	...overrides
});
const documents = (
	list: ReturnType<typeof letter>[],
	status: string | null = null,
	form: object | null = null
) =>
	show(DocumentsPage, { data: { documents: list, status }, form } as never);

// #449 (V-2 A, N-1 A): a reminder of a statement paid or replaced since; no new Versandstatus, a derived row
describe('Mahnung, die nicht mehr hinausgeht', () => {
	it('nennt den Grund, bietet kein Markieren an und nennt keine Zahlungsfrist', () => {
		documents([
			letter({ notToSend: 'paid', paymentDeadline: '2025-03-11' }),
			letter({ id: 'd2', notToSend: 'replaced', paymentDeadline: '2025-03-11' })
		]);

		const [paid, replaced] = allByTestId('document-row');
		expect(paid.querySelector('[data-testid="document-status"]')!.textContent!.trim()).toBe(
			'Nicht mehr versenden: Abrechnung bezahlt'
		);
		expect(replaced.querySelector('[data-testid="document-status"]')!.textContent!.trim()).toBe(
			'Nicht mehr versenden: Abrechnung ersetzt'
		);
		expect(paid.textContent).not.toContain('Zahlungsfrist');
		expect(paid.textContent).not.toContain('Als versendet markieren');
	});
});

// #545 (persona weber-545 P-1): the Zahlungsfrist of a letter starts on the day it is marked sent, when Dwello remakes it
describe('Mahnung, die noch zu versenden ist', () => {
	it('nennt noch keine Zahlungsfrist, erst die versendete Mahnung nennt sie', () => {
		documents([
			letter({ paymentDeadline: '2025-03-11' }),
			letter({ id: 'd2', status: 'sent', sentAt: '2025-03-01T09:00:00Z', paymentDeadline: '2025-03-11' })
		]);

		const [waiting, sent] = allByTestId('document-row');
		expect(waiting.textContent).not.toContain('Zahlungsfrist');
		expect(sent.textContent).toContain('Zahlungsfrist der Mahnung: 11.03.2025');
	});
});

describe('Dokumente', () => {
	it('nennt Empfänger, Datum, Weg und Versandstatus jedes Briefs', () => {
		documents([letter(), letter({ id: 'd2', status: 'sent', channel: 'email' })]);

		const [toSend, sent] = allByTestId('document-row');
		expect(toSend.textContent).toContain('An Anna Keller');
		expect(toSend.textContent).toContain('01.03.2025');
		expect(toSend.querySelector('[data-testid="document-status"]')!.textContent!.trim()).toBe(
			'Zu versenden'
		);
		expect(toSend.querySelector('[data-testid="document-mark-sent"]')).not.toBeNull();
		expect(sent.querySelector('[data-testid="document-status"]')!.textContent!.trim()).toBe(
			'Versendet'
		);
		expect(sent.querySelector('[data-testid="document-mark-sent"]')).toBeNull();
	});

	it('nennt das Dokument im PDF-Link', () => {
		documents([letter()]);
		expect(byTestId('document-pdf-link')!.getAttribute('aria-label')).toContain(
			'Zahlungserinnerung · NK-2024-0001'
		);
	});

	it('zeigt, welcher Filter gewählt ist', () => {
		documents([letter()], 'to_send');
		expect(byTestId('documents-filter-to-send')!.getAttribute('aria-current')).toBe('page');
		expect(byTestId('documents-filter-all')!.getAttribute('aria-current')).toBeNull();
	});

	it('meldet, wenn nichts zu versenden ist', () => {
		documents([], 'to_send');
		expect(byTestId('documents-empty')!.textContent).toContain('Keine Briefe zu versenden');
	});

	it('meldet einen Fehler beim Markieren', () => {
		show(DocumentsPage, {
			data: { documents: [letter()], status: null },
			form: { actionError: 'Dokument konnte nicht aktualisiert werden.' }
		} as never);
		expect(byTestId('form-error')!.textContent).toContain(
			'Dokument konnte nicht aktualisiert werden.'
		);
	});

	it('nennt bei einem hochgeladenen Dokument Mieter und Datum, ohne Versandstatus und ohne Markieren', () => {
		documents([documentList.data[0] as never]);

		const row = byTestId('document-row')!;
		expect(row.textContent).toContain('Zu Marco Bernasconi, hochgeladen am 14.10.2026');
		expect(byTestId('document-status')).toBeNull();
		expect(byTestId('document-mark-sent')).toBeNull();
		expect(byTestId('document-pdf-link')!.textContent).toContain('Datei herunterladen');
		expect(byTestId('document-pdf-link')!.getAttribute('aria-label')).toBe('Datei herunterladen: Ausweiskopie');
		// gespeichert, nicht angezeigt: WebKit zeigt ein Foto sonst im Browser an (#424)
		expect(byTestId('document-pdf-link')!.hasAttribute('download')).toBe(true);
	});

	it('nennt hochgeladene Dokumente, wenn noch keine Dokumente da sind', () => {
		documents([]);
		expect(byTestId('documents-empty')!.textContent).toContain(
			'Mahnungen und Dokumente, die Sie zu einem Mieter hochladen, erscheinen hier.'
		);
	});

	it('verspricht unter «Zu versenden» nur Briefe', () => {
		documents([], 'to_send');
		expect(byTestId('documents-empty')!.textContent).toContain(
			'Briefe, die Sie ausdrucken und per Post schicken müssen, erscheinen hier.'
		);
	});

	// #193: marked as sent, the letter leaves «Zu versenden»; its remade PDF is offered right there
	it('bietet nach dem Markieren das neue PDF zum Ausdrucken an', () => {
		documents([], 'to_send', {
			sent: { id: 'd1', title: 'Zahlungserinnerung', tenantName: 'Anna Keller' }
		});

		const notice = byTestId('document-marked-sent')!;
		expect(notice.textContent).toContain('«Zahlungserinnerung» an Anna Keller ist als versendet markiert.');
		expect(notice.textContent).toContain('Drucken Sie ihn jetzt aus');
		expect(byTestId('document-marked-sent-pdf')!.getAttribute('href')).toBe('/documents/d1/pdf');
	});

	// persona Helga: «Keine Briefe zu versenden» beside it reads as if nothing were left to post
	it('meldet neben dem eben markierten Brief nicht, dass nichts zu versenden ist', () => {
		documents([], 'to_send', {
			sent: { id: 'd1', title: 'Zahlungserinnerung', tenantName: 'Anna Keller' }
		});

		expect(byTestId('documents-empty')).toBeNull();
	});
});
