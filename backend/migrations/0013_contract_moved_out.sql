-- ============================================================================
-- «Mieter ist ausgezogen» after the agreed end of a fixed-term contract (A-6, #115): without it the overview asks
-- whether the contract continues open-ended (Art. 266 Abs. 2 OR). It belongs to one Vertragsende, so changing or
-- removing the end clears it.
-- ============================================================================

ALTER TABLE rental_contracts ADD COLUMN moved_out BOOLEAN NOT NULL DEFAULT FALSE;
