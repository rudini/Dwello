/**
 * The notice of a new version after sign-in (#1453): which variant the layout shows, from the backend's newest version
 * (tests/contracts/update.json), the build's own version and the state of the Sicherung
 */

import { describe, expect, it, vi } from 'vitest';
import sample from '../../tests/contracts/update.json';
import { updateNotice } from '$lib/server/update';

vi.mock('$lib/app-version', () => ({ appVersion: '1.4.0' }));

const SIGNED_IN_AT = 1_700_000_000;
const backend =
	(update: object, backup = 'ok'): typeof fetch =>
	async (input) =>
		Response.json(String(input).endsWith('/health') ? { backup } : { ...sample, ...update });
const cookies = (later?: string) => ({
	get: (name: string) => (name === 'dwello_update_later' ? later : undefined)
});

describe('Hinweis zur neuen Version', () => {
	it('nennt die neue und die eigene Version, wenn die Sicherung eingerichtet ist', async () => {
		expect(await updateNotice(backend({}), cookies(), SIGNED_IN_AT)).toEqual({
			latest: '1.5.0',
			current: '1.4.0',
			releaseUrl: 'https://github.com/rudini/Dwello/releases/tag/v1.5.0',
			variant: 'update'
		});
	});

	it('verlangt zuerst die Sicherung und nennt ohne Update-Dienst das einmalige Update von Hand', async () => {
		expect(await updateNotice(backend({}, 'setup'), cookies(), SIGNED_IN_AT)).toMatchObject({
			variant: 'backup'
		});
		expect(await updateNotice(backend({}, 'off'), cookies(), SIGNED_IN_AT)).toMatchObject({
			variant: 'backup'
		});
		expect(await updateNotice(backend({}, 'stale'), cookies(), SIGNED_IN_AT)).toMatchObject({
			variant: 'update'
		});
		expect(await updateNotice(backend({ updater: false }), cookies(), SIGNED_IN_AT)).toMatchObject({
			variant: 'manual'
		});
	});

	it('zeigt nichts ohne neuere Version und nach «Später» in derselben Anmeldung', async () => {
		expect(await updateNotice(backend({ latest: null }), cookies(), SIGNED_IN_AT)).toBeNull();
		expect(await updateNotice(backend({ latest: '1.4.0' }), cookies(), SIGNED_IN_AT)).toBeNull();
		expect(await updateNotice(backend({ latest: '1.3.9' }), cookies(), SIGNED_IN_AT)).toBeNull();
		expect(await updateNotice(backend({}), cookies(String(SIGNED_IN_AT)), SIGNED_IN_AT)).toBeNull();
		expect(
			await updateNotice(
				backend({ latest: '1.10.0' }),
				cookies(String(SIGNED_IN_AT - 60)),
				SIGNED_IN_AT
			)
		).toMatchObject({ latest: '1.10.0' });
	});
});
