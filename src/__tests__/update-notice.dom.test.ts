/**
 * The update in the browser (#1453): after 15 minutes it asks for patience (No scenario: the browser's clock; the
 * page loading again once it is done: aktualisierung.feature)
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import UpdateNotice from '$lib/ui/UpdateNotice.svelte';
import { byTestId, click, fakeBff, show } from './helpers/dom';

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
		expect(byTestId('update-step-current')?.textContent).toContain('Sichern');
		// personas Helga P-1, Marco P-2: done and coming steps differ on screen too, not only for a screen reader
		const states = [...document.querySelectorAll('[data-testid="update-overlay"] li span')];
		expect(states.map((state) => [state.textContent, state.classList.contains('sr-only')])).toEqual(
			[
				['(erledigt)', false],
				['(läuft)', false],
				['(folgt)', false]
			]
		);
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
});
