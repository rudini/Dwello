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
			'Das Update dauert länger als üblich. Lassen Sie diese Seite offen; dauert es mehr als eine Stunde, wenden Sie sich an die Person, die Dwello eingerichtet hat.'
		);
		expect(byTestId('update-step-current')?.textContent).toContain('Sichern');
	});
});
