-- ============================================================================
-- «Verwaltungspauschale vereinbart» on the Mietvertrag (#89): the rate of an Abrechnungslauf applies only where the
-- contract agrees a fee (Art. 257a Abs. 2 OR), its own rate first. Existing contracts start without one, until the
-- landlord records what the signed contract says.
-- ============================================================================

ALTER TABLE rental_contracts ADD COLUMN management_fee_agreed BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE rental_contracts ADD COLUMN management_fee_percent DECIMAL(5, 2)
	CHECK (management_fee_percent BETWEEN 0 AND 10);
