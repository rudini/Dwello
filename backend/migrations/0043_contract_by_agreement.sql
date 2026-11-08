-- ============================================================================
-- Aufhebungsvereinbarung (#1148): an open-ended contract ended by agreement, not by notice. It stays terminated
-- (open-ended with a Vertragsende: no tacit continuation, the next steps and the move-out apply) and has no day a
-- notice arrived.
-- ============================================================================

ALTER TABLE rental_contracts ADD COLUMN by_agreement BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE rental_contracts ADD CONSTRAINT contracts_by_agreement_check
	CHECK (NOT by_agreement OR (terminated AND notice_received_on IS NULL));
