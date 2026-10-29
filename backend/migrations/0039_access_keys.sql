-- Zugangsschlüssel für KI-Programme (#817, ADR 0007): only the SHA-256 hash of a key is kept; a key is valid through
-- the Swiss calendar day expires_on; expiry_recorded says its expiry is in the Protokoll
CREATE TABLE access_keys (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name VARCHAR(100) NOT NULL,
	key_hash CHAR(64) NOT NULL UNIQUE,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	last_used_at TIMESTAMPTZ,
	expires_on DATE NOT NULL,
	expiry_recorded BOOLEAN NOT NULL DEFAULT false
);
