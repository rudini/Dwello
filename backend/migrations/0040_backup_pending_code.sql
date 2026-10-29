-- ============================================================================
-- #718 part 2: the Wiederherstellungscode shown on «Sicherung einrichten» until the landlord types it again; deleted at
-- the confirmation, so no Sicherung and no copy of the database holds a confirmed code (Fachreview 718b R-3)
-- ============================================================================

ALTER TABLE backup_codes ADD COLUMN pending_code TEXT;
