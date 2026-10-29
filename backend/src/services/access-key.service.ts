/**
 * Zugangsschlüssel für KI-Programme (#817, ADR 0007): the landlord gives an AI program read access through /mcp.
 * A key is shown once and kept only as SHA-256 hash (256 random bits need no salt); it is valid through the Swiss
 * calendar day 90 days after it was created (Fachprüfung 817-1 V-5). Creating, revoking and expiry go into the Protokoll.
 */

import { createHash, randomBytes } from 'node:crypto';
import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../db/connection';
import { accessKeys, auditLog } from '../db/schema';
import { recordAudit } from './audit-log.service';
import { daysAfter, sqlToday, swissToday } from './today';

type AccessKey = typeof accessKeys.$inferSelect;

const hashOf = (key: string) => createHash('sha256').update(key).digest('hex');

const shown = ({ id, name, createdAt, lastUsedAt, expiresOn }: AccessKey) => ({
	id,
	name,
	createdAt,
	lastUsedAt,
	expiresOn,
	expired: expiresOn < swissToday()
});

/** A new key with its secret, the only time the secret leaves the backend */
export async function createAccessKey(name: string) {
	const key = `dwello_${randomBytes(32).toString('base64url')}`;
	return db.transaction(async (tx) => {
		const [created] = await tx
			.insert(accessKeys)
			.values({ name, keyHash: hashOf(key), expiresOn: daysAfter(swissToday(), 90) })
			.returning();
		await recordAudit('access_key_created', { name }, tx);
		return { ...shown(created), key };
	});
}

const EXPIRE = sql`update ${accessKeys} set expiry_recorded = true
	where not expiry_recorded and expires_on < ${sqlToday}
	returning name, expires_on`;
const RECORD = sql`insert into ${auditLog} (action, details, occurred_at)
	select 'access_key_expired', jsonb_build_object('name', name), (expires_on + 1)::timestamp at time zone 'Europe/Zurich'
	from expired
	returning id, occurred_at, action, details`;

/**
 * Puts the expiry of every key that ran out into the Protokoll, once, at the start of the day after its last valid
 * one: called wherever Dwello shows keys or entries, so a key never used again is recorded too (Fachprüfung 817-1 V-1)
 */
function recordExpiries() {
	return db.execute(sql`with expired as (${EXPIRE}) ${RECORD}`);
}

/**
 * The Protokoll, newest first, with the expiries recorded now: one statement, so the list stays one query (P2); the
 * entries it adds are not in its own snapshot of audit_log, hence the union
 */
export async function auditLogWithExpiries() {
	const { rows } = await db.execute<{ id: string; occurred_at: Date; action: string; details: Record<string, unknown> }>(
		sql`with expired as (${EXPIRE}), added as (${RECORD})
		select id, occurred_at, action, details from ${auditLog} union all select * from added order by occurred_at desc`
	);
	return rows.map(({ occurred_at, ...entry }) => ({ ...entry, occurredAt: occurred_at }));
}

/** Every key, newest first, without its hash */
export async function listAccessKeys() {
	await recordExpiries();
	return (await db.select().from(accessKeys).orderBy(desc(accessKeys.createdAt))).map(shown);
}

/** Revoking deletes the key; false when there is none */
export function revokeAccessKey(id: string) {
	return db.transaction(async (tx) => {
		const [revoked] = await tx.delete(accessKeys).where(eq(accessKeys.id, id)).returning();
		if (revoked) await recordAudit('access_key_revoked', { name: revoked.name }, tx);
		return !!revoked;
	});
}

/** The key of an `Authorization: Bearer` header, marked as used now, or the code that refuses it */
export async function keyOf(authorization: string | undefined) {
	const key = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';
	const [found] = key ? await db.select().from(accessKeys).where(eq(accessKeys.keyHash, hashOf(key))) : [];
	if (!found) return 'ACCESS_KEY_INVALID';
	if (found.expiresOn < swissToday()) {
		await recordExpiries();
		return 'ACCESS_KEY_EXPIRED';
	}
	await db.update(accessKeys).set({ lastUsedAt: new Date() }).where(eq(accessKeys.id, found.id));
	return found;
}
