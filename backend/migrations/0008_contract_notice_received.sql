-- ============================================================================
-- The day the notice of an open-ended contract arrived (A-3, #112): optional, entered in «Mietvertrag beenden» and
-- shown on the contract; only with a notice, so withdrawing it or making the contract fixed-term clears it.
-- ============================================================================

ALTER TABLE rental_contracts ADD COLUMN notice_received_on DATE;
ALTER TABLE rental_contracts ADD CONSTRAINT contracts_notice_received_check CHECK (notice_received_on IS NULL OR terminated);
