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

// «1.10.0» after «1.4.0»; a development build («1.4.0+3-gabc1234») is not older than its release
const newer = (version: string, than: string) =>
	version.localeCompare(than, 'en', { numeric: true }) > 0;

// one click once the Sicherung is set up, else the Sicherung first
const variantOf = async (fetch: Fetch) =>
	['ok', 'stale'].includes((await backupState(fetch)).backup)
		? ('update' as const)
		: ('backup' as const);

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
	return {
		latest,
		current: appVersion,
		releaseUrl,
		variant: updater ? await variantOf(fetch) : 'manual'
	};
}

/** Whether this installation asks GitHub for new versions: the privacy statement names it then (Fachreview update-1 R-3) */
export const asksGitHub = (fetch: Fetch): Promise<boolean> =>
	fetch(`${BACKEND}/api/v1/update/checks`)
		.then((response) => response.json())
		.then(({ checks }) => checks === true)
		.catch(() => false);
