/**
 * How long the BFF waits for the backend: the start of an update makes a Sicherung of the whole database first
 * (#1457, Fachreview backup-first-1 V-1), so it gets the hour the update's window names
 */

import type { Cookies } from '@sveltejs/kit';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { forwardRequest } from '$lib/server/api-proxy';

const cookies = { get: () => 'token' } as unknown as Cookies;

afterEach(() => vi.restoreAllMocks());

describe('Zeitlimit des BFF', () => {
	it('wartet beim Start des Updates eine Stunde auf das Backend, sonst 30 Sekunden', async () => {
		vi.stubGlobal('fetch', async () => Response.json({}));
		const timeout = vi.spyOn(AbortSignal, 'timeout');

		await forwardRequest('/update', 'POST', cookies);
		await forwardRequest('/update/later', 'POST', cookies);
		await forwardRequest('/update', 'GET', cookies);

		expect(timeout.mock.calls).toEqual([[60 * 60_000], [30_000], [30_000]]);
	});
});
