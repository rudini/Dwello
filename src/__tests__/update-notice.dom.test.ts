/**
 * The update in the browser (#1453): after 15 minutes it asks for patience (No scenario: the browser's clock; the
 * page loading again once it is done: aktualisierung.feature)
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import UpdateNotice from '$lib/ui/UpdateNotice.svelte';
import { byTestId, click, fakeBff, show } from './helpers/dom';
import backupRefused from '../../tests/contracts/update-backup-refused.json';
import de from '../../messages/de.json';
import fr from '../../messages/fr.json';
import it_ from '../../messages/it.json';
import en from '../../messages/en.json';

const notice = { latest: '1.5.0', current: '1.4.0', releaseUrl: 'x', variant: 'update' as const };

async function startUpdate(status: () => string) {
	fakeBff(({ method }) =>
		method === 'POST' ? [202, { started: true }] : [200, { state: status() }]
	);
	show(UpdateNotice, { notice });
	click('update-notice-update');
	click('update-confirm');
	await vi.advanceTimersByTimeAsync(0);
}

afterEach(() => vi.useRealTimers());

describe('Update im Browser', () => {
	it('bittet nach 15 Minuten um Geduld und nennt, an wen man sich wendet', async () => {
		vi.useFakeTimers();
		await startUpdate(() => 'backend');

		await vi.advanceTimersByTimeAsync(14 * 60_000);
		expect(byTestId('update-slow')).toBeNull();
		await vi.advanceTimersByTimeAsync(60_000);
		expect(byTestId('update-slow')?.textContent).toBe(
			'Das Update dauert länger als üblich. Lassen Sie diese Seite offen; dauert es mehr als eine Stunde, wenden Sie sich an die Person, die Dwello betreut.'
		);
	});

	// #1457: Dwello backs up before the update service is asked, so «Sichern» comes first (No scenario: the
	// Sicherung of the E2E installation takes a moment)
	it('zeigt «Sichern» als ersten Schritt, solange Dwello die Daten sichert, dann «Herunterladen» und «Neu starten»', async () => {
		vi.useFakeTimers();
		let accept = () => {};
		let state = 'pulling';
		globalThis.fetch = (async (_url: string, init?: RequestInit) => {
			if (init?.method === 'POST') await new Promise<void>((resolve) => (accept = resolve));
			return Response.json(init?.method === 'POST' ? { started: true } : { state });
		}) as typeof fetch;
		show(UpdateNotice, { notice });
		click('update-notice-update');
		click('update-confirm');
		await vi.advanceTimersByTimeAsync(0);
		// personas Helga P-1, Marco P-2: done and coming steps differ on screen too, not only for a screen reader
		const steps = () =>
			[...document.querySelectorAll('[data-testid="update-overlay"] li')].map((step) => step.textContent?.trim());

		expect(steps()).toEqual(['Sichern (läuft)', 'Herunterladen (folgt)', 'Neu starten (folgt)']);
		accept();
		await vi.advanceTimersByTimeAsync(0);
		expect(steps()).toEqual(['Sichern (erledigt)', 'Herunterladen (läuft)', 'Neu starten (folgt)']);
		for (state of ['backend', 'frontend']) {
			await vi.advanceTimersByTimeAsync(2000);
			expect(steps()).toEqual(['Sichern (erledigt)', 'Herunterladen (erledigt)', 'Neu starten (läuft)']);
		}
		expect(document.querySelector('[data-testid="update-overlay"] li span.sr-only')).toBeNull();
	});

	// code review update-1 C-2: the page behind the update cannot be reached, and its «Aktualisieren» not pressed again
	it('nimmt den Fokus ins Update und nach einem Fehlschlag auf «Schliessen»', async () => {
		vi.useFakeTimers();
		let state = 'pulling';
		await startUpdate(() => state);
		await vi.advanceTimersByTimeAsync(0);

		expect(byTestId('update-overlay')?.contains(document.activeElement)).toBe(true);
		expect(byTestId('update-notice-update')?.closest('[inert]')).not.toBeNull();
		state = 'failed';
		await vi.advanceTimersByTimeAsync(2000);
		expect(document.activeElement).toBe(byTestId('update-failed-close'));
		// code review update-2 C-13: back where the update began
		click('update-failed-close');
		await vi.advanceTimersByTimeAsync(0);
		expect(document.activeElement).toBe(byTestId('update-notice-update'));
	});

	// #1457: the Sicherung before the update failed, so no update started; the other refusals stay in the notice's line
	it('meldet im Update-Fenster, dass die Sicherung fehlschlug und kein Update gestartet ist', async () => {
		vi.useFakeTimers();
		fakeBff(() => [409, backupRefused]);
		show(UpdateNotice, { notice });
		click('update-notice-update');
		click('update-confirm');
		await vi.advanceTimersByTimeAsync(0);

		expect(byTestId('update-failed')?.textContent?.trim()).toBe(de.backend_update_backup_failed);
		expect(document.activeElement).toBe(byTestId('update-failed-close'));
		click('update-failed-close');
		await vi.advanceTimersByTimeAsync(0);
		expect(byTestId('update-overlay')).toBeNull();
		expect(byTestId('update-notice-refusal')).toBeNull();
	});

	// Fachreview backup-first-1 V-4: no update failed there
	it('schliesst das Update-Fenster bei einer anderen Ablehnung und nennt sie in der Zeile des Hinweises', async () => {
		vi.useFakeTimers();
		fakeBff(() => [409, { ...backupRefused, code: 'UPDATE_RUNNING' }]);
		show(UpdateNotice, { notice });
		click('update-notice-update');
		click('update-confirm');
		await vi.advanceTimersByTimeAsync(0);

		expect(byTestId('update-overlay')).toBeNull();
		expect(byTestId('update-notice-refusal')?.textContent?.trim()).toBe(de.backend_update_running);
	});
});

// Fachreview backup-first-1 gives these texts word for word (fr with U+00A0 before «;»)
describe('Texte zur Sicherung vor dem Update', () => {
	it('nennt in allen vier Sprachen, dass die Sicherung fehlschlug, dass sich nichts geändert hat und was zu tun ist', () => {
		expect([de, fr, it_, en].map((messages) => messages.backend_update_backup_failed)).toEqual([
			'Dwello konnte vor dem Update keine Sicherung erstellen und hat das Update darum nicht gestartet. Es hat sich nichts geändert; Dwello läuft weiter in der bisherigen Version. Die Ursache steht im Protokoll des Servers. Melden Sie sich bei der Person, die Dwello betreut; sie kann es dort nachlesen. Sobald Dwello wieder eine Sicherung erstellen kann, können Sie das Update starten.',
			'Dwello n’a pas pu créer de sauvegarde avant la mise à jour\u00a0; c’est pourquoi la mise à jour n’a pas été lancée. Rien n’a changé\u00a0; Dwello continue de fonctionner dans la version précédente. La cause figure dans le journal du serveur. Contactez la personne qui s’occupe de Dwello\u00a0; elle peut l’y consulter. Dès que Dwello pourra de nouveau créer une sauvegarde, vous pourrez lancer la mise à jour.',
			'Prima dell’aggiornamento Dwello non è riuscito a creare una copia di sicurezza, perciò non ha avviato l’aggiornamento. Non è cambiato nulla; Dwello continua a funzionare nella versione precedente. La causa figura nel registro del server. Si rivolga alla persona che si occupa di Dwello; può consultarla lì. Appena Dwello riuscirà di nuovo a creare una copia di sicurezza, potrà avviare l’aggiornamento.',
			'Dwello could not make a backup before the update, so it did not start the update. Nothing has changed; Dwello keeps running in the previous version. The cause is in the server log. Contact the person who looks after Dwello; they can look it up there. As soon as Dwello can make a backup again, you can start the update.'
		]);
	});

	it('nennt vor dem Update die Schritte in ihrer Reihenfolge: sichern, herunterladen, neu starten', () => {
		expect([de, fr, it_, en].map((messages) => messages.update_confirm_text)).toEqual([
			'Dwello sichert Ihre Daten, lädt Version {latest} herunter und startet neu. Das dauert einige Minuten; so lange können Sie Dwello nicht nutzen.',
			'Dwello sauvegarde vos données, télécharge la version {latest} et redémarre. Cela prend quelques minutes\u00a0; pendant ce temps, vous ne pouvez pas utiliser Dwello.',
			'Dwello crea una copia di sicurezza dei Suoi dati, scarica la versione {latest} e si riavvia. Ci vogliono alcuni minuti; nel frattempo non può usare Dwello.',
			'Dwello backs up your data, downloads version {latest} and restarts. This takes a few minutes; during that time you cannot use Dwello.'
		]);
	});
});
