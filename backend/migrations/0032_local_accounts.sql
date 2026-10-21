-- ============================================================================
-- #576 (product owner 2026-10-21): Konto mit Passwort. E-mail address, Argon2id hash, failed attempts since the last
-- successful sign-in, the end of a Sperre (5 failed attempts lock sign-in for 15 minutes), and when the password was
-- last set: sessions issued before end (the command that resets a password ends the old sessions).
-- ============================================================================

CREATE TABLE local_accounts (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	email VARCHAR(255) NOT NULL UNIQUE,
	password_hash TEXT NOT NULL,
	failed_attempts INTEGER NOT NULL DEFAULT 0,
	locked_until TIMESTAMPTZ,
	password_changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
