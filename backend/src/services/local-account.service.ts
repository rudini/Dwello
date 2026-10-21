/**
 * Konto mit Passwort (#576): the account the Betreiber creates with `bun run account`, and the check of a sign-in.
 * The password is kept only as Argon2id hash (Bun.password); after 5 failed attempts sign-in is locked for 15
 * minutes (Sperre). An unknown address is refused like a wrong password and never locked (decided in #576).
 */

import { eq, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { localAccounts } from '../db/schema';
import { CodedError } from './coded-error';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MS = 15 * 60_000;
export const MIN_PASSWORD_LENGTH = 8;

// a hash to check unknown addresses against, so they take as long as a known one
const unknownHash = Bun.password.hash('unknown-account');

const normal = (email: string) => email.trim().toLowerCase();

export async function setLocalAccount(email: string, password: string): Promise<void> {
	if (password.length < MIN_PASSWORD_LENGTH)
		throw new CodedError('PASSWORD_TOO_SHORT', `Das Passwort braucht mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`, {
			min: MIN_PASSWORD_LENGTH
		});
	const passwordHash = await Bun.password.hash(password);
	// a new password also lifts a Sperre: the same command resets both
	await db
		.insert(localAccounts)
		.values({ email: normal(email), passwordHash, passwordChangedAt: new Date() })
		.onConflictDoUpdate({
			target: localAccounts.email,
			set: { passwordHash, failedAttempts: 0, lockedUntil: null, passwordChangedAt: new Date(), updatedAt: new Date() }
		});
}

export async function deleteLocalAccount(email: string): Promise<boolean> {
	return (await db.delete(localAccounts).where(eq(localAccounts.email, normal(email))).returning()).length > 0;
}

/** A session of a Konto mit Passwort holds while the account exists and its password was not set again after it began */
export async function localSessionHolds(sub: string, issuedAt: number): Promise<boolean> {
	const id = sub.replace(/^local:/, '');
	if (!/^[0-9a-f-]{36}$/i.test(id)) return false;
	const [account] = await db.select({ changed: localAccounts.passwordChangedAt }).from(localAccounts).where(eq(localAccounts.id, id));
	return !!account && Math.floor(account.changed.getTime() / 1000) <= issuedAt;
}

export async function hasLocalAccount(): Promise<boolean> {
	return (await db.select({ id: localAccounts.id }).from(localAccounts).limit(1)).length > 0;
}

/** The account the BFF puts into the session, or a refusal: INVALID_CREDENTIALS, ACCOUNT_LOCKED with the end */
export async function checkPassword(email: string, password: string): Promise<{ sub: string; email: string; name: string }> {
	const address = normal(email);
	const [account] = await db.select().from(localAccounts).where(eq(localAccounts.email, address));
	if (!account) {
		await Bun.password.verify(password, await unknownHash);
		console.warn('[auth] Anmeldung mit Passwort abgelehnt', { email: address });
		throw invalid();
	}
	const now = Date.now();
	if (account.lockedUntil && account.lockedUntil.getTime() > now) throw locked(account.lockedUntil, address);
	if (await Bun.password.verify(password, account.passwordHash)) {
		await db.update(localAccounts).set({ failedAttempts: 0, lockedUntil: null }).where(eq(localAccounts.id, account.id));
		return { sub: `local:${account.id}`, email: account.email, name: account.email };
	}
	// counted in SQL, so parallel attempts cannot both stay below the limit; a run out lock starts the count anew
	const [failed] = await db
		.update(localAccounts)
		.set({
			failedAttempts: sql`CASE WHEN ${localAccounts.lockedUntil} IS NOT NULL THEN 1 ELSE ${localAccounts.failedAttempts} + 1 END`,
			lockedUntil: null
		})
		.where(eq(localAccounts.id, account.id))
		.returning({ failedAttempts: localAccounts.failedAttempts });
	console.warn('[auth] Anmeldung mit Passwort abgelehnt', { email: address, failedAttempts: failed.failedAttempts });
	if (failed.failedAttempts >= MAX_FAILED_ATTEMPTS) {
		const until = new Date(now + LOCK_MS);
		await db.update(localAccounts).set({ lockedUntil: until }).where(eq(localAccounts.id, account.id));
		console.warn('[auth] Konto mit Passwort gesperrt', { email: address, until: until.toISOString() });
	}
	throw invalid();
}

const invalid = () => new CodedError('INVALID_CREDENTIALS', 'E-Mail-Adresse oder Passwort stimmen nicht.');

function locked(until: Date, email: string) {
	console.warn('[auth] Anmeldung mit Passwort gesperrt', { email, until: until.toISOString() });
	return new CodedError('ACCOUNT_LOCKED', 'Die Anmeldung ist nach mehreren Fehlversuchen gesperrt.', { until: until.toISOString() });
}
