/**
 * The search for new versions (#1453): once a day the backend asks GitHub for the newest published version, only on an
 * installation from the published images (DWELLO_RELEASES, set by the image, emptied by docker-compose.prod.yml)
 * without a fixed DWELLO_VERSION, and while «Einstellungen» › «Updates» is on; off, nothing goes out
 */

import { DATABASE_URL } from '../db/connection';
import { backupState, createBackup } from './backup.service';
import { CodedError } from './coded-error';
import { getConfig } from './config.service';

const DAY = 24 * 60 * 60 * 1000;

/** Whether this installation may ask GitHub at all: the privacy statement names the request exactly then */
export const updateChecks = () => !!process.env.DWELLO_RELEASES && !process.env.DWELLO_VERSION;

// the newest version and its release notes on GitHub («Was ist neu?»)
const NONE = { latest: null, releaseUrl: null };
let known: { latest: string | null; releaseUrl: string | null } = NONE;

/** Asks GitHub now (at the start, daily, when the setting is saved); turned off, it forgets the known version */
export async function checkForUpdate() {
	try {
		if (!updateChecks() || (await getConfig('update_check')) === 'off') {
			known = NONE;
			return;
		}
		// only «Dwello», no version or mark of the installation (Fachreview update-1 R-4)
		const response = await fetch(process.env.DWELLO_RELEASES!, {
			headers: { 'user-agent': 'Dwello', accept: 'application/vnd.github+json' },
			// saving the settings waits for it (code review update-1 C-5)
			signal: AbortSignal.timeout(10_000)
		});
		if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
		const { tag_name, html_url } = (await response.json()) as { tag_name: string; html_url: string };
		if (!html_url.startsWith('https://github.com/')) throw new Error(`release notes at ${html_url}`);
		known = { latest: tag_name.replace(/^v/, ''), releaseUrl: html_url };
	} catch (error) {
		console.warn(`⚠️ Neueste Version nicht abgefragt: ${error}`);
	}
}

/** Saves the settings; GitHub is asked again only when they switch the search (fallback review of #1455) */
export async function askingWhenSwitched<T>(wanted: string | undefined, save: () => Promise<T>) {
	const before = await getConfig('update_check');
	const saved = await save();
	if (wanted && wanted !== before) await checkForUpdate();
	return saved;
}

export function startUpdateChecks() {
	void checkForUpdate();
	setInterval(() => void checkForUpdate(), DAY);
}

// updater: the update service of compose.yaml; an installation from an older compose.yaml has none (it runs the
// installer once more)
export const updateState = () => ({ checks: updateChecks(), ...known, updater: !!process.env.UPDATER_URL });

// one start at a time: a click in a second tab while the first still backs up makes no Sicherung of its own
let starting = false;

/** Has the update service start an update: only with a set-up Sicherung, and after a Sicherung made now (#1457), also
 * for a version that does not change the database; when it fails nothing was asked of the update service */
export async function startUpdate() {
	const updater = process.env.UPDATER_URL;
	if (!updater) throw new CodedError('UPDATE_UNAVAILABLE', 'This installation has no update service');
	if (starting) throw new CodedError('UPDATE_RUNNING', 'An update is starting');
	starting = true;
	try {
		const { backup } = await backupState(DATABASE_URL);
		if (backup !== 'ok' && backup !== 'stale') throw new CodedError('UPDATE_BACKUP_MISSING', 'The Sicherung is not set up');
		try {
			await createBackup(DATABASE_URL, process.env.BACKUP_DIR!);
		} catch (error) {
			console.error(`Sicherung vor dem Update fehlgeschlagen: ${error instanceof Error ? error.message : error}`);
			throw new CodedError('UPDATE_BACKUP_FAILED', 'The Sicherung before the update failed');
		}
		const response = await fetch(`${updater}/update`, { method: 'POST' });
		if (response.status === 409) throw new CodedError('UPDATE_RUNNING', 'An update is running');
		if (!response.ok) throw new Error(`update service: ${response.status}`);
	} finally {
		starting = false;
	}
}
