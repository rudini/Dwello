import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// #718: the Sicherung; per Wiederherstellungscode only its public key and salt (base64), and each run
export const backupCodes = pgTable('backup_codes', {
	id: uuid('id').defaultRandom().primaryKey(),
	publicKey: text('public_key').notNull(),
	salt: text('salt').notNull(),
	confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
	pendingCode: text('pending_code'), // only until the confirmation
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const backupRuns = pgTable('backup_runs', {
	id: uuid('id').defaultRandom().primaryKey(),
	startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
	finishedAt: timestamp('finished_at', { withTimezone: true }),
	file: text('file'),
	error: text('error')
});
