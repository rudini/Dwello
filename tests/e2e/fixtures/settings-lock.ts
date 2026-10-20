import { mkdirSync, rmSync, statSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

// The settings are one record for every scenario, in every browser project and worker of a run (O-34): a scenario
// that saves the IBAN and reads it back, and every IBAN the fixtures set, take turns. A directory is created
// atomically or not at all; one left by a killed worker is taken over after a minute
const LOCK = join(tmpdir(), 'dwello-e2e-settings.lock');
const STALE_MS = 60_000;

const tryLock = () => {
	try {
		mkdirSync(LOCK);
		return true;
	} catch {
		try {
			if (Date.now() - statSync(LOCK).mtimeMs > STALE_MS) rmSync(LOCK, { recursive: true, force: true });
		} catch {
			// released meanwhile
		}
		return false;
	}
};

export async function withSettingsLock<T>(work: () => Promise<T>): Promise<T> {
	while (!tryLock()) await new Promise((resolve) => setTimeout(resolve, 100));
	try {
		return await work();
	} finally {
		rmSync(LOCK, { recursive: true, force: true });
	}
}
