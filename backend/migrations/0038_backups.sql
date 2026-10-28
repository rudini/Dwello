-- ============================================================================
-- #718 (R1, O1): the Sicherung. backup_codes keeps only the public key and salt of each Wiederherstellungscode, never the
-- code; a Sicherung is made only once one is confirmed. backup_runs records each run, so the state shows when the last
-- one succeeded and why one failed.
-- ============================================================================

CREATE TABLE backup_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_key TEXT NOT NULL, -- base64
    salt TEXT NOT NULL,       -- base64
    confirmed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE backup_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ,
    file TEXT,
    error TEXT
);
