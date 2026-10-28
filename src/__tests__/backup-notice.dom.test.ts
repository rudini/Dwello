import { describe, it, expect } from 'vitest';
import BackupNotice from '../routes/dashboard/BackupNotice.svelte';
import { byTestId, show } from './helpers/dom';
import stale from '../../tests/contracts/health-backup-stale.json';
import type { BackupState } from '$lib/types';

// #718 (O1): the Übersicht says when no Sicherung succeeded for more than a day, and once that the Sicherung is set up.
// No scenario: a day without a Sicherung depends on the server's clock (tests/e2e/CLAUDE.md, «No scenario»)
describe('Hinweis zur Sicherung in der Übersicht', () => {
	it('nennt den Tag der letzten Sicherung, wenn seit mehr als einem Tag keine gelang', () => {
		show(BackupNotice, { state: stale as BackupState, confirmed: false });
		expect(byTestId('backup-stale')!.textContent).toContain(
			'Dwello konnte seit 28.10.2026 keine Sicherung erstellen. Ihre Daten sind nicht gesichert. Melden Sie sich bei der Person, die Dwello betreut.'
		);
		expect(byTestId('backup-stale')!.textContent).toContain(
			'Betreuen Sie Dwello selbst, finden Sie das Vorgehen in der Installationsanleitung.'
		);
		expect(byTestId('backup-stale-guide')!.getAttribute('href')).toBe(
			'https://github.com/rudini/Dwello/blob/main/docs/installation.md'
		);
	});

	it('bestätigt die eingerichtete Sicherung', () => {
		show(BackupNotice, { state: { backup: 'ok' }, confirmed: true });
		expect(byTestId('backup-confirmed')!.textContent).toContain(
			'Die Sicherung ist eingerichtet. Dwello sichert Ihre Daten ab jetzt jeden Tag.'
		);
	});

	it('schweigt, solange die Sicherung läuft', () => {
		show(BackupNotice, { state: { backup: 'ok' }, confirmed: false });
		expect(document.querySelector('[data-testid^="backup-"]')).toBeNull();
	});
});
