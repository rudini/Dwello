import { describe, it, expect, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import DocumentsPage from '../routes/documents/+page.svelte';
import { allByTestId, byTestId, show } from './helpers/dom';

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
const documents = (list: ReturnType<typeof letter>[], status: string | null = null, form = null) =>
	show(DocumentsPage, { data: { documents: list, status }, form } as never);

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
});
