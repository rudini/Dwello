/**
 * The search for new versions (#1453): once a day the backend asks GitHub for the newest published version, only on an
 * installation from the published images (DWELLO_RELEASES, set by the image, emptied by docker-compose.prod.yml)
 * without a fixed DWELLO_VERSION, and while «Einstellungen» › «Updates» is on; off, nothing goes out
 */

import { DATABASE_URL } from '../db/connection';
import { backupState } from './backup.service';
import { CodedError } from './coded-error';
import { getConfig } from './config.service';

const DAY = 24 * 60 * 60 * 1000;

/** Whether this installation may ask GitHub at all: the privacy statement names the request exactly then */
export const updateChecks = () => !!process.env.DWELLO_RELEASES && !process.env.DWELLO_VERSION;

// the newest version and its release notes on GitHub («Was ist neu?»)
let latest: { version: string; url: string } | null = null;

/** Asks GitHub now (at the start, daily, when the setting is saved); turned off, it forgets the known version */
export async function checkForUpdate() {
	try {
		if (!updateChecks() || (await getConfig('update_check')) === 'off') {
			latest = null;
			return;
		}
		// only «Dwello», no version or mark of the installation (Fachreview update-1 R-4)
		const response = await fetch(process.env.DWELLO_RELEASES!, {
			headers: { 'user-agent': 'Dwello', accept: 'application/vnd.github+json' },
			// saving the settings waits for it (code review update-1 C-5)
			signal: AbortSignal.timeout(10_000)
		});
		if (!response.ok) throw new Error(`${response.status}`);
		const { tag_name, html_url } = (await response.json()) as { tag_name: string; html_url: string };
		if (!html_url.startsWith('https://github.com/')) throw new Error(`release notes at ${html_url}`);
		latest = { version: tag_name.replace(/^v/, ''), url: html_url };
	} catch (error) {
		console.warn('⚠️ Neueste Version nicht abgefragt', error instanceof Error ? error.message : error);
	}
}

export function startUpdateChecks() {
	void checkForUpdate();
	setInterval(() => void checkForUpdate(), DAY);
}

// updater: the update service of compose.yaml; an installation from an older compose.yaml has none (it runs the
// installer once more)
export const updateState = () => ({
	checks: updateChecks(),
	latest: latest?.version ?? null,
	releaseUrl: latest?.url ?? null,
	updater: !!process.env.UPDATER_URL
});

/** Has the update service start an update: only with a set-up Sicherung, since the new version backs up before it
 * changes the database */
export async function startUpdate() {
	const updater = process.env.UPDATER_URL;
	if (!updater) throw new CodedError('UPDATE_UNAVAILABLE', 'This installation has no update service');
	const { backup } = await backupState(DATABASE_URL);
	if (backup !== 'ok' && backup !== 'stale') throw new CodedError('UPDATE_BACKUP_MISSING', 'The Sicherung is not set up');
	const response = await fetch(`${updater}/update`, { method: 'POST' });
	if (response.status === 409) throw new CodedError('UPDATE_RUNNING', 'An update is running');
	if (!response.ok) throw new Error(`update service: ${response.status}`);
}
