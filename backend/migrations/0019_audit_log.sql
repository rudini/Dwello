-- ============================================================================
-- The Protokoll under «Einstellungen» (#357, decided in #111): logins and changes that affect statements, each with
-- its time; the details keep what the entry names (a snapshot), so it stays readable after the record changed or was
-- deleted. Entries stay until the landlord deletes them.
-- ============================================================================

CREATE TABLE audit_log (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	action VARCHAR(50) NOT NULL,
	details JSONB NOT NULL
);
