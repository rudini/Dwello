-- ============================================================================
-- #1410: «Behalten» of the invoices of a building's Abrechnungsperiode whose Aufbewahrungsfrist has passed, by the
-- start of the period; the overview no longer names them. Dwello deletes nothing.
-- ============================================================================

ALTER TABLE buildings ADD COLUMN kept_invoice_periods JSONB NOT NULL DEFAULT '[]';
