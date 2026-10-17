import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/forms', () => ({ enhance: () => ({ destroy() {} }) }));

import AuditLogPage from '../routes/config/audit-log/+page.svelte';
import { allByTestId, byTestId, click, show } from './helpers/dom';

const entry = { id: 'a1', when: '17.10.2026, 14:05', text: 'Anmeldung mit Google' };

// Protokoll (#357): Einträge mit Zeitpunkt, einzeln zu löschen, und ein Hinweis, solange keiner da ist
describe('Protokoll unter den Einstellungen', () => {
	it('zeigt jeden Eintrag mit Zeitpunkt', () => {
		show(AuditLogPage, { data: { entries: [entry] }, form: null } as never);

		expect(allByTestId('audit-entry')).toHaveLength(1);
		expect(byTestId('audit-entry-date')?.textContent).toBe('17.10.2026, 14:05');
		expect(byTestId('audit-entry-text')?.textContent).toBe('Anmeldung mit Google');
	});

	it('sagt, was hier erscheint, solange es keine Einträge gibt', () => {
		show(AuditLogPage, { data: { entries: [] }, form: null } as never);

		expect(byTestId('audit-log-empty')?.textContent).toContain('Noch keine Einträge');
		expect(byTestId('audit-log-list')).toBeNull();
	});

	// Fachprüfung V-2: die Bestätigung nennt den Eintrag und sagt, dass die Änderung selbst bleibt
	it('fragt vor dem Löschen mit dem Eintrag und der Folge', () => {
		show(AuditLogPage, { data: { entries: [entry] }, form: null } as never);

		click('audit-entry-delete-button');

		expect(byTestId('audit-entry-delete-message')?.textContent).toBe(
			'Dieser Eintrag wird endgültig aus dem Protokoll gelöscht: Anmeldung mit Google. Die Änderung selbst bleibt bestehen. Das lässt sich nicht rückgängig machen.'
		);
	});

	it('nennt im Dialog, warum das Löschen nicht gelang', () => {
		show(AuditLogPage, {
			data: { entries: [entry] },
			form: { error: 'Der Eintrag konnte nicht gelöscht werden.' }
		} as never);

		click('audit-entry-delete-button');

		expect(byTestId('form-error')?.textContent).toContain(
			'Der Eintrag konnte nicht gelöscht werden.'
		);
	});
});
