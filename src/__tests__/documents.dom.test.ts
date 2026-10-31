import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import DocumentsPage from '../routes/documents/+page.svelte';
import { allByTestId, byTestId, click, show } from './helpers/dom';
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

	// Persona Dr. Weber 534 P-2, P-4: marking a letter sent asks first and says what follows for which letter
	it('fragt vor dem Markieren als versendet nach und nennt die Folge', () => {
		documents([letter()]);
		click('document-mark-sent');
		expect(document.body.textContent!.replace(/\s+/g, ' ')).toContain(
			'Markieren Sie den Brief erst am Tag, an dem Sie ihn zur Post bringen. Eine Mahnung trägt danach das heutige Datum und eine neue Zahlungsfrist; das neue PDF einer Abrechnung behält deren Datum und Zahlungsfrist.'
		);
		expect(byTestId('document-mark-sent-confirm')).not.toBeNull();
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
		// in the open confirmation, the page behind it is inert (Code-Review 534-2 C-15)
		click('document-mark-sent');
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

	// Fachreview 534-2 V-1: the new PDF of a statement keeps its date and Zahlungsfrist, the notice says so
	it('sagt nach dem Markieren eines neuen PDF, dass Datum und Zahlungsfrist bleiben', () => {
		documents([], 'to_send', { sent: { id: 'd2', title: 'Nebenkostenabrechnung, neues PDF', tenantName: 'Anna Keller', newPdf: true } });
		const notice = byTestId('document-marked-sent')!.textContent!;
		expect(notice).toContain('Das neue PDF bleibt, wie es ist: Abrechnungsdatum und Zahlungsfrist ändern sich nicht.');
		expect(notice).not.toContain('heutige Datum');
	});

	// Code-Review 534-2 C-15: a refusal stays readable in the open confirmation
	it('nennt eine Ablehnung im Dialog vor dem Markieren', () => {
		documents([letter()], 'to_send', { actionError: 'Die Abrechnung ist bereits bezahlt. Schicken Sie diese Mahnung nicht mehr ab.' });
		click('document-mark-sent');
		expect(document.querySelector('[role="dialog"]')!.textContent).toContain('Die Abrechnung ist bereits bezahlt.');
	});

	// persona Helga: «Keine Briefe zu versenden» beside it reads as if nothing were left to post
	it('meldet neben dem eben markierten Brief nicht, dass nichts zu versenden ist', () => {
		documents([], 'to_send', {
			sent: { id: 'd1', title: 'Zahlungserinnerung', tenantName: 'Anna Keller' }
		});

		expect(byTestId('documents-empty')).toBeNull();
	});
});
