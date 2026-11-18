/**
 * A new version of Dwello (#1453): the notice after sign-in, «Später» until the next sign-in, the start of an update
 * and how far it is
 */

import type { Cookies } from '@sveltejs/kit';
import { appVersion } from '$lib/app-version';
import type { UpdateNotice } from '$lib/update';
import { backupState } from './backup';

type Fetch = typeof globalThis.fetch;
const BACKEND = process.env.BACKEND_URL || 'http://localhost:3001';

/** «Später»: the sign-in it was chosen in; a new sign-in shows the notice again (privacy statement, «Cookies») */
export const LATER_COOKIE = 'dwello_update_later';


const newer = (version: string, than: string) => {
	const [a, b] = [version, than].map((v) => v.split(/[.+]/).slice(0, 3).map(Number));
	const differs = a.findIndex((part, i) => part !== b[i]);
	return differs >= 0 && a[differs] > b[differs];
};

export async function updateNotice(
	fetch: Fetch,
	cookies: Pick<Cookies, 'get'>,
	signedInAt: number
): Promise<UpdateNotice | null> {
	if (!appVersion || cookies.get(LATER_COOKIE) === String(signedInAt)) return null;
	const { latest, releaseUrl, updater } = (await fetch(`${BACKEND}/api/v1/update`)
		.then((response) => response.json())
		.catch(() => ({}))) as { latest?: string | null; releaseUrl?: string; updater?: boolean };
	if (!latest || !releaseUrl || !newer(latest, appVersion)) return null;
	const notice = { latest, current: appVersion, releaseUrl };
	if (!updater) return { ...notice, variant: 'manual' };
	const { backup } = await backupState(fetch);
	return { ...notice, variant: backup === 'ok' || backup === 'stale' ? 'update' : 'backup' };
}
