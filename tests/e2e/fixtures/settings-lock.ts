import { mkdirSync, rmSync, statSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// The settings are one record for every scenario, in every browser project and worker of a run (O-34): a scenario
// that saves the IBAN and reads it back, and every IBAN the fixtures set, take turns. A directory is created
// atomically or not at all; one left by a killed worker is taken over after a minute. The fresh installation (#577)
// has a lock of its own: its scenarios create and delete the one account it may have
const lockOf = (name: string) => join(tmpdir(), `dwello-e2e-${name}.lock`);
const STALE_MS = 60_000;

const tryLock = (lock: string) => {
	try {
		mkdirSync(lock);
		return true;
	} catch {
		try {
			if (Date.now() - statSync(lock).mtimeMs > STALE_MS) rmSync(lock, { recursive: true, force: true });
		} catch {
			// released meanwhile
		}
		return false;
	}
};

export async function withLock<T>(name: string, work: () => Promise<T>): Promise<T> {
	const lock = lockOf(name);
	while (!tryLock(lock)) await new Promise((resolve) => setTimeout(resolve, 100));
	try {
		return await work();
	} finally {
		rmSync(lock, { recursive: true, force: true });
	}
}

export const withSettingsLock = <T>(work: () => Promise<T>) => withLock('settings', work);
