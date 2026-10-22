/**
 * The setup on the first visit (#577): while no Konto mit Passwort exists, whoever knows the Einrichtungscode from the
 * Protokoll des Servers creates the first one. The code is made on each start (SETUP_CODE fixes it for the tests) and
 * never leaves the server but through its log; 5 wrong codes lock the setup for 15 minutes (fach review 577 R-5).
 */

import { eq, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { localAccounts } from '../db/schema';
import { CodedError } from './coded-error';
import { hasLocalAccount, setLocalAccount } from './local-account.service';

const MAX_WRONG_CODES = 5;
const LOCK_MS = 15 * 60_000;
// without 0/O and 1/I, which read alike; 32 signs, so a random byte maps to each equally often
const SIGNS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** 8 signs, 40 bits: with 5 tries per 15 minutes beyond guessing */
export function newSetupCode(): string {
	const signs = [...crypto.getRandomValues(new Uint8Array(8))].map((byte) => SIGNS[byte % SIGNS.length]).join('');
	return `${signs.slice(0, 4)}-${signs.slice(4)}`;
}

let made: string | undefined;
const setupCode = () => process.env.SETUP_CODE ?? (made ??= newSetupCode());
const normal = (code: string) => code.trim().toUpperCase();

let wrongCodes = 0;
let lockedUntil = 0;

/** For the tests: every test starts without wrong codes */
export function resetSetupAttempts() {
	wrongCodes = 0;
	lockedUntil = 0;
}

/** On start: the code goes into the Protokoll des Servers, only while Dwello still has to be set up */
export async function announceSetupCode() {
	if (await hasLocalAccount()) return;
	console.log(`[setup] Einrichtungscode: ${setupCode()} (Dwello einrichten: die Adresse von Dwello im Browser öffnen)`);
}

const done = () => new CodedError('SETUP_DONE', 'Dwello ist schon eingerichtet.');

export async function setUpFirstAccount(code: string, email: string, password: string) {
	// once set up, no request waits for the lock (code review 577 C-2)
	if (await hasLocalAccount()) throw done();
	return db.transaction(async (tx) => {
		// one setup at a time, two at once could each find no account yet; check and insert on the transaction's own
		// connection, so a waiting setup holds one connection only
		await tx.execute(sql`SELECT pg_advisory_xact_lock(577)`);
		if (await hasLocalAccount(tx)) throw done();
		if (Date.now() < lockedUntil)
			throw new CodedError('SETUP_LOCKED', 'Die Einrichtung ist gesperrt.', { until: new Date(lockedUntil).toISOString() });
		if (normal(code) !== normal(setupCode())) {
			if (++wrongCodes >= MAX_WRONG_CODES) {
				lockedUntil = Date.now() + LOCK_MS;
				wrongCodes = 0;
				console.warn('[setup] Einrichtung nach falschen Einrichtungscodes gesperrt', { until: new Date(lockedUntil).toISOString() });
			}
			throw new CodedError('SETUP_CODE_INVALID', 'Der Einrichtungscode stimmt nicht.');
		}
		await setLocalAccount(email, password, tx);
		const [account] = await tx.select({ id: localAccounts.id, email: localAccounts.email }).from(localAccounts).where(eq(localAccounts.email, email.trim().toLowerCase()));
		return { sub: `local:${account.id}`, email: account.email, name: account.email };
	});
}
